import React, { useContext, useEffect, useState } from "react";
import { useDogs } from "../../contexts/DogsContext";
import { fetchDogsByIds } from "../../services/api";

const FavoritesPanel = () => {
  const { favorites, removeFavorite, handleGenerateMatch } = useDogs();
  const [favoriteDogs, setFavoriteDogs] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setFavoriteDogs([]);
        return;
      }
      try {
        const dogs = await fetchDogsByIds(favorites);
        setFavoriteDogs(dogs);
      } catch (err) {
        console.error("Fetch favorites failed:", err);
        setError("Failed to load favorites.");
      }
    };
    loadFavorites();
  }, [favorites]);

  return (
    <div className="favorites-panel">
      <h3>Favorites ({favorites.length})</h3>
      {favoriteDogs.map((dog) => (
        <div key={dog.id} className="favorite-item">
          <span>{dog.name}</span>
          <button onClick={() => removeFavorite(dog.id)}>×</button>
        </div>
      ))}
      <button onClick={handleGenerateMatch} disabled={favorites.length === 0}>
        Generate Match!
      </button>
    </div>
  );
};

export default FavoritesPanel;
