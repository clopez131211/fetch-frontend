import React, { memo } from "react";
import { useDogs, Dog } from "../../contexts/DogsContext";

export interface DogListProps {
  dogs: Dog[];
  loading: boolean;
  error: string | null;
}

const DogList: React.FC<DogListProps> = memo(({ dogs, loading, error }) => {
  const { favorites, addToFavorites, removeFromFavorites, locationsMap } = useDogs();

  const isFavorite = (dogId: string) => {
    return favorites.some((fav: Dog) => fav.id === dogId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (dogs.length === 0) return <div>No dogs found.</div>;

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

              {isFavorite(dog.id) ? (
                <button onClick={() => removeFromFavorites(dog.id)}>
                  Remove from Favorites
                </button>
              ) : (
                <button onClick={() => addToFavorites(dog)}>
                  Add to Favorites
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default DogList;