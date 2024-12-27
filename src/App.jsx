import React, { useState, useEffect } from "react";

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);

  // Creator's fixed location: Nellore
  const creatorLocation = {
    lat: 14.4426, // Latitude of Nellore
    lon: 79.9865, // Longitude of Nellore
  };

  // Haversine Formula to Calculate Distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoords = { lat: latitude, lon: longitude };
          setUserLocation(userCoords);

          const dist = calculateDistance(
            creatorLocation.lat,
            creatorLocation.lon,
            userCoords.lat,
            userCoords.lon
          );
          setDistance(dist.toFixed(2)); // Rounded to 2 decimal places
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError(
            "Failed to get your location. Please allow location access."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Distance Calculator</h1>
      {userLocation ? (
        <p>
          Your location: {`Lat: ${userLocation.lat}, Lon: ${userLocation.lon}`}
        </p>
      ) : (
        <p>Fetching your location...</p>
      )}
      {distance !== null ? (
        <p>Distance from creator: {distance} km</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>Calculating distance...</p>
      )}
    </div>
  );
};

export default App;
