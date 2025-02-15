const pool = require('../config/db');

const FlightStatus = {
    getAll: async () => {
        const result = await pool.query(`
            SELECT fs.status_id, f.flight_number, f.airline_name, f.departure_airport_code, f.arrival_airport_code, fsm.status_name 
            FROM Flight_Status fs
            JOIN Flights f ON fs.flight_id = f.flight_id
            JOIN Flight_Status_Master fsm ON fs.status_name_id = fsm.status_id
        `);
        return result.rows;
    },
    getById: async (id) => {
        const result = await pool.query(`
            SELECT fs.status_id, f.flight_number, f.airline_name, f.departure_airport_code, f.arrival_airport_code, fsm.status_name
            FROM Flight_Status fs
            JOIN Flights f ON fs.flight_id = f.flight_id
            JOIN Flight_Status_Master fsm ON fs.status_name_id = fsm.status_id
            WHERE fs.status_id = $1
        `, [id]);
        return result.rows[0];
    },
    update: async (id, status_name_id) => {
        const result = await pool.query(`
            UPDATE Flight_Status SET status_name_id = $1, modified_at = CURRENT_TIMESTAMP 
            WHERE status_id = $2 RETURNING *`,
            [status_name_id, id]
        );
        return result.rows[0];
    }
};

module.exports = FlightStatus;
