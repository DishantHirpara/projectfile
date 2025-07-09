import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, Button } from '@mui/material';
import '../styles/UserProfileModal.scss';

const UserProfileModal = ({ open, onClose, user }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    onClose();
    // Navigate to appropriate profile edit page based on user role
    if (user?.isAdmin) {
      navigate('/admin/profile');
    } else {
      navigate('/edit-profile');
    }
  };

  if (!user) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      className="profile-dialog"
      PaperProps={{
        className: "profile-paper"
      }}
    >
      <DialogContent className="profile-content">
        <h1 className="profile-title">My Profile</h1>
        
        <div className="profile-card">
          <div className="profile-image-container">
            {user.profileImagePath ? (
              <img 
                src={`http://localhost:3001/${user.profileImagePath.replace("public", "")}`} 
                alt={user.firstName} 
                className="profile-image" 
              />
            ) : (
              <div className="profile-image-placeholder">
                {user.firstName ? user.firstName[0] : 'U'}
              </div>
            )}
          </div>
          
          <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
          
          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Contact No:</span>
              <span className="info-value">
                {user.phone && user.phone.length === 10 
                  ? user.phone 
                  : 'Not provided'}
              </span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Role:</span>
              <span className="info-value">{user.isAdmin ? 'Admin' : 'User'}</span>
            </div>
          </div>
          
          <Button 
            className="edit-profile-button"
            variant="contained"
            onClick={handleEditProfile}
            fullWidth
          >
            Edit Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal; 