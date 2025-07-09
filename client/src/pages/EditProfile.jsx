import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../redux/state";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import "../styles/EditProfile.scss";
import { TextField, Button, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    user?.profileImagePath
      ? `http://localhost:3001/${user.profileImagePath.replace("public", "")}`
      : null
  );

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Only include fields that have changed
      if (formData.firstName !== user.firstName) {
        formDataToSend.append("firstName", formData.firstName);
      }
      
      if (formData.lastName !== user.lastName) {
        formDataToSend.append("lastName", formData.lastName);
      }
      
      if (formData.email !== user.email) {
        formDataToSend.append("email", formData.email);
      }
      
      if (formData.phone !== user.phone) {
        formDataToSend.append("phone", formData.phone);
      }
      
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }
      
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }
      
      const response = await fetch(`http://localhost:3001/users/${user._id}/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      
      const updatedUser = await response.json();
      
      if (response.ok) {
        // Update user in Redux store
        dispatch(
          setLogin({
            user: updatedUser.user,
            token: token,
          })
        );
        
        alert("Profile updated successfully!");
        navigate("/");
      } else {
        alert(updatedUser.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className="edit-profile-container">
        <div className="edit-profile-content">
          <h1>Edit Profile</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="profile-image-section">
              <div className="profile-image-container">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="profile-image" />
                ) : (
                  <div className="profile-image-placeholder">
                    {formData.firstName ? formData.firstName[0] : "U"}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="profile-image-input"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="profile-image-input">
                  <IconButton
                    color="primary"
                    component="span"
                    className="upload-button"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </div>
              <p className="upload-hint">Click the camera icon to upload a new profile picture</p>
            </div>
            
            <div className="form-row">
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </div>
            
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              required
              className="form-field"
            />
            
            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              className="form-field"
              type="number"
              inputProps={{ 
                maxLength: 10,
                pattern: "[0-9]{10}",
                inputMode: "numeric",
                onInput: (e) => {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
              error={!!errors.phone}
              helperText={errors.phone}
            />
            
            <div className="password-section">
              <h3>Change Password (optional)</h3>
              <div className="form-row">
                <TextField
                  label="New Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </div>
            </div>
            
            <div className="button-container">
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={() => navigate("/")}
                className="cancel-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="save-button"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile; 