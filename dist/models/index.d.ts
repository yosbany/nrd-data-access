export interface BaseEntity {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
}
export interface Account extends BaseEntity {
    name: string;
    type: string;
    balance?: number;
    currency?: string;
    description?: string;
    active?: boolean;
}
export interface Area extends BaseEntity {
    name: string;
    description?: string;
    code?: string;
    active?: boolean;
}
export interface Category extends BaseEntity {
    name: string;
    description?: string;
    parentId?: string;
    active?: boolean;
}
export interface Client extends BaseEntity {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    taxId?: string;
    active?: boolean;
    notes?: string;
}
export interface CompanyInfo extends BaseEntity {
    name: string;
    legalName?: string;
    taxId?: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    settings?: Record<string, any>;
}
export interface Employee extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position?: string;
    department?: string;
    hireDate?: number;
    active?: boolean;
    userId?: string;
}
export interface Order extends BaseEntity {
    orderNumber: string;
    clientId: string;
    employeeId?: string;
    status: string;
    total: number;
    currency?: string;
    items?: OrderItem[];
    notes?: string;
    orderDate?: number;
}
export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
}
export interface Process extends BaseEntity {
    name: string;
    description?: string;
    steps?: ProcessStep[];
    active?: boolean;
}
export interface ProcessStep {
    order: number;
    name: string;
    description?: string;
    completed?: boolean;
}
export interface Product extends BaseEntity {
    name: string;
    description?: string;
    sku?: string;
    price: number;
    currency?: string;
    categoryId?: string;
    stock?: number;
    active?: boolean;
    images?: string[];
}
export interface Role extends BaseEntity {
    name: string;
    description?: string;
    permissions?: string[];
    active?: boolean;
}
export interface Task extends BaseEntity {
    title: string;
    description?: string;
    assignedTo?: string;
    assignedBy?: string;
    status: string;
    priority?: string;
    dueDate?: number;
    completedDate?: number;
    relatedEntityType?: string;
    relatedEntityId?: string;
}
export interface Transaction extends BaseEntity {
    type: 'income' | 'expense';
    accountId: string;
    amount: number;
    currency?: string;
    description?: string;
    category?: string;
    date: number;
    reference?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
}
//# sourceMappingURL=index.d.ts.map