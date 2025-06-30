import { Link, useNavigate } from 'react-router-dom';
export default function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <nav className="bg-indigo-700 text-white p-4 flex justify-between">
      <div className="flex gap-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/create" className="hover:underline">Create</Link>
        <Link to="/results" className="hover:underline">Results</Link>
      </div>
      <button onClick={logout} className="bg-white text-indigo-700 px-3 py-1 rounded">Logout</button>
    </nav>
  );
}
