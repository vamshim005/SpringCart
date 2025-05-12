import React, { useState } from 'react';

const Register: React.FC<{ onRegistered: () => void }> = ({ onRegistered }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    if (res.ok) {
      setMessage('Registration successful! Please log in.');
      setUsername(''); setPassword(''); setEmail('');
      onRegistered();
    } else {
      const text = await res.text();
      if (text.toLowerCase().includes('exists')) {
        setMessage('You are already registered. Please log in instead.');
        setShowLogin(true);
      } else {
        setMessage(text);
        setShowLogin(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
      <button
        type="button"
        style={{ marginTop: 16, background: '#fff', border: '1px solid #ccc', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
        onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
      >
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" style={{ width: 18, marginRight: 8, verticalAlign: 'middle' }} />
        Sign up with Google
      </button>
      <div>{message}</div>
      {showLogin && (
        <button type="button" onClick={onRegistered} style={{ marginTop: 8 }}>
          Go to Login
        </button>
      )}
    </form>
  );
};

export default Register; 