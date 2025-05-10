import React, { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');

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

  return (
    <div>
      <h2>Product List</h2>
      {message && <div>{message}</div>}
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <b>{p.name}</b>: {p.description} (${p.price}) [Stock: {p.stock}]
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList; 