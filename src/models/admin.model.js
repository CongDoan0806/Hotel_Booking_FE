const pool = require("../config/db");

const getUserListModel = async () => {
  const query = `
        SELECT 
            u.*, 
            b.booking_id, b.status AS booking_status, b.payment_status, 
            bd.booking_detail_id, bd.service_name, bd.quantity, bd.price_per_unit, bd.check_in_date, bd.check_out_date,
            r.room_id, r.name AS room_name, r.description AS room_description, r.price AS room_price, r.room_type_id, r.floor_id
        FROM users u
        INNER JOIN bookings b ON u.user_id = b.user_id
        LEFT JOIN booking_details bd ON b.booking_id = bd.booking_id
        LEFT JOIN rooms r ON bd.room_id = r.room_id
        ORDER BY u.user_id ASC, b.booking_id ASC, bd.booking_detail_id ASC;
    `;

  const result = await pool.query(query);
  return result.rows;
};
const getCheckinGuestsModel = async () => {
  const query = `
    SELECT 
      u.*, 
      b.booking_id, b.status AS booking_status, b.payment_status, 
      bd.booking_detail_id, bd.service_name, bd.quantity, bd.price_per_unit, bd.check_in_date, bd.check_out_date,
      r.room_id, r.name AS room_name, r.description AS room_description, r.price AS room_price, r.room_type_id, r.floor_id
    FROM users u
    LEFT JOIN bookings b ON u.user_id = b.user_id
    LEFT JOIN booking_details bd ON b.booking_id = bd.booking_id
    LEFT JOIN rooms r ON bd.room_id = r.room_id
    WHERE bd.check_in_date <= CURRENT_DATE
      AND bd.check_out_date > CURRENT_DATE
      AND b.status = 'confirmed'
    ORDER BY u.user_id ASC, b.booking_id ASC, bd.booking_detail_id ASC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

const getCheckoutGuestsModel = async () => {
  const query = `
    SELECT 
      u.*, 
      b.booking_id, b.status AS booking_status, b.payment_status, 
      bd.booking_detail_id, bd.service_name, bd.quantity, bd.price_per_unit, bd.check_in_date, bd.check_out_date,
      r.room_id, r.name AS room_name, r.description AS room_description, r.price AS room_price, r.room_type_id, r.floor_id
    FROM users u
    LEFT JOIN bookings b ON u.user_id = b.user_id
    LEFT JOIN booking_details bd ON b.booking_id = bd.booking_id
    LEFT JOIN rooms r ON bd.room_id = r.room_id
    WHERE bd.check_out_date <= CURRENT_DATE
      AND b.status = 'confirmed'
    ORDER BY u.user_id ASC, b.booking_id ASC, bd.booking_detail_id ASC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

const getAdminDashboardStatusModel = async () => {
  const query = `
     SELECT
      (SELECT COUNT(*) 
      FROM booking_details 
      WHERE check_in_date = CURRENT_DATE) AS check_in_today,

      (SELECT COUNT(*) 
      FROM booking_details 
      WHERE check_out_date = CURRENT_DATE) AS check_out_today,

      (SELECT COUNT(*) 
       FROM rooms 
       WHERE status = 'available') AS available_room_count,

      (SELECT COUNT(*) 
       FROM rooms 
       WHERE status = 'occupied') AS occupied_room_count,

       (SELECT COUNT(*) 
       FROM rooms 
       WHERE status = 'booked') AS booked_room_count;
    `;
  const result = await pool.query(query);
  return result.rows[0];
};

const getAdminDashboardDealModel = async () => {
  const query = `
    SELECT 
        rt.name AS room_type_name,
        rt.price,
        COUNT(DISTINCT d.deal_id) AS total_deals,
        COUNT(DISTINCT r.room_id) AS total_rooms,
        SUM(CASE WHEN r.status IN ('booked', 'occupied') THEN 1 ELSE 0 END) AS used_rooms
      FROM room_types rt
      LEFT JOIN rooms r ON rt.room_type_id = r.room_type_id
      LEFT JOIN deals d ON rt.room_type_id = d.room_type
      GROUP BY rt.room_type_id, rt.name, rt.price
      ORDER BY rt.name;
      `;
  const result = await pool.query(query);
  return result.rows;
};

const getFeedbackModel = async () => {
  const query = `
      SELECT 
        u.name AS customer_name,
        r.name AS room_name,
        f.comment
      FROM feedbacks f
      JOIN booking_details bd ON f.booking_details_id = bd.booking_detail_id
      JOIN bookings b ON bd.booking_id = b.booking_id
      JOIN users u ON b.user_id = u.user_id
      JOIN rooms r ON bd.room_id = r.room_id
      ORDER BY f.created_at DESC;
    `;
  const result = await pool.query(query);
  return result.rows;
};

const getHotelFeedbackModel = async () => {
  const query = `
      SELECT 
          u.name AS customer_name,
          hf.comment,
          hf.rating,
          hf.submitted_at
      FROM hotel_feedbacks hf
      JOIN users u ON hf.user_id = u.user_id
      ORDER BY hf.submitted_at DESC;
    `;
  const result = await pool.query(query);
  return result.rows;
};

const getTop5MostBookedRoomsModel = async () => {
  const query = `
      SELECT 
      r.room_id,
      r.name AS room_name,
      COUNT(bd.booking_detail_id) AS total_bookings
      FROM 
          booking_details bd
      JOIN 
          rooms r ON bd.room_id = r.room_id
      GROUP BY 
          r.room_id, r.name
      ORDER BY 
          total_bookings DESC
      LIMIT 5;
    `;
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = {
  getUserListModel,
  getCheckinGuestsModel,
  getCheckoutGuestsModel,
  getAdminDashboardStatusModel,
  getAdminDashboardDealModel,
  getFeedbackModel,
  getTop5MostBookedRoomsModel,
  getHotelFeedbackModel,
};
