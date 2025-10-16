# 🎮 Control de Inventario - Tienda de Videojuegos

## 📋 Descripción del Proyecto

Sistema de gestión de inventario y ventas para una tienda de videojuegos físicos y consolas. Permite administrar productos, controlar stock y registrar ventas de manera eficiente.

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **express-validator** - Validación de datos
- **CORS** - Manejo de políticas de origen cruzado
- **dotenv** - Variables de entorno

### Frontend
- **HTML5** - Estructura web
- **CSS3** - Estilos y diseño
- **JavaScript** - Lógica del cliente

## 📁 Estructura del Proyecto
``````
backend/
├── controllers/
│ ├── productController.js
│ └── saleController.js
├── models/
│ ├── Product.js
│ └── Sale.js
├── routes/
│ ├── products.js
│ └── sales.js
├── middlewares/
│ └── validation.js
├── config/
│ └── database.js
├── .env
├── server.js
└── package.json
``````

## ⚙️ Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- Git

### Pasos para ejecutar el backend

1. **Clonar el repositorio**
```bash
git clone <https://github.com/JuanGualdronGallo1203/Gestion_Videojuegos-FullStack-Express.js---back>
cd backend

npm install

PORT=3000
MONGODB_URI=mongodb://localhost:27017/tienda_videojuegos
FRONTEND_URL=http://localhost:3001

# Desarrollo
npm run dev

# Producción
npm start
```

## 📊 Modelos de Datos
``````
# Producto
{
  nombre: String,        // Nombre del producto
  tipo: String,          // "juego" o "consola"
  precio: Number,        // Precio unitario
  cantidad: Number       // Stock disponible
}

# Venta
{
  producto: ObjectId,    // Referencia al producto
  cantidad: Number,      // Cantidad vendida
  total: Number,         // Total de la venta
  fecha: Date           // Fecha de la venta
}
``````
## 🔌 Endpoints de la API

``````
Crea un nuevo producto:

curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "The Legend of Zelda",
    "tipo": "juego",
    "precio": 59.99,
    "cantidad": 50
  }'

  Actualiza un producto existente:
  curl -X PUT http://localhost:3000/api/products/12345 \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 49.99,
    "cantidad": 45
  }'
  ``````
## 🛡️ Validaciones
  ``````

Productos =

nombre: Requerido, mínimo 2 caracteres
tipo: Requerido, debe ser "juego" o "consola"
precio: Requerido, número positivo
cantidad: Requerido, número entero no negativo


Ventas =

producto: Requerido, ID válido de MongoDB
cantidad: Requerido, número entero positivo
Validación de stock suficiente
  ``````

## Repositorio Frontend
 - Repositorio front (🔗 https://github.com/JuanGualdronGallo1203/Gestion_Videojuegos-FullStack-Express.js---front)

 - ultimo hash back : 
 