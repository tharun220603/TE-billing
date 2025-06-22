import React, { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import BillsList from './components/BillsList';
import Login from './components/Login';

const App = () => {
  const [user, setUser] = useState(null); // Track login
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingBill, setEditingBill] = useState(null);
  const [viewingBill, setViewingBill] = useState(null);

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setActiveTab('invoice');
  };

  const handleViewBill = (bill) => {
    setViewingBill(bill);
    alert(`Viewing bill: ${bill.quotationNo}\nTotal: ₹${bill.grandTotal}`);
  };

  const handleBillSaved = () => {
    setEditingBill(null);
  };

  if (!user) {
    return <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ marginLeft: '250px', padding: '0' }}>
        <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'invoice' && (
          <InvoiceForm 
            editingBill={editingBill} 
            onSaved={handleBillSaved} 
          />
        )}

        {activeTab === 'bills' && (
          <BillsList 
            onEditBill={handleEditBill}
            onViewBill={handleViewBill} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
