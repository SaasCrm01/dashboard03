// src/app/login/page.tsx
'use client';  // Necessário para páginas que usam hooks do React

import { useState } from 'react';
import { useRouter } from 'next/navigation';  // Use "next/navigation" no App Router

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');  // Redireciona para o dashboard
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
