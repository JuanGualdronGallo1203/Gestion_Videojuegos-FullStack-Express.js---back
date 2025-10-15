import { Router } from "express";
import { body } from "express-validator";
import { ProductosController } from "../controllers/productosController.js";
import { handleValidationErrors } from "../middlewares/validationMiddleware.js";

const router = Router();

// Validaciones
const validarProducto = [
  body("nombre")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("tipo")
    .isIn(["juego", "consola"])
    .withMessage("El tipo debe ser 'juego' o 'consola'"),
  body("precio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número positivo"),
  body("cantidad")
    .isInt({ min: 0 })
    .withMessage("La cantidad debe ser un número entero positivo"),
  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres"),
  handleValidationErrors
];

// Rutas CRUD completas
router.get("/", ProductosController.obtenerTodos);
router.get("/bajo-stock", ProductosController.obtenerBajoStock);
router.get("/buscar/:nombre", ProductosController.buscarPorNombre);
router.get("/:id", ProductosController.obtenerPorId);
router.post("/", validarProducto, ProductosController.crear);
router.put("/:id", validarProducto, ProductosController.actualizar);
router.delete("/:id", ProductosController.eliminar);

export default router;