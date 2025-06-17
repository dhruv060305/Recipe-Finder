import React, { useState } from 'react';
import { Link } from "react-router-dom";
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">Recipe Finder</div>
                <div className="block lg:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        {isOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
                <div className={`lg:flex lg:items-center ${isOpen ? 'block' : 'hidden'}`}>
                    <Link to="/" className="text-white px-4 py-2">Home</Link>
                    <Link to="/about" className="text-white px-4 py-2">About</Link>
                    
                    
                </div>
            </div>
        </nav>
    );
};

export default Navbar;  