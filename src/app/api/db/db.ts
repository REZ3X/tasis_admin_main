import mysql from 'mysql2/promise';

const createPool = () => mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 3, // Reduced further
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  connectTimeout: 20000, // Reduced timeout
  enableKeepAlive: true,
  keepAliveInitialDelay: 5000,
  maxIdle: 60000,
  idleTimeout: 60000
});

let pool = createPool();
let isConnected = false;
const MAX_RETRIES = 3; // Reduced retries
const RETRY_DELAY = 3000

async function connectWithRetry(retries = MAX_RETRIES): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    console.log('Database connected successfully');
    connection.release();
    isConnected = true;
    return true;
  } catch (err) {
    console.error(`Connection attempt failed. Retries left: ${retries}`, err);
    
    if (retries > 0) {
      console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      
      // Create a new pool for retry
      pool = createPool();
      return connectWithRetry(retries - 1);
    }
    
    console.error('Max retries reached. Could not connect to database.');
    return false;
  }
}

async function ensureConnection(): Promise<boolean> {
  try {
    if (!isConnected) {
      return connectWithRetry();
    }
    
    // Verify existing connection
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    return true;
  } catch (err) {
    console.error('Connection verification failed:', err);
    isConnected = false;
    return connectWithRetry();
  }
}

// Periodic connection check
setInterval(async () => {
  try {
    if (isConnected) {
      const connection = await pool.getConnection();
      await connection.query('SELECT 1');
      connection.release();
    }
  } catch (err) {
    console.error('Periodic connection check failed:', err);
    isConnected = false;
  }
}, 30000); // Check every 30 seconds

// Cleanup on process exit
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Pool connections closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error closing pool connections:', err);
    process.exit(1);
  }
});

export { pool, ensureConnection };