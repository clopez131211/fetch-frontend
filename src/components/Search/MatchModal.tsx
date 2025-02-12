import React from "react";
import { useDogs, Dog } from "../../contexts/DogsContext";

const MatchModal = (): JSX.Element | null => {
  const { match, setMatch, locationsMap } = useDogs();

  if (!match) return null;

  const location = locationsMap[match.zip_code];

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
