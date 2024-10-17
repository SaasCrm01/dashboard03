"use client";

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

      <div className="row">
        <div className="col-12 col-lg-8 mb-4">
          <div className="card">
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
                <button type="submit" className="btn" style={{ backgroundColor: '#13F287' }}>
                  {editingSeller ? 'Atualizar Vendedor' : 'Cadastrar Vendedor'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div
            className="card text-center"
            style={{
              backgroundColor: '#1E1E1E',
              color: '#13F287',
              borderRadius: '8px',
              padding: '20px',
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '14px' }}>Total de Vendedores:</span>
            <h2 style={{ margin: '0', fontSize: '100px' }}>{sellers.length}</h2>
          </div>
        </div>
      </div>

      <h2 className="mb-3">Vendedores Cadastrados</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="table table-striped sellers-table">
          <thead>
            <tr>
              <th className="d-none d-md-table-cell">ID</th>
              <th>Nome</th>
              <th className="d-none d-md-table-cell">Email</th>
              <th>Ações</th> {/* Certifique-se de que essa coluna esteja sempre visível */}
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id}>
                <td className="d-none d-md-table-cell">{seller.id}</td>
                <td>{seller.name}</td>
                <td className="d-none d-md-table-cell">{seller.email}</td>
                <td>
                  <button
                    onClick={() => handleEdit(seller)}
                    className="btn"
                    style={{ backgroundColor: '#13F287', marginRight: '10px' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(seller.id)}
                    className="btn"
                    style={{ backgroundColor: '#1E1E1E', color: '#FFFFFF' }}
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
