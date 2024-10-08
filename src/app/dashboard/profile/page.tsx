// src/app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulação de obtenção dos dados do usuário (via API ou localStorage)
    const fetchUserData = async () => {
      // Simulação de dados de usuário
      const userData = {
        name: 'Bruno Couto',
        email: 'bruno@example.com',
        avatarUrl: '/favicon.ico', // Substitua pelo caminho real da imagem
      };
      setUser(userData);
    };

    fetchUserData();
  }, []);

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
            <label htmlFor="avatar" className="form-label">Foto de Perfil:</label>
            <div>
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="img-thumbnail"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
