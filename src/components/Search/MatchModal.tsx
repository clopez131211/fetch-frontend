import React, { useEffect, useState } from "react";
import { useDogs, Dog } from "../../contexts/DogsContext";
import { fetchLocations } from "../../services/api";

const MatchModal = (): JSX.Element | null => {
  const { match, setMatch, locationsMap } = useDogs();
  const [locationInfo, setLocationInfo] = useState<{
    city: string;
    state: string;
    county: string;
  } | null>(null);

  useEffect(() => {
    if (match && !locationsMap[match.zip_code]) {
      const fetchLocation = async () => {
        try {
          const locations = await fetchLocations([match.zip_code]);
          if (locations && locations.length > 0) {
            setLocationInfo({
              city: locations[0].city,
              state: locations[0].state,
              county: locations[0].county,
            });
          }
        } catch (error) {
          console.error("Failed to fetch location:", error);
        }
      };
      fetchLocation();
    }
  }, [match, locationsMap]);

  if (!match) return null;

  const location = locationsMap[match.zip_code] || locationInfo;

  return (
    <div className="match-modal-overlay">
      <div className="match-modal">
        <h2>Your Perfect Match!</h2>
        <img src={match.img} alt={match.name} />
        <h3>{match.name}</h3>
        <p>Breed: {match.breed}</p>
        <p>Age: {match.age}</p>
        <div className="location-info">
          <p>City: {location?.city || "N/A"}</p>
          <p>State: {location?.state || "N/A"}</p>
          <p>County: {location?.county || "N/A"}</p>
        </div>
        <button onClick={() => setMatch(null)}>Close</button>
      </div>
    </div>
  );
};

export default MatchModal;
