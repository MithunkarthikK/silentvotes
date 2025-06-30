import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/create">Create Poll</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
