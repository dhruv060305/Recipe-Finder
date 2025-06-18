import React from "react";

// Functional component to display favorite recipes
const Fav = ({ favorites = [], toggleFavorite }) => {
  return (
    // Container with styling for light/dark mode
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-800 dark:text-white">
      
      {/* Heading */}
      <h1 className="text-3xl font-bold text-center mb-6">❤️ Favorite Recipes</h1>

      {/* If no favorite recipes, show a message */}
      {favorites.length === 0 ? (
        <p className="text-center">No favorite recipes yet.</p>
      ) : (
        // Grid layout for displaying favorite recipe cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((meal) => (
            <div
              key={meal.idMeal}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow relative"
            >
              {/* Meal image */}
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-48 object-cover rounded"
              />

              {/* Meal name */}
              <h2 className="text-xl font-semibold mt-2">{meal.strMeal}</h2>

              {/* Meal category */}
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Category: {meal.strCategory}
              </p>

              {/* Link to recipe source or YouTube */}
              <a
                href={meal.strSource || meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 mt-2 inline-block"
              >
                View Recipe
              </a>

              {/* Button to remove recipe from favorites */}
              <button
                onClick={() => toggleFavorite(meal)}
                className="absolute top-2 right-2 text-xl"
                title="Remove from Favorites"
              >
                ❤️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fav;
