# Firebase Realtime Database Rules

Este archivo documenta las reglas de seguridad e índices necesarios para Firebase Realtime Database.

## Reglas Actuales

Las reglas están definidas en `firebase-database-rules.json`. Para aplicarlas:

1. Ve a Firebase Console → Realtime Database → Rules
2. Copia el contenido de `firebase-database-rules.json`
3. Pega y publica las reglas

## Índices Requeridos

Firebase Realtime Database requiere índices (`.indexOn`) para optimizar las consultas por campos específicos. Sin estos índices, las consultas pueden fallar o ser muy lentas.

### Colecciones con Índices

#### `shifts`
- `date`: Para consultas por fecha de turno

#### `shiftMovements`
- `shiftId`: Para consultas de movimientos por turno

#### `shiftIncidents`
- `shiftId`: Para consultas de incidentes por turno

#### `salaries` (RRHH)
- `employeeId`: **Requerido** - Para consultas de salarios por empleado (`queryByChild('employeeId', ...)`)
- `year`: **Requerido** - Para consultas de salarios por año (optimización)

#### `licenses` (RRHH)
- `employeeId`: **Requerido** - Para consultas de licencias por empleado (`queryByChild('employeeId', ...)`)
- `year`: **Requerido** - Para consultas de licencias por año (optimización)

#### `vacations` (RRHH)
- `employeeId`: **Requerido** - Para consultas de salario vacacional por empleado (`queryByChild('employeeId', ...)`)
- `year`: **Requerido** - Para consultas de salario vacacional por año (optimización)

#### `aguinaldo` (RRHH)
- `employeeId`: **Requerido** - Para consultas de aguinaldo por empleado (`queryByChild('employeeId', ...)`)
- `year`: **Requerido** - Para consultas de aguinaldo por año (optimización)

#### `employees`
- `name`: Para búsquedas por nombre (opcional, si se implementa búsqueda)

## Errores Comunes

### Error: "Index not defined, add \".indexOn\": \"employeeId\", for path \"/salaries\""

**Causa**: Se está intentando consultar salarios por `employeeId` pero no hay índice definido.

**Solución**: Agregar `".indexOn": ["employeeId", "year"]` a la sección `salaries` en las reglas.

### Error: "Index not defined, add \".indexOn\": \"employeeId\", for path \"/licenses\""

**Causa**: Se está intentando consultar licencias por `employeeId` pero no hay índice definido.

**Solución**: Agregar `".indexOn": ["employeeId", "year"]` a la sección `licenses` en las reglas.

## Notas Importantes

1. **Los índices son necesarios para consultas eficientes**: Sin índices, Firebase puede rechazar consultas o hacerlas muy lentas.

2. **Múltiples índices por colección**: Puedes definir múltiples índices en un array: `".indexOn": ["employeeId", "year"]`

3. **Índices compuestos**: Si consultas por múltiples campos, considera crear índices compuestos.

4. **Actualización de reglas**: Después de actualizar las reglas en Firebase Console, los cambios se aplican inmediatamente.

5. **Validación**: Firebase valida automáticamente las reglas antes de publicarlas. Si hay errores de sintaxis, no se publicarán.

## Reglas Completas

Ver `firebase-database-rules.json` para las reglas completas y actualizadas.
