'use client';

import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importação do Bootstrap

interface Seller {
  id: number;
  name: string;
  email: string;
}

export default function SellersPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/sellers/list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSellers(data.filter((seller: any) => seller.role === 'SELLER'));
        } else {
          console.error('Erro: A resposta da API não é uma lista.');
          setSellers([]);
        }
      } else {
        console.error(`Erro ao buscar vendedores: ${res.status}`);
        alert('Erro ao carregar vendedores');
      }
      setLoading(false);
    };

    fetchSellers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingSeller ? '/api/sellers/update' : '/api/sellers/create';
    const method = editingSeller ? 'PUT' : 'POST';
    const body = JSON.stringify({ id: editingSeller?.id, name, email, password });

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    if (res.ok) {
      const sellerData = await res.json();
      if (editingSeller) {
        setSellers((prev) =>
          prev.map((seller) => (seller.id === sellerData.id ? sellerData : seller))
        );
        setEditingSeller(null);
      } else {
        setSellers((prev) => [...prev, sellerData]);
      }
      setName('');
      setEmail('');
      setPassword('');
      alert('Operação bem-sucedida!');
    } else {
      alert('Erro na operação');
    }
  };

  const handleEdit = (seller: Seller) => {
    setEditingSeller(seller);
    setName(seller.name);
    setEmail(seller.email);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/sellers/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setSellers((prev) => prev.filter((seller) => seller.id !== id));
      alert('Vendedor excluído com sucesso!');
    } else {
      alert('Erro ao excluir vendedor');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gerenciamento de Vendedores</h1>

      <div className="card mb-4">
        <div className="card-header">
          <h4>{editingSeller ? 'Editar Vendedor' : 'Cadastrar Vendedor'}</h4>
        </div>
        <div className="card-body">
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
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!editingSeller}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingSeller ? 'Atualizar Vendedor' : 'Cadastrar Vendedor'}
            </button>
          </form>
        </div>
      </div>

      <h2 className="mb-3">Vendedores Cadastrados</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id}>
                <td>{seller.id}</td>
                <td>{seller.name}</td>
                <td>{seller.email}</td>
                <td>
                  <button
                    onClick={() => handleEdit(seller)}
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(seller.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
