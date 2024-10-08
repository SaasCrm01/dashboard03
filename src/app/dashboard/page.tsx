// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [clientCount, setClientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchClients(token);
    }
  }, [router]);

  const fetchClients = async (token: string) => {
    const res = await fetch('/api/clients/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setClientCount(data.length);
    setLoading(false);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Clientes Cadastrados</div>
            <div className="card-body">
              <h5 className="card-title">Total de Clientes</h5>
              <p className="card-text">{clientCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
