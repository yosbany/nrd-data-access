/**
 * Tab Herramientas — NRD Data Access Admin
 */
(function () {
  let initialized = false;

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

  function getAnonCleanupDays() {
    const input = document.getElementById('anon-cleanup-days');
    const days = parseInt(input && input.value, 10);
    return days >= 1 && days <= 3650 ? days : 90;
  }

  function buildAnonCleanupCommands(days, dryRun) {
    const scriptPath = 'nrd-data-access/tools/cleanup-anonymous-users/cleanup-anonymous-users.py';
    const dryFlag = dryRun ? ' --dry-run' : '';
    return [
      '# Una sola vez: pip install firebase-admin',
      '# Descargá la clave JSON en Firebase Console → Cuentas de servicio',
      'export GOOGLE_APPLICATION_CREDENTIALS=/ruta/a/service-account.json',
      '',
      'python3 ' + scriptPath + ' --days ' + days + dryFlag
    ].join('\n');
  }

  function copyAnonCleanupCommand(dryRun) {
    const days = getAnonCleanupDays();
    const text = buildAnonCleanupCommands(days, dryRun);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToolsOutput('Comando copiado al portapapeles:\n\n' + text);
      }).catch(function () {
        showToolsOutput(text);
      });
    } else {
      showToolsOutput(text);
    }
  }

  function bindAnonymousCleanupHandlers() {
    const previewBtn = document.getElementById('anon-cleanup-preview-btn');
    const copyBtn = document.getElementById('anon-cleanup-copy-btn');

    if (previewBtn) {
      previewBtn.onclick = function () {
        const days = getAnonCleanupDays();
        showToolsOutput(
          'Ejecutá en tu Mac (terminal), sin hosting:\n\n' +
          buildAnonCleanupCommands(days, true) +
          '\n\n--dry-run solo muestra cuántos se borrarían.'
        );
      };
    }

    if (copyBtn) {
      copyBtn.onclick = function () {
        copyAnonCleanupCommand(false);
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
      '<p class="text-sm text-gray-600 mb-3">Firebase Auth no permite borrar otros usuarios desde el navegador. ' +
      'Usá el script local con una cuenta de servicio (sin Cloud Functions ni hosting extra).</p>' +
      '<ol class="text-sm text-gray-600 mb-4 list-decimal list-inside space-y-1">' +
      '<li>Firebase Console → Configuración → Cuentas de servicio → Generar nueva clave JSON</li>' +
      '<li><code class="text-xs bg-gray-100 px-1">pip install firebase-admin</code></li>' +
      '<li>Elegí días de inactividad y copiá el comando</li>' +
      '<li>Primero simulá con <code class="text-xs bg-gray-100 px-1">--dry-run</code>, después ejecutá sin ese flag</li>' +
      '</ol>' +
      '<div class="flex flex-col sm:flex-row sm:items-end gap-3">' +
      '<div class="flex-1">' +
      '<label for="anon-cleanup-days" class="block text-xs uppercase tracking-wider text-gray-600 mb-1">Inactivos hace más de (días)</label>' +
      '<input type="number" id="anon-cleanup-days" min="1" max="3650" value="90" ' +
      'class="w-full sm:w-40 px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-600 text-sm">' +
      '</div>' +
      '<div class="flex flex-wrap gap-2">' +
      '<button type="button" id="anon-cleanup-preview-btn" ' +
      'class="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors uppercase tracking-wider text-xs font-light">' +
      'Ver comando (simular)' +
      '</button>' +
      '<button type="button" id="anon-cleanup-copy-btn" ' +
      'class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors uppercase tracking-wider text-xs font-light">' +
      'Copiar comando (borrar)' +
      '</button>' +
      '</div>' +
      '</div>' +
      '<p class="text-xs text-gray-500 mt-3">Script: <code class="bg-gray-100 px-1">tools/cleanup-anonymous-users/cleanup-anonymous-users.py</code></p>' +
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
