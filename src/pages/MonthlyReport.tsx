import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

type Reporte = {
  [categoria: string]: number;
};

export default function MonthlyReport() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setLoading(true);
    fetch(`${API_URL}/reports/monthly?month=${month}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener reporte');
        return res.json();
      })
      .then(res => {
        const report: Reporte = res.report || res;
        setData(Object.entries(report).map(([name, value]) => ({ name, value })));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reporte Mensual</h2>
      <div className="bg-white rounded-lg shadow p-4">
        {loading && <div className="text-gray-400">Cargando...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && data.length > 0 && (
          <PieChart width={350} height={250} className="mx-auto">
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
        {!loading && !error && data.length === 0 && (
          <div className="text-gray-400">No hay datos para este mes.</div>
        )}
      </div>
    </div>
  );
}
