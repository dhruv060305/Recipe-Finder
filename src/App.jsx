import "./App.css";
import Nav from "./Components/Nav";
import Main from "./Components/Main";
import About from "./Components/About";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      

      <Router>
        <Nav></Nav>
        <Routes>
          <Route path="/" element={<Main />} /> 
          <Route path="/about" element={<About />} />
        </Routes>  

      </Router>
    </>
  );
}

export default App;
