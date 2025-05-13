import React, { useEffect, useState } from 'react';
import type { CartItem } from './App'; // adjust the import path as needed

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

interface ProductListProps {
  role: string | null;
  addToCart?: (product: CartItem) => void;
}

const ProductList: React.FC<ProductListProps> = ({ role, addToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', imageUrl: '' });
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});

  const fetchProducts = async () => {
    const jwt = localStorage.getItem('jwt');
    const params = new URLSearchParams();
    if (search) params.append('name', search);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);
    const fetchOptions = jwt ? { headers: { 'Authorization': `Bearer ${jwt}` } } : {};
    const res = await fetch(`
      http://localhost:8080/api/products?${params.toString()}`, fetchOptions);
    if (res.ok) {
      setProducts(await res.json());
    } else {
      setMessage('Failed to fetch products.');
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [search, minPrice, maxPrice, sortBy, order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const jwt = localStorage.getItem('jwt');
    const res = await fetch('http://localhost:8080/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        imageUrl: form.imageUrl
      })
    });
    if (res.ok) {
      setMessage('Product created!');
      setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' });
      fetchProducts();
    } else {
      setMessage('Failed to create product.');
    }
  };

  const handleDelete = async (id: number) => {
    const jwt = localStorage.getItem('jwt');
    const res = await fetch(`http://localhost:8080/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${jwt}` }
    });
    if (res.ok) {
      setMessage('Product deleted!');
      fetchProducts();
    } else {
      setMessage('Failed to delete product.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || ''
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;
    const jwt = localStorage.getItem('jwt');
    const res = await fetch(`http://localhost:8080/api/products/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        imageUrl: form.imageUrl
      })
    });
    if (res.ok) {
      setMessage('Product updated!');
      setEditingId(null);
      setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' });
      fetchProducts();
    } else {
      setMessage('Failed to update product.');
    }
  };

  const handleAddToCart = (product: Product) => {
    if (addToCart) {
      addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 });
      setCartQuantities(prev => ({ ...prev, [product.id]: 1 }));
    }
  };

  const handleIncrementQuantity = (productId: number) => {
    setCartQuantities(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const handleDecrementQuantity = (productId: number) => {
    setCartQuantities(prev => {
      const newQuantity = (prev[productId] || 0) - 1;
      if (newQuantity <= 0) {
        const newQuantities = { ...prev };
        delete newQuantities[productId];
        return newQuantities;
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Product List</h2>
      {message && <div className="mb-4 text-red-600 font-semibold">{message}</div>}
      <div className="flex flex-wrap justify-center gap-5 bg-gray-50 border rounded-2xl shadow-sm px-8 py-5 mb-12">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-10 w-44 rounded-md border border-gray-300 px-3 text-sm placeholder:text-gray-400"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="h-10 w-44 rounded-md border border-gray-300 px-3 text-sm placeholder:text-gray-400"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="h-10 w-44 rounded-md border border-gray-300 px-3 text-sm placeholder:text-gray-400"
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="h-10 w-44 rounded-md border border-gray-300 px-3 text-sm placeholder:text-gray-400">
          <option value="id">Sort By</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
        <select value={order} onChange={e => setOrder(e.target.value)} className="h-10 w-44 rounded-md border border-gray-300 px-3 text-sm placeholder:text-gray-400">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))] w-full">
        {products.map(p => (
          <div
            key={p.id}
            className="flex flex-col bg-white rounded-2xl shadow p-6 hover:shadow-lg transition transform hover:-translate-y-1 w-full h-full"
          >
            <div className="w-full h-40 flex items-center justify-center mb-6">
              <img
                src={p.imageUrl || 'https://via.placeholder.com/200x150?text=Product'}
                alt={p.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex flex-col items-center space-y-1 mb-6">
              <h3 className="text-base font-semibold text-center line-clamp-2">{p.name}</h3>
              <p className="text-lg font-bold text-red-700 text-center">${p.price.toFixed(2)}</p>
              <p className={`${p.stock > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} text-xs font-medium px-2 py-0.5 rounded-full text-center`}>{p.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
            </div>
            {addToCart && (
              <div className="mt-auto">
                {cartQuantities[p.id] ? (
                  <div className="quantity-controls grid grid-cols-3 gap-2 w-full">
                    <button
                      onClick={() => handleDecrementQuantity(p.id)}
                      className="h-9 rounded-full bg-yellow-400 hover:bg-yellow-500 font-bold"
                    >-</button>
                    <span className="text-center font-bold">{cartQuantities[p.id]}</span>
                    <button
                      onClick={() => handleIncrementQuantity(p.id)}
                      className="h-9 rounded-full bg-yellow-400 hover:bg-yellow-500 font-bold"
                    >+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="add-to-cart bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-full w-full"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {role === 'ADMIN' && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h3>
          <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-4">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
            <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
            <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
            <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' }); }} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">Cancel</button>}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductList; 
