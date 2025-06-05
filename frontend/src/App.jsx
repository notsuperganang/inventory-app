import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemList from './components/ItemList';
import AdminPanel from './components/AdminPanel';
import './App.css';

const API_BASE = 'http://localhost:3001/api';

// Setup axios defaults
axios.defaults.baseURL = API_BASE;

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
    fetchItems();
  }, []);

  // Fetch items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      const response = await axios.post('/login', { username, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setCurrentView('admin');
      
      return { success: true, message: 'Login successful' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setCurrentView('home');
  };

  // Navigation
  const Navigation = () => (
    <nav style={navStyle}>
      <div style={navContainerStyle}>
        <h1 style={logoStyle}>📦 Inventory System</h1>
        <div style={navLinksStyle}>
          <button 
            onClick={() => setCurrentView('home')}
            style={currentView === 'home' ? activeButtonStyle : buttonStyle}
          >
            Home
          </button>
          
          {isAuthenticated ? (
            <>
              <button 
                onClick={() => setCurrentView('admin')}
                style={currentView === 'admin' ? activeButtonStyle : buttonStyle}
              >
                Admin Panel
              </button>
              <button onClick={logout} style={logoutButtonStyle}>
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => setCurrentView('login')}
              style={currentView === 'login' ? activeButtonStyle : buttonStyle}
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );

  // Login Form
  const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      const result = await login(credentials.username, credentials.password);
      setMessage(result.message);
      
      if (!result.success) {
        setTimeout(() => setMessage(''), 3000);
      }
    };

    return (
      <div style={containerStyle}>
        <div style={loginFormStyle}>
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
            <div style={formGroupStyle}>
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
            <button type="submit" style={submitButtonStyle}>
              Login
            </button>
          </form>
          {message && <p style={messageStyle}>{message}</p>}
          <div style={hintStyle}>
            <p><strong>Demo Credentials:</strong></p>
            <p>Username: admin</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={appStyle}>
      <Navigation />
      
      <main style={mainStyle}>
        {currentView === 'home' && (
          <ItemList items={items} />
        )}
        
        {currentView === 'login' && (
          <LoginForm />
        )}
        
        {currentView === 'admin' && isAuthenticated && (
          <AdminPanel items={items} refreshItems={fetchItems} />
        )}
      </main>
    </div>
  );
}

// Styles
const appStyle = {
  minHeight: '100vh',
  backgroundColor: '#f5f5f5'
};

const navStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '1rem 0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const navContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const logoStyle = {
  margin: 0,
  fontSize: '1.5rem'
};

const navLinksStyle = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center'
};

const buttonStyle = {
  background: 'none',
  border: '1px solid #555',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.3s'
};

const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#007bff',
  borderColor: '#007bff'
};

const logoutButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
  borderColor: '#dc3545'
};

const mainStyle = {
  maxWidth: '1200px',
  margin: '2rem auto',
  padding: '0 1rem'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh'
};

const loginFormStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px'
};

const formGroupStyle = {
  marginBottom: '1rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
  boxSizing: 'border-box'
};

const submitButtonStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer'
};

const messageStyle = {
  marginTop: '1rem',
  padding: '0.5rem',
  borderRadius: '4px',
  backgroundColor: '#f8d7da',
  color: '#721c24',
  textAlign: 'center'
};

const hintStyle = {
  marginTop: '1.5rem',
  padding: '1rem',
  backgroundColor: '#e7f3ff',
  borderRadius: '4px',
  fontSize: '0.9rem',
  textAlign: 'center'
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh'
};

export default App;
