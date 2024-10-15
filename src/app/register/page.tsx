// src/app/register/page.tsx

// src/app/register/page.tsx
'use client';  // Para poder usar hooks do React

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (res.ok) {
      // Redireciona para a página de login após registro bem-sucedido
      router.push('/login');
    } else {
      alert(data.error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100" // Centraliza vertical e horizontalmente
      style={{ backgroundColor: '#1E1E1E' }} // Fundo da página
    >
      <div 
        className="card" 
        style={{ 
          width: '400px', 
          borderRadius: '8px', 
          border: 'none', 
          backgroundColor: '#2D2D2D' // Cor do card diferente do fundo
        }}
      >
        <div className="card-body" style={{ color: '#13F287' }}>
          {/* Logo */}
          <div className="text-center mb-4">
            <img
              src="/images/imobflowlogo.png"
              alt="Logo"
              className="img-fluid" // Torna a imagem responsiva
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <h1 className="text-center mb-4">Faça seu Registro</h1>
          <input
            type="text"
            className="form-control mb-3" // Estilo do Bootstrap
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ backgroundColor: '#fff', color: '#13F287' }} // Estilo do input
          />
          <input
            type="email"
            className="form-control mb-3" // Estilo do Bootstrap
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ backgroundColor: '#fff', color: '#13F287' }} // Estilo do input
          />
          <input
            type="password"
            className="form-control mb-3" // Estilo do Bootstrap
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ backgroundColor: '#fff', color: '#13F287' }} // Estilo do input
          />
          <button
            className="btn btn-success w-100 mb-2" // Botão com largura total e margem inferior
            onClick={handleRegister}
            style={{ backgroundColor: '#13F287', borderColor: '#13F287' }} // Cor do botão
          >
            Registrar
          </button>
          <div className="text-center">
            <p className="mb-0" style={{ color: '#13F287' }}>
              Já tem uma conta? <a href="/login" style={{ color: '#13F287', textDecoration: 'underline' }}>Entrar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
