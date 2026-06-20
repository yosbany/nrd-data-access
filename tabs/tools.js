/**
 * Tab Herramientas — NRD Data Access Admin
 */
(function () {
  const FIREBASE_PROJECT_ID = 'nrd-db';
  const FUNCTIONS_REGION = 'us-central1';
  const CLEANUP_FUNCTION_NAME = 'cleanupAnonymousUsers';

  let initialized = false;

  function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  function getToolsOutput() {
    return {
      box: document.getElementById('tools-output'),
      content: document.getElementById('tools-output-content')
    };
  }

  function showToolsOutput(text) {
    const { box, content } = getToolsOutput();
    if (!box || !content) return;
    box.classList.remove('hidden');
    content.textContent = text;
  }

  function appendToolsOutput(text) {
    const { box, content } = getToolsOutput();
    if (!box || !content) return;
    box.classList.remove('hidden');
    content.textContent += text;
  }

  async function getAdminIdToken() {
    const user = window.nrd && window.nrd.auth ? window.nrd.auth.getCurrentUser() : null;
    if (!user) throw new Error('Debes iniciar sesión como administrador.');
    if (typeof user.getIdToken !== 'function') {
      throw new Error('No se pudo obtener el token de sesión.');
    }
    return user.getIdToken();
  }

  async function callCleanupAnonymousUsers(payload) {
    const token = await getAdminIdToken();
    const url = 'https://' + FUNCTIONS_REGION + '-' + FIREBASE_PROJECT_ID + '.cloudfunctions.net/' + CLEANUP_FUNCTION_NAME;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ data: payload })
    });

    let body;
    try {
      body = await response.json();
    } catch (_) {
      throw new Error('Respuesta inválida del servidor (¿está desplegada la Cloud Function?).');
    }

    if (body.error) {
      const msg = body.error.message || body.error.status || 'Error en Cloud Function';
      throw new Error(msg);
    }

    return body.result;
  }

  function formatCleanupResult(result) {
    const lines = [];
    lines.push(result.dryRun ? '=== Simulación (sin borrar) ===' : '=== Limpieza ejecutada ===');
    lines.push('Antigüedad mínima: ' + result.olderThanDays + ' días');
    lines.push('Usuarios revisados: ' + result.scanned);
    lines.push('Anónimos inactivos encontrados: ' + result.matched);
    lines.push('En cola para borrar: ' + result.queuedForDelete);
    if (!result.dryRun) {
      lines.push('Eliminados: ' + result.deleted);
      if (result.failed) lines.push('Fallidos: ' + result.failed);
    }
    if (result.truncated) {
      lines.push('Nota: hay más usuarios elegibles; ejecutá de nuevo para continuar.');
    }
    if (result.errors && result.errors.length) {
      lines.push('\nErrores:');
      result.errors.forEach(function (err) {
        lines.push('- ' + (err.uid || '?') + ': ' + (err.message || err));
      });
    }
    return lines.join('\n');
  }

  async function runAnonymousCleanup(dryRun) {
    const daysInput = document.getElementById('anon-cleanup-days');
    const days = parseInt(daysInput && daysInput.value, 10) || 90;

    showToolsOutput((dryRun ? 'Analizando' : 'Eliminando') + ' usuarios anónimos inactivos (> ' + days + ' días)...\n');

    try {
      const result = await callCleanupAnonymousUsers({
        olderThanDays: days,
        dryRun: dryRun,
        maxDelete: 1000
      });
      appendToolsOutput('\n' + formatCleanupResult(result));
    } catch (error) {
      appendToolsOutput('\nError: ' + (error.message || String(error)));
      appendToolsOutput('\n\nSi la función no está desplegada:\n');
      appendToolsOutput('  cd nrd-data-access/functions && npm install\n');
      appendToolsOutput('  firebase deploy --only functions:cleanupAnonymousUsers --project nrd-db\n');
    }
  }

  function bindAnonymousCleanupHandlers() {
    const previewBtn = document.getElementById('anon-cleanup-preview-btn');
    const runBtn = document.getElementById('anon-cleanup-run-btn');

    if (previewBtn) {
      previewBtn.onclick = function () {
        runAnonymousCleanup(true);
      };
    }

    if (runBtn) {
      runBtn.onclick = function () {
        const days = parseInt(document.getElementById('anon-cleanup-days')?.value, 10) || 90;
        const message =
          '¿Eliminar usuarios anónimos inactivos hace más de ' + days + ' días?\n\n' +
          'Esta acción no se puede deshacer. Los pedidos en RTDB no se borran; solo la cuenta Auth.';
        if (typeof window.showConfirmModal === 'function') {
          window.showConfirmModal('Limpiar usuarios anónimos', message, function () {
            runAnonymousCleanup(false);
          });
        } else if (confirm(message)) {
          runAnonymousCleanup(false);
        }
      };
    }
  }

  function renderToolsTab() {
    const container = document.getElementById('tools-tab-content');
    if (!container) return;

    container.innerHTML =
      '<div class="mb-4 sm:mb-6">' +
      '<h2 class="text-lg sm:text-xl font-light tracking-tight text-gray-800 mb-1">Herramientas de Administración</h2>' +
      '<p class="text-sm sm:text-base text-gray-600">Depuración, limpieza y mantenimiento del sistema</p>' +
      '</div>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
      '<div class="bg-white border border-gray-200 p-4 sm:p-6 md:col-span-2">' +
      '<h3 class="text-base font-medium mb-2">Usuarios anónimos (catálogo)</h3>' +
      '<p class="text-sm text-gray-600 mb-4">Elimina cuentas Firebase Auth anónimas inactivas creadas por visitantes del catálogo. Requiere Cloud Function desplegada.</p>' +
      '<div class="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">' +
      '<div class="flex-1">' +
      '<label for="anon-cleanup-days" class="block text-xs uppercase tracking-wider text-gray-600 mb-1">Inactivos hace más de (días)</label>' +
      '<input type="number" id="anon-cleanup-days" min="1" max="3650" value="90" ' +
      'class="w-full sm:w-40 px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-600 text-sm">' +
      '</div>' +
      '<div class="flex flex-wrap gap-2">' +
      '<button type="button" id="anon-cleanup-preview-btn" ' +
      'class="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors uppercase tracking-wider text-xs font-light">' +
      'Simular' +
      '</button>' +
      '<button type="button" id="anon-cleanup-run-btn" ' +
      'class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors uppercase tracking-wider text-xs font-light">' +
      'Ejecutar limpieza' +
      '</button>' +
      '</div>' +
      '</div>' +
      '<p class="text-xs text-gray-500">Simular cuenta cuántos se borrarían. Ejecutar elimina hasta 1000 por corrida; repetí si hay más.</p>' +
      '</div>' +
      '<div class="bg-white border border-gray-200 p-4 sm:p-6">' +
      '<h3 class="text-base font-medium mb-3">Depuración</h3>' +
      '<p class="text-sm text-gray-600 mb-4">Encuentra referencias rotas entre entidades</p>' +
      '<button type="button" onclick="runDebug()" class="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors uppercase tracking-wider text-xs font-light">Ejecutar</button>' +
      '</div>' +
      '<div class="bg-white border border-gray-200 p-4 sm:p-6">' +
      '<h3 class="text-base font-medium mb-3">Limpieza RTDB</h3>' +
      '<p class="text-sm text-gray-600 mb-4">Quita referencias huérfanas en la base de datos</p>' +
      '<button type="button" onclick="runCleanup()" class="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors uppercase tracking-wider text-xs font-light">Ejecutar</button>' +
      '</div>' +
      '<div class="bg-white border border-gray-200 p-4 sm:p-6">' +
      '<h3 class="text-base font-medium mb-3">Migración</h3>' +
      '<p class="text-sm text-gray-600 mb-4">Migraciones puntuales de datos</p>' +
      '<button type="button" onclick="runMigration()" class="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors uppercase tracking-wider text-xs font-light">Ejecutar</button>' +
      '</div>' +
      '<div class="bg-white border border-gray-200 p-4 sm:p-6">' +
      '<h3 class="text-base font-medium mb-3">Exportar datos</h3>' +
      '<p class="text-sm text-gray-600 mb-4">Descarga JSON de todas las entidades</p>' +
      '<button type="button" onclick="exportData()" class="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors uppercase tracking-wider text-xs font-light">Exportar</button>' +
      '</div>' +
      '</div>' +
      '<div id="tools-output" class="mt-6 bg-white border border-gray-200 p-4 sm:p-6 hidden">' +
      '<h3 class="text-base font-medium mb-3">Resultado</h3>' +
      '<pre id="tools-output-content" class="text-xs overflow-auto max-h-96 whitespace-pre-wrap"></pre>' +
      '</div>';

    bindAnonymousCleanupHandlers();
  }

  window.initializeToolsTab = function () {
    if (!initialized) {
      initialized = true;
    }
    renderToolsTab();
  };

  window.loadToolsTab = function () {
    renderToolsTab();
  };
})();
