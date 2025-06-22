import React from 'react';
import logo from './assets/logo'; // Adjust the path if needed

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'invoice', label: 'Create Invoice', icon: '📄' },
    { id: 'bills', label: 'All Bills', icon: '📋' }
  ];

  return (
    <div style={{
      width: '250px',
      backgroundColor: '#2c3e50',
      minHeight: '100vh',
      padding: '20px 0',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      <div style={{ padding: '0 20px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '100px' }} />
        <h2 style={{ color: 'white', margin: 0, fontSize: '18px' }}>Tharun Enterprises</h2>
      </div>

      <nav>
        {menuItems.map(item => (
          <button
            key={item.id}
            style={{
              width: '100%',
              padding: '15px 20px',
              border: 'none',
              backgroundColor: activeTab === item.id ? '#34495e' : 'transparent',
              color: 'white',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '16px',
              borderLeft: activeTab === item.id ? '4px solid #3498db' : '4px solid transparent',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setActiveTab(item.id)}
            onMouseEnter={(e) => {
              if (activeTab !== item.id) {
                e.target.style.backgroundColor = '#34495e';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== item.id) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ marginRight: '10px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
