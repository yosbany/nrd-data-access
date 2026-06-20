#!/usr/bin/env python3
"""
Elimina usuarios Firebase Auth anónimos inactivos (visitantes del catálogo).

Requiere cuenta de servicio con permiso Firebase Auth Admin (descargar desde
Firebase Console → Configuración → Cuentas de servicio → Generar nueva clave).

Uso:
  pip install firebase-admin
  export GOOGLE_APPLICATION_CREDENTIALS=/ruta/a/service-account.json
  python3 cleanup-anonymous-users.py --days 90 --dry-run
  python3 cleanup-anonymous-users.py --days 90
"""

from __future__ import annotations

import argparse
import os
import sys
from datetime import datetime, timezone

try:
    import firebase_admin
    from firebase_admin import auth, credentials
except ImportError:
    print("Instalá firebase-admin: pip install firebase-admin", file=sys.stderr)
    sys.exit(1)

LIST_PAGE_SIZE = 1000
BATCH_DELETE_SIZE = 1000


def is_anonymous_user(user: auth.UserRecord) -> bool:
    if user.email or user.phone_number:
        return False
    if not user.provider_data:
        return True
    return any(p.provider_id == "anonymous" for p in user.provider_data)


def last_active_ms(user: auth.UserRecord) -> int:
    meta = user.user_metadata
    ref = meta.last_sign_in_timestamp or meta.creation_timestamp
    return int(ref or 0)


def init_firebase(credentials_path: str | None) -> None:
    if firebase_admin._apps:
        return
    path = credentials_path or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not path or not os.path.isfile(path):
        print(
            "Falta la cuenta de servicio. Usá --credentials RUTA.json "
            "o export GOOGLE_APPLICATION_CREDENTIALS=RUTA.json",
            file=sys.stderr,
        )
        sys.exit(1)
    cred = credentials.Certificate(path)
    firebase_admin.initialize_app(cred)


def run_cleanup(days: int, dry_run: bool, max_delete: int) -> int:
    cutoff_ms = int(datetime.now(tz=timezone.utc).timestamp() * 1000) - days * 24 * 60 * 60 * 1000
    scanned = 0
    matched = 0
    uids_to_delete: list[str] = []
    page = auth.list_users()

    while page:
        for user in page.users:
            scanned += 1
            if not is_anonymous_user(user):
                continue
            if last_active_ms(user) > cutoff_ms:
                continue
            matched += 1
            if len(uids_to_delete) < max_delete:
                uids_to_delete.append(user.uid)

        page = page.get_next_page()

    print(f"Usuarios revisados: {scanned}")
    print(f"Anónimos inactivos (> {days} días): {matched}")
    print(f"En cola para borrar: {len(uids_to_delete)}")
    if matched > len(uids_to_delete):
        print(f"Nota: límite {max_delete} por corrida; ejecutá de nuevo si hay más.")

    if dry_run:
        print("\n=== Simulación (sin borrar) ===")
        for uid in uids_to_delete[:10]:
            print(f"  - {uid}")
        if len(uids_to_delete) > 10:
            print(f"  ... y {len(uids_to_delete) - 10} más")
        return 0

    if not uids_to_delete:
        print("Nada que eliminar.")
        return 0

    deleted = 0
    failed = 0
    for i in range(0, len(uids_to_delete), BATCH_DELETE_SIZE):
        batch = uids_to_delete[i : i + BATCH_DELETE_SIZE]
        result = auth.delete_users(batch)
        deleted += result.success_count
        failed += result.failure_count
        for err in result.errors:
            idx = err.index
            uid = batch[idx] if idx is not None and idx < len(batch) else "?"
            print(f"Error borrando {uid}: {err.reason}", file=sys.stderr)

    print(f"\nEliminados: {deleted}")
    if failed:
        print(f"Fallidos: {failed}", file=sys.stderr)
        return 1
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Limpia usuarios Auth anónimos inactivos (catálogo NRD)")
    parser.add_argument("--days", type=int, default=90, help="Inactivos hace más de N días (default: 90)")
    parser.add_argument("--dry-run", action="store_true", help="Solo simular, no borrar")
    parser.add_argument("--max-delete", type=int, default=1000, help="Máximo a borrar por corrida (default: 1000)")
    parser.add_argument("--credentials", help="Ruta al JSON de cuenta de servicio")
    args = parser.parse_args()

    if args.days < 1 or args.days > 3650:
        print("--days debe estar entre 1 y 3650", file=sys.stderr)
        sys.exit(1)

    init_firebase(args.credentials)
    sys.exit(run_cleanup(args.days, args.dry_run, args.max_delete))


if __name__ == "__main__":
    main()
