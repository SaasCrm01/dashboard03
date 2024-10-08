'use client';

import { useState, useEffect } from 'react';

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
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null); // Para edição
  const [loading, setLoading] = useState(true);

  // Fetch sellers from API
  useEffect(() => {
    const fetchSellers = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/sellers/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setSellers(data);
      setLoading(false);
    };

    fetchSellers();
  }, []);

  // Submit form to add or update a seller
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (editingSeller) {
      // Atualizar vendedor
      console.log("ID do vendedor para atualização:", editingSeller.id); // Log do ID do vendedor

      const res = await fetch('/api/sellers/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: editingSeller.id, name, email, password }),
      });

      if (res.ok) {
        const updatedSeller = await res.json();
        setSellers((prevSellers) =>
          prevSellers.map((seller) =>
            seller.id === updatedSeller.id ? updatedSeller : seller
          )
        );
        setEditingSeller(null);
        setName('');
        setEmail('');
        setPassword('');
        alert('Vendedor atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar vendedor');
      }
    } else {
      // Adicionar novo vendedor
      const res = await fetch('/api/sellers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        const newSeller = await res.json();
        setSellers([...sellers, newSeller]);
        setName('');
        setEmail('');
        setPassword('');
        alert('Vendedor cadastrado com sucesso!');
      } else {
        alert('Erro ao cadastrar vendedor');
      }
    }
  };

  // Handle edit seller
  const handleEdit = (seller: Seller) => {
    setEditingSeller(seller);
    setName(seller.name);
    setEmail(seller.email);
  };

  // Handle delete seller
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
      setSellers(sellers.filter((seller) => seller.id !== id));
      alert('Vendedor excluído com sucesso!');
    } else {
      alert('Erro ao excluir vendedor');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gerenciamento de Vendedores</h1>

      {/* Formulário de Cadastro / Edição */}
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
                required={!editingSeller} // Senha só é necessária no cadastro
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingSeller ? 'Atualizar Vendedor' : 'Cadastrar Vendedor'}
            </button>
          </form>
        </div>
      </div>

      {/* Lista de Vendedores */}
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
