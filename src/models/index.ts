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
}

// Product model
export interface Product extends BaseEntity {
  name: string;
  price: number;
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
