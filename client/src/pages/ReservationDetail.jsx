import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useParams } from "react-router-dom";
import { facilities } from "../data";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { Chip, Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";
import { ReceiptLong, Close, Print, CalendarMonth, CreditCard, QueryBuilder, Bookmark, EventAvailable, EventBusy, PaymentOutlined, Person, Home } from "@mui/icons-material";

const ReservationDetail = () => {
  const [loading, setLoading] = useState(true);
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [listing, setListing] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  const getBookingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/bookings/${bookingId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      console.log("Booking data:", data);
      setBooking(data);
      setListing(data.listingId);
      
      // Ensure all property and guest details are loaded
      if (!data.listingId?.creator?.firstName || !data.listingId?.creator?.lastName) {
        try {
          const propertyResponse = await fetch(
            `http://localhost:3001/properties/${data.listingId._id}`,
            {
              method: "GET"
            }
          );
          const propertyData = await propertyResponse.json();
          setListing({...data.listingId, creator: propertyData.creator});
        } catch (err) {
          console.log("Error fetching additional property details", err);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.log("Fetch Booking Details Failed", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingDetails();
  }, [bookingId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleOpenInvoice = () => {
    setInvoiceOpen(true);
  };

  const handleCloseInvoice = () => {
    setInvoiceOpen(false);
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

  // Handle case where data is not loaded properly
  if (loading) {
    return <Loader />;
  }

  if (!booking || !listing) {
    return (
      <>
        <Navbar />
        <div className="listing-details">
          <h2>Reservation details not found or still loading. Please try again later.</h2>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate length of stay
  const checkIn = new Date(booking.startDate);
  const checkOut = new Date(booking.endDate);
  const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  return (
    <>
      <Navbar />
      
      <div className="listing-details">
        <div className="title">
          <h1>Reservation Details</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item, index) => (
            <img
              key={index}
              src={`http://localhost:3001/${item?.replace("public", "")}`}
              alt="listing photo"
              className="highlighted-photo" // Add a class for highlighted photos
            />
          ))}
        </div>

        <h2>
          {listing.type || 'Property'} in {listing.city || 'Unknown City'}, {listing.province || ''},{" "}
          {listing.country || 'Unknown Location'}
        </h2>
        <p>
          {listing.guestCount || 0} guests - {listing.bedroomCount || 0} bedroom(s) -{" "}
          {listing.bedCount || 0} bed(s) - {listing.bathroomCount || 0} bathroom(s)
        </p>
        <hr />

        {booking.customerId && (
          <>
            <div className="profile">
              {booking.customerId.profileImagePath ? (
                <img
                  src={`http://localhost:3001/${booking.customerId.profileImagePath.replace(
                    "public",
                    ""
                  )}`}
                  alt="Guest"
                />
              ) : (
                <div className="profile-placeholder">
                  {(booking.customerId.firstName && booking.customerId.firstName[0]) || 'G'}
                </div>
              )}
              <h3>
                Guest: {booking.customerId.firstName && booking.customerId.lastName ? 
                  `${booking.customerId.firstName} ${booking.customerId.lastName}` : 
                  'Guest'}
              </h3>
            </div>
            <hr />
          </>
        )}

        {listing.description && (
          <>
            <h3>Property Description</h3>
            <p>{listing.description}</p>
            <hr />
          </>
        )}

        {listing.highlight && (
          <>
            <h3>{listing.highlight}</h3>
            <p>{listing.highlightDesc || ''}</p>
            <hr />
          </>
        )}

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities && listing.amenities[0]?.split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="booking-details-title">
              <Bookmark className="booking-icon-title" />
              Reservation Details
            </h2>
            <div className="booking-details-card">
              <div className="booking-status-banner" style={{ backgroundColor: booking.paymentStatus === 'paid' ? '#4caf50' : '#ff9800' }}>
                <div className="booking-status-content">
                  <PaymentOutlined className="booking-status-icon" />
                  <span className="booking-status-text">{booking.paymentStatus || 'pending'}</span>
                </div>
                
                {booking.paymentStatus === 'paid' && (
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<ReceiptLong />}
                    onClick={handleOpenInvoice}
                    className="invoice-button-banner"
                  >
                    Invoice
                  </Button>
                )}
              </div>

              <div className="booking-details-content">
                <div className="booking-detail-item">
                  <div className="booking-detail-icon">
                    <Person />
                  </div>
                  <div className="booking-detail-info">
                    <h4>Guest</h4>
                    <p>{booking.customerId.firstName} {booking.customerId.lastName}</p>
                    <p className="booking-detail-small">{booking.customerId.email || 'No email provided'}</p>
                  </div>
                </div>

                <div className="booking-detail-item">
                  <div className="booking-detail-icon">
                    <Home />
                  </div>
                  <div className="booking-detail-info">
                    <h4>Property</h4>
                    <p>{listing.title}</p>
                  </div>
                </div>

                <div className="booking-detail-item">
                  <div className="booking-detail-icon">
                    <EventAvailable />
                  </div>
                  <div className="booking-detail-info">
                    <h4>Check-in</h4>
                    <p>{formatDate(booking.startDate)}</p>
                  </div>
                </div>

                <div className="booking-detail-item">
                  <div className="booking-detail-icon">
                    <EventBusy />
                  </div>
                  <div className="booking-detail-info">
                    <h4>Check-out</h4>
                    <p>{formatDate(booking.endDate)}</p>
                  </div>
                </div>

                <div className="booking-detail-item">
                  <div className="booking-detail-icon">
                    <QueryBuilder />
                  </div>
                  <div className="booking-detail-info">
                    <h4>Duration</h4>
                    <p>{nights} {nights === 1 ? 'night' : 'nights'}</p>
                  </div>
                </div>

                <div className="booking-detail-item">
                  <div className="booking-detail-icon">
                    <CreditCard />
                  </div>
                  <div className="booking-detail-info">
                    <h4>Payment</h4>
                    <p className="booking-price">₹{booking.totalPrice}</p>
                    {booking.paymentMethod && (
                      <span className="payment-method">via {booking.paymentMethod}</span>
                    )}
                  </div>
                </div>

                {booking.paymentMethod === 'cash' && booking.paymentStatus === 'pending' && (
                  <div className="booking-cash-notice">
                    <p>Cash payment will be collected on arrival</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <Dialog 
        open={invoiceOpen} 
        onClose={handleCloseInvoice}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <div className="invoice-dialog-header">
            <IconButton onClick={handleCloseInvoice} className="close-button">
              <Close />
            </IconButton>
            <div className="invoice-actions">
              <IconButton onClick={printInvoice} color="primary" title="Print Invoice">
                <Print />
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
                <div>{booking.customerId?.firstName || 'Guest'} {booking.customerId?.lastName || ''}</div>
                <div>{booking.customerId?.email || 'No email provided'}</div>
              </div>
              
              <div className="invoice-section">
                <h3>Property Hosted By:</h3>
                {user ? (
                  <>
                    <div>{user.firstName || 'Admin'} {user.lastName || ''}</div>
                    <div>{user.email || 'support@shreeharirental.com'}</div>
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
      </Dialog>

      <Footer />
    </>
  );
};

export default ReservationDetail; 