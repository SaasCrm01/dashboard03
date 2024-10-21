// src/app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [clientCount, setClientCount] = useState(0);
  const [associatedClientCount, setAssociatedClientCount] = useState(0);
  const [unassociatedClientCount, setUnassociatedClientCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchData(token);
    }
  }, [router]);

  const fetchData = async (token: string) => {
    try {
      const clientRes = await fetch('/api/clients-with-sellers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const clientsData = await clientRes.json();
      setClientCount(clientsData.length);

      const associatedClients = clientsData.filter((client: any) => client.seller !== null);
      const unassociatedClients = clientsData.filter((client: any) => client.seller === null);
      setAssociatedClientCount(associatedClients.length);
      setUnassociatedClientCount(unassociatedClients.length);

      const sellerRes = await fetch('/api/sellers/list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sellersData = await sellerRes.json();
      const filteredSellers = sellersData.filter((seller: any) => seller.role === 'SELLER');
      setSellerCount(filteredSellers.length);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  const data = {
    labels: ['Clientes', 'Vendedores', 'Associados', 'Não Associados'],
    datasets: [
      {
        label: 'Contagem',
        data: [clientCount, sellerCount, associatedClientCount, unassociatedClientCount],
        backgroundColor: '#13F287',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Garantir que o gráfico se ajuste corretamente no mobile
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Estatísticas da Dashboard',
      },
    },
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row g-3">
        {/* Clientes */}
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1E1E1E' }}>
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title" style={{ fontWeight: '500', color: '#13F287' }}>Clientes</h5>
              <p className="card-text fs-4" style={{ fontWeight: '700', color: '#13F287' }}>{clientCount}</p>
            </div>
          </div>
        </div>

        {/* Vendedores */}
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1E1E1E' }}>
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title" style={{ fontWeight: '500', color: '#13F287' }}>Vendedores</h5>
              <p className="card-text fs-4" style={{ fontWeight: '700', color: '#13F287' }}>{sellerCount}</p>
            </div>
          </div>
        </div>

        {/* Associados */}
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1E1E1E' }}>
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title" style={{ fontWeight: '500', color: '#13F287' }}>Associados</h5>
              <p className="card-text fs-4" style={{ fontWeight: '700', color: '#13F287' }}>{associatedClientCount}</p>
            </div>
          </div>
        </div>

        {/* Não Associados */}
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div className="card border-0 h-100" style={{ backgroundColor: '#1E1E1E' }}>
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title" style={{ fontWeight: '500', color: '#13F287' }}>Não Associados</h5>
              <p className="card-text fs-4" style={{ fontWeight: '700', color: '#13F287' }}>{unassociatedClientCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="mt-5">
        <div className="chart-container" style={{ position: 'relative', height: '250px' }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
