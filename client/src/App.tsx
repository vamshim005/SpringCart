import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import ProductList from './ProductList';

const App: React.FC = () => {
  const [page, setPage] = useState<'register' | 'login' | 'products'>('register');

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <nav>
        <button onClick={() => setPage('register')}>Register</button>
        <button onClick={() => setPage('login')}>Login</button>
        <button onClick={() => setPage('products')}>Products</button>
      </nav>
      <hr />
      {page === 'register' && <Register onRegistered={() => setPage('login')} />}
      {page === 'login' && <Login onLogin={() => setPage('products')} />}
      {page === 'products' && <ProductList />}
    </div>
  );
};

export default App;
