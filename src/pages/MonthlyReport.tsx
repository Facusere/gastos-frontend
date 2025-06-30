import { Calendar, Tag } from 'lucide-react';
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
  const [month, setMonth] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const now = new Date();
    const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setMonth(defaultMonth);
  }, []);

  useEffect(() => {
    if (!month) return;
    setLoading(true);
    setError(null);
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
  }, [month]);

  const filteredData = category
    ? data.filter(d => d.name.toLowerCase().includes(category.toLowerCase()))
    : data;

  const total = filteredData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <header className="w-full h-16 bg-white/90 flex items-center px-8 mb-8 rounded-t-2xl shadow-lg border-b border-blue-100">
        <span className="text-blue-700 font-extrabold text-2xl tracking-tight">Reporte Mensual</span>
      </header>
      <nav className="flex gap-8 text-blue-500 mb-4 border-b border-blue-100">
        <span className="py-2 px-1 cursor-pointer hover:text-blue-700 transition">Reportes</span>
        <span className="py-2 px-1 border-b-2 border-blue-700 text-blue-700 font-semibold">Mensual</span>
      </nav>
      <h2 className="text-3xl font-extrabold mb-4 text-blue-700">Resumen del Mes</h2>

      <form className="flex flex-wrap gap-4 mb-8 items-end bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-100">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-blue-700">Mes</label>
          <div className="relative">
            <input
              className="input bg-blue-50 rounded-xl px-4 py-2 pr-10 border border-blue-200 text-blue-900 placeholder-blue-400 font-semibold"
              name="month"
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-blue-700">Categoría</label>
          <div className="relative">
            <input
              className="input bg-blue-50 rounded-xl px-4 py-2 pr-10 border border-blue-200 text-blue-900 placeholder-blue-400 font-semibold"
              name="category"
              placeholder="Todas"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
            <Tag className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          </div>
        </div>
      </form>

      <div className="bg-white/90 rounded-2xl border border-blue-100 p-8 shadow-xl w-full max-w-4xl">
        <h3 className="text-xl font-bold mb-2 text-blue-700">Distribución de gastos</h3>
        <p className="text-blue-900 font-semibold mb-6">Total del mes: <span className="font-bold">${total.toLocaleString()}</span></p>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="w-full md:w-1/2">
            {filteredData.length > 0 ? (
              <PieChart width={320} height={240}>
                <Pie
                  data={filteredData}
                  cx={160}
                  cy={120}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                >
                  {filteredData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    borderRadius: 12,
                    background: '#fff',
                    border: '1px solid #2563eb33',
                  }}
                />
                <Legend />
              </PieChart>
            ) : (
              <div className="text-blue-500 font-semibold text-center">No hay datos para mostrar</div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-2">
            {filteredData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></span>
                <span className="font-semibold text-blue-700">{d.name}</span>
                <span className="ml-auto font-bold text-blue-900">${d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {loading && <div className="text-center text-blue-500 mt-6">Cargando...</div>}
        {error && <div className="text-center text-red-500 mt-6">{error}</div>}
      </div>
    </div>
  );
}
