const cron = require("node-cron");
const bookingService = require("../services/booking.service");
const dayjs = require("../utils/dayjs");

cron.schedule("*/10 * * * * *", async () => {
  const now = dayjs();
  const today = now.format("YYYY-MM-DD");
  const time = now.format("HH:mm:ss");

  try {
    const checkinCount = await bookingService.autoUpdateCheckinStatus();
    const checkoutCount = await bookingService.autoUpdateCheckoutStatus();

  } catch (err) {
    console.error(`[${today} ${time}] ❌ Cron job error:`, err);
  }
});
