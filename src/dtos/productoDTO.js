export const productoDTO = {
  nombre: {
    type: String,
    required: [true, "El nombre es requerido"],
    trim: true,
    minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    maxlength: [100, "El nombre no puede exceder 100 caracteres"]
  },
  tipo: {
    type: String,
    required: [true, "El tipo es requerido"],
    enum: {
      values: ["juego", "consola"],
      message: "El tipo debe ser 'juego' o 'consola'"
    }
  },
  precio: {
    type: Number,
    required: [true, "El precio es requerido"],
    min: [0, "El precio no puede ser negativo"]
  },
  cantidad: {
    type: Number,
    required: [true, "La cantidad es requerida"],
    min: [0, "La cantidad no puede ser negativa"],
    integer: true
  },
  descripcion: {
    type: String,
    maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    default: ""
  },
  activo: {
    type: Boolean,
    default: true
  }
};

export const validateProducto = (producto) => {
  const errors = [];
  
  if (!producto.nombre || producto.nombre.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }
  
  if (!producto.tipo || !["juego", "consola"].includes(producto.tipo)) {
    errors.push("El tipo debe ser 'juego' o 'consola'");
  }
  
  if (typeof producto.precio !== "number" || producto.precio < 0) {
    errors.push("El precio debe ser un número positivo");
  }
  
  if (!Number.isInteger(producto.cantidad) || producto.cantidad < 0) {
    errors.push("La cantidad debe ser un número entero positivo");
  }
  
  return errors;
};