// src/app/dashboard/products/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  createdAt: string;
}

export default function ProductsPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products/list');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/products/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, price: parseFloat(price) }),
    });

    if (res.ok) {
      const newProduct = await res.json();
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setName('');
      setDescription('');
      setPrice('');
      alert('Produto cadastrado com sucesso!');
    } else {
      alert('Erro ao cadastrar produto');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Gerenciamento de Produtos</h1>

      <div className="card mt-3" style={{ padding: '20px', backgroundColor: '#1E1E1E', color: '#13F287' }}>
        <h3>Cadastrar Produto</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descrição</label>
            <textarea
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Preço</label>
            <input
              type="number"
              className="form-control"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" style={{ backgroundColor: '#13F287' }}>
            Cadastrar Produto
          </button>
        </form>
      </div>

      <h2 className="mt-4">Lista de Produtos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="list-group mt-3">
          {products.map((product) => (
            <li key={product.id} className="list-group-item" style={{ backgroundColor: '#1E1E1E', color: '#13F287' }}>
              <h5>{product.name}</h5>
              <p>{product.description}</p>
              <strong>Preço: </strong>R$ {product.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
