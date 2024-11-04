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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/products/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (photo) formData.append('photo', photo);

    const res = await fetch('/api/products/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      const newProduct = await res.json();
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setName('');
      setDescription('');
      setPrice('');
      setPhoto(null);
      alert('Produto cadastrado com sucesso!');
    } else {
      const errorData = await res.json();
      alert(errorData.message || 'Erro ao cadastrar produto');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Gerenciamento de Produtos</h1>

      <div className="card mt-3" style={{ padding: '20px', backgroundColor: '#1E1E1E', color: '#13F287' }}>
        <h3>Cadastrar Produto</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <div className="mb-3">
            <label htmlFor="photo" className="form-label">Foto do Produto</label>
            <input
              type="file"
              className="form-control"
              id="photo"
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
              accept="image/*"
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
              {product.photo && (
                <img 
                src={`/api/uploads/${product.photo}`} // Usando a rota API
                alt={product.name} 
                width="100" 
                style={{ marginTop: '10px' }}
              />
              
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
