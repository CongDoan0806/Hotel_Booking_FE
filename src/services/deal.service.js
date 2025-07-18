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
              title: deal.title,
              discount_rate: deal.discount_rate * 100, // phần trăm
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
        // Nếu có lọc theo deal_id thì chỉ lấy các phòng có deal trùng khớp
        if (filterDealId) {
          return room.deal && room.deal.deal_id === filterDealId;
        }
        return true;
      });
  },

  getActiveDeals: async () => {
    return await dealsRepository.getActiveDeals();
  },
  getAllDeals: async () => {
    return await dealsRepository.getAllDeals();
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

};

module.exports = dealsService;
