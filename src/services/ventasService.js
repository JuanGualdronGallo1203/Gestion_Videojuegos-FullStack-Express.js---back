import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { ProductosService } from "./productosService.js";

export class VentasService {
  static async obtenerTodas() {
    try {
      const ventas = await getDB()
        .collection("ventas")
        .find()
        .sort({ fecha: -1 })
        .toArray();
      
      return { success: true, data: ventas };
    } catch (error) {
      throw new Error(`Error al obtener ventas: ${error.message}`);
    }
  }

  static async obtenerPorId(id) {
    try {
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        return { success: false, error: "ID de venta inválido" };
      }

      const venta = await getDB()
        .collection("ventas")
        .findOne({ _id: objectId });
      
      if (!venta) {
        return { success: false, error: "Venta no encontrada" };
      }
      
      return { success: true, data: venta };
    } catch (error) {
      throw new Error(`Error al obtener venta: ${error.message}`);
    }
  }

  static async crear(ventaData) {
    try {
      const { productoId, cantidad } = ventaData;

      // Convertir a ObjectId y verificar que el producto existe
      let objectId;
      try {
        objectId = new ObjectId(productoId);
      } catch (error) {
        return { success: false, error: "ID de producto inválido" };
      }

      // Verificar que el producto existe y tiene stock suficiente
      const producto = await getDB()
        .collection("productos")
        .findOne({ _id: objectId, activo: true });

      if (!producto) {
        return { success: false, error: "Producto no encontrado" };
      }
      
      if (producto.cantidad < cantidad) {
        return { 
          success: false, 
          error: `Stock insuficiente. Disponible: ${producto.cantidad}` 
        };
      }

      // Calcular total
      const total = producto.precio * cantidad;

      // Crear la venta
      const venta = {
        productoId: objectId,
        nombreProducto: producto.nombre,
        tipoProducto: producto.tipo,
        cantidad,
        precioUnitario: producto.precio,
        total,
        fecha: new Date()
      };

      // Insertar venta
      const ventaResult = await getDB()
        .collection("ventas")
        .insertOne(venta);

      // Actualizar stock del producto
      const nuevoStock = producto.cantidad - cantidad;
      await getDB()
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

      return {
        success: true,
        data: {
          ...venta,
          _id: ventaResult.insertedId,
          stockActualizado: nuevoStock
        }
      };

    } catch (error) {
      console.error("Error detallado:", error);
      throw new Error(`Error al crear venta: ${error.message}`);
    }
  }

  static async actualizar(id, ventaData) {
    try {
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        return { success: false, error: "ID de venta inválido" };
      }

      // Verificar que la venta existe
      const ventaExistente = await getDB()
        .collection("ventas")
        .findOne({ _id: objectId });

      if (!ventaExistente) {
        return { success: false, error: "Venta no encontrada" };
      }

      // Actualizar venta (solo algunos campos permitidos)
      const updates = {
        ...ventaData,
        fechaActualizacion: new Date()
      };

      const result = await getDB()
        .collection("ventas")
        .updateOne(
          { _id: objectId },
          { $set: updates }
        );

      if (result.modifiedCount === 0) {
        return { success: false, error: "No se pudo actualizar la venta" };
      }

      return { 
        success: true, 
        data: { ...ventaExistente, ...updates } 
      };
    } catch (error) {
      throw new Error(`Error al actualizar venta: ${error.message}`);
    }
  }

  static async eliminar(id) {
    try {
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        return { success: false, error: "ID de venta inválido" };
      }

      // Verificar que la venta existe
      const venta = await getDB()
        .collection("ventas")
        .findOne({ _id: objectId });

      if (!venta) {
        return { success: false, error: "Venta no encontrada" };
      }

      // Devolver el stock al producto
      const producto = await getDB()
        .collection("productos")
        .findOne({ _id: venta.productoId, activo: true });

      if (producto) {
        const nuevoStock = producto.cantidad + venta.cantidad;
        await getDB()
          .collection("productos")
          .updateOne(
            { _id: venta.productoId },
            { 
              $set: { 
                cantidad: nuevoStock,
                fechaActualizacion: new Date()
              } 
            }
          );
      }

      // Eliminar la venta
      const result = await getDB()
        .collection("ventas")
        .deleteOne({ _id: objectId });

      if (result.deletedCount === 0) {
        return { success: false, error: "No se pudo eliminar la venta" };
      }

      return { 
        success: true, 
        message: "Venta eliminada correctamente y stock restaurado" 
      };
    } catch (error) {
      throw new Error(`Error al eliminar venta: ${error.message}`);
    }
  }

  static async obtenerEstadisticas() {
    try {
      const estadisticas = await getDB()
        .collection("ventas")
        .aggregate([
          {
            $group: {
              _id: null,
              totalVentas: { $sum: "$total" },
              totalUnidades: { $sum: "$cantidad" },
              ventaPromedio: { $avg: "$total" }
            }
          }
        ])
        .toArray();

      const ventasPorProducto = await getDB()
        .collection("ventas")
        .aggregate([
          {
            $group: {
              _id: "$nombreProducto",
              totalVendido: { $sum: "$total" },
              unidadesVendidas: { $sum: "$cantidad" }
            }
          },
          { $sort: { totalVendido: -1 } }
        ])
        .toArray();

      return {
        success: true,
        data: {
          resumen: estadisticas[0] || {
            totalVentas: 0,
            totalUnidades: 0,
            ventaPromedio: 0
          },
          ventasPorProducto
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}