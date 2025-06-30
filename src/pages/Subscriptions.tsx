import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

type Gasto = {
  id: string;
  monto: number;
  fecha: string;
  categoria: string;
  descripcion?: string;
};

export default function Subscriptions() {
  const [suscripciones, setSuscripciones] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/expenses`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener gastos');
        return res.json();
      })
      .then(data => setSuscripciones(data.filter((g: Gasto) => g.categoria === 'suscripcion')))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Suscripciones</h2>
      <div className="bg-white rounded-lg shadow p-4">
        {loading && <div className="text-gray-400">Cargando...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <ul className="divide-y">
          {suscripciones.length === 0 && !loading && <li className="py-3 text-gray-400">No hay suscripciones registradas.</li>}
          {suscripciones.map(s => (
            <li key={s.id} className="py-3 flex justify-between items-center">
              <span className="font-medium">{s.descripcion || 'Sin descripción'}</span>
              <span className="text-green-600">-${s.monto} / mes</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
