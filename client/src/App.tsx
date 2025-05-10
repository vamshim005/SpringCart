import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import ProductList from './ProductList';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role?: string;
  [key: string]: any;
}

const App: React.FC = () => {
  const [page, setPage] = useState<'register' | 'login' | 'products'>('register');
  const [role, setRole] = useState<string | null>(null);

  const handleLogin = () => {
    setPage('products');
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      try {
        const decoded = jwtDecode<JwtPayload>(jwt);
        setRole(decoded.role || null);
      } catch {
        setRole(null);
      }
    } else {
      setRole(null);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <nav>
        <button onClick={() => setPage('register')}>Register</button>
        <button onClick={() => setPage('login')}>Login</button>
        <button onClick={() => setPage('products')}>Products</button>
      </nav>
      <hr />
      {page === 'register' && <Register onRegistered={() => setPage('login')} />}
      {page === 'login' && <Login onLogin={handleLogin} />}
      {page === 'products' && <ProductList role={role} />}
    </div>
  );
};

export default App;
