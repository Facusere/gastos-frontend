import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function NewExpense() {
  const [form, setForm] = useState({
    monto: '',
    fecha: '',
    categoria: '',
    descripcion: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al registrar gasto');
        return res.json();
      })
      .then(() => {
        setForm({ monto: '', fecha: '', categoria: '', descripcion: '' });
        alert('Gasto registrado');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Nuevo Gasto</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <input
          name="descripcion"
          type="text"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          name="monto"
          type="number"
          placeholder="Monto"
          value={form.monto}
          onChange={handleChange}
          required
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChange}
          required
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Categoría</option>
          <option value="suscripcion">Suscripción</option>
          <option value="unico">Único</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Agregando...' : 'Agregar Gasto'}
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
    </div>
  );
}
