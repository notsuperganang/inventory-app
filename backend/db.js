const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'inventory_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection and setup tables
const initializeDatabase = async () => {
  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Create items table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Items table ready');
    
    // Check if table has data, if not insert sample data
    const result = await client.query('SELECT COUNT(*) FROM items');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('📦 Inserting sample data...');
      
      const sampleItems = [
        ['Laptop Dell XPS 13', 'Electronics', 10, 15000000],
        ['Mouse Wireless Logitech', 'Electronics', 25, 150000],
        ['Keyboard Mechanical RGB', 'Electronics', 15, 800000],
        ['Monitor 24 inch 4K', 'Electronics', 8, 2500000],
        ['Webcam HD 1080p', 'Electronics', 12, 500000],
        ['Smartphone Samsung Galaxy', 'Electronics', 20, 12000000],
        ['Headphones Sony WH-1000XM4', 'Electronics', 18, 4500000],
        ['Tablet iPad Air', 'Electronics', 6, 8000000],
        ['Printer HP LaserJet', 'Electronics', 5, 3200000],
        ['External Hard Drive 1TB', 'Electronics', 30, 1200000]
      ];
      
      for (const item of sampleItems) {
        await client.query(
          'INSERT INTO items (name, category, stock, price) VALUES ($1, $2, $3, $4)',
          item
        );
      }
      
      console.log('✅ Sample data inserted successfully');
    }
    
    client.release();
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    process.exit(1);
  }
};

// Initialize database on startup
initializeDatabase();

// Export pool for use in other files
module.exports = pool;