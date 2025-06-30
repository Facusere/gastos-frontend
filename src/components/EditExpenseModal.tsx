import { Calendar, Tag, DollarSign, Edit2 } from 'lucide-react';
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

const categoriasDisponibles = ['Alimentación', 'Transporte', 'Compras', 'Salud', 'Otra'];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...form,
      monto: parseFloat(form.monto),
    };

    fetch(`${API_URL}/expenses/${gasto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al editar gasto');
        onSave();
        onClose();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  const inputClasses =
    'w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-blue-50 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-900 shadow';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-extrabold mb-6 text-blue-700 drop-shadow">Editar Gasto</h2>

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
                type="number"
                name="monto"
                value={form.monto}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Ej: 1500"
                className={inputClasses}
              />
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-700">Fecha</label>
            <div className="relative">
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
                className={inputClasses}
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
                className={inputClasses}
              >
                <option value="">Seleccionar</option>
                {categoriasDisponibles.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
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
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Ej: Supermercado, viaje, etc."
                rows={2}
                className={`${inputClasses} resize-none`}
              />
              <Edit2 className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 text-white font-bold text-lg shadow hover:from-blue-600 hover:to-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
