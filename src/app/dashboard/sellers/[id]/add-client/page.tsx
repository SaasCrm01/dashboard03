// src/app/dashboard/sellers/[id]/add-client/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddClient({ params }: { params: { id: string } }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/sellers/${params.id}/add-client`, {
      method: 'POST',
      body: JSON.stringify({ name, email, phone }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      router.push('/dashboard/sellers');
    } else {
      alert('Erro ao adicionar cliente');
    }
  };

  return (
    <div>
      <h1>Adicionar Cliente ao Vendedor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Telefone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit">Adicionar Cliente</button>
      </form>
    </div>
  );
}
    