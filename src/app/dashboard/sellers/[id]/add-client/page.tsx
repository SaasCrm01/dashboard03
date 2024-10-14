// src/app/dashboard/sellers/[id]/add-client/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css'; // Certifique-se de que o Bootstrap está sendo carregado

interface Client {
  id: number;
  name: string;
  email: string;
  seller: Seller | null;
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

  // Função auxiliar para obter o token armazenado
  const getToken = () => {
    return localStorage.getItem('token'); // Certifique-se de que o token está armazenado no localStorage após o login
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      // Carregar vendedores
      const resSellers = await fetch('/api/sellers/list', {
        headers: {
          'Authorization': `Bearer ${token}` // Envia o token JWT no cabeçalho
        }
      });

      if (resSellers.ok) {
        const sellersData = await resSellers.json();
        if (Array.isArray(sellersData)) setSellers(sellersData);
      } else {
        alert('Erro ao carregar vendedores');
      }

      // Carregar clientes
      const resClients = await fetch('/api/clients-with-sellers', {
        headers: {
          'Authorization': `Bearer ${token}` // Envia o token JWT no cabeçalho
        }
      });

      if (resClients.ok) {
        const clientsData = await resClients.json();
        if (Array.isArray(clientsData)) setClients(clientsData);
      } else {
        alert('Erro ao carregar clientes');
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
        'Authorization': `Bearer ${token}` // Envia o token JWT no cabeçalho
      },
      body: JSON.stringify({ clientId: selectedClient }),
    });

    if (res.ok) {
      alert('Cliente associado com sucesso!');
      router.refresh();
    } else {
      alert('Erro ao associar cliente.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Gerenciamento de Clientes e Vendedores</h1>
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
              {clients
                .filter((client) => !client.seller) // Filtrar clientes que não têm um vendedor associado
                .map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.email}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Associar Cliente</button>
      </form>

      <div className="row">
        <div className="col">
          <h2>Vendedores e Clientes Associados</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Vendedor</th>
                <th>Clientes</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => {
                const associatedClients = clients.filter(client => client.seller?.id === seller.id);
                return (
                  <tr key={seller.id}>
                    <td>{seller.name}</td>
                    <td>
                      {associatedClients.length > 0 ? (
                        <ul>
                          {associatedClients.map((client) => (
                            <li key={client.id}>
                              {client.name} - {client.email}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>Sem clientes</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
