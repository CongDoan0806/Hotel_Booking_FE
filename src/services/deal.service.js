const dealsRepository = require("../repositories/deal.repository");

const dealsService = {
  applyDealsToRooms: (rooms, deals, filterDealId = null) => {
    return rooms
      .map(room => {
        const deal = deals.find(d => d.room_type === room.room_type_id);

        if (deal) {
          const discountedPrice = room.price * (1 - deal.discount_rate);
          return {
            ...room,
            deal: {
              deal_id: deal.deal_id,
              name: deal.deal_name,
              discount_rate: deal.discount_rate * 100,
              final_price: discountedPrice,
            },
            final_price: discountedPrice,
          };
        }

        return {
          ...room,
          deal: null,
          final_price: room.price,
        };
      })
      .filter(room => {
        if (filterDealId) {
          return room.deal && room.deal.deal_id === filterDealId;
        }
        return true;
      });
  },

  getActiveDeals: async () => {
    return await dealsRepository.getActiveDeals();
  },

  getAllDeals: async ({ page, limit }) => {
    return await dealsRepository.getAllDeals({ page, limit });
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