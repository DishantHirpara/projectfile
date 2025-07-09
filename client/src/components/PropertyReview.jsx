import { useState } from 'react';
import { Dialog, DialogContent, Rating, TextField, Button, IconButton, Box, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import '../styles/PropertyReview.scss';

const PropertyReview = ({ open, onClose, property, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    onSubmitReview({ rating, review });
    setRating(0);
    setReview('');
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    setReview('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      className="review-dialog"
    >
      <DialogContent className="review-dialog-content">
        <IconButton 
          onClick={handleClose} 
          className="close-button"
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        <div className="review-header">
          <div className="property-info">
            <Typography variant="h3" className="property-title">
              {property?.title || 'Property Title'}
            </Typography>
            <Typography variant="subtitle1" className="property-location">
              By {property?.creator?.firstName} {property?.creator?.lastName || 'Property Owner'}
            </Typography>
          </div>
          
          <div className="property-image">
            {property?.listingPhotoPaths && property.listingPhotoPaths[0] ? (
              <img 
                src={`http://localhost:3001/${property.listingPhotoPaths[0]?.replace("public", "")}`}
                alt={property.title}
              />
            ) : (
              <div className="image-placeholder">
                <span>Property</span>
              </div>
            )}
          </div>
        </div>

        <div className="rating-container">
          <Rating
            name="property-rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            size="large"
            precision={0.5}
          />
        </div>

        <TextField
          className="review-input"
          placeholder="Write your review..."
          multiline
          rows={6}
          fullWidth
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <Box className="button-container">
          <Button 
            variant="contained"
            color="primary"
            className="cancel-button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="success"
            className="submit-button"
            onClick={handleSubmit}
            disabled={!rating}
          >
            Submit Review
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyReview; 