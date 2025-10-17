import { Router } from "express";
import { body } from "express-validator";
import { VentasController } from "../controllers/ventasController.js";
import { handleValidationErrors } from "../middlewares/validationMiddleware.js";

const router = Router();

// Validaciones
const validarVenta = [
  body("productoId")
    .notEmpty()
    .withMessage("El ID del producto es requerido"),
  body("cantidad")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero positivo"),
  handleValidationErrors
];

// Rutas
router.get("/", VentasController.obtenerTodas);
router.get("/estadisticas", VentasController.obtenerEstadisticas);
router.get("/:id", VentasController.obtenerPorId);
router.post("/", validarVenta, VentasController.crear);
router.put("/:id", VentasController.actualizar);
router.delete("/:id", VentasController.eliminar);

export default router;