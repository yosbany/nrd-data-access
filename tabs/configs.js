// Configs management for NRD Data Access Admin

// Use nrd from global scope (exposed by auth.js)
// nrd is available via window.nrd after initAuth() is called

let configsListener = null;
let configsSearchTerm = '';
let configsData = {};

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Helper functions for alerts (using logger if available, fallback to console/alert)
function showError(message) {
  if (typeof logger !== 'undefined' && logger.error) {
    logger.error('Configs Error', { message });
  } else {
    console.error('Configs Error:', message);
  }
  alert('Error: ' + message);
}

function showSuccess(message) {
  if (typeof logger !== 'undefined' && logger.info) {
    logger.info('Configs Success', { message });
  } else {
    console.log('Configs Success:', message);
  }
  if (typeof window.NRDCommon !== 'undefined' && window.NRDCommon.showSuccess) {
    return window.NRDCommon.showSuccess(message);
  }
  const alertEl = document.getElementById('custom-alert');
  const titleEl = document.getElementById('alert-title');
  const messageEl = document.getElementById('alert-message');
  const okBtn = document.getElementById('alert-ok');
  if (alertEl && titleEl && messageEl && okBtn) {
    return new Promise((resolve) => {
      titleEl.textContent = 'Éxito';
      messageEl.textContent = message;
      alertEl.classList.remove('hidden');
      const handleOk = () => {
        alertEl.classList.add('hidden');
        okBtn.removeEventListener('click', handleOk);
        resolve();
      };
      okBtn.addEventListener('click', handleOk);
      const handleBg = (e) => {
        if (e.target === alertEl) {
          handleOk();
          alertEl.removeEventListener('click', handleBg);
        }
      };
      alertEl.addEventListener('click', handleBg);
    });
  }
  alert(message);
}

function showConfirm(title, message) {
  return confirm(message);
}

// Load configs
function loadConfigs() {
  const nrd = window.nrd;
  if (!nrd) {
    if (typeof logger !== 'undefined' && logger.warn) {
      logger.warn('NRD Data Access not initialized');
    } else {
      console.warn('NRD Data Access not initialized');
    }
    return;
  }
  
  // Check if config service is available
  if (!nrd.config) {
    const errorMsg = 'ConfigService not available. Please ensure you are using the latest version of nrd-data-access library.';
    if (typeof logger !== 'undefined' && logger.error) {
      logger.error(errorMsg);
    } else {
      console.error(errorMsg);
    }
    const configsList = document.getElementById('configs-list');
    if (configsList) {
      configsList.innerHTML = `
        <div class="text-center py-8 border border-red-200 bg-red-50 p-4">
          <p class="text-red-600 mb-3 text-sm font-medium">Servicio de Configuraciones no disponible</p>
          <p class="text-gray-600 text-xs">Por favor, actualiza la librería nrd-data-access a la última versión.</p>
        </div>
      `;
    }
    return;
  }
  
  if (typeof logger !== 'undefined' && logger.debug) {
    logger.debug('Loading configs');
  }
  const configsList = document.getElementById('configs-list');
  if (!configsList) {
    if (typeof logger !== 'undefined' && logger.warn) {
      logger.warn('Configs list element not found');
    } else {
      console.warn('Configs list element not found');
    }
    return;
  }
  
  configsList.innerHTML = '<div class="text-center py-8 text-gray-500">Cargando configuraciones...</div>';

  // Load configs
  (async () => {
    try {
      const configs = await nrd.config.getAllWithDetails();
      configsData = configs || {};
      renderConfigs(configsData);
    } catch (error) {
      if (typeof logger !== 'undefined' && logger.error) {
        logger.error('Failed to load configs', error);
      } else {
        console.error('Failed to load configs', error);
      }
      configsList.innerHTML = `
        <div class="text-center py-8 border border-red-200 bg-red-50 p-4">
          <p class="text-red-600 mb-3 text-sm font-medium">Error al cargar configuraciones</p>
          <p class="text-gray-600 text-xs">${escapeHtml(error.message)}</p>
        </div>
      `;
    }
  })();
}

// Render configs list
function renderConfigs(configs) {
  const configsList = document.getElementById('configs-list');
  if (!configsList) return;
  
  configsList.innerHTML = '';

  if (Object.keys(configs).length === 0) {
    configsList.innerHTML = `
      <div class="text-center py-8 border border-gray-200 p-4">
        <p class="text-gray-600 mb-3 text-sm">No hay configuraciones registradas</p>
      </div>
    `;
    return;
  }

  // Filter by search term if active
  let configsToShow = Object.entries(configs);
  if (configsSearchTerm.trim()) {
    const searchLower = configsSearchTerm.toLowerCase().trim();
    configsToShow = configsToShow.filter(([key, cfg]) => {
      const c = typeof cfg === 'object' && cfg !== null ? cfg : { name: key, variableName: key, description: '', value: String(cfg) };
      return (c.name || '').toLowerCase().includes(searchLower) ||
             (c.variableName || key).toLowerCase().includes(searchLower) ||
             (c.description || '').toLowerCase().includes(searchLower) ||
             (c.value || '').toLowerCase().includes(searchLower);
    });
  }
  
  if (configsToShow.length === 0) {
    configsList.innerHTML = '<p class="text-center text-gray-600 py-6 text-sm">No hay configuraciones que coincidan con la búsqueda</p>';
    return;
  }

  configsToShow.forEach(([key, cfg]) => {
    const c = typeof cfg === 'object' && cfg !== null ? cfg : { name: key, variableName: key, description: '', value: String(cfg) };
    const item = document.createElement('div');
    item.className = 'border border-gray-200 p-4 hover:border-red-600 transition-colors';
    
    item.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <div class="flex-1">
          <div class="text-base font-medium text-gray-800 mb-1">${escapeHtml(c.name || key)}</div>
          <div class="text-xs text-gray-500 font-mono mb-1">${escapeHtml(c.variableName || key)}</div>
          ${c.description ? `<div class="text-xs text-gray-600 mb-1">${escapeHtml(c.description)}</div>` : ''}
          <div class="text-sm text-gray-700 font-mono">${escapeHtml(String(c.value || ''))}</div>
        </div>
      </div>
      <div class="flex gap-2 pt-2 border-t border-gray-200">
        <button class="edit-config-btn px-3 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors" data-config-key="${escapeHtml(key)}">
          Editar
        </button>
        <button class="delete-config-btn px-3 py-1 bg-red-600 text-white text-xs hover:bg-red-700 transition-colors" data-config-key="${escapeHtml(key)}">
          Eliminar
        </button>
      </div>
    `;
    
    // Add event listeners for buttons
    const editBtn = item.querySelector('.edit-config-btn');
    const deleteBtn = item.querySelector('.delete-config-btn');
    
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showConfigForm(key);
      });
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConfigHandler(key);
      });
    }
    
    configsList.appendChild(item);
  });
}

// Show config form
function showConfigForm(key = null) {
  const form = document.getElementById('config-form');
  const list = document.getElementById('configs-list');
  const title = document.getElementById('config-form-title');
  const saveBtn = document.getElementById('save-config-btn');
  const nameInput = document.getElementById('config-name');
  const variableNameInput = document.getElementById('config-variable-name');
  const descriptionInput = document.getElementById('config-description');
  const valueInput = document.getElementById('config-value');
  const keyEditInput = document.getElementById('config-key-edit');
  
  if (!form || !list) return;
  
  form.classList.remove('hidden');
  
  setTimeout(() => {
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
  
  const formElement = document.getElementById('config-form-element');
  if (formElement) formElement.reset();
  
  if (keyEditInput) keyEditInput.value = key || '';

  if (key) {
    const cfg = configsData[key];
    const c = typeof cfg === 'object' && cfg !== null ? cfg : { name: key, variableName: key, description: '', value: String(cfg || '') };
    if (title) title.textContent = 'Editar Configuración';
    if (saveBtn) {
      saveBtn.classList.remove('bg-green-600', 'border-green-600', 'hover:bg-green-700');
      saveBtn.classList.add('bg-blue-600', 'border-blue-600', 'hover:bg-blue-700');
    }
    if (nameInput) nameInput.value = c.name || key;
    if (variableNameInput) {
      variableNameInput.value = c.variableName || key;
      variableNameInput.disabled = true;
    }
    if (descriptionInput) descriptionInput.value = c.description || '';
    if (valueInput) valueInput.value = c.value || '';
  } else {
    if (title) title.textContent = 'Nueva Configuración';
    if (saveBtn) {
      saveBtn.classList.remove('bg-blue-600', 'border-blue-600', 'hover:bg-blue-700');
      saveBtn.classList.add('bg-green-600', 'border-green-600', 'hover:bg-green-700');
    }
    if (nameInput) nameInput.value = '';
    if (variableNameInput) {
      variableNameInput.value = '';
      variableNameInput.disabled = false;
    }
    if (descriptionInput) descriptionInput.value = '';
    if (valueInput) valueInput.value = '';
  }
}

// Hide config form
function hideConfigForm() {
  const form = document.getElementById('config-form');
  if (form) form.classList.add('hidden');
  
  const variableNameInput = document.getElementById('config-variable-name');
  if (variableNameInput) variableNameInput.disabled = false;
  const keyEditInput = document.getElementById('config-key-edit');
  if (keyEditInput) keyEditInput.value = '';
}

// Save config
async function saveConfig(item) {
  const nrd = window.nrd;
  if (!nrd) {
    throw new Error('NRD Data Access not initialized');
  }
  if (!nrd.config) {
    throw new Error('ConfigService not available. Please ensure you are using the latest version of nrd-data-access library.');
  }
  
  await nrd.config.setConfig(item.variableName, item);
}

// Delete config handler
async function deleteConfigHandler(key) {
  const nrd = window.nrd;
  if (!nrd) {
    if (typeof logger !== 'undefined' && logger.warn) {
      logger.warn('NRD Data Access not initialized');
    } else {
      console.warn('NRD Data Access not initialized');
    }
    return;
  }
  if (!nrd.config) {
    const errorMsg = 'ConfigService not available';
    if (typeof logger !== 'undefined' && logger.error) {
      logger.error(errorMsg);
    } else {
      console.error(errorMsg);
    }
    await showError('El servicio de Configuraciones no está disponible. Por favor, actualiza la librería nrd-data-access.');
    return;
  }
  
  if (typeof logger !== 'undefined' && logger.debug) {
    logger.debug('Delete config requested', { key });
  }
  const confirmed = await showConfirm('Eliminar Configuración', `¿Está seguro de eliminar la configuración "${key}"?`);
  if (!confirmed) {
    if (typeof logger !== 'undefined' && logger.debug) {
      logger.debug('Config deletion cancelled', { key });
    }
    return;
  }

  try {
    await nrd.config.delete(key);
    if (typeof logger !== 'undefined' && logger.info) {
      logger.info('Config deleted successfully', { key });
    }
    loadConfigs();
  } catch (error) {
    if (typeof logger !== 'undefined' && logger.error) {
      logger.error('Failed to delete config', error);
    } else {
      console.error('Failed to delete config', error);
    }
    await showError('Error al eliminar configuración: ' + error.message);
  }
}

// Config form submit handler
let configFormHandlerSetup = false;
function setupConfigFormHandler() {
  if (configFormHandlerSetup) return;
  const formElement = document.getElementById('config-form-element');
  if (!formElement) return;
  
  configFormHandlerSetup = true;
  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const keyEditInput = document.getElementById('config-key-edit');
    const nameInput = document.getElementById('config-name');
    const variableNameInput = document.getElementById('config-variable-name');
    const descriptionInput = document.getElementById('config-description');
    const valueInput = document.getElementById('config-value');
    
    const existingKey = keyEditInput?.value || null;
    const name = nameInput?.value.trim() || '';
    const variableName = (variableNameInput?.value || '').trim().replace(/\s+/g, '');
    const description = descriptionInput?.value.trim() || '';
    const value = valueInput?.value.trim() || '';

    if (!name) {
      await showError('El nombre es requerido');
      return;
    }

    if (!variableName) {
      await showError('El nombre variable es requerido');
      return;
    }

    if (!value) {
      await showError('El valor es requerido');
      return;
    }

    const variableNameToUse = existingKey || variableName;

    try {
      await saveConfig({
        name,
        variableName: variableNameToUse,
        description,
        value
      });
      hideConfigForm();
      await showSuccess(existingKey ? 'Configuración actualizada exitosamente' : 'Configuración creada exitosamente');
      loadConfigs();
    } catch (error) {
      if (typeof logger !== 'undefined' && logger.error) {
        logger.error('Failed to save config', error);
      } else {
        console.error('Failed to save config', error);
      }
      await showError('Error al guardar configuración: ' + error.message);
    }
  });
}

// Cleanup function
function cleanupConfigs() {
  // No listeners to cleanup for configs (we load on demand)
  configsData = {};
}

// Initialize configs management
function initializeConfigs() {
  setupConfigFormHandler();
  
  // Search input handler
  const searchInput = document.getElementById('configs-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      configsSearchTerm = e.target.value;
      renderConfigs(configsData);
    });
  }

  // New config button
  const newBtn = document.getElementById('new-config-btn');
  if (newBtn) {
    newBtn.addEventListener('click', () => {
      showConfigForm();
    });
  }

  // Cancel config form
  const cancelBtn = document.getElementById('cancel-config-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      hideConfigForm();
    });
  }

  // Close config form button
  const closeBtn = document.getElementById('close-config-form');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideConfigForm();
    });
  }
}

// Load configs when tab is shown
function loadConfigsTab() {
  loadConfigs();
}

// Export functions for global use
window.initializeConfigs = initializeConfigs;
window.loadConfigsTab = loadConfigsTab;
window.cleanupConfigs = cleanupConfigs;
