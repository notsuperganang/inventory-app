import React, { useState } from 'react';
import axios from 'axios';

function AdminPanel({ items, refreshItems }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    price: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', category: '', stock: '', price: '' });
    setEditingItem(null);
    setShowForm(false);
    setMessage('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        stock: parseInt(formData.stock),
        price: parseFloat(formData.price)
      };

      if (editingItem) {
        // Update existing item
        await axios.put(`/items/${editingItem.id}`, payload);
        setMessage('Item updated successfully!');
      } else {
        // Create new item
        await axios.post('/items', payload);
        setMessage('Item created successfully!');
      }

      resetForm();
      refreshItems();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Operation failed');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      stock: item.stock.toString(),
      price: item.price.toString()
    });
    setShowForm(true);
  };

  // Delete item
  const deleteItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await axios.delete(`/items/${id}`);
      setMessage('Item deleted successfully!');
      refreshItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Delete failed');
      setTimeout(() => setMessage(''), 3000);
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
        <h2 style={titleStyle}>🔧 Admin Panel</h2>
        
        {!showForm ? (
          <button 
            onClick={() => setShowForm(true)} 
            style={addButtonStyle}
          >
            ➕ Add New Item
          </button>
        ) : (
          <button onClick={resetForm} style={cancelButtonStyle}>
            ❌ Cancel
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={formContainerStyle}>
          <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Item Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Category:</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
            
            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Stock:</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  style={inputStyle}
                  min="0"
                  required
                />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Price (IDR):</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  style={inputStyle}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <button type="submit" style={submitButtonStyle} disabled={loading}>
              {loading ? 'Saving...' : (editingItem ? 'Update Item' : 'Create Item')}
            </button>
          </form>
        </div>
      )}

      {/* Items Table */}
      <div style={tableContainerStyle}>
        <h3>Items Management ({items.length} items)</h3>
        
        {items.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>No items found. Create your first item!</p>
          </div>
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={headerRowStyle}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Stock</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} style={rowStyle}>
                    <td style={tdStyle}>{item.id}</td>
                    <td style={tdStyle}><strong>{item.name}</strong></td>
                    <td style={tdStyle}>
                      <span style={categoryStyle}>{item.category}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={item.stock > 0 ? stockGoodStyle : stockBadStyle}>
                        {item.stock}
                      </span>
                    </td>
                    <td style={tdStyle}>{formatCurrency(item.price)}</td>
                    <td style={tdStyle}>
                      <div style={actionsStyle}>
                        <button 
                          onClick={() => startEdit(item)}
                          style={editButtonStyle}
                          title="Edit item"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteItem(item.id, item.name)}
                          style={deleteButtonStyle}
                          title="Delete item"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: '100%'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem'
};

const titleStyle = {
  color: '#333',
  margin: 0
};

const addButtonStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem'
};

const cancelButtonStyle = {
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem'
};

const messageStyle = {
  backgroundColor: '#d4edda',
  color: '#155724',
  padding: '1rem',
  borderRadius: '4px',
  marginBottom: '1rem',
  textAlign: 'center'
};

const formContainerStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: '2rem'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const formRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  color: '#333'
};

const inputStyle = {
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem'
};

const submitButtonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
  marginTop: '1rem'
};

const tableContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  padding: '2rem'
};

const tableWrapperStyle = {
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem'
};

const headerRowStyle = {
  backgroundColor: '#f8f9fa'
};

const thStyle = {
  padding: '1rem',
  textAlign: 'left',
  borderBottom: '2px solid #dee2e6',
  fontWeight: 'bold',
  color: '#495057'
};

const rowStyle = {
  borderBottom: '1px solid #dee2e6'
};

const tdStyle = {
  padding: '1rem',
  borderBottom: '1px solid #dee2e6'
};

const categoryStyle = {
  backgroundColor: '#e9ecef',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.85rem'
};

const stockGoodStyle = {
  color: '#28a745',
  fontWeight: 'bold'
};

const stockBadStyle = {
  color: '#dc3545',
  fontWeight: 'bold'
};

const actionsStyle = {
  display: 'flex',
  gap: '0.5rem'
};

const editButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.2rem',
  padding: '0.25rem'
};

const deleteButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.2rem',
  padding: '0.25rem'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '2rem',
  color: '#666'
};

export default AdminPanel;