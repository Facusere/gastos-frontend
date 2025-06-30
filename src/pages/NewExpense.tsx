import React, { useState, useMemo } from 'react';
import { DollarSign, Calendar, Tag, AlignLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const categoriasDisponibles = ['Alimentación', 'Transporte', 'Compras', 'Salud', 'Otra'];

export default function NewExpense() {
  const initialForm = useMemo(() => ({
    monto: '',
    fecha: '',
    categoria: '',
    descripcion: '',
  }), []);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const parsedMonto = parseFloat(form.monto);
    if (isNaN(parsedMonto) || parsedMonto <= 0) {
      setError('Ingrese un monto válido mayor a 0');
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      monto: parsedMonto,
    };

    try {
      const res = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al registrar gasto');
      setForm(initialForm);
      alert('✅ Gasto registrado exitosamente');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-lg mx-auto px-2 sm:px-4">
          <nav className="text-sm text-blue-500 mb-2 flex gap-1">
            <span>Inicio</span>
            <span className="mx-1">&gt;</span>
            <span>Gastos</span>
            <span className="mx-1">&gt;</span>
            <span className="text-blue-700 font-semibold">Registrar gasto</span>
          </nav>

          <div className="bg-white/90 rounded-2xl shadow-2xl border border-blue-100 p-8">
            <h2 className="text-3xl font-extrabold mb-6 text-blue-700 drop-shadow">Registrar Gasto</h2>

            {error && (
              <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 mb-4 text-center font-semibold shadow">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Monto */}
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-700">Monto</label>
                <div className="relative">
                  <input
                    className="input w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-900 shadow"
                    type="number"
                    name="monto"
                    placeholder="Ej: 1500"
                    value={form.monto}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-700">Fecha</label>
                <div className="relative">
                  <input
                    className="input w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-900 shadow"
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    required
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-700">Categoría</label>
                <div className="relative">
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-900 shadow"
                  >
                    <option value="">Seleccionar</option>
                    {categoriasDisponibles.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Tag className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-700">Descripción</label>
                <div className="relative">
                  <textarea
                    name="descripcion"
                    placeholder="Ej: Supermercado, viaje, etc."
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-900 shadow resize-none"
                  />
                  <AlignLeft className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                </div>
              </div>

              <button
                className="btn w-full py-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 text-white font-bold text-lg shadow hover:from-blue-600 hover:to-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Registrar gasto'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
