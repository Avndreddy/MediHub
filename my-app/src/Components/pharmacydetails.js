import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  InputBase,
  TextField,
  Chip,
} from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

// Function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (angle) => (angle * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};

const PharmacyDetails = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [displayedPharmacies, setDisplayedPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Define constant coordinates for the place
  const placeCoordinates = { lat: 12.341896, lon: 76.584634 }; // Example coordinates

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lon: longitude });
          },
          (error) => {
            console.error("Error getting location:", error);
            setCurrentLocation(null); // Optionally handle the case where location couldn't be retrieved
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setCurrentLocation(null); // Optionally handle the case where geolocation is not supported
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/pharmacies"
        );
        const fetchedPharmacies = response.data;

        if (currentLocation) {
          const pharmaciesWithDistance = fetchedPharmacies.map((pharmacy) => {
            const pharmacyLat = parseFloat(pharmacy.latitude);
            const pharmacyLon = parseFloat(pharmacy.longitude);

            if (isNaN(pharmacyLat) || isNaN(pharmacyLon)) {
              return { ...pharmacy, distance: "Invalid Coordinates" };
            }

            const distance = calculateDistance(
              currentLocation.lat,
              currentLocation.lon,
              pharmacyLat,
              pharmacyLon
            );
            return { ...pharmacy, distance };
          });

          const sortedPharmacies = pharmaciesWithDistance.sort(
            (a, b) => a.distance - b.distance
          );

          setPharmacies(sortedPharmacies);
          setDisplayedPharmacies(sortedPharmacies.slice(0, 5));
        } else {
          setPharmacies(fetchedPharmacies);
          setDisplayedPharmacies(fetchedPharmacies.slice(0, 5));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, [currentLocation]);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filteredPharmacies = pharmacies.filter((pharmacy) => {
      const matchesSearchTerm =
        (pharmacy.outletName || "")
          .toLowerCase()
          .includes(lowercasedSearchTerm) ||
        (pharmacy.sellerName || "")
          .toLowerCase()
          .includes(lowercasedSearchTerm) ||
        (pharmacy.storeSpecialty || "")
          .toLowerCase()
          .includes(lowercasedSearchTerm);

      const matchesTags =
        tags.length === 0 ||
        tags.some(
          (tag) =>
            (pharmacy.outletName || "")
              .toLowerCase()
              .includes(tag.toLowerCase()) ||
            (pharmacy.sellerName || "")
              .toLowerCase()
              .includes(tag.toLowerCase()) ||
            (pharmacy.storeSpecialty || "")
              .toLowerCase()
              .includes(tag.toLowerCase())
        );

      return matchesSearchTerm && matchesTags;
    });

    setDisplayedPharmacies(filteredPharmacies.slice(0, 5));
  }, [searchTerm, tags, pharmacies]);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleShowMore = () => {
    setDisplayedPharmacies(pharmacies);
    setShowMore(true);
  };

  const handleRedirect = (id) => {
    localStorage.setItem("SelectedPharmacy", id);
    navigate("/UserDashboard"); // Redirect to UserDashboard
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3, bgcolor: "#F5F5F5" }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "#006EBE", fontWeight: 600, mb: 4 }}
      >
        Discover Pharmacies Near You
      </Typography>
      <Box sx={{ display: "flex", alignItems: "flex-end", mb: 4 }}>
        <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          sx={{ ml: 1, flex: 1 }}
          label="Search Pharmacies, Store Spacility or by Seller Name"
          value={searchTerm}
          variant="standard"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <TextField
          label="Add Filter Tag"
          variant="standard"
          size="small"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          sx={{ ml: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTag}
          sx={{ ml: 2 }}
        >
          Add Tag
        </Button>
      </Box>
      <Box sx={{ mb: 4 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => handleRemoveTag(tag)}
            color="primary"
            sx={{ mr: 1 }}
          />
        ))}
      </Box>
      {displayedPharmacies.length === 0 ? (
        <Typography>No pharmacies available.</Typography>
      ) : (
        <Grid container spacing={3}>
          {displayedPharmacies.map((pharmacy) => (
            <Grid item xs={12} sm={6} md={4} key={pharmacy._id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  boxShadow: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleRedirect(pharmacy._id)} // Pass a function to handleRedirect
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={pharmacy.outletPictures}
                  alt={pharmacy.outletName}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: "#006EBE", mb: 1 }}
                  >
                    {pharmacy.outletName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Seller Name:</strong> {pharmacy.sellerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {pharmacy.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Contact Info:</strong> {pharmacy.contactInfo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Delivery Available:</strong>{" "}
                    {pharmacy.availableDelivery ? "Yes" : "No"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Store Specialty:</strong> {pharmacy.storeSpecialty}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Distance:</strong>{" "}
                    {typeof pharmacy.distance === "number"
                      ? pharmacy.distance.toFixed(2) + " km"
                      : pharmacy.distance}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Rating:</strong>{" "}
                    {pharmacy.rating ? pharmacy.rating : "No rating available"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {!showMore && pharmacies.length > 5 && (
        <Button onClick={handleShowMore} variant="contained">
          Show More
        </Button>
      )}
    </Box>
  );
};

export default PharmacyDetails;
