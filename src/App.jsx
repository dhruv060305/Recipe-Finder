import "./App.css";
import Nav from "./Components/Nav";
import Main from "./Components/Main";
import About from "./Components/About";
import Fav from "./Components/Fav"; // <- import Fav

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (meal) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.idMeal === meal.idMeal);
      if (exists) {
        return prev.filter((fav) => fav.idMeal !== meal.idMeal);
      } else {
        return [...prev, meal];
      }
    });
  };

  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Main favorites={favorites} toggleFavorite={toggleFavorite} />} />
        <Route path="/about" element={<About />} />
        <Route path="/fav" element={<Fav favorites={favorites} toggleFavorite={toggleFavorite} />} />
      </Routes>
    </Router>
  );
}

export default App;
