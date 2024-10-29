// src/app/dashboard/layout.tsx

"use client"; // Certifica que este componente é um Client Component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import jwt from 'jsonwebtoken';
import './layout.css'; // Importando o CSS da sidebar

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null); // Armazena o papel do usuário

  useEffect(() => {
    // Decodifica o token e define o papel do usuário
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt.decode(token) as { role: string };
      setRole(decoded?.role || null);
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Hamburger Menu - Aparece no mobile */}
      <div className="hamburger" onClick={toggleSidebar}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Image src="/images/imobflowsidebar.png" alt="Logo" width={200} height={100} />
        </div>

        {/* Navigation Links */}
        <nav>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {[
              { link: '/dashboard/profile', text: 'Perfil' },
              { link: '/dashboard', text: 'Dashboard' },
              { link: '/dashboard/clients', text: 'Clientes' },
              // Apenas exibir esta rota de gerenciamento se o papel for "PRINCIPAL"
              ...(role === 'PRINCIPAL' ? [
                { link: '/dashboard/sellers', text: 'Vendedores' }
              ] : []),
              { link: '/dashboard/tags', text: 'Gerenciar Tags' }
            ].map(({ link, text }, index) => (
              <li key={index} style={{ marginBottom: '25px' }}>
                <Link 
                  href={link} 
                  style={{ 
                    backgroundColor: '#2e2e2e', 
                    color: '#13F287', 
                    textDecoration: 'none', 
                    padding: '10px 15px', 
                    borderRadius: '4px',
                    display: 'block'
                  }}
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Content Area */}
      <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        {/* Top bar */}
        <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/dashboard/profile" style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }}>
              Olá, Bruno
            </Link>
            <Link href="/dashboard/profile">
              <Image src="/images/imofloowperfil.png" alt="Avatar" width={40} height={40} className="rounded-circle" />
            </Link>
          </div>
        </header>

        <section>
          {children}
        </section>
      </main>
    </div>
  );
}
