//src/app/dashboard/tags/page.tsx

"use client";

import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o Bootstrap

interface Tag {
  id: number;
  name: string;
  clients: Client[];
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  tags?: Tag[];
}

export default function ManageTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('token');

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) throw new Error('Token not available');

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) throw new Error(`Error fetching ${url}`);
    return res.json();
  };

  const fetchTagsAndClients = async () => {
    try {
      const [tagsData, clientsData] = await Promise.all([
        fetchWithAuth('/api/tags/with-clients'),
        fetchWithAuth('/api/clients/list'),
      ]);
      setTags(tagsData);
      setClients(clientsData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching data';
      console.error(message);
      alert(message);
    }
  };

  useEffect(() => {
    fetchTagsAndClients();
  }, []);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetchWithAuth('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      setTags((prevTags) => [...prevTags, res]);
      setName('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating tag';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTags = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert('Please select a client');
      return;
    }

    setLoading(true);
    try {
      await fetchWithAuth(`/api/clients/${selectedClientId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagIds: selectedTagIds }),
      });
      alert('Tags assigned successfully!');
      await fetchTagsAndClients();
      setSelectedTagIds([]);
      setSelectedClientId(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error assigning tags';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTagSelect = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-5 text-center" style={{ color: '#13F287' }}>Manage Tags for Clients</h1>

      {/* Seção de Criação de Tags */}
      <section className="mb-5">
        <h2 className="mb-4">Create a New Tag</h2>
        <form onSubmit={handleCreateTag} className="row g-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Tag Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <button
              type="submit"
              className="btn w-100 btn-lg"
              style={{ backgroundColor: '#13F287', color: '#1E1E1E' }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Tag'}
            </button>
          </div>
        </form>
      </section>

      {/* Seção de Atribuição de Tags */}
      <section className="mb-5">
        <h2 className="mb-4">Assign Tags to a Client</h2>
        <form onSubmit={handleAssignTags} className="row g-4">
          <div className="col-md-6">
            <label htmlFor="client" className="form-label">Select Client</label>
            <select
              id="client"
              className="form-select form-select-lg"
              onChange={(e) => setSelectedClientId(Number(e.target.value))}
              value={selectedClientId || ''}
              required
            >
              <option value="" disabled>-- Select a Client --</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <h4>Select Tags to Assign</h4>
            <div className="d-flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div key={tag.id} className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`tag-${tag.id}`}
                    onChange={() => handleTagSelect(tag.id)}
                  />
                  <label className="form-check-label" htmlFor={`tag-${tag.id}`}>{tag.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn w-100 btn-lg"
              style={{ backgroundColor: '#13F287', color: '#1E1E1E' }}
              disabled={loading || !selectedClientId}
            >
              {loading ? 'Assigning...' : 'Assign Tags to Client'}
            </button>
          </div>
        </form>
      </section>

      {/* Tabela de Clientes e Tags Associadas */}
      <section>
        <h2 className="mb-4">Tags and Associated Clients</h2>
        {clients.length > 0 ? (
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Client Name</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>
                    {client.tags && client.tags.length > 0
                      ? client.tags.map((tag) => tag.name).join(', ')
                      : 'No tags associated'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No clients available.</p>
        )}
      </section>
    </div>
  );
}
