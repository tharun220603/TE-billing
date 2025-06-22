import React, { useState, useEffect } from 'react';
import numberToWords from './numberToWords';
import { saveBill, updateBill } from 'D:/React-TE project/te-management/src/firebaseService';
import logo from '../components/assets/logo';

const InvoiceForm = ({ editingBill: propEditingBill, onSaved }) => {
  const [billType, setBillType] = useState('quotation');
  const [quotationNo, setQuotationNo] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'));
  
  // Firebase-related state
  const [saving, setSaving] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const companyDetails = {
    name: 'THARUN ENTERPRISES',
    address: 'Plot No.67, CRR.Puram,\nL&T Colony, 3rd Main Road,\nManapakkam, Chennai – 600 125.',
    phone: '94451 51269, 99529 48725',
    email: 'coolprotek@gmail.com',
    website: 'www.tharunmanifold.com',
    gst: '33AOXPM9753K1ZZ',
    bank: 'THE KARUR VYSYA BANK LTD',
    account: '1244 270 000 000 231',
    ifsc: 'KVBL0001244'
  };

  const [buyer, setBuyer] = useState({
    name: '',
    address: '',
    gst: ''
  });

  const [products, setProducts] = useState([{
    id: 1,
    description: '',
    hsnCode: '',
    quantity: '',
    rate: '',
    amount: 0
  }]);

  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');

  // Handle editing bill from props
  useEffect(() => {
    if (propEditingBill) {
      setEditingBill(propEditingBill);
    }
  }, [propEditingBill]);

  // Handle editing bill data population
  useEffect(() => {
    if (editingBill) {
      // Populate form with bill data
      setBillType(editingBill.billType || 'quotation');
      setQuotationNo(editingBill.quotationNo || '');
      setDate(editingBill.date || new Date().toLocaleDateString('en-GB'));
      setBuyer(editingBill.buyer || { name: '', address: '', gst: '' });
      setProducts(editingBill.products || [{
        id: 1,
        description: '',
        hsnCode: '',
        quantity: '',
        rate: '',
        amount: 0
      }]);
      setDiscount(editingBill.discount || '');
      setNotes(editingBill.notes || '');
    }
  }, [editingBill]);

  const addProduct = () => {
    const newProduct = {
      id: products.length + 1,
      description: '',
      hsnCode: '',
      quantity: '',
      rate: '',
      amount: 0
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const updateProduct = (id, field, value) => {
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };
        
        if (field === 'quantity' || field === 'rate') {
          const qty = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(product.quantity) || 0;
          const rate = field === 'rate' ? parseFloat(value) || 0 : parseFloat(product.rate) || 0;
          updatedProduct.amount = qty * rate;
        }
        
        return updatedProduct;
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const calculateTotals = () => {
    const subtotal = products.reduce((sum, product) => sum + product.amount, 0);
    const discountAmount = discount ? (subtotal * parseFloat(discount)) / 100 : 0;
    const totalAfterDiscount = subtotal - discountAmount;
    
    const cgst = totalAfterDiscount * 0.09;
    const sgst = totalAfterDiscount * 0.09;
    const grandTotal = totalAfterDiscount + cgst + sgst;
    
    return {
      subtotal,
      discountAmount,
      totalAfterDiscount,
      cgst,
      sgst,
      grandTotal: Math.round(grandTotal)
    };
  };

  const totals = calculateTotals();

  // Prepare bill data for Firebase
  const prepareBillData = () => {
    const totals = calculateTotals();
    return {
      billType,
      quotationNo,
      date,
      buyer,
      products,
      discount,
      notes,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      cgst: totals.cgst,
      sgst: totals.sgst,
      grandTotal: totals.grandTotal
    };
  };

  // Save bill to Firebase
 const saveBillToFirebase = async () => {
  if (!quotationNo || !buyer.name || products.some(p => !p.description)) {
    alert('Please fill in all required fields.');
    return;
  }

  setSaving(true);
  setSaveMessage('');

  try {
    const billData = prepareBillData();
    let result;

    if (editingBill && !saveAsNew) {
      // Update existing bill
      result = await updateBill(editingBill.id, billData);
      setSaveMessage(result.success ? 'Bill updated successfully!' : `Error: ${result.error}`);
    } else {
      // Save as new bill
      result = await saveBill(billData);
      setSaveMessage(result.success ? 'Bill saved successfully!' : `Error: ${result.error}`);
    }

    if (result.success && onSaved) {
      onSaved(result.data);
    }
  } catch (error) {
    setSaveMessage('Error saving bill: ' + error.message);
  } finally {
    setSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  }
};


  // Reset form to initial state
  const resetForm = () => {
    setBillType('quotation');
    setQuotationNo('');
    setDate(new Date().toLocaleDateString('en-GB'));
    setBuyer({ name: '', address: '', gst: '' });
    setProducts([{
      id: 1,
      description: '',
      hsnCode: '',
      quantity: '',
      rate: '',
      amount: 0
    }]);
    setDiscount('');
    setNotes('');
    setEditingBill(null);
    setSaveMessage('');
  };

  const generateHTMLTemplate = () => {
    return `
      <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${billType.toUpperCase()}</title>
  <style>
    .logo {
    width: 100px;
    height: auto;
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      margin: 20px;
      color: #000;
    }
    h1 {
      text-align: center;
      font-size: 18px;
      margin-bottom: 10px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .company-details h2 {
      font-size: 16px;
      margin: 0;
      color: red;
    }
    .company-details div,
    .quotation-details div {
      margin: 2px 0;
    }
    .section-title {
      font-weight: bold;
      margin-top: 15px;
      border-bottom: 1px solid #000;
    }
    .buyer-box {
      margin-top: 5px;
      padding: 5px;
      border: 1px solid #000;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      border: 1px solid #000;
      padding: 4px;
      font-size: 11px;
      vertical-align: top;
    }
    th {
      background-color: #f0f0f0;
      text-align: center;
    }
    .totals {
      margin-top: 10px;
      width: 100%;
      border-top: 1px solid #000;
    }
    .totals td {
      padding: 4px;
      font-weight: bold;
    }
    .right {
      text-align: right;
    }
    .amount-words {
      margin-top: 10px;
    }
    .bank, .terms {
      font-size: 11px;
      margin-top: 10px;
    }
    .signature {
      margin-top: 30px;
      text-align: right;
    }
  </style>
</head>
<body>
  <h1>${billType.toUpperCase()}</h1>
  <div class="header">
  <div style="display: flex; gap: 20px; align-items: flex-start;">
    <img src="${logo}" class="logo" />
    <div class="company-details">
      <h2>${companyDetails.name}</h2>
      <div>${companyDetails.address.replace(/\n/g, '<br>')}</div>
      <div>Ph: ${companyDetails.phone}</div>
      <div>${companyDetails.email}</div>
      <div>GST No: ${companyDetails.gst}</div>
    </div>
  </div>
  <div class="quotation-details">
    <div><strong>${billType.toUpperCase()} No:</strong> ${quotationNo}</div>
    <div><strong>Date:</strong> ${date}</div>
  </div>
</div>

  <div class="section-title">Buyer Details</div>
  <div class="buyer-box">
    ${buyer.name}<br>
    ${buyer.address.replace(/\n/g, '<br>')}<br>
    GST IN: ${buyer.gst || ' '}
  </div>

  <table>
    <thead>
      <tr>
        <th>S.No.</th>
        <th>Description</th>
        <th>HSN</th>
        <th>Qty</th>
        <th>Rate</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${products.map((p, i) => `
        <tr>
          <td style="text-align:center;">${i + 1}</td>
          <td>${p.description || ''}</td>
          <td>${p.hsnCode || ''}</td>
          <td class="right">${p.quantity || ''}</td>
          <td class="right">${p.rate || ''}</td>
          <td class="right">₹${(p.amount || 0).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <table class="totals">
    <tr><td class="right" colspan="5">Subtotal:</td><td class="right">₹${totals.subtotal.toFixed(2)}</td></tr>
    <tr><td class="right" colspan="5">CGST (9%):</td><td class="right">₹${totals.cgst.toFixed(2)}</td></tr>
    <tr><td class="right" colspan="5">SGST (9%):</td><td class="right">₹${totals.sgst.toFixed(2)}</td></tr>
    <tr><td class="right" colspan="5"><strong>Grand Total:</strong></td><td class="right"><strong>₹${totals.grandTotal.toFixed(2)}</strong></td></tr>
  </table>

  <div class="amount-words">
    <strong>Amount in words:</strong><br>
    ${numberToWords(totals.grandTotal).replace(/\b\w/g, c => c.toUpperCase())}
  </div>

  ${notes ? `<div class="bank"><strong>Note:</strong><br>${notes.replace(/\n/g, '<br>')}</div>` : ''}

  <div class="bank">
    <strong>Bank:</strong> ${companyDetails.bank}<br>
    <strong>Account No:</strong> ${companyDetails.account}<br>
    <strong>IFSC:</strong> ${companyDetails.ifsc}
  </div>

  <div class="terms">
    <strong>Terms:</strong><br>
    • Report any issue within 10 days.<br>
    • Subject to Chennai jurisdiction.
  </div>

  <div class="signature">
    For ${companyDetails.name}<br><br>
    Authorised Signature
  </div>
</body>
</html>

    `;
  };

  const generatePDF = () => {
    if (!quotationNo || !buyer.name || products.some(p => !p.description)) {
      alert('Please fill in all required fields.');
      return;
    }

    const html = generateHTMLTemplate();
    const newWindow = window.open();
    newWindow.document.write(html);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#2196F3', padding: '20px', textAlign: 'center', marginBottom: '20px', borderRadius: '8px' }}>
        <h3 style={{ color: 'white', margin: 0 }}>BILLING PAGE</h3>
      </div>

      {/* Bill Type Selection */}
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Bill Type</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: billType === 'quotation' ? '#2196F3' : 'white',
              color: billType === 'quotation' ? 'white' : 'black',
              cursor: 'pointer'
            }}
            onClick={() => setBillType('quotation')}
          >
            Quotation
          </button>
          <button
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: billType === 'Tax/invoice' ? '#2196F3' : 'white',
              color: billType === 'Tax/invoice' ? 'white' : 'black',
              cursor: 'pointer'
            }}
            onClick={() => setBillType('Tax/invoice')}
          >
            Tax/Invoice
          </button>
        </div>
      </div>

      {/* Bill Details */}
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Bill Details</h3>
        <input
          style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          placeholder={`${billType === 'quotation' ? 'Quotation' : 'Invoice'} Number`}
          value={quotationNo}
          onChange={(e) => setQuotationNo(e.target.value)}
        />
        <input
          style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          placeholder="Date (DD/MM/YY)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Buyer Details */}
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Buyer Details</h3>
        <input
          style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          placeholder="Company Name"
          value={buyer.name}
          onChange={(e) => setBuyer({...buyer, name: e.target.value})}
        />
        <textarea
          style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', minHeight: '80px', resize: 'vertical' }}
          placeholder="Address"
          value={buyer.address}
          onChange={(e) => setBuyer({...buyer, address: e.target.value})}
        />
        <input
          style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          placeholder="GST Number"
          value={buyer.gst}
          onChange={(e) => setBuyer({...buyer, gst: e.target.value})}
        />
      </div>

      {/* Products */}
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Products</h3>
          <button
            style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}
            onClick={addProduct}
          >
            + Add Product
          </button>
        </div>

        {products.map((product, index) => (
          <div key={product.id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '5px', backgroundColor: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, color: '#2196F3' }}>Product {index + 1}</h4>
              {products.length > 1 && (
                <button
                  style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                  onClick={() => removeProduct(product.id)}
                >
                  Remove
                </button>
              )}
            </div>

            <textarea
              style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', minHeight: '60px', resize: 'vertical' }}
              placeholder="Product Description"
              value={product.description}
              onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
            />

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                placeholder="HSN Code"
                value={product.hsnCode}
                onChange={(e) => updateProduct(product.id, 'hsnCode', e.target.value)}
              />
              <input
                style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                placeholder="Quantity"
                type="number"
                value={product.quantity}
                onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                placeholder="Rate (₹)"
                type="number"
                value={product.rate}
                onChange={(e) => updateProduct(product.id, 'rate', e.target.value)}
              />
              <div style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
                <strong>₹{product.amount.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Discount */}
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Discount (%)</h3>
        <input
          style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          placeholder="Discount Percentage (Optional)"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
      </div>

      {/* Notes */}
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Notes</h3>
        <textarea
          style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', minHeight: '80px', resize: 'vertical' }}
          placeholder="Additional notes (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Totals */}
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Summary</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>Subtotal:</span>
          <strong>₹{totals.subtotal.toFixed(2)}</strong>
        </div>

        {discount && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>Discount ({discount}%):</span>
            <strong>-₹{totals.discountAmount.toFixed(2)}</strong>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>CGST (9%):</span>
          <strong>₹{totals.cgst.toFixed(2)}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>SGST (9%):</span>
          <strong>₹{totals.sgst.toFixed(2)}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', backgroundColor: '#f8f9fa', marginTop: '10px', borderRadius: '5px', paddingLeft: '10px', paddingRight: '10px' }}>
          <strong style={{ color: '#2196F3', fontSize: '18px' }}>Grand Total:</strong>
          <strong style={{ color: '#2196F3', fontSize: '18px' }}>₹{totals.grandTotal}</strong>
        </div>

        <p style={{ marginTop: '15px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
          <strong>Amount in Words:</strong> {numberToWords(totals.grandTotal)}
        </p>
      </div>

      {/* Save message display */}
      {saveMessage && (
        <div style={{
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          backgroundColor: saveMessage.includes('Error') ? '#ffebee' : '#e8f5e9',
          color: saveMessage.includes('Error') ? '#c62828' : '#2e7d32',
          border: `1px solid ${saveMessage.includes('Error') ? '#ef5350' : '#4caf50'}`
        }}>
          {saveMessage}
        </div>
      )}
      
      {editingBill && (
  <div style={{ marginBottom: '10px' }}>
    <label style={{ fontSize: '14px' }}>
      <input
        type="checkbox"
        checked={saveAsNew}
        onChange={() => setSaveAsNew(!saveAsNew)}
        style={{ marginRight: '8px' }}
      />
      Save as New Bill Instead of Updating
    </label>
  </div>
)}


      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          style={{ 
            flex: 1,
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            padding: '15px', 
            borderRadius: '8px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1
          }}
          onClick={saveBillToFirebase}
          disabled={saving}
        >
          {saving ? 'Saving...' : (editingBill ? 'Update Bill' : 'Save Bill')}
        </button>

        <button
          style={{ 
            flex: 1,
            backgroundColor: '#FF9800', 
            color: 'white', 
            border: 'none', 
            padding: '15px', 
            borderRadius: '8px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer'
          }}
          onClick={generatePDF}
        >
          Generate PDF
        </button>
      </div>

      {editingBill && (
        <button
          style={{ 
            width: '100%',
            backgroundColor: '#9E9E9E', 
            color: 'white', 
            border: 'none', 
            padding: '10px', 
            borderRadius: '8px', 
            fontSize: '14px', 
            cursor: 'pointer',
            marginBottom: '20px'
          }}
          onClick={resetForm}
        >
          Clear Form / Create New
        </button>
      )}
    </div>
  );
};

export default InvoiceForm;