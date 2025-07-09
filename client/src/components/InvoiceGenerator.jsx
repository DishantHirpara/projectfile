import React, { useEffect, useState } from 'react';
import { 
  Box, 
  DialogContent,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import { useSelector } from 'react-redux';

const InvoiceGenerator = ({ booking, onClose }) => {
  const [listing, setListing] = useState(null);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchListingDetails = async () => {
      if (booking && booking.listingId && booking.listingId._id) {
        try {
          const response = await fetch(
            `http://localhost:3001/properties/${booking.listingId._id}`,
            {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`
              }
            }
          );
          const data = await response.json();
          setListing({...booking.listingId, creator: data.creator});
        } catch (err) {
          console.log("Error fetching property details", err);
        }
      }
    };
    
    fetchListingDetails();
  }, [booking]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const printInvoice = () => {
    const printContent = document.getElementById('invoice-content');
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=0,top=0,width=800,height=800');
    
    printWindow.document.write('<html><head><title>Shree Hari Rental Property Invoice</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; }
      .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; }
      .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
      .invoice-brand { display: flex; flex-direction: column; }
      .invoice-logo-container { display: flex; align-items: center; margin-bottom: 10px; }
      .invoice-logo-image { width: 80px; height: auto; margin-right: 15px; }
      .invoice-company-name { font-size: 20px; font-weight: bold; color: #3f51b5; }
      .invoice-title { font-size: 24px; color: #333; font-weight: bold; }
      .invoice-number { text-align: right; font-size: 14px; color: #666; }
      .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
      .invoice-section { margin-bottom: 20px; }
      .invoice-section h3 { color: #3f51b5; margin-bottom: 5px; }
      .booking-info { padding: 15px; border-radius: 8px; background-color: #f5f5f5; }
      .payment-status { display: inline-block; padding: 5px 12px; border-radius: 20px; font-weight: bold; }
      .payment-status.paid { background-color: #4caf50; color: white; }
      .payment-status.pending { background-color: #ff9800; color: white; }
      .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      .invoice-table th, .invoice-table td { padding: 12px 15px; border-bottom: 1px solid #ddd; text-align: left; }
      .invoice-table th { background-color: #f5f5f5; }
      .total-row { font-weight: bold; }
      .invoice-footer { margin-top: 40px; text-align: center; color: #666; font-size: 14px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Calculate length of stay
  const checkIn = new Date(booking.startDate);
  const checkOut = new Date(booking.endDate);
  const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  if (!booking || !listing) {
    return <div>Loading invoice details...</div>;
  }

  return (
    <DialogContent>
      <div className="invoice-dialog-header">
        <IconButton onClick={onClose} className="close-button">
          <CloseIcon />
        </IconButton>
        <div className="invoice-actions">
          <IconButton onClick={printInvoice} color="primary" title="Print Invoice">
            <PrintIcon />
          </IconButton>
        </div>
      </div>
      
      <div id="invoice-content" className="invoice-container">
        <div className="invoice-header">
          <div className="invoice-brand">
            <div className="invoice-logo-container">
              <img 
                src="/assets/logo_1.png" 
                alt="Shree Hari Rental Property" 
                className="invoice-logo-image" 
              />
              <span className="invoice-company-name">Shree Hari Rental Property</span>
            </div>
            <div className="invoice-title">INVOICE</div>
          </div>
          <div className="invoice-number">
            <div>Invoice #: DN-{booking._id?.substring(0, 8)}</div>
            <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>
        
        <div className="invoice-details">
          <div className="invoice-section">
            <h3>Billed To:</h3>
            <div>{user?.firstName || 'Guest'} {user?.lastName || ''}</div>
            <div>{user?.email || 'No email provided'}</div>
          </div>
          
          <div className="invoice-section">
            <h3>Property Hosted By:</h3>
            {listing.creator ? (
              <>
                <div>{listing.creator.firstName || 'Admin'} {listing.creator.lastName || ''}</div>
                <div>{listing.creator.email || 'support@shreeharirental.com'}</div>
              </>
            ) : (
              <>
                <div>Shree Hari Rental Property Admin</div>
                <div>support@shreeharirental.com</div>
              </>
            )}
          </div>
        </div>
        
        <div className="invoice-section">
          <h3>Property Details:</h3>
          <div>{listing.title}</div>
          <div>{listing.type} in {listing.city}, {listing.province}, {listing.country}</div>
        </div>
        
        <div className="invoice-section">
          <h3>Booking Information:</h3>
          <div className="booking-info">
            <div>Booking ID: {booking._id}</div>
            <div>Check-in: {formatDate(booking.startDate)}</div>
            <div>Check-out: {formatDate(booking.endDate)}</div>
            <div>Duration: {nights} {nights === 1 ? 'night' : 'nights'}</div>
            <div className={`payment-status ${booking.paymentStatus}`}>
              Payment Status: {booking.paymentStatus}
            </div>
            {booking.paymentMethod && (
              <div>Payment Method: {booking.paymentMethod}</div>
            )}
          </div>
        </div>
        
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Nights</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accommodation at {listing.title}</td>
              <td>{nights}</td>
              <td>₹{Math.round(booking.totalPrice / nights)}/night</td>
              <td>₹{booking.totalPrice}</td>
            </tr>
            <tr className="total-row">
              <td colSpan="3" style={{ textAlign: 'right' }}>Total</td>
              <td>₹{booking.totalPrice}</td>
            </tr>
          </tbody>
        </table>
        
        <div className="invoice-footer">
          <p>Thank you for choosing Shree Hari Rental Property for your accommodation needs!</p>
          <p>For any queries, please contact support@shreeharirental.com</p>
        </div>
      </div>
    </DialogContent>
  );
};

export default InvoiceGenerator; 