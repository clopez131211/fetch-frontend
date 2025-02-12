import React, { useEffect, useState } from "react";
import { useDogs, Dog } from "../../contexts/DogsContext";
import { fetchDogsByIds } from "../../services/api";

const FavoritesPanel = (): JSX.Element => {
  const { favorites, removeFromFavorites, generateMatchFromFavorites } = useDogs();
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setFavoriteDogs([]);
        return;
      }
      try {
        const dogIds = favorites.map((fav) => fav.id);
        const dogs = await fetchDogsByIds(dogIds);
        setFavoriteDogs(dogs);
      } catch (err: any) {
        console.error("Fetch favorites failed:", err);
        setError("Failed to load favorites.");
      }
    };
    loadFavorites();
  }, [favorites, fetchDogsByIds, removeFromFavorites]);

  return (
    <div className="favorites-panel">
      <h3>Favorites ({favorites.length})</h3>
      {favoriteDogs.map((dog) => (
        <div key={dog.id} className="favorite-item">
          <span>{dog.name}</span>
          <button onClick={() => removeFromFavorites(dog.id)}>×</button>
        </div>
      ))}
      <button onClick={generateMatchFromFavorites} disabled={favorites.length === 0}>
        Generate Match!
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FavoritesPanel;
