const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create({ national_id, full_name, password, email, phone }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (national_id, full_name, password_hash, email, phone) VALUES (?, ?, ?, ?, ?)',
            [national_id, full_name, hashedPassword, email, phone]
        );
        return result.insertId;
    }

    static async findByNationalId(national_id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE national_id = ?', [national_id]);
        return rows[0];
    }

    // Add other user methods as needed
}

module.exports = User;