import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo / Title */}
        <div className="text-2xl font-bold tracking-tight text-white hover:text-indigo-100 transition">
          <Link to="/dashboard">Silent<span className="text-yellow-300">Votes</span></Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center text-sm font-medium">
          <Link to="/dashboard" className="hover:text-yellow-300 transition duration-150">Dashboard</Link>
          <Link to="/create" className="hover:text-yellow-300 transition duration-150">Create Poll</Link>
          <Link to="/results" className="hover:text-yellow-300 transition duration-150">Results</Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-yellow-300 text-indigo-800 font-semibold px-4 py-1.5 rounded-lg hover:bg-yellow-400 transition duration-150"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
