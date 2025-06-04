const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple hardcoded auth (in production, use proper auth with hashed passwords)
  if (username === 'admin' && password === 'password123') {
    const token = jwt.sign({ username: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get all items (public)
app.get('/api/items', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM items ORDER BY created_at DESC';
    let params = [];
    
    if (search) {
      query = 'SELECT * FROM items WHERE name ILIKE $1 OR category ILIKE $1 ORDER BY created_at DESC';
      params = [`%${search}%`];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get single item (public)
app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create item (admin only)
app.post('/api/items', authenticateToken, async (req, res) => {
  try {
    const { name, category, stock, price } = req.body;
    
    if (!name || !category || stock === undefined || price === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const result = await pool.query(
      'INSERT INTO items (name, category, stock, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, parseInt(stock), parseFloat(price)]
    );
    
    res.status(201).json({
      ...result.rows[0],
      message: 'Item created successfully'
    });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update item (admin only)
app.put('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, stock, price } = req.body;
    
    if (!name || !category || stock === undefined || price === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const result = await pool.query(
      'UPDATE items SET name = $1, category = $2, stock = $3, price = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, category, parseInt(stock), parseFloat(price), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({
      ...result.rows[0],
      message: 'Item updated successfully'
    });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item (admin only)
app.delete('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Get database stats (admin only)
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const totalItems = await pool.query('SELECT COUNT(*) FROM items');
    const totalCategories = await pool.query('SELECT COUNT(DISTINCT category) FROM items');
    const inStock = await pool.query('SELECT COUNT(*) FROM items WHERE stock > 0');
    const outOfStock = await pool.query('SELECT COUNT(*) FROM items WHERE stock = 0');
    const totalValue = await pool.query('SELECT SUM(price * stock) as total_value FROM items');
    
    res.json({
      total_items: parseInt(totalItems.rows[0].count),
      total_categories: parseInt(totalCategories.rows[0].count),
      in_stock: parseInt(inStock.rows[0].count),
      out_of_stock: parseInt(outOfStock.rows[0].count),
      total_inventory_value: parseFloat(totalValue.rows[0].total_value) || 0
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      message: 'Inventory API is running',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: err.message 
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});