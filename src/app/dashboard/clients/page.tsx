"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export default function ClientsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editClientId, setEditClientId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/clients/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setClients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/clients/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, phone }),
    });

    if (res.ok) {
      const newClient = await res.json();
      setClients((prevClients) => [...prevClients, newClient]);
      setName('');
      setEmail('');
      setPhone('');
      alert('Cliente cadastrado com sucesso!');
    } else {
      alert('Erro ao cadastrar cliente');
    }
  };

  const handleUpdateClient = async (clientId: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/clients/update/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, phone }),
    });

    if (res.ok) {
      const updatedClient = await res.json();
      setClients((prevClients) =>
        prevClients.map((client) => (client.id === clientId ? updatedClient : client))
      );
      setEditMode(false);
      setEditClientId(null);
      setName('');
      setEmail('');
      setPhone('');
      alert('Cliente atualizado com sucesso!');
    } else {
      alert('Erro ao atualizar cliente');
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/clients/delete/${clientId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== clientId)
      );
      alert('Cliente excluído com sucesso!');
    } else {
      alert('Erro ao excluir cliente');
    }
  };

  const handleEdit = (client: Client) => {
    setEditMode(true);
    setEditClientId(client.id);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone || '');
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gerenciamento de Clientes</h1>

      <div className="row">
        <div className="col-12 col-lg-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h4>{editMode ? 'Editar Cliente' : 'Cadastrar Cliente'}</h4>
            </div>
            <div className="card-body">
              <form
                onSubmit={
                  editMode
                    ? (e) => {
                      e.preventDefault();
                      handleUpdateClient(editClientId!);
                    }
                    : handleSubmit
                }
              >
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nome
                  </label>
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
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
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
                  <label htmlFor="phone" className="form-label">
                    Telefone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: '#13F287' }}
                >
                  {editMode ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
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
            <span style={{ fontSize: '14px' }}>Total de Clientes:</span>
            <h2 style={{ margin: '0', fontSize: '100px' }}>{clients.length}</h2>
          </div>
        </div>
      </div>

      <h2 className="mt-4">Clientes Cadastrados</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped clients-table">
            <thead>
              <tr>
                <th className="d-none d-md-table-cell">ID</th>
                <th>Nome</th>
                <th className="d-none d-md-table-cell">Email</th>
                <th className="d-none d-md-table-cell">Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="d-none d-md-table-cell">{client.id}</td>
                  <td>{client.name}</td>
                  <td className="d-none d-md-table-cell">{client.email}</td>
                  <td className="d-none d-md-table-cell">{client.phone}</td>
                  <td>
                    <button
                      className="btn"
                      style={{ backgroundColor: '#13F287', marginRight: '10px' }}
                      onClick={() => handleEdit(client)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn"
                      style={{ backgroundColor: '#1E1E1E', color: '#FFFFFF' }}
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
