export interface BaseEntity {
    id?: string;
}
export interface Account extends BaseEntity {
    name: string;
    active?: boolean;
    initialBalance?: number;
}
export interface Area extends BaseEntity {
    name: string;
    description?: string;
    managerEmployeeId?: string;
}
export interface Category extends BaseEntity {
    name: string;
    type: 'income' | 'expense';
    active?: boolean;
}
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
    price?: number;
    percentage?: number;
}
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
export interface Employee extends BaseEntity {
    name: string;
    roleIds?: string[];
}
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
export interface Product extends BaseEntity {
    name: string;
    sku?: string;
    price: number;
    cost?: number;
    targetMargin?: number;
    active?: boolean;
}
export interface Role extends BaseEntity {
    name: string;
}
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
    data: string;
}
export interface Input extends BaseEntity {
    name: string;
    unit: 'kg' | 'litro' | 'unidad' | string;
    unitPrice: number;
    supplier?: string;
    lastUpdated?: number;
}
export interface LaborRole extends BaseEntity {
    name: string;
    hourlyCost: number;
}
export interface IndirectCost extends BaseEntity {
    name: string;
    monthlyAmount: number;
    prorationMethod: 'units' | 'hours';
}
export interface Recipe extends BaseEntity {
    productId: string;
    batchYield: number;
    inputs: RecipeInput[];
    labor: RecipeLabor[];
    createdAt?: number;
    active?: boolean;
}
export interface RecipeInput {
    inputId: string;
    inputType: 'input' | 'product';
    quantity: number;
}
export interface RecipeLabor {
    roleId: string;
    hours: number;
}
//# sourceMappingURL=index.d.ts.map