import React, { useState, useEffect } from 'react';

// Function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (angle) => (angle * Math.PI) / 180;
  
  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};

const LocationApp = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [placeCoordinates, setPlaceCoordinates] = useState({ lat: 12.341896, lon: 76.584634 }); // Example coordinates

  useEffect(() => {
    // Get the current location of the user
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lon: longitude });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    if (currentLocation) {
      // Calculate the distance between current location and place coordinates
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lon,
        placeCoordinates.lat,
        placeCoordinates.lon
      );
      setDistance(distance);
      // Store distance in local storage
      localStorage.setItem('distanceToPlace', distance);
    }
  }, [currentLocation, placeCoordinates]);

  return (
    <div>
      <h1>Location and Distance</h1>
      {currentLocation ? (
        <div>
          <p>Current Location: Latitude {currentLocation.lat}, Longitude {currentLocation.lon}</p>
          <p>Place Coordinates: Latitude {placeCoordinates.lat}, Longitude {placeCoordinates.lon}</p>
          <p>Distance to Place: {distance ? distance.toFixed(2) + ' km' : 'Calculating...'} </p>
        </div>
      ) : (
        <p>Getting current location...</p>
      )}
    </div>
  );
};

export default LocationApp;
