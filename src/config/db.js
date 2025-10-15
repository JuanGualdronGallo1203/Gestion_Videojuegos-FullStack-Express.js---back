import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
let db;

export async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB");
    db = client.db(process.env.DB_NAME);
    
    // Crear índices para mejor performance
    await db.collection("productos").createIndex({ nombre: 1 });
    await db.collection("ventas").createIndex({ fecha: -1 });
    
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB", error);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) throw new Error("La base de datos no está conectada");
  return db;
}