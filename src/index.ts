import { initializeFirebase } from './config/firebase';
import { AuthService } from './services/auth.service';
import { AccountsService } from './services/accounts.service';
import { AreasService } from './services/areas.service';
import { CategoriesService } from './services/categories.service';
import { ClientsService } from './services/clients.service';
import { CompanyInfoService } from './services/company-info.service';
import { ContractsService } from './services/contracts.service';
import { EmployeesService } from './services/employees.service';
import { OrdersService } from './services/orders.service';
import { ProcessesService } from './services/processes.service';
import { ProductsService } from './services/products.service';
import { RolesService } from './services/roles.service';
import { TasksService } from './services/tasks.service';
import { TransactionsService } from './services/transactions.service';

// Export all models
export * from './models';

// Export services
export { AuthService } from './services/auth.service';
export { BaseService } from './services/base.service';
export { ContractsService } from './services/contracts.service';

// Main library class
class NRDDataAccess {
  public auth: AuthService;
  public accounts: AccountsService;
  public areas: AreasService;
  public categories: CategoriesService;
  public clients: ClientsService;
  public companyInfo: CompanyInfoService;
  public contracts: ContractsService;
  public employees: EmployeesService;
  public orders: OrdersService;
  public processes: ProcessesService;
  public products: ProductsService;
  public roles: RolesService;
  public tasks: TasksService;
  public transactions: TransactionsService;

  constructor() {
    // Initialize Firebase
    initializeFirebase();
    
    // Initialize services
    this.auth = new AuthService();
    this.accounts = new AccountsService();
    this.areas = new AreasService();
    this.categories = new CategoriesService();
    this.clients = new ClientsService();
    this.companyInfo = new CompanyInfoService();
    this.contracts = new ContractsService();
    this.employees = new EmployeesService();
    this.orders = new OrdersService();
    this.processes = new ProcessesService();
    this.products = new ProductsService();
    this.roles = new RolesService();
    this.tasks = new TasksService();
    this.transactions = new TransactionsService();
  }
}

export default NRDDataAccess;

