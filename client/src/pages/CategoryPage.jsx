import { useState, useEffect, useRef } from "react";
import "../styles/List.scss";
import "../styles/Listings.scss";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import { IconButton, Box, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties?category=${category}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [category]);

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      handleScroll();
      slider.addEventListener('scroll', handleScroll);
      return () => slider.removeEventListener('scroll', handleScroll);
    }
  }, [listings]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>
      
      <div className="listings-container">
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} px={8}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Browse {category}
          </Typography>
          <Box>
            <IconButton 
              onClick={scrollLeft} 
              disabled={!canScrollLeft}
              className={`slider-nav-button ${!canScrollLeft ? 'disabled' : ''}`}
            >
              <ArrowBackIos />
            </IconButton>
            <IconButton 
              onClick={scrollRight} 
              disabled={!canScrollRight}
              className={`slider-nav-button ${!canScrollRight ? 'disabled' : ''}`}
            >
              <ArrowForwardIos />
            </IconButton>
          </Box>
        </Box>
        <div className="listings-slider" ref={sliderRef}>
          {listings?.map(
            ({
              _id,
              creator,
              listingPhotoPaths,
              city,
              province,
              country,
              category,
              type,
              price,
              booking = false,
            }) => (
              <div className="slider-item" key={_id}>
                <ListingCard
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={listingPhotoPaths}
                  city={city}
                  province={province}
                  country={country}
                  category={category}
                  type={type}
                  price={price}
                  booking={booking}
                />
              </div>
            )
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CategoryPage;
