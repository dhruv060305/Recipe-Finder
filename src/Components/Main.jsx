import React, { useState, useEffect, useRef } from 'react';

const Main = () => {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  // Load favorites and recent searches from state on mount
  useEffect(() => {
    // Since we can't use localStorage, we'll start with empty arrays
    setFavorites([]);
    setRecentSearches([]);
  }, []);

  // Close recent searches when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowRecentSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add to recent searches (avoid duplicates and limit to 10)
    const trimmedQuery = query.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(search => search.toLowerCase() !== trimmedQuery.toLowerCase());
      return [trimmedQuery, ...filtered].slice(0, 10);
    });

    setShowRecentSearches(false);

    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.meals) {
        setMeals(data.meals);
        setError(null);
      } else {
        setMeals([]);
        setError('No meals found.');
      }
    } catch (err) {
      setError('Could not fetch meals. Please try again.');
    }
  };

  const handleRecentSearchClick = (searchTerm) => {
    setQuery(searchTerm);
    setShowRecentSearches(false);
    // Trigger search automatically
    handleSearchWithTerm(searchTerm);
  };

  const handleSearchWithTerm = async (searchTerm) => {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.meals) {
        setMeals(data.meals);
        setError(null);
      } else {
        setMeals([]);
        setError('No meals found.');
      }
    } catch (err) {
      setError('Could not fetch meals. Please try again.');
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setShowRecentSearches(false);
  };

  const removeRecentSearch = (searchToRemove) => {
    setRecentSearches(prev => prev.filter(search => search !== searchToRemove));
  };

  const toggleFavorite = (meal) => {
    const exists = favorites.find(fav => fav.idMeal === meal.idMeal);
    if (exists) {
      setFavorites(favorites.filter(fav => fav.idMeal !== meal.idMeal));
    } else {
      setFavorites([...favorites, meal]);
    }
  };

  const isFavorite = (meal) => {
    return favorites.some(fav => fav.idMeal === meal.idMeal);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🍽 Recipe Finder</h1>

      <div className="flex justify-center mb-6 relative" ref={searchRef}>
        <div className="flex relative">
          <input
            type="text"
            placeholder="Search meals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowRecentSearches(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            className="border px-4 py-2 w-64 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            Search
          </button>
          
          {showRecentSearches && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer group"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <div className="flex items-center flex-1">
                      <span className="text-gray-400 mr-2">🕒</span>
                      <span className="text-sm text-gray-700">{search}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(search);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-2"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <div key={meal.idMeal} className="bg-white p-4 rounded shadow relative">
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
              onClick={() => toggleFavorite(meal)}
              className="absolute top-2 right-2 text-xl"
              title="Save to Favorites"
            >
              {isFavorite(meal) ? '❤️' : '🤍'}
            </button>
          </div>
        ))}
      </div>

      {favorites.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">❤️ Favorite Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={fav.idMeal} className="bg-white p-4 rounded shadow">
                <img
                  src={fav.strMealThumb}
                  alt={fav.strMeal}
                  className="w-full h-48 object-cover rounded"
                />
                <h2 className="text-xl font-semibold mt-2">{fav.strMeal}</h2>
                <p className="text-sm text-gray-600">Category: {fav.strCategory}</p>
                <a
                  href={fav.strSource || fav.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 mt-2 inline-block"
                >
                  View Recipe
                </a>
                <button
                  onClick={() => toggleFavorite(fav)}
                  className="mt-2 text-red-500"
                >
                  Remove from Favorites
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;