import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import ProductList from './ProductList';
import { jwtDecode } from 'jwt-decode';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccess from './pages/PaymentSuccess';

interface JwtPayload {
  role?: string;
  [key: string]: any;
}

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const App: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('jwt');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwt = params.get('jwt');
    if (jwt) {
      localStorage.setItem('jwt', jwt);
      navigate('/products', { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (localStorage.getItem('jwt') && !username) {
      handleLogin();
    }
    // eslint-disable-next-line
  }, []);

  const handleLogin = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      try {
        const decoded = jwtDecode<JwtPayload>(jwt);
        setRole(decoded.role || null);
        setUsername(decoded.username || decoded.sub || null);
      } catch {
        setRole(null);
        setUsername(null);
      }
    } else {
      setRole(null);
      setUsername(null);
    }
    navigate('/products');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setRole(null);
    setUsername(null);
    navigate('/login');
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      let updated;
      if (existing) {
        updated = prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        updated = [...prev, { ...item, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCart(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, quantity } : i);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <nav>
        {!isLoggedIn && <button onClick={() => navigate('/register')}>Register</button>}
        {!isLoggedIn && <button onClick={() => navigate('/login')}>Login</button>}
        <button onClick={() => navigate('/products')}>Products</button>
        <button onClick={() => navigate('/cart')}>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>
        {isLoggedIn && <button onClick={() => navigate('/profile')}>Profile</button>}
        {isLoggedIn && <button onClick={() => navigate('/checkout')}>Checkout</button>}
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
      </nav>
      <hr />
      <Routes>
        <Route path="/register" element={<Register onRegistered={() => navigate('/login')} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/products" element={<ProductList role={role} addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} updateCartQuantity={updateCartQuantity} clearCart={clearCart} />} />
        <Route path="/profile" element={isLoggedIn ? <Profile username={username} /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={isLoggedIn ? <CheckoutPage cart={cart} clearCart={clearCart} /> : <Navigate to="/login" />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="*" element={<Navigate to="/products" />} />
      </Routes>
    </div>
  );
};

// Simple Profile component
const Profile: React.FC<{ username: string | null }> = ({ username }) => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!username) {
      setError('No username found in token.');
      return;
    }
    const jwt = localStorage.getItem('jwt');
    console.log('Fetching profile for username:', username);
    fetch(`http://localhost:8080/api/users/${encodeURIComponent(username)}`, {
      headers: { 'Authorization': `Bearer ${jwt}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => setUser(data))
      .catch(err => setError('Failed to load profile: ' + err));
  }, [username]);

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading profile...</div>;
  return (
    <div>
      <h2>Profile</h2>
      <div><b>Username:</b> {user.username}</div>
      <div><b>Email:</b> {user.email}</div>
      <div><b>Role:</b> {user.role}</div>
    </div>
  );
};

// Cart page component
const CartPage: React.FC<{
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}> = ({ cart, removeFromCart, updateCartQuantity, clearCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div>
      <h2>Cart</h2>
      {cart.length === 0 ? <div>Your cart is empty.</div> : (
        <ul>
          {cart.map(item => (
            <li key={item.id}>
              <b>{item.name}</b> (${item.price}) x
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => updateCartQuantity(item.id, parseInt(e.target.value) || 1)}
                style={{ width: 40, marginLeft: 4, marginRight: 4 }}
              />
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div><b>Total:</b> ${total.toFixed(2)}</div>
      {cart.length > 0 && <button onClick={clearCart}>Clear Cart</button>}
    </div>
  );
};

export default App;
