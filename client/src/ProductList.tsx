import React, { useEffect, useState } from 'react';

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
  addToCart?: (product: { id: number; name: string; price: number }) => void;
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

  const fetchProducts = async () => {
    const jwt = localStorage.getItem('jwt');
    const params = new URLSearchParams();
    if (search) params.append('name', search);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);
    const fetchOptions = jwt ? { headers: { 'Authorization': `Bearer ${jwt}` } } : {};
    const res = await fetch(`http://localhost:8080/api/products?${params.toString()}`, fetchOptions);
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

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 0' }}>
      <h2 style={{ textAlign: 'left', color: '#232f3e', fontWeight: 700, fontSize: '2.1em', marginBottom: 8 }}>Product List</h2>
      {message && <div style={{ marginBottom: 12, color: '#b12704', fontWeight: 600 }}>{message}</div>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        background: '#f3f3f3',
        borderRadius: 10,
        padding: '18px 18px 10px 18px',
        marginBottom: 24,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginRight: 8, padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: '1em', minWidth: 180 }}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          style={{ marginRight: 8, padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: '1em', width: 120 }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          style={{ marginRight: 8, padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: '1em', width: 120 }}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ marginRight: 8, padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: '1em' }}>
          <option value="id">Sort By</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
        <select value={order} onChange={e => setOrder(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: '1em' }}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="product-grid">
        {products.map(p => (
          <div className="product-card" key={p.id}>
            <img
              src={p.imageUrl || "https://via.placeholder.com/200x150?text=Product"}
              alt={p.name}
              className="product-image"
            />
            <h3>{p.name}</h3>
            <p>${p.price.toFixed(2)}</p>
            <span className={`stock-badge${p.stock === 0 ? ' out' : ''}`}>{p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
            {addToCart && (
              <button onClick={() => addToCart({ id: p.id, name: p.name, price: p.price })}>
                Add to Cart
              </button>
            )}
            {role === 'ADMIN' && (
              <span style={{ marginTop: 8 }}>
                <button style={{ marginRight: 6 }} onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </span>
            )}
          </div>
        ))}
      </div>
      {role === 'ADMIN' && (
        <div>
          <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
            <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required />
            <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} required />
            <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' }); }}>Cancel</button>}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductList; 