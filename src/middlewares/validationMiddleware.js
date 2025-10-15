import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

export const errorHandler = (error, req, res, next) => {
  console.error("Error:", error);
  
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Error de validación",
      details: error.errors
    });
  }
  
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      error: "El producto ya existe"
    });
  }
  
  res.status(500).json({
    success: false,
    error: "Error interno del servidor"
  });
};