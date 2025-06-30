import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

type Gasto = {
  id: string;
  monto: number;
  fecha: string;
  categoria: string;
  descripcion?: string;
};

type EditExpenseModalProps = {
  gasto: Gasto | null;
  onClose: () => void;
  onSave: () => void;
};

export default function EditExpenseModal({ gasto, onClose, onSave }: EditExpenseModalProps) {
  const [form, setForm] = useState({
    monto: '',
    fecha: '',
    categoria: '',
    descripcion: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gasto) {
      setForm({
        monto: String(gasto.monto),
        fecha: gasto.fecha.slice(0, 10),
        categoria: gasto.categoria,
        descripcion: gasto.descripcion || '',
      });
    }
  }, [gasto]);

  if (!gasto) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/expenses/${gasto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al editar gasto');
        onSave();
        onClose();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Editar Gasto</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
      </div>
    </div>
  );
}
