import { useState } from 'react';
import API from '../services/api';

import { useNavigate ,Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    alert('Login successful');
    navigate('/dashboard');
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 to-indigo-700">
        <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-4"> Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 mb-3 border rounded" /><br/><br/>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 mb-4 border rounded" /><br/><br/>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition" onClick={handleLogin}>Login</button>
          <h3 className="mt-4 text-center text-sm text-gray-600">Don't have an account?{" "}<Link to="/register" className="text-blue-600 font-medium hover:underline">Register here</Link></h3>
        </div>
      </div>
    </div>
  );
}
