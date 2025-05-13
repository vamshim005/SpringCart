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
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="border rounded px-3 py-2" />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border rounded px-3 py-2" />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="border rounded px-3 py-2" />
        <button type="submit" className="bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600">Register</button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 border py-2 rounded bg-white hover:bg-gray-100"
          onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="w-5 h-5" />
          Sign up with Google
        </button>
        <div className="text-center text-red-500">{message}</div>
        {showLogin && (
          <button type="button" onClick={onRegistered} className="mt-2 text-blue-600 hover:underline">Go to Login</button>
        )}
      </form>
    </div>
  );
};

export default Register; 