// Base interface for entities with common fields
export interface BaseEntity {
  id?: string;
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
  productName?: string;
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

// Input model (Insumo)
export interface Input extends BaseEntity {
  name: string;
  unit: 'kg' | 'litro' | 'unidad' | string; // Unidad de medida
  unitPrice: number; // Precio unitario de compra actual
  supplier?: string; // Proveedor (opcional)
  lastUpdated?: number; // Timestamp de última actualización de precio
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
  batchYield: number; // Cantidad de unidades que rinde el lote
  inputs: RecipeInput[]; // Insumos utilizados
  labor: RecipeLabor[]; // Mano de obra aplicada
  createdAt?: number;
  active?: boolean; // Permite activar/desactivar recetas
}

export interface RecipeInput {
  inputId: string; // ID del insumo (referencia en tiempo real)
  inputType: 'input' | 'product'; // Tipo: insumo directo o subproducto (producto usado como insumo)
  quantity: number; // Cantidad utilizada
  // NO se guardan snapshots - se usan precios actuales en tiempo real
}

export interface RecipeLabor {
  roleId: string; // ID del rol (referencia en tiempo real)
  hours: number; // Cantidad de horas
  // NO se guardan snapshots - se usa costo hora actual en tiempo real
}
