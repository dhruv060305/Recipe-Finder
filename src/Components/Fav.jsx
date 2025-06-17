import React, { useEffect, useState } from 'react';

const Fav = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(saved);
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter(fav => fav.idMeal !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  if (favorites.length === 0) {
    return <p className="text-center mt-10 text-gray-600">No favorite recipes yet.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">❤️ Favorite Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favorites.map((meal) => (
          <div key={meal.idMeal} className="bg-white p-4 rounded shadow">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{meal.strMeal}</h2>
            <p className="text-sm text-gray-600">Category: {meal.strCategory}</p>
            <a
              href={meal.strSource || meal.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mt-2 inline-block"
            >
              View Recipe
            </a>
            <button
              onClick={() => removeFavorite(meal.idMeal)}
              className="mt-2 text-red-600 hover:text-red-800 block"
            >
              Remove from Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fav;
