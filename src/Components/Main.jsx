import React, { useState, useEffect, useRef } from 'react';

const Main = () => {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    setFavorites([]);
    setRecentSearches([]);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      const data = await res.json();
      if (data.meals) {
        setCategories(data.meals.map((cat) => cat.strCategory));
      }
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

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
    const trimmedQuery = query.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((search) => search.toLowerCase() !== trimmedQuery.toLowerCase());
      return [trimmedQuery, ...filtered].slice(0, 10);
    });
    setShowRecentSearches(false);
    await handleSearchWithTerm(trimmedQuery);
  };

  const handleSearchWithTerm = async (searchTerm) => {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
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

  const handleRecentSearchClick = (term) => {
    setQuery(term);
    setShowRecentSearches(false);
    handleSearchWithTerm(term);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setShowRecentSearches(false);
  };

  const removeRecentSearch = (term) => {
    setRecentSearches((prev) => prev.filter((s) => s !== term));
  };

  const toggleFavorite = (meal) => {
    const exists = favorites.find((fav) => fav.idMeal === meal.idMeal);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.idMeal !== meal.idMeal));
    } else {
      setFavorites([...favorites, meal]);
    }
  };

  const isFavorite = (meal) => favorites.some((fav) => fav.idMeal === meal.idMeal);

  const filteredMeals = selectedCategory
    ? meals.filter((meal) => meal.strCategory === selectedCategory)
    : meals;

  const handleDownload = (meal) => {
    const content = `Recipe: ${meal.strMeal}\n\nCategory: ${meal.strCategory}\n\nInstructions: ${meal.strInstructions}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${meal.strMeal}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🍽 Recipe Finder</h1>

      <div className="flex justify-center mb-4">
        <select
          className="border px-3 py-2 rounded focus:outline-none focus:ring"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

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
                <button onClick={clearRecentSearches} className="text-xs text-blue-500 hover:text-blue-700">
                  Clear All
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {recentSearches.map((term, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer group"
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    <div className="flex items-center flex-1">
                      <span className="text-gray-400 mr-2">🕒</span>
                      <span className="text-sm text-gray-700">{term}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(term);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-2"
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
        {filteredMeals.map((meal) => (
          <div key={meal.idMeal} className="bg-white p-4 rounded shadow relative">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{meal.strMeal}</h2>
            <p className="text-sm text-gray-600">Category: {meal.strCategory || selectedCategory}</p>
            <a
              href={meal.strSource || meal.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mt-2 inline-block"
            >
              View Recipe
            </a>
            <button
              onClick={() => handleDownload(meal)}
              className="text-green-600 mt-1 block text-sm"
            >
              ⬇ Download
            </button>
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
