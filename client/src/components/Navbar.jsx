import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import UserProfileModal from "./UserProfileModal";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [search, setSearch] = useState("")

  const navigate = useNavigate()

  const handleProfileClick = (e) => {
    if (user) {
      e.stopPropagation(); // Prevent triggering dropdown menu
      setShowProfileModal(true);
    }
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <div className="navbar">
      <a href="/">
        <img src="/assets/logo_1.png" alt="logo" />
      </a>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""}>
          <Search
            sx={{ color: variables.pinkred }}
            onClick={() => {navigate(`/properties/search/${search}`)}}
          />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user ? (
          <a href="/create-listing" className="host">
             Add Your Property 
          </a>
        ) : (
          <a href="/login" className="host">
             Add Your Property 
          </a>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!user ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <div className="profile-image-wrapper" onClick={handleProfileClick}>
              {user.profileImagePath ? (
                <img
                  src={`http://localhost:3001/${user.profileImagePath.replace(
                    "public",
                    ""
                  )}`}
                  alt="profile"
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              ) : (
                <div className="profile-placeholder">
                  {user.firstName ? user.firstName[0] : 'U'}
                </div>
              )}
            </div>
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link to={`/${user._id}/trips`}>Trip List</Link>
            <Link to={`/${user._id}/wishList`}>Wish List</Link>
            <Link to={`/${user._id}/properties`}>Property List</Link>
            <Link to={`/${user._id}/reservations`}>Reservation List</Link>
            <Link to="/create-listing"> Add Your Property </Link>

            <Link
              to="/login"
              onClick={() => {
                dispatch(setLogout());
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      <UserProfileModal 
        open={showProfileModal}
        onClose={handleCloseProfileModal}
        user={user}
      />
    </div>
  );
};

export default Navbar;
