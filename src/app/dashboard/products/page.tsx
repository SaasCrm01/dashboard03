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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/products/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (photo) formData.append('photo', photo);

    const res = await fetch('/api/products/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      alert('Produto cadastrado com sucesso!');
      fetchProducts(); // Atualiza a lista de produtos
      setName('');
      setDescription('');
      setPrice('');
      setPhoto(null);
    } else {
      alert('Erro ao cadastrar produto');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mt-4">Cadastro de Produto</h2>
      <form onSubmit={handleFormSubmit} className="mt-3">
        <div className="form-group">
          <label>Nome do Produto</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Preço</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Foto</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <button type="submit" className="btn btn-success mt-3">
          Cadastrar Produto
        </button>
      </form>

      <h2 className="mt-4">Lista de Produtos</h2>
      <ul className="list-group mt-3">
        {products.map((product) => (
          <li
            key={product.id}
            className="list-group-item"
            style={{ backgroundColor: '#1E1E1E', color: '#13F287' }}
          >
            <h5>{product.name}</h5>
            <p>{product.description}</p>
            <strong>Preço: </strong>R$ {product.price.toFixed(2)}
            {product.photo && (
              <img
                src={`/uploads/${product.photo}`}
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
