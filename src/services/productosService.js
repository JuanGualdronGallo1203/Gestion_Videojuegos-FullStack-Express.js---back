import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { validateProducto } from "../dtos/productoDTO.js";

export class ProductosService {
  static async obtenerTodos() {
    try {
      const productos = await getDB()
        .collection("productos")
        .find({ activo: true })
        .sort({ nombre: 1 })
        .toArray();
      
      return { success: true, data: productos };
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  static async obtenerPorId(id) {
    try {
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        return { success: false, error: "ID de producto inválido" };
      }

      const producto = await getDB()
        .collection("productos")
        .findOne({ _id: objectId, activo: true });
      
      if (!producto) {
        return { success: false, error: "Producto no encontrado" };
      }
      
      return { success: true, data: producto };
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  static async crear(productoData) {
    try {
      // Validar datos
      const errors = validateProducto(productoData);
      if (errors.length > 0) {
        return { success: false, errors };
      }

      // Verificar si ya existe un producto con el mismo nombre
      const existe = await getDB()
        .collection("productos")
        .findOne({ 
          nombre: productoData.nombre.trim(),
          activo: true 
        });

      if (existe) {
        return { 
          success: false, 
          error: "Ya existe un producto con este nombre" 
        };
      }

      const producto = {
        ...productoData,
        nombre: productoData.nombre.trim(),
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        activo: true
      };

      const result = await getDB()
        .collection("productos")
        .insertOne(producto);

      return { 
        success: true, 
        data: { ...producto, _id: result.insertedId } 
      };
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  static async actualizar(id, productoData) {
    try {
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        return { success: false, error: "ID de producto inválido" };
      }

      const errors = validateProducto(productoData);
      if (errors.length > 0) {
        return { success: false, errors };
      }

      const producto = await getDB()
        .collection("productos")
        .findOne({ _id: objectId, activo: true });

      if (!producto) {
        return { success: false, error: "Producto no encontrado" };
      }

      const updates = {
        ...productoData,
        nombre: productoData.nombre.trim(),
        fechaActualizacion: new Date()
      };

      const result = await getDB()
        .collection("productos")
        .updateOne(
          { _id: objectId },
          { $set: updates }
        );

      if (result.modifiedCount === 0) {
        return { success: false, error: "No se pudo actualizar el producto" };
      }

      return { success: true, data: { ...producto, ...updates } };
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  static async eliminar(id) {
    try {
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        return { success: false, error: "ID de producto inválido" };
      }

      const producto = await getDB()
        .collection("productos")
        .findOne({ _id: objectId, activo: true });

      if (!producto) {
        return { success: false, error: "Producto no encontrado" };
      }

      // Soft delete
      const result = await getDB()
        .collection("productos")
        .updateOne(
          { _id: objectId },
          { $set: { activo: false, fechaActualizacion: new Date() } }
        );

      if (result.modifiedCount === 0) {
        return { success: false, error: "No se pudo eliminar el producto" };
      }

      return { success: true, message: "Producto eliminado correctamente" };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  static async actualizarStock(id, cantidad) {
    try {
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        return { success: false, error: "ID de producto inválido" };
      }

      const producto = await getDB()
        .collection("productos")
        .findOne({ _id: objectId, activo: true });

      if (!producto) {
        return { success: false, error: "Producto no encontrado" };
      }

      const nuevoStock = producto.cantidad + cantidad;
      
      if (nuevoStock < 0) {
        return { 
          success: false, 
          error: "Stock insuficiente para realizar la operación" 
        };
      }

      const result = await getDB()
        .collection("productos")
        .updateOne(
          { _id: objectId },
          { 
            $set: { 
              cantidad: nuevoStock,
              fechaActualizacion: new Date()
            } 
          }
        );

      if (result.modifiedCount === 0) {
        return { success: false, error: "No se pudo actualizar el stock" };
      }

      return { 
        success: true, 
        data: { ...producto, cantidad: nuevoStock } 
      };
    } catch (error) {
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }
  }

  static async buscarPorNombre(nombre) {
    try {
      const productos = await getDB()
        .collection("productos")
        .find({
          nombre: { $regex: nombre, $options: 'i' },
          activo: true
        })
        .sort({ nombre: 1 })
        .toArray();

      return { success: true, data: productos };
    } catch (error) {
      throw new Error(`Error al buscar productos: ${error.message}`);
    }
  }

  static async obtenerBajoStock(limite = 5) {
    try {
      const productos = await getDB()
        .collection("productos")
        .find({
          cantidad: { $lte: limite },
          activo: true
        })
        .sort({ cantidad: 1 })
        .toArray();

      return { success: true, data: productos };
    } catch (error) {
      throw new Error(`Error al obtener productos con bajo stock: ${error.message}`);
    }
  }
}