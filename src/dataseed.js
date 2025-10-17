import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

const productos = [
  // Juegos
  {
    nombre: "The Legend of Zelda: Tears of the Kingdom",
    tipo: "juego",
    precio: 69.99,
    cantidad: 25,
    descripcion: "Secuela de Breath of the Wild. Explora los cielos de Hyrule.",
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    nombre: "Elden Ring",
    tipo: "juego",
    precio: 59.99,
    cantidad: 15,
    descripcion: "Juego de rol de acción de FromSoftware y George R. R. Martin.",
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    nombre: "God of War Ragnarök",
    tipo: "juego",
    precio: 49.99,
    cantidad: 30,
    descripcion: "Kratos y Atreus viajan por los Nueve Reinos.",
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    nombre: "FIFA 25",
    tipo: "juego",
    precio: 64.99,
    cantidad: 50,
    descripcion: "Simulador de fútbol de EA Sports.",
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    nombre: "Cyberpunk 2077",
    tipo: "juego",
    precio: 39.99,
    cantidad: 10,
    descripcion: "RPG de mundo abierto en Night City.",
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  // Consolas
  {
    nombre: "PlayStation 5",
    tipo: "consola",
    precio: 499.99,
    cantidad: 8,
    descripcion: "Consola de última generación de Sony con lector de discos.",
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    nombre: "Xbox Series X",
    tipo: "consola",
    precio: 499.99,
    cantidad: 6,
    descripcion: "La consola más potente de Microsoft.",
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    nombre: "Nintendo Switch (OLED)",
    tipo: "consola",
    precio: 349.99,
    cantidad: 12,
    descripcion: "Modelo con pantalla OLED de 7 pulgadas.",
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  // Producto con poco stock para pruebas
  {
    nombre: "Spider-Man 2",
    tipo: "juego",
    precio: 69.99,
    cantidad: 3,
    descripcion: "Juego exclusivo de PS5.",
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  // Producto sin stock para pruebas
  {
    nombre: "Xbox Series S",
    tipo: "consola",
    precio: 299.99,
    cantidad: 0,
    descripcion: "Consola de última generación de Microsoft (solo digital).",
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  }
];

async function seedDB() {
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB para el seeder.");
    
    const db = client.db(process.env.DB_NAME);
    const productosCollection = db.collection("productos");
    
    // Limpiar la colección antes de insertar
    await productosCollection.deleteMany({});
    console.log("🧹 Colección de productos limpiada.");
    
    // Insertar los datos
    const result = await productosCollection.insertMany(productos);
    console.log(`🌱 Se han insertado ${result.insertedCount} productos.`);

    // Limpiar colección de ventas por si acaso
    await db.collection("ventas").deleteMany({});
    console.log("🧹 Colección de ventas limpiada.");
    
  } catch (error) {
    console.error("❌ Error durante el seeding:", error);
  } finally {
    // Asegurarse de cerrar la conexión
    await client.close();
    console.log("🔌 Conexión cerrada.");
  }
}

seedDB();