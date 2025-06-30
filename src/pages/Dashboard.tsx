import { useEffect, useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import EditExpenseModal from '../components/EditExpenseModal';

const API_URL = import.meta.env.VITE_API_URL;

type Gasto = {
  id: string;
  monto: number;
  fecha: string;
  categoria: string;
  descripcion?: string;
};

export default function Dashboard() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editGasto, setEditGasto] = useState<Gasto | null>(null);

  const fetchGastos = () => {
    setLoading(true);
    fetch(`${API_URL}/expenses`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener gastos');
        return res.json();
      })
      .then(setGastos)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  const total = gastos.reduce((acc, g) => acc + g.monto, 0);
  const totalSuscripciones = gastos.filter(g => g.categoria === 'suscripcion').reduce((acc, g) => acc + g.monto, 0);
  const totalUnicos = gastos.filter(g => g.categoria === 'unico').reduce((acc, g) => acc + g.monto, 0);

  const handleDelete = (id: string) => {
    if (!window.confirm('¿Eliminar este gasto?')) return;
    setDeleting(id);
    fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar gasto');
        fetchGastos();
      })
      .catch(e => alert(e.message))
      .finally(() => setDeleting(null));
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Resumen de Gastos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Total Gastado</span>
          <span className="text-2xl font-bold text-blue-600">${total.toLocaleString()}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Suscripciones</span>
          <span className="text-2xl font-bold text-green-600">${totalSuscripciones.toLocaleString()}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Gastos Únicos</span>
          <span className="text-2xl font-bold text-red-600">${totalUnicos.toLocaleString()}</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Gastos recientes</h3>
        {loading && <div className="text-gray-400">Cargando...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <ul className="divide-y">
          {gastos.slice(0, 10).map(g => (
            <li key={g.id} className="py-2 flex justify-between items-center gap-2">
              <span>{g.descripcion || 'Sin descripción'}</span>
              <span className={`text-${g.categoria === 'suscripcion' ? 'green' : 'red'}-600`}>
                ${g.monto}
              </span>
              <button
                className="ml-2 p-1 text-red-500 hover:bg-red-100 rounded"
                title="Eliminar"
                onClick={() => handleDelete(g.id)}
                disabled={deleting === g.id}
              >
                <Trash2 size={18} />
              </button>
              <button
                className="ml-1 p-1 text-blue-500 hover:bg-blue-100 rounded"
                title="Editar"
                onClick={() => setEditGasto(g)}
              >
                <Edit2 size={18} />
              </button>
            </li>
          ))}
        </ul>
        {editGasto && (
          <EditExpenseModal
            gasto={editGasto}
            onClose={() => setEditGasto(null)}
            onSave={fetchGastos}
          />
        )}
      </div>
    </div>
  );
}
