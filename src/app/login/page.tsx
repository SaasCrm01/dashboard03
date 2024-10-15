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
          <h1 className="text-center mb-4">Faça seu Login</h1>
          <input
            type="email"
            className="form-control mb-3" // Estilo do Bootstrap
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ backgroundColor: '#fffff', color: '#1E1E1E' }} // Estilo do input
          />
          <input
            type="password"
            className="form-control mb-3" // Estilo do Bootstrap
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ backgroundColor: '#fffff', color: '#1E1E1E' }} // Estilo do input
          />
          <button
            className="btn btn-success w-100 mb-2" // Botão com largura total e margem inferior
            onClick={handleLogin}
            style={{ backgroundColor: '#13F287', borderColor: '#13F287' }} // Cor do botão
          >
            Entrar
          </button>
          <div className="text-center">
            <p className="mb-0" style={{ color: '#13F287' }}>
              Não tem uma conta? <a href="/register" style={{ color: '#13F287', textDecoration: 'underline' }}>Registrar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
