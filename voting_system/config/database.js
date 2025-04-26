const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,  // Changed from evoting_system
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});