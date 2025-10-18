# 🎮 Control de Inventario - Tienda de Videojuegos (Backend)

Este repositorio contiene el backend de la aplicación Full Stack "GameStore Manager", un sistema de gestión de inventario y ventas para una tienda de videojuegos.

El propósito de este proyecto es implementar una API RESTful siguiendo buenas prácticas de desarrollo, incluyendo modularización, uso de variables de entorno, validaciones y persistencia en MongoDB.

---

## 🔗 Repositorio del Frontend
Link al Repositorio del Frontend: https://github.com/JuanGualdronGallo1203/Gestion_Videojuegos-FullStack-Express.js---front

---

## 🚀 Tecnologías Utilizadas
- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
- **Express.js**: Framework web para la creación de la API RESTful.
- **MongoDB (Native Driver)**: Base de datos NoSQL para la persistencia de datos.
- **express-validator**: Middleware para la validación de los datos de entrada en las rutas.
- **dotenv**: Para la gestión de variables de entorno.
- **CORS**: Middleware para habilitar el Acceso de Recursos de Origen Cruzado.

---

## ⚙️ Instalación y Ejecución
Sigue estos pasos para levantar el servidor de backend localmente.

### Prerrequisitos
- Node.js (v18 o superior)
- npm
- MongoDB (local o una instancia en Atlas)
- Git

### Pasos

**Clonar el repositorio**

**Bash**
```bash
git clone https://github.com/JuanGualdronGallo1203/Gestion_Videojuegos-FullStack-Express.js---back.git
cd Gestion_Videojuegos-FullStack-Express.js---back
```

**Instalar dependencias**

**Bash**
```bash
npm install
```

**Configurar variables de entorno** Crea un archivo `.env` en la raíz del proyecto y copia el contenido del siguiente paso.

**Poblar la base de datos (Opcional pero recomendado)** Para llenar la base de datos con datos de prueba, ejecuta:

**Bash**
```bash
npm run seed
```

**Ejecutar el servidor en modo desarrollo** El servidor se reiniciará automáticamente con cada cambio.

**Bash**
```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000` (o el puerto que definas en tu `.env`).

---

## 🔑 Variables de Entorno
El archivo `.env` debe contener las siguientes variables:

**Ini, TOML**
```ini
# Puerto en el que correrá el servidor
PORT=3000

# URI de conexión de tu instancia de MongoDB
MONGODB_URI=mongodb://localhost:27017

# Nombre de la base de datos que usará la aplicación
DB_NAME=tienda_videojuegos

# URL donde se ejecuta el frontend (para la configuración de CORS)
FRONTEND_URL=http://127.0.0.1:5500
```

---

## 📁 Estructura del Proyecto
El backend está organizado de forma modular para separar responsabilidades:

```
src/
├── config/
│   └── db.js         # Configuración y conexión de MongoDB
├── controllers/
│   ├── productosController.js  # Lógica de manejo de (req, res) para Productos
│   └── ventasController.js     # Lógica de manejo de (req, res) para Ventas
├── middlewares/
│   └── validationMiddleware.js # Middlewares para validaciones y manejo de errores
├── routers/
│   ├── productosRouter.js    # Definición de rutas de /api/productos
│   └── ventasRouter.js       # Definición de rutas de /api/ventas
├── services/
│   ├── productosService.js   # Lógica de negocio de Productos
│   └── ventasService.js      # Lógica de negocio de Ventas (descuento de stock, etc.)
├── dataseed.js       # Script para poblar la base de datos
└── server.js         # Punto de entrada, configuración de Express, CORS y middlewares
```

---

## 🔌 Endpoints de la API
La URL base de la API es `http://localhost:3000/api`

### Productos (`/api/productos`)

**GET /api/productos**  
Obtiene todos los productos activos.

**Respuesta (200):**

**JSON**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f1b...e1a",
      "nombre": "Elden Ring",
      "tipo": "juego",
      "precio": 59.99,
      "cantidad": 15,
      /* ... */
    }
  ]
}
```

**GET /api/productos/:id**  
Obtiene un producto por su ID.

**Respuesta (200):**

**JSON**
```json
{
  "success": true,
  "data": {
    "_id": "60f1b...e1a",
    "nombre": "Elden Ring",
    /* ... */
  }
}
```

**POST /api/productos**  
Crea un nuevo producto.

Validaciones: nombre (requerido, min 2), tipo ('juego' o 'consola'), precio (positivo), cantidad (entero positivo).

Body (raw/json):

**JSON**
```json
{
  "nombre": "Nuevo Juego Test",
  "tipo": "juego",
  "precio": 29.99,
  "cantidad": 100,
  "descripcion": "Descripción opcional"
}
```

**Respuesta (201):**

**JSON**
```json
{
  "success": true,
  "data": {
    "nombre": "Nuevo Juego Test",
    /* ... */
    "_id": "60f1c...e1b"
  }
}
```

**PUT /api/productos/:id**  
Actualiza un producto existente por su ID.

Body (raw/json):

**JSON**
```json
{
  "nombre": "Juego Test Actualizado",
  "tipo": "juego",
  "precio": 35.99,
  "cantidad": 90,
  "descripcion": "Descripción actualizada"
}
```

**DELETE /api/productos/:id**  
Elimina un producto (Soft Delete, lo marca como activo: false).

**Respuesta (200):**

**JSON**
```json
{
  "success": true,
  "message": "Producto eliminado correctamente"
}
```

**GET /api/productos/bajo-stock**  
Obtiene productos con bajo inventario (5 o menos).

Query Params (Opcional): `?limite=3` (para definir un límite diferente de 5).

**GET /api/productos/buscar/:nombre**  
Busca productos cuyo nombre coincida parcialmente (case-insensitive) con el término de búsqueda.

---

### Ventas (`/api/ventas`)

**GET /api/ventas**  
Obtiene un listado de todas las ventas realizadas, ordenadas por fecha descendente.

**POST /api/ventas**  
Registra una nueva venta. Esta acción descuenta automáticamente el stock del producto correspondiente.

Validaciones: productoId (requerido), cantidad (entero, min 1).

Validación de Negocio: Falla si la cantidad solicitada es mayor al stock disponible del producto.

Body (raw/json):

**JSON**
```json
{
  "productoId": "60f1b...e1a",
  "cantidad": 2
}
```

**Respuesta (201):**

**JSON**
```json
{
  "success": true,
  "data": {
    "productoId": "60f1b...e1a",
    "nombreProducto": "Elden Ring",
    "cantidad": 2,
    "precioUnitario": 59.99,
    "total": 119.98,
    "fecha": "2025-10-17T...Z",
    "_id": "60f1d...e1c",
    "stockActualizado": 13
  }
}
```

**Respuesta de Error (400 - Stock insuficiente):**

**JSON**
```json
{
  "success": false,
  "error": "Stock insuficiente. Disponible: 15"
}
```

**DELETE /api/ventas/:id**  
Elimina una venta y restaura el stock al producto correspondiente.

**Respuesta (200):**

**JSON**
```json
{
  "success": true,
  "message": "Venta eliminada correctamente y stock restaurado"
}
```

**GET /api/ventas/estadisticas**  
Obtiene un resumen de las ventas (total, promedio) y un ranking de productos más vendidos.

**Respuesta (200):**

**JSON**
```json
{
  "success": true,
  "data": {
    "resumen": {
      "totalVentas": 119.98,
      "totalUnidades": 2,
      "ventaPromedio": 119.98
    },
    "ventasPorProducto": [
      {
        "_id": "Elden Ring",
        "totalVendido": 119.98,
        "unidadesVendidas": 2
      }
    ]
  }
}
```
## Video

Para ver explicación mira el siguiente video:

[**visualizar video explicativo**](https://drive.google.com/file/d/17OfScKoDbThm_O1d3GqU6XPe6YTlyrzR/view?usp=sharing)

## Autor
- Juan Sebastián Gualdron