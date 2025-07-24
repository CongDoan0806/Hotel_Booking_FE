const dealService = require("../services/deal.service");

const dealController = {
  getAllActiveDeals: async (req, res) => {
    try {
      const deals = await dealService.getActiveDeals();
      res.json({ status: "success", data: deals });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  getAllDeals: async (req, res) => {
    try {
      const deals = await dealService.getAllDeals();
      res.json({ status: "success", data: deals });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  getDealByRoomTypeController: async (req, res) => {
    try {
      const roomType = req.params.id;
      const deals = await dealService.getDealByRoomType(roomType);
      res.json({ status: "success", data: deals });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  createDeal: async (req, res) => {
      try {
          const newDeal = await dealService.createDeal(req.body);
          res.status(201).json({ status: "success", data: newDeal });
      } catch (err) {
          if (err.message.includes("overlaps")) {
              return res.status(400).json({ status: "error", message: err.message });
          }
          res.status(500).json({ status: "error", message: err.message });
      }
  },

  updateDeal: async (req, res) => {
    try {
      const updated = await dealService.updateDeal(req.params.id, req.body);
      res.json({ status: "success", data: updated });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  deleteDeal: async (req, res) => {
    try {
      const deleted = await dealService.deleteDeal(req.params.id);
      res.json({ status: "success", data: deleted });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  getDealByIdController: async (req, res) => {
    try {
      const deal = await dealService.getDealById(req.params.id);
      if (!deal) {
        return res.status(404).json({ status: "error", message: "Deal not found" });
      }
      res.json({ status: "success", data: deal });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  getDealsByStatusController: async (req, res) => {
    try {
      const status = req.params.status;
      const deals = await dealService.getDealsByStatus(status);
      res.json({ status: "success", data: deals });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  getDealSummaryController: async (req, res) => {
    try {
      const summary = await dealService.getDealSummary();
      res.json({ status: "success", data: summary });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },
};

module.exports = dealController;