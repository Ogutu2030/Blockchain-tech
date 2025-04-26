const app = require('./app');
const http = require('http');
const pool = require('./config/database');

// Normalize port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Test database connection
pool.getConnection()
    .then(conn => {
        console.log('Connected to MySQL database');
        conn.release();
        
        // Start server
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') throw error;
    
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Server listening on ' + bind);
}