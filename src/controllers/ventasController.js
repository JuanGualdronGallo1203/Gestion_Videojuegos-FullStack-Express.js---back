import { VentasService } from "../services/ventasService.js";

export class VentasController {
  static async obtenerTodas(req, res) {
    try {
      const result = await VentasService.obtenerTodas();
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
      const result = await VentasService.obtenerPorId(id);

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
      const ventaData = req.body;
      const result = await VentasService.crear(ventaData);

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
      const ventaData = req.body;
      const result = await VentasService.actualizar(id, ventaData);

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
      const result = await VentasService.eliminar(id);

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

  static async obtenerEstadisticas(req, res) {
    try {
      const result = await VentasService.obtenerEstadisticas();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}