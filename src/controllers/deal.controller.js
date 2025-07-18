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

  createDeal: async (req, res) => {
    try {
      const newDeal = await dealService.createDeal(req.body);
      res.json({ status: "success", data: newDeal });
    } catch (err) {
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
};

module.exports = dealController;
