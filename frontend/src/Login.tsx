import React, { useState } from 'react';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('//api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      console.log('Login response:', data);
      localStorage.setItem('jwt', data.token);
      setMessage('Login successful!');
      onLogin();
    } else {
      setMessage('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="border rounded px-3 py-2" />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="border rounded px-3 py-2" />
        <button type="submit" className="bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600">Login</button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 border py-2 rounded bg-white hover:bg-gray-100"
          onClick={() => window.location.href = '/oauth2/authorization/google'}
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="w-5 h-5" />
          Sign in with Google
        </button>
        <div className="text-center text-red-500">{message}</div>
      </form>
    </div>
  );
};

export default Login; 
