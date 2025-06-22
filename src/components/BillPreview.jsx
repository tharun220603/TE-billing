// components/BillPreview.js
import React from 'react';
import numberToWords from './numberToWords';
import logo from '../components/assets/logo';

const BillPreview = ({ bill }) => {
  if (!bill) return null;

  const {
    billType,
    quotationNo,
    date,
    buyer = {},
    products = [],
    notes,
    subtotal = 0,
    cgst = 0,
    sgst = 0,
    grandTotal = 0,
    companyName,
    address,
    phone,
    email,
    gst,
    bank,
    account,
    ifsc
  } = bill;

  const cellStyle = {
    border: '1px solid #000',
    padding: '6px 8px',
    fontSize: '12px',
    verticalAlign: 'top',
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', fontSize: '12px' }}>
      <h2 style={{ textAlign: 'center' }}>{billType?.toUpperCase()}</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <img src={logo} alt="Logo" style={{ width: '100px' }} />
          <div>
            <h3 style={{ color: 'red', margin: 0 }}>THARUN ENTERPRISES</h3>
            <div>67,3RD MAIN ROAD,CRR PURAM,L&T COLONY</div>
            <div>MANAPAKKAM,CHENNAI-600125</div>
            <div>Ph: 9445151269</div>
            <div>tharunp2206@gmail.com</div>
            <div>GST No:AOK9M9753K1ZZ</div>
          </div>
        </div>

        <div>
          <div><strong>{billType?.toUpperCase()} No:</strong> {quotationNo}</div>
          <div><strong>Date:</strong> {date}</div>
        </div>
      </div>

      <h4 style={{ borderBottom: '1px solid #000', marginTop: '20px' }}>Buyer Details</h4>
      <div style={{ border: '1px solid #000', padding: '8px' }}>
        <div>{buyer.name || '-'}</div>
        <div dangerouslySetInnerHTML={{ __html: (buyer.address || '').replace(/\n/g, '<br>') }} />
        <div>GST IN: {buyer.gst || '-'}</div>
      </div>

      {/* Product Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={cellStyle}>S.No.</th>
            <th style={cellStyle}>Description</th>
            <th style={cellStyle}>HSN</th>
            <th style={{ ...cellStyle, textAlign: 'right' }}>Qty</th>
            <th style={{ ...cellStyle, textAlign: 'right' }}>Rate</th>
            <th style={{ ...cellStyle, textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={i}>
              <td style={cellStyle}>{i + 1}</td>
              <td style={cellStyle}>{p.description || ''}</td>
              <td style={cellStyle}>{p.hsnCode || ''}</td>
              <td style={{ ...cellStyle, textAlign: 'right' }}>{p.quantity || ''}</td>
              <td style={{ ...cellStyle, textAlign: 'right' }}>{p.rate || ''}</td>
              <td style={{ ...cellStyle, textAlign: 'right' }}>₹{(p.amount || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Table */}
      <table style={{ marginTop: '10px', width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, textAlign: 'right' }} colSpan="5">Subtotal:</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>₹{subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, textAlign: 'right' }} colSpan="5">CGST 9%:</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>₹{cgst.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, textAlign: 'right' }} colSpan="5">SGST 9%:</td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>₹{sgst.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 'bold' }} colSpan="5">Grand Total:</td>
            <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 'bold' }}>₹{grandTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Amount in Words */}
      <div style={{ marginTop: '10px' }}>
        <strong>Amount in Words:</strong><br />
        {numberToWords(grandTotal).replace(/\b\w/g, c => c.toUpperCase())}
      </div>

      {/* Notes */}
      {notes && notes.trim() !== '' && (
        <div style={{ marginTop: '10px' }}>
          <strong>Note:</strong><br />
          <div dangerouslySetInnerHTML={{ __html: notes.replace(/\n/g, '<br>') }} />
        </div>
      )}

      {/* Bank Details */}
      <div style={{ marginTop: '10px' }}>
        <strong>Bank: THE KARUR VYSYA BANK LTD</strong> {bank}<br />
        <strong>Account No: 1244 270 000 000 231</strong> {account}<br />
        <strong>IFSC: KVBL0001244</strong> {ifsc}
      </div>

      {/* Terms */}
      <div style={{ marginTop: '10px', fontSize: '11px' }}>
        <strong>Terms:</strong><br />
        • Report any issue within 10 days.<br />
        • Subject to Chennai jurisdiction.
      </div>

      {/* Signature */}
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        For Tharun Enterprises<br /><br />
        Authorised Signature
      </div>
    </div>
  );
};

export default BillPreview;
