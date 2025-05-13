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
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));

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
        setIsLoggedIn(true);
      } catch {
        setRole(null);
        setUsername(null);
        setIsLoggedIn(false);
      }
    } else {
      setRole(null);
      setUsername(null);
      setIsLoggedIn(false);
    }
    navigate('/products');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setRole(null);
    setUsername(null);
    setIsLoggedIn(false);
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
    <div className="w-full min-h-screen bg-white">
      <nav className="w-full bg-gradient-to-r from-[#FF9900] to-[#E24329] py-4 shadow-md">
        <div className="flex justify-center items-center gap-12">
          <button onClick={() => navigate('/products')} className="text-white text-lg font-extrabold tracking-wide hover:text-yellow-200 transition-colors focus:outline-none">Products</button>
          <button onClick={() => navigate('/cart')} className="text-white text-lg font-extrabold tracking-wide hover:text-yellow-200 transition-colors focus:outline-none">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>
          {isLoggedIn && <button onClick={() => navigate('/profile')} className="text-white text-lg font-extrabold tracking-wide hover:text-yellow-200 transition-colors focus:outline-none">Profile</button>}
          {isLoggedIn && <button onClick={() => navigate('/checkout')} className="text-white text-lg font-extrabold tracking-wide hover:text-yellow-200 transition-colors focus:outline-none">Checkout</button>}
          {isLoggedIn && <button onClick={handleLogout} className="text-white text-lg font-extrabold tracking-wide hover:text-yellow-200 transition-colors focus:outline-none">Logout</button>}
          {!isLoggedIn && <button onClick={() => navigate('/login')} className="text-white text-lg font-extrabold tracking-wide hover:text-yellow-200 transition-colors focus:outline-none">Login</button>}
          {!isLoggedIn && <button onClick={() => navigate('/register')} className="text-white text-lg font-extrabold tracking-wide hover:text-yellow-200 transition-colors focus:outline-none">Register</button>}
        </div>
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

// Profile component
const Profile: React.FC<{ username: string | null }> = ({ username }) => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!username) {
      setError('No username found in token.');
      return;
    }
    const jwt = localStorage.getItem('jwt');
    fetch(`http://localhost:8080/api/users/${encodeURIComponent(username)}`, {
      headers: { 'Authorization': `Bearer ${jwt}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => setUser(data))
      .catch(err => setError('Failed to load profile: ' + err));
  }, [username]);

  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!user) return <div className="text-center mt-8">Loading profile...</div>;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="flex items-center bg-white rounded-xl shadow-lg p-8 mt-8">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=FF9900&color=fff&rounded=true`}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-orange-300 shadow-md mr-8"
        />
        <div>
          <div className="text-2xl font-bold mb-2">{user.username}</div>
          <div className="text-gray-600 mb-1"><b>Email:</b> {user.email}</div>
          <div className="text-gray-600"><b>Role:</b> {user.role}</div>
        </div>
      </div>
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
    <div className="flex flex-col items-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 mt-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Cart</h2>
        {cart.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <ul className="divide-y">
            {cart.map(item => (
              <li key={item.id} className="flex items-center justify-between py-4">
                <div>
                  <span className="font-semibold">{item.name}</span>
                  <span className="ml-2 text-gray-500">${item.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateCartQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-16 border rounded px-2 py-1"
                  />
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex justify-between items-center">
          <span className="font-bold text-lg">Total: ${total.toFixed(2)}</span>
          {cart.length > 0 && (
            <button onClick={clearCart} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Clear Cart</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
