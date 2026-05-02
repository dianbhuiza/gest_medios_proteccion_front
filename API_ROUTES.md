# Documentacion de Rutas - Refineria Backend

Esta guia documenta todas las rutas agrupadas por modulo.

Base URL sugerida:
- `/api/v1`

## Convenciones Generales

### Paginacion (rutas de listado)
Query params disponibles:
- `page` (default: `1`)
- `pageSize` (default: `20`, max: `100`)

Estructura de respuesta paginada:
```json
{
  "results": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 3,
    "total": 57
  }
}
```

### Autenticacion
Para rutas protegidas usar:
- O cookie `access_token`

---

## Modulo Auth
Prefijo: `/auth`

### 1) Sign In
- Ruta: `POST /api/v1/auth/signin`
- Operacion: Iniciar sesion (actualmente siempre responde exitoso con datos ficticios)
- Body:
```json
{
  "credencial": "usuario_o_correo",
  "password": "string_min_6"
}
```
- Respuesta `200`:
```json
{
  "token_type": "bearer",
  "usuario_id": 1,
  "credencial": "usuario_o_correo"
}
```
- Extra: tambien retorna cookies `access_token` y `refresh_token`

### 2) Refresh Token
- Ruta: `POST /api/v1/auth/refresh`
- Operacion: Renovar access token usando refresh token
- Body: No requerido

```
- Respuesta `200`:
```json
{
  "token_type": "bearer",
  "usuario_id": 1,
  "credencial": "usuario_o_correo"
}

Devuelve cookies
```

### 3) Validate Token
- Ruta: `GET /api/v1/auth/validate`
- Operacion: Validar token actual
- Body: No requerido
- Respuesta `200`:
```json
{
  "valido": true,
  "usuario_id": 1,
  "credencial": "usuario_o_correo"
}
```

---

## Modulo Area
Prefijo: `/areas`

### 1) Crear area
- Ruta: `POST /api/v1/areas`
- Operacion: Crear
- Body:
```json
{
  "nombre": "Produccion"
}
```
- Respuesta `201`:
```json
{
  "id": 1,
  "nombre": "Produccion",
  "sub_areas": []
}
```

### 2) Listar areas
- Ruta: `GET /api/v1/areas?page=1&pageSize=20`
- Operacion: Listado paginado
- Body: No requerido
- Respuesta `200`:
```json
{
  "results": [
    {
      "id": 1,
      "nombre": "Produccion",
      "sub_areas": [
        {
          "id": 1,
          "nombre": "Refinacion",
          "area_id": 1
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "total": 1
  }
}
```

### 3) Obtener area por id
- Ruta: `GET /api/v1/areas/{area_id}`
- Operacion: Obtener detalle
- Body: No requerido
- Respuesta `200`:
```json
{
  "id": 1,
  "nombre": "Produccion",
  "sub_areas": [
    {
      "id": 1,
      "nombre": "Refinacion",
      "area_id": 1
    }
  ]
}
```

### 4) Actualizar area
- Ruta: `PUT /api/v1/areas/{area_id}`
- Operacion: Actualizar
- Body:
```json
{
  "nombre": "Produccion Turno A"
}
```
- Respuesta `200`:
```json
{
  "id": 1,
  "nombre": "Produccion Turno A",
  "sub_areas": [
    {
      "id": 1,
      "nombre": "Refinacion",
      "area_id": 1
    }
  ]
}
```

### 5) Eliminar area
- Ruta: `DELETE /api/v1/areas/{area_id}`
- Operacion: Eliminar
- Body: No requerido
- Respuesta `204`: sin contenido

### 6) Crear sub area
- Ruta: `POST /api/v1/areas/{area_id}/subareas`
- Operacion: Crear sub area para un area
- Body:
```json
{
  "nombre": "Refinacion"
}
```
- Respuesta `201`:
```json
{
  "id": 1,
  "nombre": "Refinacion",
  "area_id": 1
}
```

### 7) Listar sub areas de un area
- Ruta: `GET /api/v1/areas/{area_id}/subareas?page=1&pageSize=20`
- Operacion: Listado paginado de sub areas por area
- Body: No requerido
- Respuesta `200`: formato paginado de `SubAreaResponse`

### 8) Obtener sub area por id
- Ruta: `GET /api/v1/areas/{area_id}/subareas/{subarea_id}`
- Operacion: Obtener detalle de sub area
- Body: No requerido
- Respuesta `200`: estructura `SubAreaResponse`

### 9) Actualizar sub area
- Ruta: `PUT /api/v1/areas/{area_id}/subareas/{subarea_id}`
- Operacion: Actualizar sub area
- Body:
```json
{
  "nombre": "Refinacion Turno A"
}
```
- Respuesta `200`: estructura `SubAreaResponse`

### 10) Eliminar sub area
- Ruta: `DELETE /api/v1/areas/{area_id}/subareas/{subarea_id}`
- Operacion: Eliminar sub area
- Body: No requerido
- Respuesta `204`: sin contenido

---

## Modulo Cargo
Prefijo: `/cargos`

### 1) Crear cargo
- Ruta: `POST /api/v1/cargos`
- Operacion: Crear
- Body:
```json
{
  "nombre": "Operador"
}
```
- Respuesta `201`:
```json
{
  "id": 1,
  "nombre": "Operador"
}
```

### 2) Listar cargos
- Ruta: `GET /api/v1/cargos?page=1&pageSize=20`
- Operacion: Listado paginado
- Body: No requerido
- Respuesta `200`: formato paginado de `CargoResponse`

### 3) Obtener cargo por id
- Ruta: `GET /api/v1/cargos/{cargo_id}`
- Operacion: Obtener detalle
- Body: No requerido
- Respuesta `200`:
```json
{
  "id": 1,
  "nombre": "Operador"
}
```

### 4) Actualizar cargo
- Ruta: `PUT /api/v1/cargos/{cargo_id}`
- Operacion: Actualizar
- Body:
```json
{
  "nombre": "Supervisor"
}
```
- Respuesta `200`:
```json
{
  "id": 1,
  "nombre": "Supervisor"
}
```

### 5) Eliminar cargo
- Ruta: `DELETE /api/v1/cargos/{cargo_id}`
- Operacion: Eliminar
- Body: No requerido
- Respuesta `204`: sin contenido

---

## Modulo Talla
Prefijo: `/tallas`

### 1) Crear talla
- Ruta: `POST /api/v1/tallas`
- Operacion: Crear
- Body:
```json
{
  "valor": "M",
  "tipo": "overol",
  "orden": 2
}
```
- Respuesta `201`:
```json
{
  "id": 1,
  "valor": "M",
  "tipo": "overol",
  "orden": 2
}
```

### 2) Listar tallas
- Ruta: `GET /api/v1/tallas?page=1&pageSize=20`
- Operacion: Listado paginado
- Body: No requerido
- Respuesta `200`: formato paginado de `TallaResponse`

### 3) Obtener talla por id
- Ruta: `GET /api/v1/tallas/{talla_id}`
- Operacion: Obtener detalle
- Body: No requerido
- Respuesta `200`:
```json
{
  "id": 1,
  "valor": "M",
  "tipo": "overol",
  "orden": 2
}
```

### 4) Actualizar talla
- Ruta: `PUT /api/v1/tallas/{talla_id}`
- Operacion: Actualizar
- Body (todos opcionales):
```json
{
  "valor": "L",
  "tipo": "overol",
  "orden": 3
}
```
- Respuesta `200`:
```json
{
  "id": 1,
  "valor": "L",
  "tipo": "overol",
  "orden": 3
}
```

### 5) Eliminar talla
- Ruta: `DELETE /api/v1/tallas/{talla_id}`
- Operacion: Eliminar
- Body: No requerido
- Respuesta `204`: sin contenido

---

## Modulo Trabajador
Prefijo: `/trabajadores`

### 1) Crear trabajador
- Ruta: `POST /api/v1/trabajadores`
- Operacion: Crear
- Body:
```json
{
  "nombre": "Juan Perez",
  "sub_area_id": 1,
  "cargo_id": 1,
  "talla_overol_id": 2,
  "talla_botas_id": 5
}
```
- Respuesta `201`:
```json
{
  "id": 1,
  "nombre": "Juan Perez",
  "sub_area_id": 1,
  "cargo_id": 1,
  "talla_overol_id": 2,
  "talla_botas_id": 5
}
```

### 2) Listar trabajadores
- Ruta: `GET /api/v1/trabajadores?page=1&pageSize=20`
- Operacion: Listado paginado
- Body: No requerido
- Respuesta `200`: formato paginado de `TrabajadorResponse`

### 3) Obtener trabajador por id
- Ruta: `GET /api/v1/trabajadores/{trabajador_id}`
- Operacion: Obtener detalle
- Body: No requerido
- Respuesta `200`: estructura `TrabajadorResponse`

### 4) Actualizar trabajador
- Ruta: `PUT /api/v1/trabajadores/{trabajador_id}`
- Operacion: Actualizar
- Body (campos opcionales):
```json
{
  "nombre": "Juan P.",
  "sub_area_id": 2,
  "cargo_id": 3,
  "talla_overol_id": 3,
  "talla_botas_id": 6
}
```
- Respuesta `200`: estructura `TrabajadorResponse`

### 5) Eliminar trabajador
- Ruta: `DELETE /api/v1/trabajadores/{trabajador_id}`
- Operacion: Eliminar
- Body: No requerido
- Respuesta `204`: sin contenido

---

## Modulo MPP
Prefijo: `/mpps`

### 1) Crear MPP
- Ruta: `POST /api/v1/mpps`
- Operacion: Crear
- Body:
```json
{
  "nombre": "Casco",
  "tipo_talla": "overol"
}
```
- Respuesta `201`:
```json
{
  "id": 1,
  "nombre": "Casco",
  "tipo_talla": "overol"
}
```

### 2) Listar MPP
- Ruta: `GET /api/v1/mpps?page=1&pageSize=20`
- Operacion: Listado paginado
- Body: No requerido
- Respuesta `200`: formato paginado de `MppResponse`

### 3) Obtener MPP por id
- Ruta: `GET /api/v1/mpps/{mpp_id}`
- Operacion: Obtener detalle
- Body: No requerido
- Respuesta `200`: estructura `MppResponse`

### 4) Actualizar MPP
- Ruta: `PUT /api/v1/mpps/{mpp_id}`
- Operacion: Actualizar
- Body (campos opcionales):
```json
{
  "nombre": "Casco Industrial",
  "tipo_talla": "overol"
}
```
- Respuesta `200`: estructura `MppResponse`

### 5) Eliminar MPP
- Ruta: `DELETE /api/v1/mpps/{mpp_id}`
- Operacion: Eliminar
- Body: No requerido
- Respuesta `204`: sin contenido

### 6) Listar stock de un MPP
- Ruta: `GET /api/v1/mpps/{mpp_id}/stocks?page=1&pageSize=20`
- Operacion: Listado paginado de stock por talla
- Body: No requerido
- Respuesta `200`:
```json
{
  "results": [
    {
      "mpp_id": 1,
      "talla_id": 2,
      "cantidad": 10
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "total": 1
  }
}
```

### 7) Definir stock puntual por talla
- Ruta: `PUT /api/v1/mpps/{mpp_id}/stocks/{talla_id}`
- Operacion: Setear cantidad exacta
- Body:
```json
{
  "talla_id": 2,
  "cantidad": 30
}
```
- Respuesta `200`:
```json
{
  "mpp_id": 1,
  "talla_id": 2,
  "cantidad": 30
}
```

### 8) Eliminar stock por talla
- Ruta: `DELETE /api/v1/mpps/{mpp_id}/stocks/{talla_id}`
- Operacion: Eliminar registro de stock
- Body: No requerido
- Respuesta `204`: sin contenido

### 9) Ingreso de stock multiple
- Ruta: `POST /api/v1/mpps/{mpp_id}/ingresos-stock?page=1&pageSize=20`
- Operacion: Sumar cantidades por talla
- Body:
```json
{
  "stocks": [
    {
      "talla_id": 2,
      "cantidad": 5
    },
    {
      "talla_id": null,
      "cantidad": 8
    }
  ]
}
```
- Nota: para MPP `sin_talla`, `talla_id` puede omitirse o enviarse en `null`.
- Respuesta `200`: formato paginado de `MppStockResponse`

### 10) Retiro de stock multiple
- Ruta: `POST /api/v1/mpps/{mpp_id}/retiros-stock?page=1&pageSize=20`
- Operacion: Restar cantidades por talla
- Body:
```json
{
  "stocks": [
    {
      "talla_id": 2,
      "cantidad": 2
    },
    {
      "talla_id": null,
      "cantidad": 1
    }
  ]
}
```
- Nota: para MPP `sin_talla`, `talla_id` puede omitirse o enviarse en `null`.
- Respuesta `200`: formato paginado de `MppStockResponse`

---

## Modulo Aseo
Prefijo: `/aseos`

### 1) Crear aseo
- Ruta: `POST /api/v1/aseos`
- Operacion: Crear
- Body:
```json
{
  "nombre": "Jabon industrial",
  "cantidad": 50
}
```
- Respuesta `201`:
```json
{
  "id": 1,
  "nombre": "Jabon industrial",
  "cantidad": 50
}
```

### 2) Listar aseos
- Ruta: `GET /api/v1/aseos?page=1&pageSize=20`
- Operacion: Listado paginado
- Body: No requerido
- Respuesta `200`: formato paginado de `AseoResponse`

### 3) Obtener aseo por id
- Ruta: `GET /api/v1/aseos/{aseo_id}`
- Operacion: Obtener detalle
- Body: No requerido
- Respuesta `200`: estructura `AseoResponse`

### 4) Actualizar aseo
- Ruta: `PUT /api/v1/aseos/{aseo_id}`
- Operacion: Actualizar
- Body (campos opcionales):
```json
{
  "nombre": "Jabon",
  "cantidad": 60
}
```
- Respuesta `200`: estructura `AseoResponse`

### 5) Eliminar aseo
- Ruta: `DELETE /api/v1/aseos/{aseo_id}`
- Operacion: Eliminar
- Body: No requerido
- Respuesta `204`: sin contenido

### 6) Ingreso de cantidad
- Ruta: `POST /api/v1/aseos/{aseo_id}/ingresos-cantidad`
- Operacion: Sumar cantidad
- Body:
```json
{
  "cantidad": 10
}
```
- Respuesta `200`: estructura `AseoResponse`

### 7) Retiro de cantidad
- Ruta: `POST /api/v1/aseos/{aseo_id}/retiros-cantidad`
- Operacion: Restar cantidad
- Body:
```json
{
  "cantidad": 5
}
```
- Respuesta `200`: estructura `AseoResponse`

---

## Modulo Retiros (centralizado)
Prefijo: `/retiros`

### 1) Procesar retiros mixtos
- Ruta: `POST /api/v1/retiros`
- Operacion: Retirar en lote de aseos y/o mpps
- Body:
```json
{
  "aseos": [
    {
      "aseo_id": 1,
      "cantidad": 2
    }
  ],
  "mpps": [
    {
      "mpp_id": 1,
      "talla_id": null,
      "cantidad": 1
    }
  ]
}
```
- Respuesta `200`:
```json
{
  "aseos_retirados": 1,
  "mpps_retirados": 1,
  "mensaje": "Se retiraron 1 aseos y 1 mpps correctamente"
}
```

---

## Modulo Asignacion MPP
Prefijo: `/asignaciones-mpp`

### 1) Crear asignacion MPP
- Ruta: `POST /api/v1/asignaciones-mpp`
- Operacion: Crear asignacion (retira stock automaticamente)
- Body:
```json
{
  "trabajador_id": 1,
  "items": [
    {
      "mpp_id": 1,
      "talla_id": null
    }
  ]
}
```
- Respuesta `201`:
```json
{
  "id": 1,
  "id_trabajador": 1,
  "items": [
    {
      "id_mpp": 1,
      "nombre_mpp": "Botas",
      "talla": "XL",
      "cantidad": 1
    }
  ]
}
```

### 2) Listar asignaciones MPP
- Ruta: `GET /api/v1/asignaciones-mpp?page=1&pageSize=20&area_id=1&fecha=2026-05-02`
- Operacion: Listado paginado
- Query params opcionales:
  - `area_id`: filtra por area del trabajador
  - `fecha`: filtra por fecha exacta (formato `YYYY-MM-DD`)
- Body: No requerido
- Respuesta `200`: formato paginado de `AsignacionMppResponse`

### 3) Obtener asignacion MPP por id
- Ruta: `GET /api/v1/asignaciones-mpp/{asignacion_id}`
- Operacion: Obtener detalle
- Body: No requerido
- Respuesta `200`: estructura `AsignacionMppResponse`

### 4) Actualizar asignacion MPP
- Ruta: `PUT /api/v1/asignaciones-mpp/{asignacion_id}`
- Operacion: Actualizar
- Body (campos opcionales):
```json
{
  "trabajador_id": 2
}
```
- Respuesta `200`: estructura `AsignacionMppResponse`

### 5) Eliminar asignacion MPP
- Ruta: `DELETE /api/v1/asignaciones-mpp/{asignacion_id}`
- Operacion: Eliminar
- Body: No requerido
- Respuesta `204`: sin contenido

---

## Modulo Asignacion Aseo
Prefijo: `/asignaciones-aseo`

### 1) Crear asignacion aseo
- Ruta: `POST /api/v1/asignaciones-aseo`
- Operacion: Crear asignacion (retira stock automaticamente)
- Body:
```json
{
  "sub_area_id": 1,
  "items": [
    {
      "aseo_id": 1,
      "cantidad": 3
    }
  ]
}
```
- Respuesta `201`:
```json
{
  "id": 1,
  "id_sub_area": 1,
  "items": [
    {
      "id_aseo": 1,
      "nombre_aseo": "Jabon industrial",
      "cantidad": 3
    }
  ]
}
```

### 2) Listar asignaciones aseo
- Ruta: `GET /api/v1/asignaciones-aseo?page=1&pageSize=20&area_id=1&fecha=2026-05-02`
- Operacion: Listado paginado
- Query params opcionales:
  - `area_id`: filtra por area de la sub area asignada
  - `fecha`: filtra por fecha exacta (formato `YYYY-MM-DD`)
- Body: No requerido
- Respuesta `200`: formato paginado de `AsignacionAseoResponse`

### 3) Obtener asignacion aseo por id
- Ruta: `GET /api/v1/asignaciones-aseo/{asignacion_id}`
- Operacion: Obtener detalle
- Body: No requerido
- Respuesta `200`: estructura `AsignacionAseoResponse`

### 4) Actualizar asignacion aseo
- Ruta: `PUT /api/v1/asignaciones-aseo/{asignacion_id}`
- Operacion: Actualizar
- Body (campos opcionales):
```json
{
  "sub_area_id": 2
}
```
- Respuesta `200`: estructura `AsignacionAseoResponse`

### 5) Eliminar asignacion aseo
- Ruta: `DELETE /api/v1/asignaciones-aseo/{asignacion_id}`
- Operacion: Eliminar
- Body: No requerido
- Respuesta `204`: sin contenido

---

## Resumen Rapido de Metodos por Modulo

- Auth: `POST /signin`, `POST /refresh`, `GET /validate`
- Area: CRUD completo + CRUD de sub areas
- Cargo: CRUD completo + listado paginado
- Talla: CRUD completo + listado paginado
- Trabajador: CRUD completo + listado paginado (relacionado a sub_area_id)
- MPP: CRUD, gestion de stock, ingresos/retiros, listados paginados (soporta MPP sin talla)
- Aseo: CRUD, ingresos/retiros, listado paginado
- Retiros: retiro centralizado en lote
- Asignacion MPP: CRUD + listado paginado + filtros por area_id y fecha
- Asignacion Aseo: CRUD + listado paginado + filtros por area_id y fecha
