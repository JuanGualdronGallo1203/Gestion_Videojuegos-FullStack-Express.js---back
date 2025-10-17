import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productosRouter from "./routers/productosRouter.js";
import ventasRouter from "./routers/ventasRouter.js";
import { errorHandler } from "./middlewares/validationMiddleware.js"; 

dotenv.config();

const app = express();

// Middlewares
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/productos", productosRouter);
app.use("/api/ventas", ventasRouter);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API de Gestión de Videojuegos funcionando!" });
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Execution
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
  });
});