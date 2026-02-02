// Base interface for entities with common fields
export interface BaseEntity {
  id?: string;
}

// Budget model
export interface Budget extends BaseEntity {
  name: string;
  startDate: number; // Timestamp inicio
  endDate: number; // Timestamp fin
  createdAt?: number;
  updatedAt?: number;
  budgets: {
    [categoryId: string]: {
      subcategories: {
        [description: string]: number; // Presupuesto por subcategoría (descripción)
      };
    };
  };
}

// Account model
export interface Account extends BaseEntity {
  name: string;
  active?: boolean;
  initialBalance?: number;
}

// Area model
export interface Area extends BaseEntity {
  name: string;
  description?: string;
  managerEmployeeId?: string;
}

// Category model
export interface Category extends BaseEntity {
  name: string;
  type: 'income' | 'expense';
  active?: boolean;
}

// Client model
export interface Client extends BaseEntity {
  name: string;
  address?: string;
  phone?: string;
  description?: string;
  preferredPrices?: PreferredPrice[];
}

export interface PreferredPrice {
  productId: string;
  type: 'fijo' | 'porcentual';
  price?: number; // Precio fijo o precio calculado (si es porcentual)
  percentage?: number; // Porcentaje de descuento (solo si type es 'porcentual')
}

// Supplier model (Proveedor)
export interface Supplier extends BaseEntity {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
}

// PurchaseUnit model (Unidad de Compra por Proveedor)
export interface PurchaseUnit {
  supplierId: string; // ID del proveedor
  unidad: string; // Unidad de medida (ej: 'kg', 'litro', 'caja', 'unidad')
}

// UnitConversion model (Conversión entre Unidades)
export interface UnitConversion {
  fromUnit: string; // Unidad origen (ej: 'kg')
  toUnit: string; // Unidad destino (ej: 'g')
  factor: number; // Factor de conversión: cantidad en fromUnit * factor = cantidad en toUnit
  // Ejemplo: 1 kg = 1000 g, entonces factor = 1000
}

// MeasurementUnit model (Unidad de Medida)
export interface MeasurementUnit extends BaseEntity {
  name: string; // Nombre de la unidad (ej: 'Kilogramo', 'Unidad')
  acronym: string; // Acrónimo de la unidad (ej: 'KG', 'UN')
  conversions?: MeasurementUnitConversion[]; // Conversiones a otras unidades de medida
}

// MeasurementUnitConversion model (Conversión de Unidad de Medida)
export interface MeasurementUnitConversion {
  toUnitId: string; // ID de la unidad de medida destino
  factor: number; // Factor de conversión: cantidad en esta unidad * factor = cantidad en toUnit
  // Ejemplo: Si esta unidad es 'kg' y toUnitId es 'g', factor = 1000 (1 kg = 1000 g)
}

// CompanyInfo model (single object, not a collection)
export interface CompanyInfo {
  address?: string;
  email?: string;
  legalName?: string;
  mission?: string;
  mobile?: string;
  phone?: string;
  rut?: string;
  tradeName?: string;
  vision?: string;
}

// Employee model
export interface Employee extends BaseEntity {
  name: string;
  roleIds?: string[];
  startDate?: number; // Fecha de ingreso (timestamp) - usada para calcular días de licencia
  endDate?: number; // Fecha de egreso (timestamp) - usada para calcular licencia no gozada al egreso
}

// Order model
export interface Order extends BaseEntity {
  clientId: string;
  clientName?: string;
  status: string;
  total: number;
  createdAt?: number;
  deliveryDate?: number;
  items?: OrderItem[];
}

export interface OrderItem {
  productId: string;
  variantId?: string; // ID de la variante seleccionada (opcional)
  productName?: string;
  variantName?: string; // Nombre de la variante (para mostrar en pedidos)
  quantity: number;
  price: number;
}

// Process model
export interface Process extends BaseEntity {
  name: string;
  areaId?: string;
  objective?: string;
  taskIds?: string[];
  activities?: ProcessActivity[];
}

export interface ProcessActivity {
  name: string;
  taskId: string;
  roleId?: string;
}

// Product model
export interface Product extends BaseEntity {
  name: string;
  sku?: string; // Código SKU para referencias internas
  price: number;
  cost?: number; // Costo calculado (se actualiza automáticamente)
  targetMargin?: number; // Margen objetivo (porcentaje, ej: 30 = 30%)
  active?: boolean;
  variants?: ProductVariant[]; // Variantes del producto (tamaños, sabores, colores, etc.)
  attributes?: { [key: string]: string }; // Atributos flexibles (ej: { "tamaño": "grande", "sabor": "chocolate" })
  esVendible?: boolean; // Indica si el producto es vendible
  esComprable?: boolean; // Indica si el producto es comprable
  esInsumo?: boolean; // Indica si el producto es un insumo
  esProducible?: boolean; // Indica si el producto es producible
  unidadVenta?: string; // Unidad de medida de venta (ej: 'kg', 'litro', 'unidad', 'caja')
  unidadProduccion?: string; // Unidad de medida de producción (ej: 'kg', 'litro', 'unidad')
  unidadesCompra?: PurchaseUnit[]; // Unidades de medida de compra por proveedor
  conversiones?: UnitConversion[]; // Conversiones entre unidades de medida
  recipeId?: string; // ID de la receta asociada al producto
  supplierId?: string; // ID del proveedor referente para compras (proveedor principal por defecto)
}

// ProductVariant model
export interface ProductVariant {
  name: string; // Nombre de la variante (ej: "Pequeña", "Chocolate", "Rojo")
  sku?: string; // Código SKU de la variante
  price: number; // Precio de la variante
  cost?: number; // Costo específico (opcional, se calcula de la receta si existe)
  targetMargin?: number; // Margen objetivo específico (opcional, hereda del padre si no se especifica)
  active?: boolean; // Si la variante está activa
  attributes?: { [key: string]: string }; // Atributos flexibles (ej: { "tamaño": "grande", "sabor": "chocolate" })
  esVendible?: boolean; // Indica si la variante es vendible
  esComprable?: boolean; // Indica si la variante es comprable
  esInsumo?: boolean; // Indica si la variante es un insumo
  esProducible?: boolean; // Indica si la variante es producible
  unidadVenta?: string; // Unidad de medida de venta (ej: 'kg', 'litro', 'unidad', 'caja')
  unidadProduccion?: string; // Unidad de medida de producción (ej: 'kg', 'litro', 'unidad')
  unidadesCompra?: PurchaseUnit[]; // Unidades de medida de compra por proveedor
  conversiones?: UnitConversion[]; // Conversiones entre unidades de medida
  recipeId?: string; // ID de la receta asociada a la variante (si existe, la receta es específica para esta variante)
  supplierId?: string; // ID del proveedor referente para compras (proveedor principal por defecto)
}

// Role model
export interface Role extends BaseEntity {
  name: string;
}

// Task model
export interface Task extends BaseEntity {
  name: string;
  description?: string;
  processId?: string;
  order?: number;
  assignedEmployeeId?: string;
  estimatedTime?: number;
  executionSteps?: string[];
  successCriteria?: string[];
  commonErrors?: string[];
}

// Transaction model
export interface Transaction extends BaseEntity {
  type: 'income' | 'expense';
  accountId: string;
  accountName?: string;
  amount: number;
  categoryId?: string;
  categoryName?: string;
  description?: string;
  date: number;
  createdAt?: number;
}

// Contract model
export interface Contract extends BaseEntity {
  name: string;
  description?: string;
  importantData?: {
    [key: string]: string;
  };
  documents?: ContractDocument[];
}

export interface ContractDocument {
  name: string;
  data: string; // Data URL (base64)
}

// LaborRole model (Rol de Mano de Obra)
export interface LaborRole extends BaseEntity {
  name: string;
  hourlyCost: number; // Costo hora real (incluye salario y cargas)
}

// IndirectCost model (Costo Indirecto)
export interface IndirectCost extends BaseEntity {
  name: string;
  monthlyAmount: number; // Monto mensual
  prorationMethod: 'units' | 'hours'; // Criterio de prorrateo (aunque se distribuya igual, se mantiene para referencia)
}

// Recipe model (Receta/Lote)
export interface Recipe extends BaseEntity {
  productId: string; // Producto asociado
  variantId?: string; // ID de la variante (si existe, la receta es específica para esa variante)
  batchYield: number; // Cantidad de unidades que rinde el lote
  inputs: RecipeInput[]; // Productos utilizados como insumos (productos con esInsumo: true)
  labor: RecipeLabor[]; // Mano de obra aplicada
  createdAt?: number;
  active?: boolean; // Permite activar/desactivar recetas
}

export interface RecipeInput {
  productId: string; // ID del producto (referencia en tiempo real) - debe ser un producto con esInsumo: true
  quantity: number; // Cantidad utilizada
  // NO se guardan snapshots - se usan precios actuales en tiempo real
}

export interface RecipeLabor {
  roleId: string; // ID del rol (referencia en tiempo real)
  hours: number; // Cantidad de horas
  // NO se guardan snapshots - se usa costo hora actual en tiempo real
}

// Cash Breakdown model (Desglose de efectivo)
export interface CashBreakdown {
  bills10000?: number;
  bills5000?: number;
  bills2000?: number;
  bills1000?: number;
  bills500?: number;
  bills100?: number;
  coins500?: number;
  coins100?: number;
  coins50?: number;
  coins10?: number;
  coins5?: number;
  coins1?: number;
}

// Shift model (Turno)
export interface Shift extends BaseEntity {
  date: string; // YYYY-MM-DD format
  shift: 'mañana' | 'tarde';
  cashierName: string;
  boxes: {
    [boxKey: string]: {
      initialFund?: number;
      initialFundBreakdown?: CashBreakdown;
      collectedCash?: number;
      collectedCashBreakdown?: CashBreakdown;
    };
  };
  productCounts?: {
    opening?: {
      'cafe-senior'?: number;
      'cigarros-grandes'?: number;
      'cigarros-chicos'?: number;
      'tabaco'?: number;
      [key: string]: number | undefined;
    };
    closing?: {
      'cafe-senior'?: number;
      'cigarros-grandes'?: number;
      'cigarros-chicos'?: number;
      'tabaco'?: number;
      [key: string]: number | undefined;
    };
  };
  closed?: boolean;
  closedAt?: number;
  finalObservations?: string;
  createdAt?: number;
  updatedAt?: number;
}

// Shift Movement model (Movimiento de Turno)
export interface ShiftMovement extends BaseEntity {
  shiftId: string;
  box: 'mostrador' | 'banca-juegos';
  type: 'ingreso' | 'egreso';
  amount: number;
  breakdown?: CashBreakdown;
  reason?: string;
  moment: 'inicio' | 'durante' | 'cierre';
  createdAt?: number;
}

// Shift Incident model (Incidente de Turno)
export interface ShiftIncident extends BaseEntity {
  shiftId: string;
  type: string;
  customType?: string;
  box?: 'mostrador' | 'banca-juegos' | 'otros';
  description: string;
  amount?: number;
  createdAt?: number;
}

// License model (Licencia - Días Tomados)
export interface License extends BaseEntity {
  employeeId: string;        // ID del empleado
  daysTaken: number;        // Días de licencia tomados (se descuentan del saldo acumulado)
  startDate?: number;        // Fecha de inicio (timestamp)
  endDate?: number;          // Fecha de fin (timestamp)
  year: number;              // Año de la licencia (ej: 2025)
  month?: number;            // Mes (1-12) - opcional, para registrar mes específico
  notes?: string;            // Notas adicionales
  createdAt?: number;
}

// Salary model (Salario Mensual)
export interface Salary extends BaseEntity {
  employeeId: string;        // ID del empleado
  year: number;              // Año (ej: 2025)
  month: number;             // Mes (1-12)
  type: 'daily' | 'monthly'; // Tipo: 'daily' = jornal diario, 'monthly' = salario completo
  dailyWage?: number;        // Jornal diario (si type === 'daily')
  monthlySalary?: number;    // Salario completo mensual (si type === 'monthly')
  extras?: number;           // Extras/periodos (opcional)
  baseSalary30Days: number;  // Salario base 30 días (calculado automáticamente)
  notes?: string;            // Notas adicionales
  createdAt?: number;
}

// Vacation model (Salario Vacacional) - Calculado automáticamente
export interface Vacation extends BaseEntity {
  employeeId: string;        // ID del empleado
  amount: number;            // Monto del salario vacacional (calculado automáticamente)
  year: number;              // Año (ej: 2025)
  daysAccumulated: number;   // Días de vacaciones acumulados (calculado)
  daysTaken: number;        // Días de vacaciones tomados (suma de licencias)
  daysRemaining: number;    // Días restantes (acumulados - tomados)
  paidDate?: number;         // Fecha de pago (timestamp, opcional)
  notes?: string;            // Notas adicionales
  createdAt?: number;
  updatedAt?: number;        // Última actualización del cálculo
}

// Aguinaldo model - Calculado automáticamente
export interface Aguinaldo extends BaseEntity {
  employeeId: string;        // ID del empleado
  amount: number;            // Monto del aguinaldo (calculado automáticamente)
  year: number;              // Año (ej: 2025)
  paidDate?: number;         // Fecha de pago (timestamp, opcional)
  notes?: string;            // Notas adicionales
  createdAt?: number;
  updatedAt?: number;        // Última actualización del cálculo
}

// Notification model (Notificaciones pendientes)
export interface Notification extends BaseEntity {
  title: string;             // Título de la notificación
  message: string;           // Mensaje/body de la notificación
  sent: boolean;             // Si ya fue enviada o no
  sentAt?: number;           // Timestamp cuando fue enviada
  createdAt?: number;        // Timestamp de creación
  error?: string;            // Mensaje de error si falló el envío
}

// FCMToken model (Tokens FCM de dispositivos)
export interface FCMToken extends BaseEntity {
  token: string;             // Token FCM del dispositivo
  active?: boolean;          // Si el token está activo (default: true)
  deviceName?: string;       // Nombre del dispositivo (opcional)
  platform?: string;         // Plataforma: 'android', 'ios', 'web' (opcional)
  createdAt?: number;        // Timestamp de creación
  updatedAt?: number;        // Timestamp de última actualización
}

// PurchaseOrder model (Orden de Compra)
export interface PurchaseOrder extends BaseEntity {
  orderNumber?: string;      // Número de orden (opcional)
  supplierId: string;        // ID del proveedor
  supplierName?: string;     // Nombre del proveedor (para mostrar)
  status: string;            // Estado: 'Pendiente', 'Completada', 'Cancelada'
  total: number;             // Total de la orden
  items?: PurchaseOrderItem[]; // Items de la orden
  createdAt?: number;        // Timestamp de creación
}

export interface PurchaseOrderItem {
  productId?: string;        // ID del producto (opcional)
  productName?: string;      // Nombre del producto (para mostrar)
  quantity: number;          // Cantidad
  price: number;             // Precio unitario
}
