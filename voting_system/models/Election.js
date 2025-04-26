const pool = require('../config/database');

class Election {
    static async create({ title, description, start_date, end_date }) {
        const [result] = await pool.query(
            'INSERT INTO elections (title, description, start_date, end_date) VALUES (?, ?, ?, ?)',
            [title, description, start_date, end_date]
        );
        return result.insertId;
    }

    static async findAllActive() {
        const [rows] = await pool.query(
            'SELECT * FROM elections WHERE status = "active" AND start_date <= NOW() AND end_date >= NOW()'
        );
        return rows;
    }

    // Add other election methods as needed
}

module.exports = Election;