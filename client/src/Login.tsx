import React, { useState } from 'react';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('jwt', data.token);
      setMessage('Login successful!');
      onLogin();
    } else {
      setMessage('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
      <div>{message}</div>
    </form>
  );
};

export default Login; 