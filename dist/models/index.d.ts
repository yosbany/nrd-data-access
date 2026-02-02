export interface BaseEntity {
    id?: string;
}
export interface Budget extends BaseEntity {
    name: string;
    startDate: number;
    endDate: number;
    createdAt?: number;
    updatedAt?: number;
    budgets: {
        [categoryId: string]: {
            subcategories: {
                [description: string]: number;
            };
        };
    };
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
export interface Supplier extends BaseEntity {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    description?: string;
}
export interface PurchaseUnit {
    supplierId: string;
    unidad: string;
}
export interface UnitConversion {
    fromUnit: string;
    toUnit: string;
    factor: number;
}
export interface MeasurementUnit extends BaseEntity {
    name: string;
    acronym: string;
    conversions?: MeasurementUnitConversion[];
}
export interface MeasurementUnitConversion {
    toUnitId: string;
    factor: number;
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
    startDate?: number;
    endDate?: number;
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
    variantId?: string;
    productName?: string;
    variantName?: string;
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
    variants?: ProductVariant[];
    attributes?: {
        [key: string]: string;
    };
    esVendible?: boolean;
    esComprable?: boolean;
    esInsumo?: boolean;
    esProducible?: boolean;
    unidadVenta?: string;
    unidadProduccion?: string;
    unidadesCompra?: PurchaseUnit[];
    conversiones?: UnitConversion[];
    recipeId?: string;
    supplierId?: string;
}
export interface ProductVariant {
    name: string;
    sku?: string;
    price: number;
    cost?: number;
    targetMargin?: number;
    active?: boolean;
    attributes?: {
        [key: string]: string;
    };
    esVendible?: boolean;
    esComprable?: boolean;
    esInsumo?: boolean;
    esProducible?: boolean;
    unidadVenta?: string;
    unidadProduccion?: string;
    unidadesCompra?: PurchaseUnit[];
    conversiones?: UnitConversion[];
    recipeId?: string;
    supplierId?: string;
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
    variantId?: string;
    batchYield: number;
    inputs: RecipeInput[];
    labor: RecipeLabor[];
    createdAt?: number;
    active?: boolean;
}
export interface RecipeInput {
    productId: string;
    quantity: number;
}
export interface RecipeLabor {
    roleId: string;
    hours: number;
}
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
export interface Shift extends BaseEntity {
    date: string;
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
export interface ShiftIncident extends BaseEntity {
    shiftId: string;
    type: string;
    customType?: string;
    box?: 'mostrador' | 'banca-juegos' | 'otros';
    description: string;
    amount?: number;
    createdAt?: number;
}
export interface License extends BaseEntity {
    employeeId: string;
    daysTaken: number;
    startDate?: number;
    endDate?: number;
    year: number;
    month?: number;
    notes?: string;
    createdAt?: number;
}
export interface Salary extends BaseEntity {
    employeeId: string;
    year: number;
    month: number;
    type: 'daily' | 'monthly';
    dailyWage?: number;
    monthlySalary?: number;
    extras?: number;
    baseSalary30Days: number;
    notes?: string;
    createdAt?: number;
}
export interface Vacation extends BaseEntity {
    employeeId: string;
    amount: number;
    year: number;
    daysAccumulated: number;
    daysTaken: number;
    daysRemaining: number;
    paidDate?: number;
    notes?: string;
    createdAt?: number;
    updatedAt?: number;
}
export interface Aguinaldo extends BaseEntity {
    employeeId: string;
    amount: number;
    year: number;
    paidDate?: number;
    notes?: string;
    createdAt?: number;
    updatedAt?: number;
}
export interface Notification extends BaseEntity {
    title: string;
    message: string;
    sent: boolean;
    sentAt?: number;
    createdAt?: number;
    error?: string;
}
export interface FCMToken extends BaseEntity {
    token: string;
    active?: boolean;
    deviceName?: string;
    platform?: string;
    createdAt?: number;
    updatedAt?: number;
}
export interface PurchaseOrder extends BaseEntity {
    orderNumber?: string;
    supplierId: string;
    supplierName?: string;
    status: string;
    total: number;
    items?: PurchaseOrderItem[];
    createdAt?: number;
}
export interface PurchaseOrderItem {
    productId?: string;
    productName?: string;
    quantity: number;
    price: number;
}
//# sourceMappingURL=index.d.ts.map