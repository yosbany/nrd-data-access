import { AuthService } from './services/auth.service';
import { AccountsService } from './services/accounts.service';
import { AreasService } from './services/areas.service';
import { CategoriesService } from './services/categories.service';
import { ClientsService } from './services/clients.service';
import { CompanyInfoService } from './services/company-info.service';
import { EmployeesService } from './services/employees.service';
import { OrdersService } from './services/orders.service';
import { ProcessesService } from './services/processes.service';
import { ProductsService } from './services/products.service';
import { RolesService } from './services/roles.service';
import { TasksService } from './services/tasks.service';
import { TransactionsService } from './services/transactions.service';
export * from './models';
export { AuthService } from './services/auth.service';
export { BaseService } from './services/base.service';
declare class NRDDataAccess {
    auth: AuthService;
    accounts: AccountsService;
    areas: AreasService;
    categories: CategoriesService;
    clients: ClientsService;
    companyInfo: CompanyInfoService;
    employees: EmployeesService;
    orders: OrdersService;
    processes: ProcessesService;
    products: ProductsService;
    roles: RolesService;
    tasks: TasksService;
    transactions: TransactionsService;
    constructor();
}
export default NRDDataAccess;
//# sourceMappingURL=index.d.ts.map