import React from "react";
import { useDogs } from "../../contexts/DogsContext";

const DogList = ({ dogs }) => {
  const { favorites, addFavorite, removeFavorite, locationsMap } = useDogs();

  return (
    <div className="dog-grid">
      {dogs.map((dog) => {
        const location = locationsMap[dog.zip_code];

        return (
          <div key={dog.id} className="dog-card">
            <img src={dog.img} alt={dog.name} />
            <div className="dog-card-content">
              <h3>{dog.name}</h3>
              <p>Breed: {dog.breed}</p>
              <p>Age: {dog.age}</p>

              {location ? (
                <div className="location-info">
                  <p>City: {location?.city || "N/A"}</p>
                  <p>State: {location?.state || "N/A"}</p>
                  <p>County: {location?.county || "N/A"}</p>
                </div>
              ) : (
                <p className="loading-location">Loading location...</p>
              )}

              {favorites.includes(dog.id) ? (
                <button onClick={() => removeFavorite(dog.id)}>
                  Remove from Favorites
                </button>
              ) : (
                <button onClick={() => addFavorite(dog.id)}>
                  Add to Favorites
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DogList;
