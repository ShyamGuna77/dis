import  { useEffect, useState } from "react";
import { calculateDistance } from "./distanceUtils";

function App() {
  const [creatorLocation, setCreatorLocation] = useState(null); // Creator's location
  const [userLocation, setUserLocation] = useState(null); // Visitor's location
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");

  // Function to fetch user's current location
  const getLocation = (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          callback({ lat: latitude, lon: longitude });
        },
        (err) => {
          setError("Failed to fetch location: " + err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Fetch creator's location (you)
  useEffect(() => {
    getLocation(setCreatorLocation);
  }, []);

  // Fetch user's location (visitor) after creator's location is set
  useEffect(() => {
    if (creatorLocation) {
      getLocation(setUserLocation);
    }
  }, [creatorLocation]);

  // Calculate distance when both locations are available
  useEffect(() => {
    if (creatorLocation && userLocation) {
      const dist = calculateDistance(
        creatorLocation.lat,
        creatorLocation.lon,
        userLocation.lat,
        userLocation.lon
      );
      setDistance(dist.toFixed(2)); // Round to 2 decimal places
    }
  }, [creatorLocation, userLocation]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Distance Between Us</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!creatorLocation && !error && <p>Fetching your location...</p>}
      {creatorLocation && !userLocation && (
        <p>Fetching visitors location...</p>
      )}
      {creatorLocation && userLocation && distance !== null && (
        <div>
          <p>
            Creators Location: {creatorLocation.lat}, {creatorLocation.lon}
          </p>
          <p>
            Users Location: {userLocation.lat}, {userLocation.lon}
          </p>
          <h2>The distance between us is {distance} km.</h2>
        </div>
      )}
    </div>
  );
}

export default App;
