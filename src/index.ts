import { initializeFirebase } from './config/firebase';
import { AuthService } from './services/auth.service';
import { AccountsService } from './services/accounts.service';
import { AreasService } from './services/areas.service';
import { CategoriesService } from './services/categories.service';
import { ClientsService } from './services/clients.service';
import { SuppliersService } from './services/suppliers.service';
import { CompanyInfoService } from './services/company-info.service';
import { ContractsService } from './services/contracts.service';
import { EmployeesService } from './services/employees.service';
import { OrdersService } from './services/orders.service';
import { ProcessesService } from './services/processes.service';
import { ProductsService } from './services/products.service';
import { RolesService } from './services/roles.service';
import { TasksService } from './services/tasks.service';
import { TransactionsService } from './services/transactions.service';
import { LaborRolesService } from './services/labor-roles.service';
import { IndirectCostsService } from './services/indirect-costs.service';
import { RecipesService } from './services/recipes.service';
import { ShiftsService } from './services/shifts.service';
import { ShiftMovementsService } from './services/shift-movements.service';
import { ShiftIncidentsService } from './services/shift-incidents.service';
import { LicensesService } from './services/licenses.service';
import { SalariesService } from './services/salaries.service';
import { VacationsService } from './services/vacations.service';
import { AguinaldoService } from './services/aguinaldo.service';
import { NotificationsService } from './services/notifications.service';
import { FCMTokensService } from './services/fcm-tokens.service';
import { ConfigService } from './services/config.service';
import { CatalogConfigService } from './services/catalog-config.service';
import { PurchaseOrdersService } from './services/purchase-orders.service';
import { MeasurementUnitsService } from './services/measurement-units.service';
import { BudgetsService } from './services/budgets.service';

// Export all models
export * from './models';

// Export services
export { AuthService } from './services/auth.service';
export { BaseService } from './services/base.service';
export { ContractsService } from './services/contracts.service';
export { ProductsService } from './services/products.service';
export type { ProductsGetOptions, ProductExpanded } from './services/products.service';

// Main library class
class NRDDataAccess {
  public auth: AuthService;
  public accounts: AccountsService;
  public areas: AreasService;
  public categories: CategoriesService;
  public clients: ClientsService;
  public suppliers: SuppliersService;
  public companyInfo: CompanyInfoService;
  public contracts: ContractsService;
  public employees: EmployeesService;
  public orders: OrdersService;
  public processes: ProcessesService;
  public products: ProductsService;
  public roles: RolesService;
  public tasks: TasksService;
  public transactions: TransactionsService;
  public laborRoles: LaborRolesService;
  public indirectCosts: IndirectCostsService;
  public recipes: RecipesService;
  public shifts: ShiftsService;
  public shiftMovements: ShiftMovementsService;
  public shiftIncidents: ShiftIncidentsService;
  public licenses: LicensesService;
  public salaries: SalariesService;
  public vacations: VacationsService;
  public aguinaldo: AguinaldoService;
  public notifications: NotificationsService;
  public fcmTokens: FCMTokensService;
  public config: ConfigService;
  public catalogConfig: CatalogConfigService;
  public purchaseOrders: PurchaseOrdersService;
  public measurementUnits: MeasurementUnitsService;
  public budgets: BudgetsService;

  constructor() {
    // Initialize Firebase
    initializeFirebase();
    
    // Initialize services
    this.auth = new AuthService();
    this.accounts = new AccountsService();
    this.areas = new AreasService();
    this.categories = new CategoriesService();
    this.clients = new ClientsService();
    this.suppliers = new SuppliersService();
    this.companyInfo = new CompanyInfoService();
    this.contracts = new ContractsService();
    this.employees = new EmployeesService();
    this.orders = new OrdersService();
    this.processes = new ProcessesService();
    this.products = new ProductsService();
    this.roles = new RolesService();
    this.tasks = new TasksService();
    this.transactions = new TransactionsService();
    this.laborRoles = new LaborRolesService();
    this.indirectCosts = new IndirectCostsService();
    this.recipes = new RecipesService();
    this.shifts = new ShiftsService();
    this.shiftMovements = new ShiftMovementsService();
    this.shiftIncidents = new ShiftIncidentsService();
    this.licenses = new LicensesService();
    this.salaries = new SalariesService();
    this.vacations = new VacationsService();
    this.aguinaldo = new AguinaldoService();
    this.notifications = new NotificationsService();
    this.fcmTokens = new FCMTokensService();
    this.config = new ConfigService();
    this.catalogConfig = new CatalogConfigService();
    this.purchaseOrders = new PurchaseOrdersService();
    this.measurementUnits = new MeasurementUnitsService();
    this.budgets = new BudgetsService();
  }
}

export default NRDDataAccess;

