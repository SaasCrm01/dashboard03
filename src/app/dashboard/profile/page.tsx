// src/app/dashboard/profile/page.tsx
// src/app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login'); // Redireciona se não houver token
      return;
    }

    // Função para obter os dados do usuário a partir do token
    const fetchUserData = async () => {
      const response = await fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Falha ao obter dados do usuário');
      }
    };

    fetchUserData();
  }, [router]);

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mt-4">
      <h1>Perfil do Usuário</h1>
      <div className="card">
        <div className="card-header">
          <h4>{user.name}</h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nome:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={user.name}
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={user.email}
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Função:</label>
            <input
              type="text"
              className="form-control"
              id="role"
              value={user.role}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}
