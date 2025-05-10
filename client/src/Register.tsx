import React, { useState } from 'react';

const Register: React.FC<{ onRegistered: () => void }> = ({ onRegistered }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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
      setMessage(text);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
      <div>{message}</div>
    </form>
  );
};

export default Register; 