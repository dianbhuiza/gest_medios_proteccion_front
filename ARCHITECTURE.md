# Arquitectura de Aplicacion Vue Moderna

## Objetivo
Definir una arquitectura escalable, mantenible y tipada para una aplicacion Vue 3 usando:

- Vue 3 + Vite + TypeScript
- Vuetify (UI)
- Pinia (estado global de cliente)
- TanStack Vue Query (estado de servidor)
- Axios (cliente HTTP)
- vee-validate + Zod (formularios y validacion)

## Principios de Arquitectura

1. Separacion clara entre estado de cliente y estado de servidor.
2. Logica de dominio fuera de los componentes visuales.
3. Tipado estricto de entrada/salida en APIs y formularios.
4. Flujo de errores unificado (UI + red + validacion).
5. Estructura por modulos de negocio para facilitar crecimiento.

## Capas

### 1) Presentacion
Incluye componentes de UI, layouts y vistas.

Responsabilidades:
- Renderizar interfaz con Vuetify.
- Gestionar interacciones del usuario.
- Mostrar estados de carga, exito y error.

No debe:
- Llamar Axios directamente.
- Contener reglas de negocio complejas.

### 2) Aplicacion
Incluye composables, hooks y orquestacion de casos de uso.

Responsabilidades:
- Coordinar queries/mutations.
- Transformar datos para la vista.
- Integrar formularios con validacion.

### 3) Datos
Incluye cliente HTTP, servicios API y mapeo de DTOs.

Responsabilidades:
- Definir endpoints y contratos de red.
- Manejar interceptores (auth, refresh token, logging, errores).
- Centralizar configuracion de Axios.

### 4) Estado
Separado en dos tipos:

- Estado de servidor: TanStack Vue Query.
- Estado de cliente: Pinia.

Regla clave:
No duplicar en Pinia datos que ya viven en Vue Query, salvo necesidades muy concretas de UX.

## Estructura de Carpetas Recomendada

```text
src/
  app/
    providers/
      vuetify.ts
      query-client.ts
    router/
      index.ts
  core/
    http/
      axios.ts
      interceptors.ts
    config/
      env.ts
    types/
      api.ts
  modules/
    auth/
      api/
        auth.service.ts
      queries/
        useAuthQuery.ts
      mutations/
        useLoginMutation.ts
      store/
        auth.store.ts
      schemas/
        login.schema.ts
      components/
        LoginForm.vue
      views/
        LoginView.vue
    users/
      api/
      queries/
      mutations/
      schemas/
      components/
      views/
  shared/
    components/
    composables/
    utils/
    constants/
```

## Rol de Cada Tecnologia

### Vuetify
- Sistema de componentes visuales y layout.
- Theming centralizado (paleta, tipografia, spacing, dark/light).
- Componentes base de formulario conectados con vee-validate.

### Pinia
Para estado global de cliente, por ejemplo:
- Sesion local de UI (drawer abierto, tema, preferencias).
- Flags de experiencia de usuario.
- Estado efimero que no viene del backend.

### TanStack Vue Query
Para estado remoto:
- Carga y cache de listas/detalles.
- Invalidacion por eventos de mutation.
- Retries, staleTime, gcTime y manejo de refetch.

### Axios
- Instancia unica por app.
- Interceptores de request/response.
- Manejo centralizado de tokens y errores HTTP.

### vee-validate + Zod
- Esquemas de validacion declarativos.
- Validacion en cliente previa al submit.
- Tipos inferidos a partir del schema.

## Flujo de Datos Recomendado

1. El usuario interactua con una vista.
2. La vista usa un composable o hook de modulo.
3. El hook llama una query o mutation de Vue Query.
4. Vue Query ejecuta funciones de servicio (Axios).
5. El resultado se cachea y reactiva la UI.
6. En formularios, vee-validate valida con Zod antes de mutar.
7. Tras mutation exitosa, se invalidan queries relacionadas.

## Convenciones Importantes

1. Keys de Query
- Definir keys por modulo y centralizarlas.
- Ejemplo: usersKeys.list(filters), usersKeys.detail(id).

2. Manejo de Errores
- Normalizar errores HTTP en una estructura comun.
- Mostrar mensajes de negocio en componentes.
- Registrar errores tecnicos en capa de datos.

3. Tipado
- Tipar respuestas API, payloads y formularios.
- Evitar any en servicios y stores.

4. Testing
- Unit test para servicios, mapeadores y schemas.
- Test de componentes criticos de formulario.
- Test de flujos de mutation e invalidacion.

## Configuracion Base Sugerida

### Query Client
- staleTime por defecto para evitar refetch excesivo.
- retry habilitado para errores transitorios.
- global onError para telemetria y fallback UX.

### Axios
- baseURL por entorno.
- timeout por defecto.
- interceptor para Authorization.
- interceptor de respuesta para refresh token y 401.

### Formularios
- Un schema Zod por formulario en modules/<modulo>/schemas.
- Reutilizar tipos inferidos del schema.

## Antipatrones a Evitar

1. Llamadas Axios en componentes Vue.
2. Duplicar datos remotos en Pinia sin justificacion.
3. Logica de negocio en componentes de presentacion.
4. Validaciones inline repetidas en cada formulario.
5. Query keys hardcodeadas en multiples archivos.

## Checklist de Implementacion

1. Crear providers globales de Vuetify, Pinia y Vue Query en el arranque.
2. Crear instancia Axios con interceptores.
3. Definir convencion de query keys por modulo.
4. Implementar primer modulo vertical completo (api, query, schema, vista).
5. Estandarizar manejo de errores y estados de carga.

## Resultado Esperado

Con esta arquitectura, el proyecto gana:

- Escalabilidad por modulos.
- Menor acoplamiento entre UI y datos.
- Mejor mantenibilidad en equipos.
- Integracion consistente entre formularios, validacion y API.
