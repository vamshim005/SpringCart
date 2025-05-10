import React, { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductListProps {
  role: string | null;
}

const ProductList: React.FC<ProductListProps> = ({ role }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      const jwt = localStorage.getItem('jwt');
      const res = await fetch('http://localhost:8080/api/products', {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      if (res.ok) {
        setProducts(await res.json());
      } else {
        setMessage('Failed to fetch products.');
      }
    };
    fetchProducts();
  }, []);

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
        stock: parseInt(form.stock)
      })
    });
    if (res.ok) {
      setMessage('Product created!');
      setForm({ name: '', description: '', price: '', stock: '' });
      setProducts(await res.json());
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
      setProducts(products.filter(p => p.id !== id));
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
      stock: product.stock.toString()
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
        stock: parseInt(form.stock)
      })
    });
    if (res.ok) {
      setMessage('Product updated!');
      setEditingId(null);
      setForm({ name: '', description: '', price: '', stock: '' });
      setProducts(await res.json());
    } else {
      setMessage('Failed to update product.');
    }
  };

  return (
    <div>
      <h2>Product List</h2>
      {message && <div>{message}</div>}
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <b>{p.name}</b>: {p.description} (${p.price}) [Stock: {p.stock}]
            {role === 'ADMIN' && (
              <span>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </span>
            )}
          </li>
        ))}
      </ul>
      {role === 'ADMIN' && (
        <div>
          <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
            <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required />
            <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} required />
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', stock: '' }); }}>Cancel</button>}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductList; 