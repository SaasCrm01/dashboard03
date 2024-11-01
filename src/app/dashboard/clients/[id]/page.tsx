// src/app/dashboard/clients/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

interface Note {
  id: number;
  content: string;
  createdAt: string;
}

export default function ClientDetailPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchClient = async () => {
      const token = localStorage.getItem('token');
      try {
        // Buscar informações do cliente
        const resClient = await fetch(`/api/clients/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resClient.ok) {
          throw new Error('Erro ao buscar cliente');
        }
        const data = await resClient.json();
        const selectedClient = data.find((client: Client) => client.id === Number(id));
        if (selectedClient) {
          setClient(selectedClient);
          setName(selectedClient.name);
          setEmail(selectedClient.email);
          setPhone(selectedClient.phone || '');
        }

        // Buscar notas do cliente
        const resNotes = await fetch(`/api/clients/${id}/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resNotes.ok) {
          const notesData = await resNotes.json();
          setNotes(notesData);
        }
      } catch (error) {
        console.error(error);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/clients/${id}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newNote }),
    });

    if (res.ok) {
      const addedNote = await res.json();
      setNotes((prevNotes) => [...prevNotes, addedNote]);
      setNewNote(''); // Limpa o campo de nova nota
    } else {
      alert('Erro ao adicionar nota');
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/clients/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, phone }),
    });

    if (res.ok) {
      const updatedClient = await res.json();
      setClient(updatedClient);
      alert('Cliente atualizado com sucesso!');
    } else {
      alert('Erro ao atualizar cliente');
    }
  };

  const handleDeleteClient = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/clients/delete/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      alert('Cliente excluído com sucesso!');
      router.push('/dashboard/clients'); // Redireciona para a lista de clientes após exclusão
    } else {
      alert('Erro ao excluir cliente');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!client) return <p>Cliente não encontrado.</p>;

  return (
    <div className="container mt-4">
      <h1>Detalhes do Cliente</h1>
      <div className="card mt-3" style={{ backgroundColor: '#1E1E1E', color: '#13F287', padding: '20px' }}>
        <h2>{client.name}</h2>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Telefone:</strong> {client.phone}</p>
        <p><strong>Data de Cadastro:</strong> {new Date(client.createdAt!).toLocaleDateString()}</p>
      </div>

      <form onSubmit={handleUpdateClient} className="mt-4">
        <h3>Editar Cliente</h3>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Telefone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit" className="btn" style={{ backgroundColor: '#13F287' }}>
          Atualizar Cliente
        </button>
      </form>

      <form onSubmit={handleAddNote} className="mt-4">
        <h3>Adicionar Nota</h3>
        <textarea
          className="form-control"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
          placeholder="Escreva uma nova nota sobre o cliente..."
        ></textarea>
        <button type="submit" className="btn mt-3" style={{ backgroundColor: '#13F287' }}>
          Salvar Nota
        </button>
      </form>

      <div className="mt-4">
        <h3>Notas</h3>
        {notes.length === 0 ? (
          <p>Sem notas.</p>
        ) : (
          <ul className="list-group">
            {notes.map((note) => (
              <li key={note.id} className="list-group-item" style={{ backgroundColor: '#1E1E1E', color: '#13F287' }}>
                <p>{note.content}</p>
                <small>Adicionada em: {new Date(note.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleDeleteClient} className="btn mt-3" style={{ backgroundColor: '#ff4d4f', color: '#fff' }}>
        Excluir Cliente
      </button>
      <button onClick={() => router.back()} className="btn mt-3 ms-2" style={{ backgroundColor: '#13F287' }}>
        Voltar
      </button>
    </div>
  );
}
