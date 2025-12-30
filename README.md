# NRD Data Access

Librería de acceso a datos para Firebase Realtime Database y Authentication. Esta librería proporciona una capa de abstracción para acceder a los datos de Firebase desde aplicaciones JavaScript nativas.

## Instalación

### Desde GitHub Pages

Incluye la librería en tu HTML:

```html
<script src="https://yosbany.github.io/nrd-data-access/dist/nrd-data-access.js"></script>
```

### Desarrollo Local

1. Clona el repositorio:
```bash
git clone https://github.com/yosbany/nrd-data-access.git
cd nrd-data-access
```

2. Instala las dependencias:
```bash
npm install
```

3. Construye la librería:
```bash
npm run build
```

El archivo compilado estará en `dist/nrd-data-access.js`.

## Uso

### Inicialización

```javascript
// La librería se inicializa automáticamente al instanciarla
const nrd = new NRDDataAccess();
```

### Autenticación

```javascript
// Iniciar sesión
await nrd.auth.signIn('user@example.com', 'password');

// Registrar nuevo usuario
await nrd.auth.signUp('user@example.com', 'password');

// Cerrar sesión
await nrd.auth.signOut();

// Obtener usuario actual
const user = nrd.auth.getCurrentUser();

// Escuchar cambios de autenticación
const unsubscribe = nrd.auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('Usuario autenticado:', user.email);
  } else {
    console.log('Usuario no autenticado');
  }
});
```

### Operaciones CRUD

Todos los servicios siguen el mismo patrón. Ejemplos con `clients`:

```javascript
// Obtener todos los clientes
const clients = await nrd.clients.getAll();

// Obtener un cliente por ID
const client = await nrd.clients.getById('client-id');

// Crear un nuevo cliente
const clientId = await nrd.clients.create({
  name: 'Juan Pérez',
  phone: '+1234567890',
  address: 'Calle Ejemplo 123'
});

// Actualizar un cliente
await nrd.clients.update('client-id', {
  phone: '+0987654321'
});

// Eliminar un cliente
await nrd.clients.delete('client-id');

// Consultar por campo
const clientsByName = await nrd.clients.queryByChild('name', 'Juan Pérez');

// CompanyInfo tiene métodos especiales (es un objeto único, no una colección)
const companyInfo = await nrd.companyInfo.get();
await nrd.companyInfo.update({ phone: '+1234567890' });
await nrd.companyInfo.set({ tradeName: 'Mi Empresa', address: 'Calle 123' });

// Escuchar cambios en tiempo real
const unsubscribe = nrd.clients.onValue((clients) => {
  console.log('Clientes actualizados:', clients);
});

// Escuchar cambios de un cliente específico
const unsubscribe = nrd.clients.onValueById('client-id', (client) => {
  console.log('Cliente actualizado:', client);
});
```

## Servicios Disponibles

La librería proporciona los siguientes servicios:

- `nrd.auth` - Autenticación (AuthService)
- `nrd.accounts` - Cuentas (AccountsService)
- `nrd.areas` - Áreas (AreasService)
- `nrd.categories` - Categorías (CategoriesService)
- `nrd.clients` - Clientes (ClientsService)
- `nrd.companyInfo` - Información de la empresa (CompanyInfoService)
- `nrd.contracts` - Contratos y Habilitaciones (ContractsService)
- `nrd.employees` - Empleados (EmployeesService)
- `nrd.orders` - Órdenes (OrdersService)
- `nrd.processes` - Procesos (ProcessesService)
- `nrd.products` - Productos (ProductsService)
- `nrd.roles` - Roles (RolesService)
- `nrd.tasks` - Tareas (TasksService)
- `nrd.transactions` - Transacciones (TransactionsService)

## Modelos de Datos

Todos los modelos extienden `BaseEntity` que incluye:
- `id?: string` - ID del registro (agregado automáticamente por la librería)

**Nota especial sobre CompanyInfo**: `companyInfo` es un objeto único (no una colección), por lo que usa métodos especiales:
- `get()` - Obtiene la información de la empresa
- `set(data)` - Establece/reemplaza toda la información
- `update(updates)` - Actualiza parcialmente la información

Consulta los tipos TypeScript en `src/models/index.ts` para ver la estructura completa de cada modelo. Los modelos están definidos según la estructura real de los datos en Firebase Realtime Database.

## Scripts Disponibles

- `npm run build` - Construye la librería en modo producción
- `npm run dev` - Construye la librería en modo desarrollo con watch
- `npm run type-check` - Verifica los tipos TypeScript sin compilar

## Estructura del Proyecto

```
nrd-data-access/
├── src/
│   ├── config/
│   │   └── firebase.ts          # Configuración de Firebase
│   ├── models/
│   │   └── index.ts             # Modelos TypeScript
│   ├── services/
│   │   ├── auth.service.ts      # Servicio de autenticación
│   │   ├── base.service.ts      # Servicio base con operaciones CRUD
│   │   └── *.service.ts         # Servicios específicos por entidad
│   └── index.ts                 # Punto de entrada principal
├── dist/
│   └── nrd-data-access.js       # Archivo compilado (generado)
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## Licencia

MIT

