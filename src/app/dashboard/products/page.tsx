// src/app/dashboard/products/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  photo?: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/products/list', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  return (
    <div className="container mt-4">
      <h2 className="mt-4">Lista de Produtos</h2>
      <ul className="list-group mt-3">
        {products.map((product) => (
          <li key={product.id} className="list-group-item" style={{ backgroundColor: '#1E1E1E', color: '#13F287' }}>
            <h5>{product.name}</h5>
            <p>{product.description}</p>
            <strong>Preço: </strong>R$ {product.price.toFixed(2)}
            {product.photo && (
              <img 
                src={`/uploads/${product.photo}`} // Corrige o caminho para a pasta pública
                alt={product.name} 
                width="100" 
                style={{ marginTop: '10px' }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
