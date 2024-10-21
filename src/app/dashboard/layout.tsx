// src/app/dashboard/layout.tsx

"use client";  // Certifica que este componente é um Client Component

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './layout.css'; // Importando o CSS da sidebar

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

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
            {['/dashboard/profile', '/dashboard', '/dashboard/clients', '/dashboard/sellers', `/dashboard/sellers/1/add-client`, '/dashboard/tags'].map((link, index) => {
              const linkTexts = ["Perfil", "Dashboard", "Clientes", "Vendedores", "Associar", "Gerenciar Tags"];  // Adicionando o texto "Gerenciar Tags"
              return (
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
                    {linkTexts[index]}
                  </Link>
                </li>
              );
            })}
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
