const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const BATCH_DELETE_SIZE = 1000;
const LIST_PAGE_SIZE = 1000;

function isAnonymousUser(user) {
  if (user.email || user.phoneNumber) return false;
  if (!user.providerData || user.providerData.length === 0) return true;
  return user.providerData.some((p) => p.providerId === 'anonymous');
}

function getLastActiveMs(user) {
  const lastSignIn = user.metadata && user.metadata.lastSignInTime;
  const created = user.metadata && user.metadata.creationTime;
  const ref = lastSignIn || created;
  return ref ? new Date(ref).getTime() : 0;
}

/**
 * Callable desde NRD Data Access Admin (requiere login email/contraseña).
 * data: { olderThanDays?: number, dryRun?: boolean, maxDelete?: number }
 */
exports.cleanupAnonymousUsers = functions
  .region('us-central1')
  .runWith({ timeoutSeconds: 540, memory: '256MB' })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Debes iniciar sesión.');
    }

    const provider = context.auth.token.firebase && context.auth.token.firebase.sign_in_provider;
    if (provider === 'anonymous') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Solo administradores con email y contraseña pueden ejecutar esta acción.'
      );
    }

    const olderThanDays = Math.max(1, Math.min(3650, Number(data && data.olderThanDays) || 90));
    const dryRun = Boolean(data && data.dryRun);
    const maxDelete = Math.max(1, Math.min(5000, Number(data && data.maxDelete) || 1000));
    const cutoffMs = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

    const auth = admin.auth();
    let pageToken;
    let scanned = 0;
    let matched = 0;
    const uidsToDelete = [];

    do {
      const page = await auth.listUsers(LIST_PAGE_SIZE, pageToken);
      for (const user of page.users) {
        scanned += 1;
        if (!isAnonymousUser(user)) continue;
        if (getLastActiveMs(user) > cutoffMs) continue;
        matched += 1;
        if (uidsToDelete.length < maxDelete) {
          uidsToDelete.push(user.uid);
        }
      }
      pageToken = page.pageToken;
    } while (pageToken && uidsToDelete.length < maxDelete);

    let deleted = 0;
    let failed = 0;
    const errors = [];

    if (!dryRun && uidsToDelete.length > 0) {
      for (let i = 0; i < uidsToDelete.length; i += BATCH_DELETE_SIZE) {
        const batch = uidsToDelete.slice(i, i + BATCH_DELETE_SIZE);
        const result = await auth.deleteUsers(batch);
        deleted += result.successCount;
        failed += result.failureCount;
        if (result.errors && result.errors.length) {
          result.errors.forEach((err) => {
            errors.push({ uid: err.index != null ? batch[err.index] : null, message: err.error });
          });
        }
      }
    }

    return {
      olderThanDays,
      dryRun,
      scanned,
      matched,
      queuedForDelete: uidsToDelete.length,
      deleted: dryRun ? 0 : deleted,
      failed,
      truncated: matched > uidsToDelete.length,
      errors: errors.slice(0, 20)
    };
  });
