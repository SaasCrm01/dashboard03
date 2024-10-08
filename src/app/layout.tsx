// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css';  // Importa os estilos do Bootstrap
import './globals.css';  // Seus estilos globais

export const metadata = {
  title: 'Dashboard CRM',
  description: 'Dashboard de gerenciamento de clientes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}


