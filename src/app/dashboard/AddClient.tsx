// src/app/dashboard/AddClient.tsx
'use client';  // Para permitir o uso de hooks no App Router

import { useState } from 'react';

export default function AddClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const res = await fetch('/api/clients/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,  // Adiciona o token de autenticação
      },
      body: JSON.stringify({ name, email, phone }),
    });

    if (res.ok) {
      alert('Cliente cadastrado com sucesso!');
      setName('');
      setEmail('');
      setPhone('');
    } else {
      alert('Erro ao cadastrar cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Telefone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button type="submit">Cadastrar Cliente</button>
    </form>
  );
}
