// src/app/dashboard/layout.tsx
// src/app/dashboard/layout.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Exemplo de ID estático, você pode buscar esse ID dinamicamente
  const sellerId = "1"; // Substitua isso por uma maneira dinâmica de pegar o ID do vendedor

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#2E7D32', padding: '20px', color: 'white' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Image src="/favicon.ico" alt="Logo" width={150} height={80} />
        </div>

        {/* Navigation Links */}
        <nav>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '15px' }}>
              <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link href="/dashboard/clients" style={{ color: 'white', textDecoration: 'none' }}>Clientes</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link href="/dashboard/sellers" style={{ color: 'white', textDecoration: 'none' }}>Vendedores</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link href={`/dashboard/sellers/${sellerId}/add-client`} style={{ color: 'white', textDecoration: 'none' }}>Adicionar Cliente a Vendedor</Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link href="/dashboard/profile" style={{ color: 'white', textDecoration: 'none' }}>Perfil</Link>
            </li>
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
            {/* Avatar */}
            <Image src="/favicon.ico" alt="Avatar" width={40} height={40} className="rounded-circle" />
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
