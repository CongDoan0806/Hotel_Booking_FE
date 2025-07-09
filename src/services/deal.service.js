const dealsRepository = require("../repositories/deal.repository");

const dealsService = {
  getActiveDeals: async () => {
    return await dealsRepository.getActiveDeals();
  },

  applyDealsToRooms: (rooms, deals) => {
    return rooms.map(room => {
      const deal = deals.find(d => d.room_type === room.room_type_id);
      if (deal) {
        const discountedPrice = room.price * (1 - deal.discount_rate);
        return {
          ...room,
          deal: {
            discount_rate: deal.discount_rate * 100,
            final_price: discountedPrice,
          },
          final_price: discountedPrice,
        };
      }
      return {
        ...room,
        final_price: room.price,
        deal: null,
      };
    });
  },

  createDeal: async (dealData) => {
    return await dealsRepository.createDeal(dealData);
  },
};

module.exports = dealsService;
