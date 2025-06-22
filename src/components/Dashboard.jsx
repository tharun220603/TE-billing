import React from 'react';

const Dashboard = ({ activeTab, setActiveTab }) => {
  if (activeTab !== 'dashboard') return null;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2196F3', marginTop: 0 }}>Welcome to Tharun Enterprises</h3>
          <p>Manage your quotations and invoices efficiently.</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#4CAF50', marginTop: 0 }}>Quick Actions</h3>
          <button 
            style={{ 
              backgroundColor: '#2196F3', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
            onClick={() => setActiveTab('invoice')}
          >
            Create New Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
