// src/app/dashboard/layout.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const sellerId = "1"; // Substitua isso por uma maneira dinâmica de pegar o ID do vendedor

  return (
    
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#1E1E1E', padding: '20px', color: 'white' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Image src="/images/imobflowsidebar.png" alt="Logo" width={200} height={100} />
        </div>

        {/* Navigation Links */}
        <nav>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {['/dashboard/profile', '/dashboard', '/dashboard/clients', '/dashboard/sellers', `/dashboard/sellers/${sellerId}/add-client`].map((link, index) => {
              const linkTexts = ["Perfil", "Dashboard", "Clientes", "Vendedores", "Assossiar"];
              return (
                <li key={index} style={{ marginBottom: '25px' }}> {/* Aumentar o espaço entre os links */}
                  <Link 
                    href={link} 
                    style={{ 
                      backgroundColor: '#2e2e2e', // Cor de fundo dos links
                      color: '#13F287', 
                      textDecoration: 'none', 
                      padding: '10px 15px', // Preenchimento interno para os links
                      borderRadius: '4px', // Bordas arredondadas
                      display: 'block' // Faz o link ocupar todo o espaço do li
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

      {/* Content */}
      <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        {/* Top bar */}
        <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Name with link to profile */}
            <Link href="/dashboard/profile" style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }}>
              Olá, Bruno
            </Link>
            {/* Avatar wrapped in a link */}
            <Link href="/dashboard/profile">
              <Image src="/images/imofloowperfil.png" alt="Avatar" width={40} height={40} className="rounded-circle" />
            </Link>
          </div>
        </header>

        {/* Main content */}
        <section>
          {children}
        </section>
      </main>
    </div>
  );
}
