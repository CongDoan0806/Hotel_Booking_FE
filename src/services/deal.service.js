const dealsRepository = require("../repositories/deal.repository");

const dealsService = {
  getActiveDeals: async () => {
    return await dealsRepository.getActiveDeals();
  },

  getAllDeals: async () => {
    return await dealsRepository.getAllDeals();
  },

  getDealByRoomType: async (room_type) => {
    return await dealsRepository.getDealByRoomType(room_type);
  },

  createDeal: async (dealData) => {
    return await dealsRepository.createDeal(dealData);
  },

  updateDeal: async (id, data) => {
    return await dealsRepository.updateDeal(id, data);
  },

  deleteDeal: async (id) => {
    return await dealsRepository.deleteDeal(id);
  },

  getDealById: async (id) => {
    return await dealsRepository.getDealById(id);
  },

  getDealsByStatus: async (status) => {
    return await dealsRepository.getDealsByStatus(status);
  },

  updateDealStatus: async (id) => {
    return await dealsRepository.updateDealStatus(id);
  },

  getDealSummary: async () => {
    return await dealsRepository.getDealSummary();
  },
};

module.exports = dealsService;