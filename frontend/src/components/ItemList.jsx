import React, { useState } from 'react';
import axios from 'axios';

function ItemList({ items: initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Search function
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(`/items?search=${searchTerm}`);
      setItems(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset search
  const resetSearch = async () => {
    setSearchTerm('');
    try {
      setLoading(true);
      const response = await axios.get('/items');
      setItems(response.data);
    } catch (error) {
      console.error('Reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>📦 Inventory Items</h2>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} style={searchFormStyle}>
          <input
            type="text"
            placeholder="Search items or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <button type="submit" style={searchButtonStyle} disabled={loading}>
            {loading ? '🔄' : '🔍'} Search
          </button>
          {searchTerm && (
            <button type="button" onClick={resetSearch} style={resetButtonStyle}>
              ✖️ Clear
            </button>
          )}
        </form>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div style={emptyStateStyle}>
          <h3>No items found</h3>
          <p>Try adjusting your search terms or check back later.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {items.map((item) => (
            <div key={item.id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={itemNameStyle}>{item.name}</h3>
                <span style={categoryBadgeStyle}>{item.category}</span>
              </div>
              
              <div style={cardBodyStyle}>
                <div style={priceStyle}>
                  {formatCurrency(item.price)}
                </div>
                
                <div style={stockContainerStyle}>
                  <span style={stockLabelStyle}>Stock:</span>
                  <span style={item.stock > 0 ? stockAvailableStyle : stockOutStyle}>
                    {item.stock} {item.stock > 0 ? 'available' : 'out of stock'}
                  </span>
                </div>
                
                {item.created_at && (
                  <div style={dateStyle}>
                    Added: {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={statsStyle}>
        <div style={statItemStyle}>
          <strong>Total Items:</strong> {items.length}
        </div>
        <div style={statItemStyle}>
          <strong>Categories:</strong> {[...new Set(items.map(item => item.category))].length}
        </div>
        <div style={statItemStyle}>
          <strong>In Stock:</strong> {items.filter(item => item.stock > 0).length}
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: '100%'
};

const headerStyle = {
  marginBottom: '2rem'
};

const titleStyle = {
  color: '#333',
  marginBottom: '1.5rem',
  textAlign: 'center'
};

const searchFormStyle = {
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'center',
  flexWrap: 'wrap'
};

const searchInputStyle = {
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
  minWidth: '300px',
  maxWidth: '100%'
};

const searchButtonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem'
};

const resetButtonStyle = {
  padding: '0.75rem 1rem',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2rem'
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '1.5rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s'
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1rem'
};

const itemNameStyle = {
  margin: 0,
  color: '#333',
  fontSize: '1.25rem',
  flex: 1
};

const categoryBadgeStyle = {
  backgroundColor: '#e9ecef',
  color: '#495057',
  padding: '0.25rem 0.75rem',
  borderRadius: '12px',
  fontSize: '0.85rem',
  fontWeight: 'bold'
};

const cardBodyStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const priceStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#28a745'
};

const stockContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const stockLabelStyle = {
  color: '#666'
};

const stockAvailableStyle = {
  color: '#28a745',
  fontWeight: 'bold'
};

const stockOutStyle = {
  color: '#dc3545',
  fontWeight: 'bold'
};

const dateStyle = {
  fontSize: '0.85rem',
  color: '#888'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '3rem',
  color: '#666'
};

const statsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '2rem',
  padding: '1.5rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  flexWrap: 'wrap'
};

const statItemStyle = {
  textAlign: 'center',
  color: '#495057'
};

export default ItemList;
