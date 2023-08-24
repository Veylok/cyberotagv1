import React, { useState } from 'react';
import ApiService from '../../services/apiService';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await ApiService.post('/api/Auth/login', {
        username: username,
        password: password,
      });
  
      const token = response.accessToken;
      const decodedToken = jwtDecode(token);
  
      localStorage.setItem('token', token);
  
      if (decodedToken.role === 'Admin') {
        navigate('/home');
      } else if (decodedToken.role === 'User') {
        navigate('/userspending');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <input
        type="text"
        className="input-field"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="input-field"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
