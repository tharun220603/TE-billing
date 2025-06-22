import React, { useState, useEffect } from 'react';
import { getAllBills, deleteBill } from '../firebaseService';
import BillPreview from '../components/BillPreview';

const BillsList = ({ onEditBill, onViewBill }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('quotation');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const modalBackdrop = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalBox = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '1000px',
  height: '90%',
  overflow: 'auto',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
};


  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    const result = await getAllBills();
    if (result.success) {
      const sorted = result.data.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      setBills(sorted);
      console.log('Fetched Bills:', sorted);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDelete = async (billId) => {
    console.log('Delete function called for bill ID:', billId);
    alert('Check if this alert works'); 
    if (window.confirm('Are you sure you want to delete this bill?')) {
      const result = await deleteBill(billId);
      if (result.success) {
        setBills(bills.filter(bill => bill.id !== billId));
      } else {
        alert('Error deleting bill: ' + result.error);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB');
  };

  const filteredBills = bills
    .filter(b => b.billType === filter)
    .filter(b => {
      const search = searchTerm.toLowerCase();
      return (
        b.quotationNo?.toLowerCase().includes(search) ||
        b.buyer?.name?.toLowerCase().includes(search)
      );
    });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{filter === 'quotation' ? 'Quotations' : 'Tax Invoices'}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by name or number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc', width: '250px' }}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="quotation">Quotation</option>
            <option value="Tax/invoice">Tax/Invoice</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div style={{ color: 'red' }}>
          <p>Error: {error}</p>
          <button onClick={fetchBills}>Retry</button>
        </div>
      ) : filteredBills.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>No {filter} records found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={thStyle}>No</th>
                <th style={thStyle}>Buyer Name</th>
                <th style={thStyle}>Amount (₹)</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Edit</th>
                <th style={thStyle}>View</th>
                <th style={thStyle}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>{bill.quotationNo}</td>
                  <td style={tdStyle}>{bill.buyer?.name || 'N/A'}</td>
                  <td style={tdStyle}>₹{bill.grandTotal || 0}</td>
                  <td style={tdStyle}>{bill.date}</td>
                  <td style={tdStyle}>
                    <button onClick={() => onEditBill(bill)} style={btnStyle('#FF9800')}>Edit</button>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => setSelectedBill(bill)} style={btnStyle('#2196F3')}>View</button>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDelete(bill.id)} style={btnStyle('#f44336')}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {selectedBill && (
  <div style={modalBackdrop}>
    <div style={modalBox}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3>Preview Bill</h3>
        <button onClick={() => setSelectedBill(null)} style={btnStyle('#f44336')}>Close</button>
      </div>
      <BillPreview bill={selectedBill} />
    </div>
  </div>
)}
    </div>
  );
};

const thStyle = {
  padding: '12px 10px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  fontSize: '14px',
  color: '#333'
};

const tdStyle = {
  padding: '10px',
  fontSize: '14px',
  color: '#444'
};

const btnStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
});

export default BillsList;
