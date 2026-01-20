// Tab Inicio - Visualización de todos los modelos con propiedades y relaciones

// Definición de todos los modelos con sus propiedades y relaciones
const MODELOS = {
  accounts: {
    name: 'Cuentas',
    service: 'accounts',
    description: 'Cuentas bancarias o de efectivo',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre de la cuenta' },
      { name: 'active', type: 'boolean', required: false, description: 'Si la cuenta está activa' },
      { name: 'initialBalance', type: 'number', required: false, description: 'Saldo inicial' }
    ],
    relations: []
  },
  areas: {
    name: 'Áreas',
    service: 'areas',
    description: 'Áreas organizacionales de la empresa',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre del área' },
      { name: 'description', type: 'string', required: false, description: 'Descripción del área' },
      { name: 'managerEmployeeId', type: 'string', required: false, description: 'ID del empleado gerente' }
    ],
    relations: [
      { field: 'managerEmployeeId', to: 'employees', description: 'Gerente (Empleado)' }
    ]
  },
  categories: {
    name: 'Categorías',
    service: 'categories',
    description: 'Categorías de ingresos y egresos',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre de la categoría' },
      { name: 'type', type: "'income' | 'expense'", required: true, description: 'Tipo: ingreso o egreso' },
      { name: 'active', type: 'boolean', required: false, description: 'Si la categoría está activa' }
    ],
    relations: []
  },
  clients: {
    name: 'Clientes',
    service: 'clients',
    description: 'Clientes de la empresa',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre del cliente' },
      { name: 'address', type: 'string', required: false, description: 'Dirección' },
      { name: 'phone', type: 'string', required: false, description: 'Teléfono' },
      { name: 'description', type: 'string', required: false, description: 'Descripción' },
      { name: 'preferredPrices', type: 'PreferredPrice[]', required: false, description: 'Precios preferenciales por producto' }
    ],
    relations: [
      { field: 'preferredPrices[].productId', to: 'products', description: 'Precios preferenciales → Productos' }
    ]
  },
  'company-info': {
    name: 'Información de Empresa',
    service: 'companyInfo',
    description: 'Información única de la empresa (objeto único, no colección)',
    isSingle: true,
    properties: [
      { name: 'tradeName', type: 'string', required: false, description: 'Nombre comercial' },
      { name: 'legalName', type: 'string', required: false, description: 'Razón social' },
      { name: 'rut', type: 'string', required: false, description: 'RUT' },
      { name: 'address', type: 'string', required: false, description: 'Dirección' },
      { name: 'phone', type: 'string', required: false, description: 'Teléfono' },
      { name: 'mobile', type: 'string', required: false, description: 'Móvil' },
      { name: 'email', type: 'string', required: false, description: 'Email' },
      { name: 'mission', type: 'string', required: false, description: 'Misión' },
      { name: 'vision', type: 'string', required: false, description: 'Visión' }
    ],
    relations: []
  },
  contracts: {
    name: 'Contratos',
    service: 'contracts',
    description: 'Contratos y habilitaciones',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre del contrato' },
      { name: 'description', type: 'string', required: false, description: 'Descripción' },
      { name: 'importantData', type: 'object', required: false, description: 'Datos importantes (objeto flexible)' },
      { name: 'documents', type: 'ContractDocument[]', required: false, description: 'Documentos adjuntos' }
    ],
    relations: []
  },
  employees: {
    name: 'Empleados',
    service: 'employees',
    description: 'Empleados de la empresa',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre del empleado' },
      { name: 'roleIds', type: 'string[]', required: false, description: 'IDs de roles', relation: 'roles' },
      { name: 'startDate', type: 'number', required: false, description: 'Fecha de ingreso (timestamp)' },
      { name: 'endDate', type: 'number', required: false, description: 'Fecha de egreso (timestamp)' }
    ],
    relations: [
      { field: 'roleIds[]', to: 'roles', description: 'Roles → Roles' }
    ]
  },
  orders: {
    name: 'Pedidos',
    service: 'orders',
    description: 'Pedidos de clientes',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'clientId', type: 'string', required: true, description: 'ID del cliente', relation: 'clients' },
      { name: 'clientName', type: 'string', required: false, description: 'Nombre del cliente (denormalizado)' },
      { name: 'status', type: 'string', required: true, description: 'Estado del pedido' },
      { name: 'total', type: 'number', required: true, description: 'Total del pedido' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' },
      { name: 'deliveryDate', type: 'number', required: false, description: 'Fecha de entrega (timestamp)' },
      { name: 'items', type: 'OrderItem[]', required: false, description: 'Items del pedido' }
    ],
    relations: [
      { field: 'clientId', to: 'clients', description: 'Cliente' },
      { field: 'items[].productId', to: 'products', description: 'Items → Productos' }
    ]
  },
  processes: {
    name: 'Procesos',
    service: 'processes',
    description: 'Procesos organizacionales',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre del proceso' },
      { name: 'areaId', type: 'string', required: false, description: 'ID del área', relation: 'areas' },
      { name: 'objective', type: 'string', required: false, description: 'Objetivo del proceso' },
      { name: 'taskIds', type: 'string[]', required: false, description: 'IDs de tareas', relation: 'tasks' },
      { name: 'activities', type: 'ProcessActivity[]', required: false, description: 'Actividades del proceso' }
    ],
    relations: [
      { field: 'areaId', to: 'areas', description: 'Área' },
      { field: 'taskIds[]', to: 'tasks', description: 'Tareas → Tareas' },
      { field: 'activities[].taskId', to: 'tasks', description: 'Actividades → Tareas' },
      { field: 'activities[].roleId', to: 'roles', description: 'Actividades → Roles' }
    ]
  },
  products: {
    name: 'Productos',
    service: 'products',
    description: 'Productos de la empresa',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre del producto' },
      { name: 'sku', type: 'string', required: false, description: 'Código SKU' },
      { name: 'price', type: 'number', required: true, description: 'Precio' },
      { name: 'cost', type: 'number', required: false, description: 'Costo calculado' },
      { name: 'targetMargin', type: 'number', required: false, description: 'Margen objetivo (%)' },
      { name: 'active', type: 'boolean', required: false, description: 'Si el producto está activo' },
      { name: 'attributes', type: 'object', required: false, description: 'Atributos flexibles (objeto clave-valor)' },
      { name: 'esVendible', type: 'boolean', required: false, description: 'Indica si el producto es vendible' },
      { name: 'esComprable', type: 'boolean', required: false, description: 'Indica si el producto es comprable' },
      { name: 'esInsumo', type: 'boolean', required: false, description: 'Indica si el producto es un insumo' },
      { name: 'esProducible', type: 'boolean', required: false, description: 'Indica si el producto es producible' },
      { name: 'unidadVenta', type: 'string', required: false, description: 'Unidad de medida de venta (ej: kg, litro, unidad, caja)' },
      { name: 'unidadProduccion', type: 'string', required: false, description: 'Unidad de medida de producción (ej: kg, litro, unidad)' },
      { name: 'unidadesCompra', type: 'PurchaseUnit[]', required: false, description: 'Unidades de medida de compra por proveedor' },
      { name: 'conversiones', type: 'UnitConversion[]', required: false, description: 'Conversiones entre unidades de medida' },
      { name: 'recipeId', type: 'string', required: false, description: 'ID de la receta asociada', relation: 'recipes' },
      { name: 'supplierId', type: 'string', required: false, description: 'ID del proveedor referente para compras', relation: 'suppliers' },
      { name: 'variants', type: 'ProductVariant[]', required: false, description: 'Variantes del producto' }
    ],
    relations: [
      { field: 'recipeId', to: 'recipes', description: 'Receta asociada' },
      { field: 'supplierId', to: 'suppliers', description: 'Proveedor referente' }
    ]
  },
  'labor-roles': {
    name: 'Roles de Mano de Obra',
    service: 'laborRoles',
    description: 'Roles de mano de obra con costos horarios',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre del rol' },
      { name: 'hourlyCost', type: 'number', required: true, description: 'Costo por hora' }
    ],
    relations: []
  },
  'indirect-costs': {
    name: 'Costos Indirectos',
    service: 'indirectCosts',
    description: 'Costos indirectos de la empresa',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre del costo indirecto' },
      { name: 'monthlyAmount', type: 'number', required: true, description: 'Monto mensual' },
      { name: 'prorationMethod', type: "'units' | 'hours'", required: true, description: 'Método de prorrateo' }
    ],
    relations: []
  },
  recipes: {
    name: 'Recetas',
    service: 'recipes',
    description: 'Recetas para productos',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'productId', type: 'string', required: true, description: 'ID del producto', relation: 'products' },
      { name: 'variantId', type: 'string', required: false, description: 'ID de la variante', relation: 'products' },
      { name: 'batchYield', type: 'number', required: true, description: 'Rendimiento del lote' },
      { name: 'inputs', type: 'RecipeInput[]', required: false, description: 'Productos utilizados como insumos (productos con esInsumo: true)' },
      { name: 'labor', type: 'RecipeLabor[]', required: false, description: 'Mano de obra aplicada' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' },
      { name: 'active', type: 'boolean', required: false, description: 'Si la receta está activa' }
    ],
    relations: [
      { field: 'productId', to: 'products', description: 'Producto' },
      { field: 'inputs[].productId', to: 'products', description: 'Productos → Productos (con esInsumo: true)' },
      { field: 'labor[].roleId', to: 'laborRoles', description: 'Mano de obra → Roles de Mano de Obra' }
    ]
  },
  roles: {
    name: 'Roles',
    service: 'roles',
    description: 'Roles organizacionales',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre del rol' }
    ],
    relations: []
  },
  tasks: {
    name: 'Tareas',
    service: 'tasks',
    description: 'Tareas organizacionales',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'name', type: 'string', required: true, description: 'Nombre de la tarea' },
      { name: 'description', type: 'string', required: false, description: 'Descripción' },
      { name: 'processId', type: 'string', required: false, description: 'ID del proceso', relation: 'processes' },
      { name: 'assignedEmployeeId', type: 'string', required: false, description: 'ID del empleado asignado', relation: 'employees' },
      { name: 'order', type: 'number', required: false, description: 'Orden' },
      { name: 'estimatedTime', type: 'number', required: false, description: 'Tiempo estimado (minutos)' },
      { name: 'executionSteps', type: 'string[]', required: false, description: 'Pasos de ejecución' },
      { name: 'successCriteria', type: 'string[]', required: false, description: 'Criterios de éxito' },
      { name: 'commonErrors', type: 'string[]', required: false, description: 'Errores comunes' }
    ],
    relations: [
      { field: 'processId', to: 'processes', description: 'Proceso' },
      { field: 'assignedEmployeeId', to: 'employees', description: 'Empleado Asignado' }
    ]
  },
  transactions: {
    name: 'Transacciones',
    service: 'transactions',
    description: 'Transacciones financieras',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'type', type: "'income' | 'expense'", required: true, description: 'Tipo: ingreso o egreso' },
      { name: 'accountId', type: 'string', required: true, description: 'ID de la cuenta', relation: 'accounts' },
      { name: 'accountName', type: 'string', required: false, description: 'Nombre de la cuenta (denormalizado)' },
      { name: 'amount', type: 'number', required: true, description: 'Monto' },
      { name: 'categoryId', type: 'string', required: false, description: 'ID de la categoría', relation: 'categories' },
      { name: 'categoryName', type: 'string', required: false, description: 'Nombre de la categoría (denormalizado)' },
      { name: 'description', type: 'string', required: false, description: 'Descripción' },
      { name: 'date', type: 'number', required: true, description: 'Fecha (timestamp)' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' }
    ],
    relations: [
      { field: 'accountId', to: 'accounts', description: 'Cuenta' },
      { field: 'categoryId', to: 'categories', description: 'Categoría' }
    ]
  },
  shifts: {
    name: 'Turnos',
    service: 'shifts',
    description: 'Turnos de caja',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'date', type: 'string', required: true, description: 'Fecha (YYYY-MM-DD)' },
      { name: 'shift', type: "'mañana' | 'tarde'", required: true, description: 'Turno' },
      { name: 'cashierName', type: 'string', required: true, description: 'Nombre del cajero' },
      { name: 'boxes', type: 'object', required: false, description: 'Información de cajas' },
      { name: 'productCounts', type: 'object', required: false, description: 'Conteos de productos' },
      { name: 'closed', type: 'boolean', required: false, description: 'Si el turno está cerrado' },
      { name: 'closedAt', type: 'number', required: false, description: 'Fecha de cierre (timestamp)' },
      { name: 'finalObservations', type: 'string', required: false, description: 'Observaciones finales' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' },
      { name: 'updatedAt', type: 'number', required: false, description: 'Última actualización (timestamp)' }
    ],
    relations: []
  },
  'shift-movements': {
    name: 'Movimientos de Turno',
    service: 'shiftMovements',
    description: 'Movimientos de efectivo durante turnos',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'shiftId', type: 'string', required: true, description: 'ID del turno', relation: 'shifts' },
      { name: 'box', type: "'mostrador' | 'banca-juegos'", required: true, description: 'Caja' },
      { name: 'type', type: "'ingreso' | 'egreso'", required: true, description: 'Tipo de movimiento' },
      { name: 'amount', type: 'number', required: true, description: 'Monto' },
      { name: 'breakdown', type: 'CashBreakdown', required: false, description: 'Desglose de efectivo' },
      { name: 'reason', type: 'string', required: false, description: 'Razón' },
      { name: 'moment', type: "'inicio' | 'durante' | 'cierre'", required: true, description: 'Momento del movimiento' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' }
    ],
    relations: [
      { field: 'shiftId', to: 'shifts', description: 'Turno' }
    ]
  },
  'shift-incidents': {
    name: 'Incidentes de Turno',
    service: 'shiftIncidents',
    description: 'Incidentes durante turnos',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'shiftId', type: 'string', required: true, description: 'ID del turno', relation: 'shifts' },
      { name: 'type', type: 'string', required: true, description: 'Tipo de incidente' },
      { name: 'customType', type: 'string', required: false, description: 'Tipo personalizado' },
      { name: 'box', type: "'mostrador' | 'banca-juegos' | 'otros'", required: false, description: 'Caja' },
      { name: 'description', type: 'string', required: true, description: 'Descripción' },
      { name: 'amount', type: 'number', required: false, description: 'Monto (si aplica)' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' }
    ],
    relations: [
      { field: 'shiftId', to: 'shifts', description: 'Turno' }
    ]
  },
  licenses: {
    name: 'Licencias',
    service: 'licenses',
    description: 'Días de licencia tomados por empleados',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'employeeId', type: 'string', required: true, description: 'ID del empleado', relation: 'employees' },
      { name: 'daysTaken', type: 'number', required: true, description: 'Días tomados' },
      { name: 'startDate', type: 'number', required: false, description: 'Fecha de inicio (timestamp)' },
      { name: 'endDate', type: 'number', required: false, description: 'Fecha de fin (timestamp)' },
      { name: 'year', type: 'number', required: true, description: 'Año' },
      { name: 'month', type: 'number', required: false, description: 'Mes (1-12)' },
      { name: 'notes', type: 'string', required: false, description: 'Notas' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' }
    ],
    relations: [
      { field: 'employeeId', to: 'employees', description: 'Empleado' }
    ]
  },
  salaries: {
    name: 'Salarios',
    service: 'salaries',
    description: 'Salarios mensuales de empleados',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'employeeId', type: 'string', required: true, description: 'ID del empleado', relation: 'employees' },
      { name: 'year', type: 'number', required: true, description: 'Año' },
      { name: 'month', type: 'number', required: true, description: 'Mes (1-12)' },
      { name: 'type', type: "'daily' | 'monthly'", required: true, description: 'Tipo: jornal diario o salario mensual' },
      { name: 'dailyWage', type: 'number', required: false, description: 'Jornal diario' },
      { name: 'monthlySalary', type: 'number', required: false, description: 'Salario mensual' },
      { name: 'extras', type: 'number', required: false, description: 'Extras/periodos' },
      { name: 'baseSalary30Days', type: 'number', required: true, description: 'Salario base 30 días (calculado)' },
      { name: 'notes', type: 'string', required: false, description: 'Notas' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' }
    ],
    relations: [
      { field: 'employeeId', to: 'employees', description: 'Empleado' }
    ]
  },
  vacations: {
    name: 'Salario Vacacional',
    service: 'vacations',
    description: 'Salario vacacional calculado automáticamente',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'employeeId', type: 'string', required: true, description: 'ID del empleado', relation: 'employees' },
      { name: 'amount', type: 'number', required: true, description: 'Monto (calculado)' },
      { name: 'year', type: 'number', required: true, description: 'Año' },
      { name: 'daysAccumulated', type: 'number', required: true, description: 'Días acumulados (calculado)' },
      { name: 'daysTaken', type: 'number', required: true, description: 'Días tomados (calculado)' },
      { name: 'daysRemaining', type: 'number', required: true, description: 'Días restantes (calculado)' },
      { name: 'paidDate', type: 'number', required: false, description: 'Fecha de pago (timestamp)' },
      { name: 'notes', type: 'string', required: false, description: 'Notas' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' },
      { name: 'updatedAt', type: 'number', required: false, description: 'Última actualización (timestamp)' }
    ],
    relations: [
      { field: 'employeeId', to: 'employees', description: 'Empleado' }
    ]
  },
  aguinaldo: {
    name: 'Aguinaldo',
    service: 'aguinaldo',
    description: 'Aguinaldo calculado automáticamente',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'employeeId', type: 'string', required: true, description: 'ID del empleado', relation: 'employees' },
      { name: 'amount', type: 'number', required: true, description: 'Monto (calculado)' },
      { name: 'year', type: 'number', required: true, description: 'Año' },
      { name: 'paidDate', type: 'number', required: false, description: 'Fecha de pago (timestamp)' },
      { name: 'notes', type: 'string', required: false, description: 'Notas' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' },
      { name: 'updatedAt', type: 'number', required: false, description: 'Última actualización (timestamp)' }
    ],
    relations: [
      { field: 'employeeId', to: 'employees', description: 'Empleado' }
    ]
  },
  notifications: {
    name: 'Notificaciones',
    service: 'notifications',
    description: 'Notificaciones pendientes',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'title', type: 'string', required: true, description: 'Título' },
      { name: 'message', type: 'string', required: true, description: 'Mensaje' },
      { name: 'sent', type: 'boolean', required: false, description: 'Si fue enviada' },
      { name: 'sentAt', type: 'number', required: false, description: 'Fecha de envío (timestamp)' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' },
      { name: 'error', type: 'string', required: false, description: 'Mensaje de error si falló' }
    ],
    relations: []
  },
  'fcm-tokens': {
    name: 'Tokens FCM',
    service: 'fcmTokens',
    description: 'Tokens FCM de dispositivos',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'token', type: 'string', required: true, description: 'Token FCM' },
      { name: 'active', type: 'boolean', required: false, description: 'Si el token está activo' },
      { name: 'deviceName', type: 'string', required: false, description: 'Nombre del dispositivo' },
      { name: 'platform', type: 'string', required: false, description: 'Plataforma: android, ios, web' },
      { name: 'createdAt', type: 'number', required: false, description: 'Fecha de creación (timestamp)' },
      { name: 'updatedAt', type: 'number', required: false, description: 'Última actualización (timestamp)' }
    ],
    relations: []
  },
  config: {
    name: 'Configuración',
    service: 'config',
    description: 'Configuración del sistema',
    properties: [
      { name: 'id', type: 'string', required: false, description: 'ID único' },
      { name: 'key', type: 'string', required: true, description: 'Clave de configuración' },
      { name: 'value', type: 'any', required: true, description: 'Valor de configuración' }
    ],
    relations: []
  }
};

let inicioListener = null;

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getModelName(key) {
  return MODELOS[key]?.name || key;
}

function getModelRelations(key) {
  return MODELOS[key]?.relations || [];
}

function getModelProperties(key) {
  return MODELOS[key]?.properties || [];
}

function formatType(type) {
  if (type.includes('[]')) {
    return `<span class="text-purple-600">Array&lt;${type.replace('[]', '')}&gt;</span>`;
  }
  if (type.includes('|')) {
    return `<span class="text-blue-600">${type}</span>`;
  }
  return `<span class="text-gray-700">${type}</span>`;
}

function cleanupInicio() {
  if (inicioListener) {
    inicioListener();
    inicioListener = null;
  }
}

function loadInicio() {
  const content = document.getElementById('entity-content');
  if (!content) {
    console.error('Elemento entity-content no encontrado');
    return;
  }

  try {
    // Limpiar listener anterior
    cleanupInicio();

    // Renderizar vista de modelos
    renderModelos(content);
  } catch (error) {
    console.error('Error en loadInicio:', error);
    content.innerHTML = `
      <div class="text-center py-12 text-red-500">
        <p class="text-lg">Error al cargar los modelos</p>
        <p class="text-sm mt-2">${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

function renderModelos(container) {
  if (!container) {
    console.error('Container no proporcionado a renderModelos');
    return;
  }

  try {
    const modelosArray = Object.entries(MODELOS);
    
    if (!modelosArray || modelosArray.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-gray-500">
          <p class="text-lg">No hay modelos definidos</p>
        </div>
      `;
      return;
    }
    
    // Intentar crear visualización gráfica si es posible
    const canUseGraph = checkGraphSupport();
    
    if (canUseGraph) {
      renderGraphView(container, modelosArray);
    } else {
      renderCardsView(container, modelosArray);
    }
  } catch (error) {
    console.error('Error en renderModelos:', error);
    container.innerHTML = `
      <div class="text-center py-12 text-red-500">
        <p class="text-lg">Error al renderizar modelos</p>
        <p class="text-sm mt-2">${escapeHtml(error.message)}</p>
        <pre class="text-xs mt-4 text-left max-w-2xl mx-auto">${escapeHtml(error.stack || '')}</pre>
      </div>
    `;
  }
}

function checkGraphSupport() {
  // Por ahora, usar solo vista de tarjetas
  // Se puede mejorar en el futuro con una librería de gráficos
  return false;
}

function renderGraphView(container, modelosArray) {
  // Vista gráfica (para implementación futura)
  container.innerHTML = `
    <div class="mb-6">
      <h2 class="text-2xl font-light tracking-tight text-gray-800 mb-2">Modelos del Sistema</h2>
      <p class="text-gray-600">Vista gráfica de relaciones (próximamente)</p>
    </div>
  `;
  // Por ahora, renderizar vista de tarjetas
  renderCardsView(container, modelosArray);
}

function renderCardsView(container, modelosArray) {
  try {
    const cardsHtml = modelosArray.map(([key, modelo]) => {
      try {
        return renderModelCard(key, modelo);
      } catch (error) {
        console.error(`Error renderizando tarjeta para ${key}:`, error);
        return `
          <div class="bg-white border border-red-200 rounded-lg p-4">
            <h3 class="text-lg font-medium text-red-600">${escapeHtml(key)}</h3>
            <p class="text-sm text-red-500 mt-2">Error al renderizar: ${escapeHtml(error.message)}</p>
          </div>
        `;
      }
    }).join('');

    container.innerHTML = `
      <div class="mb-6">
        <h2 class="text-2xl font-light tracking-tight text-gray-800 mb-2">Modelos del Sistema</h2>
        <p class="text-gray-600">Todos los modelos con sus propiedades y relaciones</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${cardsHtml}
      </div>
    `;
    
    // Agregar event listeners después de renderizar
    attachCardFocusListeners();
  } catch (error) {
    console.error('Error en renderCardsView:', error);
    container.innerHTML = `
      <div class="text-center py-12 text-red-500">
        <p class="text-lg">Error al renderizar tarjetas</p>
        <p class="text-sm mt-2">${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

// Función para hacer foco en una tarjeta de modelo específica
function focusModelCard(modelKey) {
  const cardId = `model-card-${modelKey}`;
  const card = document.getElementById(cardId);
  
  if (card) {
    // Remover el highlight anterior
    document.querySelectorAll('.model-card-highlight').forEach(el => {
      el.classList.remove('model-card-highlight', 'model-card-highlight-enter');
    });
    
    // Agregar clase de highlight permanente a la tarjeta
    card.classList.add('model-card-highlight', 'model-card-highlight-enter');
    
    // Scroll suave a la tarjeta
    card.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
    
    // Remover la clase de animación después de la animación
    setTimeout(() => {
      card.classList.remove('model-card-highlight-enter');
    }, 500);
  } else {
    console.warn(`No se encontró la tarjeta del modelo: ${modelKey}`);
  }
}

function attachCardFocusListeners() {
  // Agregar event listeners a todas las tarjetas para resaltado al hacer clic
  document.querySelectorAll('[id^="model-card-"]').forEach(card => {
    card.addEventListener('click', function(e) {
      // Evitar que el clic en botones dentro de la tarjeta active el resaltado
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
      }
      const modelKey = this.id.replace('model-card-', '');
      focusModelCard(modelKey);
    });
  });
}

// Función para mostrar modal con propiedades de objeto
function showObjectPropertiesModal(propName, propType, isRequired, description) {
  const modal = document.getElementById('object-properties-modal');
  const modalTitle = document.getElementById('object-properties-modal-title');
  const modalContent = document.getElementById('object-properties-modal-content');
  
  if (!modal || !modalTitle || !modalContent) {
    console.error('Modal de propiedades de objeto no encontrado');
    return;
  }
  
  modalTitle.textContent = `Propiedades del objeto: ${escapeHtml(propName)}`;
  
  // Construir contenido del modal
  let contentHtml = `
    <div class="space-y-3">
      <div class="border-b border-gray-200 pb-2">
        <div class="text-xs uppercase tracking-wider text-gray-600 mb-1">Tipo</div>
        <div class="text-sm font-medium text-gray-800">${formatType(propType)}</div>
      </div>
      ${description ? `
      <div class="border-b border-gray-200 pb-2">
        <div class="text-xs uppercase tracking-wider text-gray-600 mb-1">Descripción</div>
        <div class="text-sm text-gray-700">${escapeHtml(description)}</div>
      </div>
      ` : ''}
      <div class="border-b border-gray-200 pb-2">
        <div class="text-xs uppercase tracking-wider text-gray-600 mb-1">Requerido</div>
        <div class="text-sm text-gray-700">${isRequired === 'true' || isRequired === true ? 'Sí' : 'No'}</div>
      </div>
      <div class="pt-2">
        <div class="text-xs uppercase tracking-wider text-gray-600 mb-2">Nota</div>
        <div class="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          Este es un objeto flexible que puede contener cualquier estructura de datos clave-valor. 
          Las propiedades específicas se definen dinámicamente según el uso en la aplicación.
        </div>
      </div>
    </div>
  `;
  
  modalContent.innerHTML = contentHtml;
  modal.classList.remove('hidden');
}

// Función para cerrar modal de propiedades de objeto
function closeObjectPropertiesModal() {
  const modal = document.getElementById('object-properties-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Exportar funciones para uso global
window.focusModelCard = focusModelCard;
window.showObjectPropertiesModal = showObjectPropertiesModal;
window.closeObjectPropertiesModal = closeObjectPropertiesModal;

function renderModelCard(key, modelo) {
  const isSingle = modelo.isSingle || false;
  const properties = modelo.properties || [];
  const relations = modelo.relations || [];
  
  // Crear un ID único para esta tarjeta para poder hacer scroll a ella
  const cardId = `model-card-${key}`;
  
  return `
    <div id="${cardId}" class="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-red-600 transition-colors scroll-mt-8 cursor-pointer" onclick="focusModelCard('${key}')">
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1.5">
          <h3 class="text-base font-medium text-gray-800">${escapeHtml(modelo.name)}</h3>
          ${isSingle ? '<span class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Único</span>' : ''}
        </div>
        <p class="text-xs text-gray-600 mb-2">${escapeHtml(modelo.description || '')}</p>
        <div class="text-xs text-gray-500 font-mono mb-2">${key}</div>
      </div>

      ${properties.length > 0 ? `
        <div class="mb-3">
          <h4 class="text-xs uppercase tracking-wider text-gray-600 mb-1.5">Propiedades</h4>
          <div class="space-y-0.5">
            ${properties.map(prop => {
              // Buscar si esta propiedad tiene una relación
              // Primero buscar en relations por el campo exacto
              let relatedModel = null;
              const relation = relations.find(r => {
                // Comparar campo exacto
                if (r.field === prop.name) return true;
                // Comparar si el campo contiene el nombre de la propiedad (para casos como 'items[].productId')
                if (r.field.includes(prop.name)) return true;
                return false;
              });
              
              if (relation) {
                relatedModel = relation.to;
              } else if (prop.relation) {
                // También verificar si la propiedad tiene directamente la relación
                relatedModel = prop.relation;
              }
              
              // Detectar si es un objeto
              const isObject = prop.type === 'object' || (prop.type.includes('object') && !prop.type.includes('[]'));
              
              return `
              <div class="border-l-2 ${prop.required ? 'border-red-600' : 'border-gray-300'} pl-1.5 py-0.5">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex-1 min-w-0 flex items-center gap-1">
                    <span class="text-xs font-medium text-gray-800">${escapeHtml(prop.name)}</span>
                    ${prop.required ? '<span class="text-xs text-red-600">*</span>' : ''}
                    <span class="text-xs text-gray-400">${formatType(prop.type)}</span>
                    ${isObject ? `
                      <button 
                        onclick="showObjectPropertiesModal('${escapeHtml(prop.name)}', '${escapeHtml(prop.type)}', ${prop.required ? 'true' : 'false'}, '${escapeHtml(prop.description || '')}'); event.stopPropagation();"
                        class="text-xs text-green-600 hover:text-green-800 hover:underline cursor-pointer transition-colors inline-flex items-center gap-0.5 ml-1"
                        title="Ver propiedades del objeto"
                      >
                        <span>📋</span>
                        <span>Ver objeto</span>
                      </button>
                    ` : ''}
                  </div>
                </div>
                ${prop.description ? `<div class="text-xs text-gray-500 leading-tight">${escapeHtml(prop.description)}</div>` : ''}
                ${relatedModel ? `
                  <button 
                    onclick="focusModelCard('${relatedModel}'); event.stopPropagation();"
                    class="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors inline-flex items-center gap-0.5"
                    title="Ver modelo ${escapeHtml(getModelName(relatedModel))}"
                  >
                    <span>→</span>
                    <span>${escapeHtml(getModelName(relatedModel))}</span>
                  </button>
                ` : ''}
              </div>
            `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <div class="pt-2 border-t border-gray-200">
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>${properties.length} propiedad${properties.length !== 1 ? 'es' : ''}</span>
          ${relations.length > 0 ? `<span>${relations.length} relación${relations.length !== 1 ? 'es' : ''}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function initializeInicio() {
  console.log('initializeInicio llamado');
  if (typeof loadInicio === 'function') {
    loadInicio();
  } else {
    console.error('loadInicio no está disponible');
  }
}

// Verificar que MODELOS esté definido
if (typeof MODELOS === 'undefined') {
  console.error('MODELOS no está definido');
}

// Exportar funciones necesarias
window.initializeInicio = initializeInicio;
window.loadInicio = loadInicio;
window.cleanupInicio = cleanupInicio;

// También exportar MODELOS para debugging
window.MODELOS = MODELOS;
