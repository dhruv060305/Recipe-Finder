// Importing styles and components
import "./App.css";
import Nav from "./Components/Nav";
import Main from "./Components/Main";
import About from "./Components/About";
import Fav from "./Components/Fav";
import ShoppingList from './Components/ShoppingList';

// Importing routing tools and state hook
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  // State to store favorite meals across components
  const [favorites, setFavorites] = useState([]);

  // Function to toggle a meal as favorite or remove it from favorites
  const toggleFavorite = (meal) => {
    setFavorites((prev) => {
      // Check if meal is already in favorites
      const exists = prev.find((fav) => fav.idMeal === meal.idMeal);
      if (exists) {
        // If exists, remove it
        return prev.filter((fav) => fav.idMeal !== meal.idMeal);
      } else {
        // If not exists, add it
        return [...prev, meal];
      }
    });
  };

  return (
    // Router wrapper to handle navigation
    <Router basename="/Recipe-Finder">
      {/* Navigation bar visible on all pages */}
      <Nav />

      {/* Define application routes and their components */}
      <Routes>
        {/* Home page: Main component with favorites and toggleFavorite */}
        <Route
          path="/"
          element={<Main favorites={favorites} toggleFavorite={toggleFavorite} />}
        />

        {/* About page */}
        <Route path="/about" element={<About />} />

        {/* Favorites page: Pass favorites and toggle function */}
        <Route
          path="/fav"
          element={<Fav favorites={favorites} toggleFavorite={toggleFavorite} />}
        />

        {/* Shopping List page */}
        <Route path="/list" element={<ShoppingList />} />
      </Routes>
    </Router>
  );
}

export default App;
