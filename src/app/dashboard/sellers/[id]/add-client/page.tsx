"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Client {
  id: number;
  name: string;
  email: string;
  seller: Seller | null;  // Incluímos o vendedor associado, se houver
}

interface Seller {
  id: number;
  name: string;
}

export default function ClientSellerManagement() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const router = useRouter();

  const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      try {
        // Carregar vendedores
        const resSellers = await fetch('/api/sellers/list', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (resSellers.ok) {
          const sellersData = await resSellers.json();
          setSellers(sellersData);
        } else {
          alert('Erro ao carregar vendedores');
        }

        // Carregar clientes
        const resClients = await fetch('/api/clients-with-sellers', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (resClients.ok) {
          const clientsData = await resClients.json();
          setClients(clientsData);
        } else {
          alert('Erro ao carregar clientes');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados.');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

    const res = await fetch(`/api/sellers/${selectedSeller}/add-client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ clientId: selectedClient }),
    });

    if (res.ok) {
      alert('Cliente associado com sucesso!');
      router.refresh();
    } else {
      const errorData = await res.json();
      alert(`Erro ao associar cliente: ${errorData.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Gerenciamento de Clientes e Vendedores</h1>

      {/* Formulário para associar cliente a vendedor */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Escolha um Vendedor</label>
            <select
              className="form-select"
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              required
            >
              <option value="" disabled>Selecione um vendedor</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Escolha um Cliente</label>
            <select
              className="form-select"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              required
            >
              <option value="" disabled>Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn" style={{ backgroundColor: '#13F287' }}>Associar Cliente</button>
      </form>

      {/* Tabela de clientes associados */}
      <h2>Clientes Associados</h2>
      <table className="table table-bordered mt-4 client-seller-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Email</th>
            <th>Vendedor Responsável</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.seller ? client.seller.name : 'Nenhum vendedor'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
