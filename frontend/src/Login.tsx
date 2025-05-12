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
    <>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <div>{message}</div>
      </form>
      <button
        type="button"
        style={{ marginTop: 16, background: '#fff', border: '1px solid #ccc', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
        onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
      >
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" style={{ width: 18, marginRight: 8, verticalAlign: 'middle' }} />
        Sign in with Google
      </button>
    </>
  );
};

export default Login; 