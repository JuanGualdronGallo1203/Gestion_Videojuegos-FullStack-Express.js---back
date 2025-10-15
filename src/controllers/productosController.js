import { ProductosService } from "../services/productosService.js";

export class ProductosController {
  static async obtenerTodos(req, res) {
    try {
      const result = await ProductosService.obtenerTodos();
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductosService.obtenerPorId(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async crear(req, res) {
    try {
      const productoData = req.body;
      const result = await ProductosService.crear(productoData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const productoData = req.body;
      const result = await ProductosService.actualizar(id, productoData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductosService.eliminar(id);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async buscarPorNombre(req, res) {
    try {
      const { nombre } = req.params;
      const result = await ProductosService.buscarPorNombre(nombre);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async obtenerBajoStock(req, res) {
    try {
      const { limite } = req.query;
      const result = await ProductosService.obtenerBajoStock(parseInt(limite) || 5);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}