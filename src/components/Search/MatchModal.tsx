import React from "react";
import { useDogs, Dog } from "../../contexts/DogsContext";

const MatchModal = (): JSX.Element | null => {
  const { match, setMatch } = useDogs();

  if (!match) return null;

  return (
    <div className="match-modal-overlay">
      <div className="match-modal">
        <h2>Your Perfect Match!</h2>
        <img src={match.img} alt={match.name} />
        <h3>{match.name}</h3>
        <p>Breed: {match.breed}</p>
        <p>Age: {match.age}</p>
        <p>Location: {match.zip_code}</p>
        <button onClick={() => setMatch(null)}>Close</button>
      </div>
    </div>
  );
};

export default MatchModal;
