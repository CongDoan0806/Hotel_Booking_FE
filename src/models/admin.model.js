const pool = require('../config/db');

const getUserListModel = async () => {
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
        ORDER BY u.user_id ASC, b.booking_id ASC, bd.booking_detail_id ASC;
    `;

    const result = await pool.query(query);
    return result.rows;
}

module.exports = {
    getUserListModel
};