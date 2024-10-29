// src/app/dashboard/clients/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  seller?: { name: string };
}

export default function ClientDetailPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams(); // Pega o ID do cliente da URL

  useEffect(() => {
    const fetchClient = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Erro ao buscar cliente');
        }
        const data = await res.json();
        setClient(data);
      } catch (error) {
        console.error(error);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!client) return <p>Cliente não encontrado.</p>;

  return (
    <div className="container mt-4">
      <h1>Detalhes do Cliente</h1>
      <div className="card mt-3" style={{ backgroundColor: '#1E1E1E', color: '#13F287', padding: '20px' }}>
        <h2>{client.name}</h2>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Telefone:</strong> {client.phone}</p>
        <p><strong>Data de Cadastro:</strong> {new Date(client.createdAt!).toLocaleDateString()}</p>
        {client.seller && <p><strong>Vendedor Responsável:</strong> {client.seller.name}</p>}
      </div>
      <button onClick={() => router.back()} className="btn" style={{ backgroundColor: '#13F287', marginTop: '20px' }}>
        Voltar
      </button>
    </div>
  );
}
