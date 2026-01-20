// Main app controller for NRD Data Access Admin

// nrd is declared in auth.js, we'll use it from there
let currentTab = null;
let listeners = {};

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Entity configurations
const ENTITIES = {
  accounts: {
    name: 'Cuentas',
    service: 'accounts',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'active', label: 'Activa', type: 'checkbox', default: true },
      { key: 'initialBalance', label: 'Saldo Inicial', type: 'number', step: '0.01' }
    ]
  },
  areas: {
    name: 'Áreas',
    service: 'areas',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      { key: 'managerEmployeeId', label: 'Gerente', type: 'select', relation: 'employees', relationLabel: 'name' }
    ]
  },
  categories: {
    name: 'Categorías',
    service: 'categories',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'type', label: 'Tipo', type: 'select', options: [{ value: 'income', label: 'Ingreso' }, { value: 'expense', label: 'Egreso' }], required: true },
      { key: 'active', label: 'Activa', type: 'checkbox', default: true }
    ]
  },
  clients: {
    name: 'Clientes',
    service: 'clients',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'address', label: 'Dirección', type: 'textarea' },
      { key: 'phone', label: 'Teléfono', type: 'text' },
      { key: 'description', label: 'Descripción', type: 'textarea' }
    ],
    hasComplexFields: true // For preferredPrices
  },
  'company-info': {
    name: 'Información de Empresa',
    service: 'companyInfo',
    isSingle: true,
    fields: [
      { key: 'tradeName', label: 'Nombre Comercial', type: 'text' },
      { key: 'legalName', label: 'Razón Social', type: 'text' },
      { key: 'rut', label: 'RUT', type: 'text' },
      { key: 'address', label: 'Dirección', type: 'textarea' },
      { key: 'phone', label: 'Teléfono', type: 'text' },
      { key: 'mobile', label: 'Móvil', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'mission', label: 'Misión', type: 'textarea' },
      { key: 'vision', label: 'Visión', type: 'textarea' }
    ]
  },
  contracts: {
    name: 'Contratos',
    service: 'contracts',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'description', label: 'Descripción', type: 'textarea' }
    ],
    hasComplexFields: true // For importantData and documents
  },
  employees: {
    name: 'Empleados',
    service: 'employees',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'roleIds', label: 'Roles', type: 'multiselect', relation: 'roles', relationLabel: 'name' }
    ]
  },
  orders: {
    name: 'Órdenes',
    service: 'orders',
    fields: [
      { key: 'clientId', label: 'Cliente', type: 'select', relation: 'clients', relationLabel: 'name', required: true },
      { key: 'status', label: 'Estado', type: 'text', required: true },
      { key: 'total', label: 'Total', type: 'number', step: '0.01', required: true },
      { key: 'deliveryDate', label: 'Fecha de Entrega', type: 'date' }
    ],
    hasComplexFields: true // For items
  },
  processes: {
    name: 'Procesos',
    service: 'processes',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'areaId', label: 'Área', type: 'select', relation: 'areas', relationLabel: 'name' },
      { key: 'objective', label: 'Objetivo', type: 'textarea' }
    ],
    hasComplexFields: true // For taskIds and activities
  },
  products: {
    name: 'Productos',
    service: 'products',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'sku', label: 'Código SKU', type: 'text' },
      { key: 'price', label: 'Precio', type: 'number', step: '0.01', required: true },
      { key: 'cost', label: 'Costo', type: 'number', step: '0.01' },
      { key: 'targetMargin', label: 'Margen Objetivo (%)', type: 'number', step: '0.01' },
      { key: 'active', label: 'Activo', type: 'checkbox', default: true },
      { key: 'esVendible', label: 'Es Vendible', type: 'checkbox' },
      { key: 'esComprable', label: 'Es Comprable', type: 'checkbox' },
      { key: 'esInsumo', label: 'Es Insumo', type: 'checkbox' },
      { key: 'esProducible', label: 'Es Producible', type: 'checkbox' },
      { key: 'unidadVenta', label: 'Unidad de Venta', type: 'text', placeholder: 'kg, litro, unidad, caja, etc.' },
      { key: 'unidadProduccion', label: 'Unidad de Producción', type: 'text', placeholder: 'kg, litro, unidad, etc.' },
      { key: 'recipeId', label: 'Receta', type: 'select', relation: 'recipes', relationLabel: 'name' },
      { key: 'supplierId', label: 'Proveedor Referente', type: 'select', relation: 'suppliers', relationLabel: 'name' }
    ],
    hasComplexFields: true // For variants, unidadesCompra, conversiones, attributes
  },
  'labor-roles': {
    name: 'Roles de Mano de Obra',
    service: 'laborRoles',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'hourlyCost', label: 'Costo Hora', type: 'number', step: '0.01', required: true }
    ]
  },
  'indirect-costs': {
    name: 'Costos Indirectos',
    service: 'indirectCosts',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'monthlyAmount', label: 'Monto Mensual', type: 'number', step: '0.01', required: true },
      { key: 'prorationMethod', label: 'Método de Prorrateo', type: 'select', options: [{ value: 'units', label: 'Por Unidades' }, { value: 'hours', label: 'Por Horas' }], required: true }
    ]
  },
  recipes: {
    name: 'Recetas',
    service: 'recipes',
    fields: [
      { key: 'productId', label: 'Producto', type: 'select', relation: 'products', relationLabel: 'name', required: true },
      { key: 'batchYield', label: 'Rendimiento del Lote', type: 'number', step: '0.01', required: true },
      { key: 'active', label: 'Activa', type: 'checkbox', default: true },
      { key: 'createdAt', label: 'Fecha de Creación', type: 'date' }
    ],
    hasComplexFields: true // For inputs and labor arrays
  },
  roles: {
    name: 'Roles',
    service: 'roles',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true }
    ]
  },
  tasks: {
    name: 'Tareas',
    service: 'tasks',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      { key: 'processId', label: 'Proceso', type: 'select', relation: 'processes', relationLabel: 'name' },
      { key: 'assignedEmployeeId', label: 'Empleado Asignado', type: 'select', relation: 'employees', relationLabel: 'name' },
      { key: 'order', label: 'Orden', type: 'number' },
      { key: 'estimatedTime', label: 'Tiempo Estimado (min)', type: 'number' }
    ],
    hasComplexFields: true // For executionSteps, successCriteria, commonErrors
  },
  transactions: {
    name: 'Transacciones',
    service: 'transactions',
    fields: [
      { key: 'type', label: 'Tipo', type: 'select', options: [{ value: 'income', label: 'Ingreso' }, { value: 'expense', label: 'Egreso' }], required: true },
      { key: 'accountId', label: 'Cuenta', type: 'select', relation: 'accounts', relationLabel: 'name', required: true },
      { key: 'categoryId', label: 'Categoría', type: 'select', relation: 'categories', relationLabel: 'name' },
      { key: 'amount', label: 'Monto', type: 'number', step: '0.01', required: true },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      { key: 'date', label: 'Fecha', type: 'date', required: true }
    ]
  }
};

// Initialize app
function initApp() {
  window.nrd = initAuth();
  if (!window.nrd) {
    return;
  }

  const loginContainer = document.getElementById('login-container');
  const appContainer = document.getElementById('app-container');
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  function showLogin() {
    loginContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
  }

  function showApp() {
    loginContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
  }

  // Handle login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');

    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
      errorMessage.textContent = error.message || 'Error al iniciar sesión';
      errorMessage.classList.remove('hidden');
    }
  });

  // Handle auth state changes
  onAuthStateChanged((user) => {
    if (user) {
      showApp();
      // Esperar a que el DOM esté listo y los scripts cargados
      const tryInitializeInicio = () => {
        if (window.initializeInicio && typeof window.initializeInicio === 'function') {
          console.log('Inicializando tab inicio...');
          window.initializeInicio();
        } else {
          console.warn('initializeInicio no disponible aún, reintentando...');
          setTimeout(tryInitializeInicio, 50);
        }
      };
      // Esperar un poco para que los scripts se carguen
      setTimeout(tryInitializeInicio, 100);
    } else {
      showLogin();
      cleanup();
    }
  });

  function cleanup() {
    // Remove all listeners
    Object.values(listeners).forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    listeners = {};
    
    // Cleanup inicio tab
    if (window.cleanupInicio) {
      window.cleanupInicio();
    }
  }

  function renderEntityList(container, entity) {
    container.innerHTML = `
      <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 class="text-lg sm:text-xl font-light tracking-tight text-gray-800 mb-1">${entity.name}</h2>
          <p class="text-sm sm:text-base text-gray-600">Administra los registros de ${entity.name.toLowerCase()}</p>
        </div>
        <button 
          id="btn-new-${entity.service}"
          class="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors uppercase tracking-wider text-xs sm:text-sm font-light"
        >
          Nuevo
        </button>
      </div>
      <div id="${entity.service}-list" class="space-y-2 sm:space-y-3">
        <div class="text-center py-8 text-gray-500">Cargando...</div>
      </div>
    `;

    // Load and display entities
    loadEntities(entity);

    // New button handler
    document.getElementById(`btn-new-${entity.service}`).addEventListener('click', () => {
      showEntityModal(entity, null);
    });
  }

  function renderSingleEntity(container, entity) {
    container.innerHTML = `
      <div class="mb-4 sm:mb-6">
        <h2 class="text-lg sm:text-xl font-light tracking-tight text-gray-800 mb-1">${entity.name}</h2>
        <p class="text-sm sm:text-base text-gray-600">Información única de la empresa</p>
      </div>
      <div id="${entity.service}-content" class="bg-white border border-gray-200 p-4 sm:p-6">
        <div class="text-center py-8 text-gray-500">Cargando...</div>
      </div>
    `;

    loadSingleEntity(entity);
  }

  async function loadEntities(entity) {
    const listContainer = document.getElementById(`${entity.service}-list`);
    if (!listContainer) return;

    try {
      const service = window.nrd[entity.service];
      const unsubscribe = service.onValue((items) => {
        if (!listContainer) return;
        
        if (items.length === 0) {
          listContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500">
              <p>No hay registros</p>
              <button 
                onclick="document.getElementById('btn-new-${entity.service}').click()"
                class="mt-4 px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors uppercase tracking-wider text-xs font-light"
              >
                Crear Primero
              </button>
            </div>
          `;
          return;
        }

        listContainer.innerHTML = items.map(item => {
          const displayName = getEntityDisplayName(item, entity);
          return `
            <div class="bg-white border border-gray-200 p-3 sm:p-4 hover:border-red-600 transition-colors cursor-pointer" data-id="${item.id}">
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <div class="text-base sm:text-lg font-light text-gray-800">${escapeHtml(displayName)}</div>
                  ${getEntitySubtitle(item, entity) ? `<div class="text-sm text-gray-500 mt-1">${escapeHtml(getEntitySubtitle(item, entity))}</div>` : ''}
                </div>
                <div class="flex gap-2 ml-4">
                  <button 
                    class="px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    onclick="event.stopPropagation(); showEntityModal(${JSON.stringify(entity).replace(/"/g, '&quot;')}, '${item.id}')"
                  >
                    Editar
                  </button>
                  <button 
                    class="px-3 py-1 text-xs bg-red-600 text-white hover:bg-red-700 transition-colors"
                    onclick="event.stopPropagation(); deleteEntity('${entity.service}', '${item.id}')"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Add click handlers
        listContainer.querySelectorAll('[data-id]').forEach(el => {
          el.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            const id = el.dataset.id;
            showEntityModal(entity, id);
          });
        });
      });

      listeners[entity.service] = unsubscribe;
    } catch (error) {
      console.error(`Error loading ${entity.name}:`, error);
      listContainer.innerHTML = `
        <div class="text-center py-8 text-red-500">
          <p>Error al cargar: ${escapeHtml(error.message)}</p>
        </div>
      `;
    }
  }

  async function loadSingleEntity(entity) {
    const contentContainer = document.getElementById(`${entity.service}-content`);
    if (!contentContainer) return;

    try {
      const service = window.nrd[entity.service];
      const data = await service.get();
      
      if (!data) {
        contentContainer.innerHTML = `
          <div class="text-center py-8">
            <p class="text-gray-500 mb-4">No hay información configurada</p>
            <button 
              onclick="showEntityModal(${JSON.stringify(entity).replace(/"/g, '&quot;')}, null)"
              class="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors uppercase tracking-wider text-xs font-light"
            >
              Crear
            </button>
          </div>
        `;
        return;
      }

      contentContainer.innerHTML = `
        <div class="space-y-4">
          ${entity.fields.map(field => {
            const value = data[field.key];
            if (value === undefined || value === null || value === '') return '';
            return `
              <div class="border-b border-gray-200 pb-3">
                <div class="text-xs uppercase tracking-wider text-gray-600 mb-1">${field.label}</div>
                <div class="text-sm sm:text-base font-light text-gray-800">${escapeHtml(formatFieldValue(value, field))}</div>
              </div>
            `;
          }).join('')}
          <div class="pt-4">
            <button 
              onclick="showEntityModal(${JSON.stringify(entity).replace(/"/g, '&quot;')}, null)"
              class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors uppercase tracking-wider text-xs font-light"
            >
              Editar
            </button>
          </div>
        </div>
      `;
    } catch (error) {
      console.error(`Error loading ${entity.name}:`, error);
      contentContainer.innerHTML = `
        <div class="text-center py-8 text-red-500">
          <p>Error al cargar: ${escapeHtml(error.message)}</p>
        </div>
      `;
    }
  }

  function getEntityDisplayName(item, entity) {
    // Try to find a name field
    if (item.name) return item.name;
    if (item.tradeName) return item.tradeName;
    if (item.legalName) return item.legalName;
    return `ID: ${item.id}`;
  }

  function getEntitySubtitle(item, entity) {
    if (item.description) return item.description;
    if (item.address) return item.address;
    if (item.type) return item.type === 'income' ? 'Ingreso' : 'Egreso';
    if (item.status) return `Estado: ${item.status}`;
    
    // Product-specific subtitle
    if (entity.service === 'products') {
      const parts = [];
      if (item.sku) parts.push(`SKU: ${item.sku}`);
      if (item.price) parts.push(`$${item.price.toFixed(2)}`);
      if (item.unidadVenta) parts.push(`Venta: ${item.unidadVenta}`);
      if (item.variants && item.variants.length > 0) parts.push(`${item.variants.length} variante${item.variants.length > 1 ? 's' : ''}`);
      if (parts.length > 0) return parts.join(' • ');
    }
    
    return null;
  }

  function formatFieldValue(value, field) {
    if (value === null || value === undefined) return '-';
    if (field.type === 'date' && typeof value === 'number') {
      return new Date(value).toLocaleDateString('es-UY');
    }
    if (field.type === 'number' && typeof value === 'number') {
      return new Intl.NumberFormat('es-UY').format(value);
    }
    if (field.type === 'checkbox') {
      return value ? 'Sí' : 'No';
    }
    if (Array.isArray(value)) {
      // Handle variants
      if (field.key === 'variants' && value.length > 0) {
        return value.map(v => v.name || v.sku || 'Sin nombre').join(', ');
      }
      // Handle unidadesCompra
      if (field.key === 'unidadesCompra' && value.length > 0) {
        return value.map(u => `${u.unidad} (Proveedor: ${u.supplierId})`).join(', ');
      }
      // Handle conversiones
      if (field.key === 'conversiones' && value.length > 0) {
        return value.map(c => `1 ${c.fromUnit} = ${c.factor} ${c.toUnit}`).join('; ');
      }
      return value.join(', ');
    }
    if (typeof value === 'object') {
      // Handle attributes object
      if (field.key === 'attributes') {
        return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ');
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  // Make functions globally available
  window.showEntityModal = showEntityModal;
  window.deleteEntity = deleteEntity;

  async function showEntityModal(entity, itemId) {
    const modal = document.getElementById('crud-modal');
    const header = document.getElementById('crud-modal-header');
    const title = document.getElementById('crud-modal-title');
    const content = document.getElementById('crud-modal-content');
    const footer = document.getElementById('crud-modal-footer');

    if (!modal || !header || !title || !content || !footer) return;

    const isNew = !itemId;
    const headerColor = isNew ? 'bg-green-600' : 'bg-blue-600';
    const buttonColor = isNew ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700';

    header.className = `p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 ${headerColor} text-white`;
    title.textContent = isNew ? `Nuevo ${entity.name}` : `Editar ${entity.name}`;

    let itemData = null;
    if (itemId) {
      try {
        const service = window.nrd[entity.service];
        itemData = await service.getById(itemId);
      } catch (error) {
        alert('Error al cargar el registro: ' + error.message);
        return;
      }
    }

    // Build form
    let formHtml = '<form id="entity-form" class="space-y-4"';
    if (itemData) {
      formHtml += ` data-item-data='${JSON.stringify(itemData).replace(/'/g, "&#39;")}'`;
    }
    formHtml += '>';
    
    for (const field of entity.fields) {
      const value = itemData ? itemData[field.key] : (field.default !== undefined ? field.default : '');
      formHtml += renderField(field, value, entity);
    }

    // Handle complex fields
    if (entity.hasComplexFields) {
      formHtml += renderComplexFields(entity, itemData);
    }

    formHtml += '</form>';

    content.innerHTML = formHtml;

    // Load relation data for select fields (must be after setting innerHTML)
    await loadRelationData(entity, itemData);

    footer.innerHTML = `
      <button 
        type="button"
        onclick="closeEntityModal()"
        class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors uppercase tracking-wider text-xs font-light"
      >
        Cancelar
      </button>
      <button 
        type="submit"
        form="entity-form"
        class="px-4 py-2 ${buttonColor} text-white transition-colors uppercase tracking-wider text-xs font-light"
      >
        Guardar
      </button>
    `;

    // Form submit handler
    const form = document.getElementById('entity-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveEntity(entity, itemId, form);
    });

    modal.classList.remove('hidden');
  }

  function renderField(field, value, entity) {
    let html = `<div>`;
    html += `<label class="block mb-1.5 sm:mb-2 text-xs uppercase tracking-wider text-gray-600">${field.label}${field.required ? ' *' : ''}</label>`;

    if (field.type === 'text' || field.type === 'email') {
      html += `<input type="${field.type}" name="${field.key}" value="${escapeHtml(value || '')}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-600 text-sm sm:text-base">`;
    } else if (field.type === 'textarea') {
      html += `<textarea name="${field.key}" ${field.required ? 'required' : ''} rows="3" class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-600 text-sm sm:text-base">${escapeHtml(value || '')}</textarea>`;
    } else if (field.type === 'number') {
      html += `<input type="number" name="${field.key}" value="${value || ''}" step="${field.step || '1'}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-600 text-sm sm:text-base">`;
    } else if (field.type === 'date') {
      let dateValue = '';
      if (value) {
        if (typeof value === 'number') {
          dateValue = new Date(value).toISOString().split('T')[0];
        } else {
          dateValue = value;
        }
      }
      html += `<input type="date" name="${field.key}" value="${dateValue}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-600 text-sm sm:text-base">`;
    } else if (field.type === 'checkbox') {
      html += `<label class="flex items-center"><input type="checkbox" name="${field.key}" ${value ? 'checked' : ''} class="mr-2"> Activo</label>`;
    } else if (field.type === 'select') {
      if (field.relation) {
        html += `<select name="${field.key}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-600 text-sm sm:text-base" data-relation="${field.relation}" data-relation-label="${field.relationLabel}"><option value="">Seleccionar...</option></select>`;
      } else if (field.options) {
        html += `<select name="${field.key}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-600 text-sm sm:text-base">`;
        field.options.forEach(opt => {
          html += `<option value="${opt.value}" ${value === opt.value ? 'selected' : ''}>${opt.label}</option>`;
        });
        html += `</select>`;
      }
    } else if (field.type === 'multiselect') {
      if (field.relation) {
        const selectedValues = Array.isArray(value) ? value : [];
        html += `<select name="${field.key}" multiple class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-600 text-sm sm:text-base" data-relation="${field.relation}" data-relation-label="${field.relationLabel}" size="5"></select>`;
        html += `<div class="text-xs text-gray-500 mt-1">Mantén presionado Ctrl/Cmd para seleccionar múltiples</div>`;
      }
    }

    html += `</div>`;
    return html;
  }

  function renderComplexFields(entity, itemData) {
    let html = '';

    if (entity.service === 'clients' && itemData) {
      // Preferred Prices
      html += `<div class="border-t border-gray-200 pt-4 mt-4">`;
      html += `<h4 class="text-sm font-medium mb-3">Precios Preferenciales</h4>`;
      html += `<div id="preferred-prices-container" class="space-y-2"></div>`;
      html += `<button type="button" onclick="addPreferredPrice()" class="mt-2 px-3 py-1 text-xs bg-gray-600 text-white hover:bg-gray-700">Agregar Precio</button>`;
      html += `</div>`;
    }

    // Add more complex fields as needed
    return html;
  }

  async function loadRelationData(entity, itemData = null) {
    const selects = document.querySelectorAll('select[data-relation]');
    
    for (const select of selects) {
      const relation = select.dataset.relation;
      const relationLabel = select.dataset.relationLabel;
      
      try {
        const service = window.nrd[relation];
        const items = await service.getAll();
        
        // Clear existing options except the first one
        while (select.options.length > (select.multiple ? 0 : 1)) {
          select.remove(select.options.length - 1);
        }
        
        items.forEach(item => {
          const option = document.createElement('option');
          option.value = item.id;
          option.textContent = item[relationLabel] || item.name || item.id;
          select.appendChild(option);
        });

        // Set selected value if editing
        if (!select.multiple && itemData) {
          const currentValue = itemData[select.name];
          if (currentValue) {
            select.value = currentValue;
          }
        }
      } catch (error) {
        console.error(`Error loading relation ${relation}:`, error);
      }
    }
  }

  async function saveEntity(entity, itemId, form) {
    const formData = new FormData(form);
    const data = {};

    // Process regular fields
    for (const field of entity.fields) {
      if (field.type === 'checkbox') {
        data[field.key] = formData.has(field.key);
      } else if (field.type === 'multiselect') {
        const values = formData.getAll(field.key);
        data[field.key] = values;
      } else if (field.type === 'date') {
        const dateValue = formData.get(field.key);
        if (dateValue) {
          data[field.key] = new Date(dateValue).getTime();
        }
      } else if (field.type === 'number') {
        const numValue = formData.get(field.key);
        if (numValue !== '') {
          data[field.key] = parseFloat(numValue);
        }
      } else {
        const value = formData.get(field.key);
        if (value !== null && value !== '') {
          data[field.key] = value;
        }
      }
    }

    // Process complex fields
    if (entity.hasComplexFields) {
      await processComplexFields(entity, data, form);
    }

    try {
      const service = window.nrd[entity.service];
      
      if (entity.isSingle) {
        if (itemId) {
          await service.update(data);
        } else {
          await service.set(data);
        }
      } else {
        if (itemId) {
          await service.update(itemId, data);
        } else {
          await service.create(data);
        }
      }

      closeEntityModal();
    } catch (error) {
      alert('Error al guardar: ' + error.message);
      console.error('Save error:', error);
    }
  }

  async function processComplexFields(entity, data, form) {
    // Handle complex fields per entity type
    // This is a placeholder - implement as needed
  }

  async function deleteEntity(serviceName, itemId) {
    return new Promise((resolve) => {
      showConfirmModal(
        'Eliminar Registro',
        '¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.',
        async () => {
          try {
            const service = window.nrd[serviceName];
            await service.delete(itemId);
            resolve(true);
          } catch (error) {
            alert('Error al eliminar: ' + error.message);
            console.error('Delete error:', error);
            resolve(false);
          }
        },
        () => {
          resolve(false);
        }
      );
    });
  }

  function closeEntityModal() {
    const modal = document.getElementById('crud-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  window.closeEntityModal = closeEntityModal;

  // Confirmation modal
  function showConfirmModal(title, message, onConfirm, onCancel) {
    const modal = document.getElementById('confirm-modal');
    const titleEl = document.getElementById('confirm-modal-title');
    const messageEl = document.getElementById('confirm-modal-message');
    const confirmBtn = document.getElementById('confirm-modal-confirm');
    const cancelBtn = document.getElementById('confirm-modal-cancel');

    if (!modal || !titleEl || !messageEl || !confirmBtn || !cancelBtn) {
      // Fallback to native confirm if modal elements don't exist
      if (confirm(message)) {
        onConfirm();
      } else if (onCancel) {
        onCancel();
      }
      return;
    }

    titleEl.textContent = title;
    messageEl.textContent = message;
    modal.classList.remove('hidden');

    // Remove previous listeners by cloning buttons
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Add new listeners
    newConfirmBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      if (onConfirm) onConfirm();
    });

    newCancelBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      if (onCancel) onCancel();
    });

    // Close on outside click
    const handleOutsideClick = (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        if (onCancel) onCancel();
        modal.removeEventListener('click', handleOutsideClick);
      }
    };
    modal.addEventListener('click', handleOutsideClick);
  }

  window.showConfirmModal = showConfirmModal;

  function renderTools(container) {
    container.innerHTML = `
      <div class="mb-4 sm:mb-6">
        <h2 class="text-lg sm:text-xl font-light tracking-tight text-gray-800 mb-1">Herramientas de Administración</h2>
        <p class="text-sm sm:text-base text-gray-600">Depuración, limpieza y migración de datos</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Depuración -->
        <div class="bg-white border border-gray-200 p-4 sm:p-6">
          <h3 class="text-base font-medium mb-3">Depuración</h3>
          <p class="text-sm text-gray-600 mb-4">Encuentra y corrige inconsistencias en los datos</p>
          <button 
            onclick="runDebug()"
            class="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors uppercase tracking-wider text-xs font-light"
          >
            Ejecutar Depuración
          </button>
        </div>

        <!-- Limpieza -->
        <div class="bg-white border border-gray-200 p-4 sm:p-6">
          <h3 class="text-base font-medium mb-3">Limpieza</h3>
          <p class="text-sm text-gray-600 mb-4">Elimina datos obsoletos o duplicados</p>
          <button 
            onclick="runCleanup()"
            class="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors uppercase tracking-wider text-xs font-light"
          >
            Ejecutar Limpieza
          </button>
        </div>

        <!-- Migración -->
        <div class="bg-white border border-gray-200 p-4 sm:p-6">
          <h3 class="text-base font-medium mb-3">Migración</h3>
          <p class="text-sm text-gray-600 mb-4">Migra datos entre estructuras</p>
          <button 
            onclick="runMigration()"
            class="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors uppercase tracking-wider text-xs font-light"
          >
            Ejecutar Migración
          </button>
        </div>

        <!-- Exportar Datos -->
        <div class="bg-white border border-gray-200 p-4 sm:p-6">
          <h3 class="text-base font-medium mb-3">Exportar Datos</h3>
          <p class="text-sm text-gray-600 mb-4">Descarga todos los datos en formato JSON</p>
          <button 
            onclick="exportData()"
            class="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors uppercase tracking-wider text-xs font-light"
          >
            Exportar
          </button>
        </div>
      </div>

      <div id="tools-output" class="mt-6 bg-white border border-gray-200 p-4 sm:p-6 hidden">
        <h3 class="text-base font-medium mb-3">Resultado</h3>
        <pre id="tools-output-content" class="text-xs overflow-auto max-h-96"></pre>
      </div>
    `;
  }

  window.runDebug = async function() {
    const output = document.getElementById('tools-output');
    const content = document.getElementById('tools-output-content');
    if (!output || !content) return;

    output.classList.remove('hidden');
    content.textContent = 'Ejecutando depuración...\n';

    try {
      const issues = [];
      
      // Check for orphaned references
      for (const [key, entity] of Object.entries(ENTITIES)) {
        if (entity.isSingle) continue;
        
        const service = window.nrd[entity.service];
        const items = await service.getAll();
        
        for (const field of entity.fields) {
          if (field.relation) {
            const relationService = window.nrd[field.relation];
            const relationItems = await relationService.getAll();
            const relationIds = new Set(relationItems.map(r => r.id));
            
            items.forEach(item => {
              const refValue = item[field.key];
              if (refValue && !relationIds.has(refValue)) {
                issues.push(`${entity.name}: ${item.id || 'sin ID'} tiene referencia inválida en ${field.key} -> ${refValue}`);
              }
            });
          }
        }
      }

      if (issues.length === 0) {
        content.textContent += '✓ No se encontraron problemas\n';
      } else {
        content.textContent += `Se encontraron ${issues.length} problemas:\n\n`;
        content.textContent += issues.join('\n');
      }
    } catch (error) {
      content.textContent += `Error: ${error.message}\n`;
    }
  };

  window.runCleanup = async function() {
    return new Promise((resolve) => {
      showConfirmModal(
        'Ejecutar Limpieza',
        '¿Estás seguro de ejecutar la limpieza? Esto puede eliminar datos. Esta acción no se puede deshacer.',
        async () => {
          await executeCleanup();
          resolve(true);
        },
        () => {
          resolve(false);
        }
      );
    });
  };

  async function executeCleanup() {

    const output = document.getElementById('tools-output');
    const content = document.getElementById('tools-output-content');
    if (!output || !content) return;

    output.classList.remove('hidden');
    content.textContent = 'Ejecutando limpieza...\n';

    try {
      let cleaned = 0;
      
      // Remove orphaned references
      for (const [key, entity] of Object.entries(ENTITIES)) {
        if (entity.isSingle) continue;
        
        const service = window.nrd[entity.service];
        const items = await service.getAll();
        
        for (const item of items) {
          let needsUpdate = false;
          const updates = {};
          
          for (const field of entity.fields) {
            if (field.relation) {
              const relationService = window.nrd[field.relation];
              const relationItems = await relationService.getAll();
              const relationIds = new Set(relationItems.map(r => r.id));
              
              const refValue = item[field.key];
              if (refValue && !relationIds.has(refValue)) {
                updates[field.key] = null;
                needsUpdate = true;
              }
            }
          }
          
          if (needsUpdate) {
            await service.update(item.id, updates);
            cleaned++;
          }
        }
      }

      content.textContent += `Limpieza completada. ${cleaned} registros actualizados.\n`;
    } catch (error) {
      content.textContent += `Error: ${error.message}\n`;
    }
  };

  window.runMigration = async function() {
    return new Promise((resolve) => {
      showConfirmModal(
        'Ejecutar Migración',
        '¿Estás seguro de ejecutar la migración? Esto modificará la estructura de los datos. Esta acción no se puede deshacer.',
        async () => {
          await executeMigration();
          resolve(true);
        },
        () => {
          resolve(false);
        }
      );
    });
  };

  async function executeMigration() {

    const output = document.getElementById('tools-output');
    const content = document.getElementById('tools-output-content');
    if (!output || !content) return;

    output.classList.remove('hidden');
    content.textContent = 'Ejecutando migración...\n';

    try {
      // Example migration: Add createdAt to orders if missing
      const ordersService = window.nrd.orders;
      const orders = await ordersService.getAll();
      
      let migrated = 0;
      for (const order of orders) {
        if (!order.createdAt) {
          await ordersService.update(order.id, { createdAt: Date.now() });
          migrated++;
        }
      }

      content.textContent += `Migración completada. ${migrated} registros actualizados.\n`;
    } catch (error) {
      content.textContent += `Error: ${error.message}\n`;
    }
  };

  window.exportData = async function() {
    const output = document.getElementById('tools-output');
    const content = document.getElementById('tools-output-content');
    if (!output || !content) return;

    output.classList.remove('hidden');
    content.textContent = 'Exportando datos...\n';

    try {
      const exportData = {};
      
      for (const [key, entity] of Object.entries(ENTITIES)) {
        if (entity.isSingle) {
          const service = window.nrd[entity.service];
          exportData[key] = await service.get();
        } else {
          const service = window.nrd[entity.service];
          exportData[key] = await service.getAll();
        }
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nrd-data-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      content.textContent += '✓ Exportación completada\n';
    } catch (error) {
      content.textContent += `Error: ${error.message}\n`;
    }
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

