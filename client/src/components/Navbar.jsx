import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi'; 
import logo from '/logo.svg'; 

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-indigo-700 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo + Brand */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">
            Silent<span className="text-yellow-300">Vote</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/dashboard" className="hover:text-yellow-300">Dashboard</Link>
          <Link to="/create" className="hover:text-yellow-300">Create Poll</Link>
          <Link to="/results" className="hover:text-yellow-300">Results</Link>
          <button
            onClick={logout}
            className="bg-yellow-300 text-indigo-800 font-semibold px-4 py-1.5 rounded-lg hover:bg-yellow-400 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 space-y-2 text-sm font-medium text-white px-2">
          <Link to="/dashboard" onClick={toggleMenu} className="block py-1 hover:text-yellow-300">Dashboard</Link>
          <Link to="/create" onClick={toggleMenu} className="block py-1 hover:text-yellow-300">Create Poll</Link>
          <Link to="/results" onClick={toggleMenu} className="block py-1 hover:text-yellow-300">Results</Link>
          <button
            onClick={() => {
              toggleMenu();
              logout();
            }}
            className="mt-2 w-full text-left bg-yellow-300 text-indigo-800 px-3 py-2 rounded-md hover:bg-yellow-400 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
