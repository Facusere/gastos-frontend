import { useEffect, useState, useCallback } from 'react';
import { ShoppingCart, Fuel, Utensils, Trash2, BarChart2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

type Gasto = {
  id: string;
  monto: number;
  fecha: string;
  categoria: string;
  descripcion?: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reporteMensual, setReporteMensual] = useState<{ [categoria: string]: number }>({});
  const now = new Date();
  const [mesSeleccionado, setMesSeleccionado] = useState(() => String(now.getMonth() + 1).padStart(2, '0'));
  const [anioSeleccionado, setAnioSeleccionado] = useState(() => String(now.getFullYear()));
  const mesActual = `${anioSeleccionado}-${mesSeleccionado}`;

  const fetchGastos = useCallback(() => {
    setLoading(true);
    fetch(`${API_URL}/expenses`)
      .then(res => res.ok ? res.json() : Promise.reject('Error al obtener gastos'))
      .then(data => setGastos(data.sort((a: Gasto, b: Gasto) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())))
      .catch(e => alert(e))
      .finally(() => setLoading(false));
  }, []);

  const fetchReporteMensual = useCallback(() => {
    fetch(`${API_URL}/expenses/reports/monthly?month=${mesActual}`)
      .then(res => res.json())
      .then(setReporteMensual);
  }, [mesActual]);

  useEffect(() => {
    fetchGastos();
    fetchReporteMensual();
  }, [fetchGastos, fetchReporteMensual]);

  const totalMes = Object.values(reporteMensual).reduce((acc, v) => acc + v, 0);
  const dataGrafico = Object.entries(reporteMensual).map(([categoria, monto]) => ({ categoria, monto }));
  const colores = ['#2563eb', '#22c55e', '#f59e42', '#ef4444', '#a855f7'];

  const handleDelete = (id: string) => {
    if (!window.confirm('¿Eliminar este gasto?')) return;
    setDeleting(id);
    fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' })
      .then(res => res.ok ? fetchGastos() : Promise.reject('Error al eliminar gasto'))
      .catch(e => alert(e))
      .finally(() => setDeleting(null));
  };

  const iconByCategory = (categoria: string) => {
    const props = { size: 20, className: 'text-icon', 'aria-hidden': true, role: 'img' };
    switch (categoria.toLowerCase()) {
      case 'supermercado': return <ShoppingCart {...props} />;
      case 'gasolina': return <Fuel {...props} />;
      case 'restaurante': return <Utensils {...props} />;
      default: return <BarChart2 {...props} />;
    }
  };

  const meses = [
    { label: 'Enero', value: '01' }, { label: 'Febrero', value: '02' }, { label: 'Marzo', value: '03' },
    { label: 'Abril', value: '04' }, { label: 'Mayo', value: '05' }, { label: 'Junio', value: '06' },
    { label: 'Julio', value: '07' }, { label: 'Agosto', value: '08' }, { label: 'Septiembre', value: '09' },
    { label: 'Octubre', value: '10' }, { label: 'Noviembre', value: '11' }, { label: 'Diciembre', value: '12' },
  ];
  const anios = [now.getFullYear(), now.getFullYear() - 1];

  return (
    <div className="min-h-screen flex flex-col items-center bg-background p-4">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Resumen mensual</h2>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div>
            <label htmlFor="mes" className="text-sm font-medium text-slate-700 mb-1 block">Mes</label>
            <select id="mes" value={mesSeleccionado} onChange={e => setMesSeleccionado(e.target.value)}
              className="bg-slate-100 rounded-xl px-4 py-2 border border-slate-300 text-slate-800 w-full"
            >
              {meses.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="anio" className="text-sm font-medium text-slate-700 mb-1 block">Año</label>
            <select id="anio" value={anioSeleccionado} onChange={e => setAnioSeleccionado(e.target.value)}
              className="bg-slate-100 rounded-xl px-4 py-2 border border-slate-300 text-slate-800 w-full"
            >
              {anios.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Total gastado */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><BarChart2 size={24} /></div>
              <h3 className="text-lg font-semibold text-slate-800">Total gastado</h3>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 mt-2">${totalMes.toLocaleString()}</div>
            <p className="text-sm text-slate-500">Gasto acumulado este mes</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl"
              onClick={() => navigate('/gastos/nuevo')}
            >
              Registrar gasto
            </button>
          </div>

          {/* Reportes */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-xl"><BarChart2 size={24} /></div>
              <h3 className="text-lg font-semibold text-slate-800">Reportes</h3>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">Ver reportes</div>
            <p className="text-sm text-slate-500">Consulta y descarga reportes mensuales</p>
            <button
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl"
              onClick={() => navigate('/reportes')}
            >
              Generar reporte
            </button>
          </div>
        </div>

        {/* Gráfico + Lista de gastos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Distribución por categoría</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataGrafico}>
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="monto">
                  {dataGrafico.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={colores[i % colores.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Lista de gastos */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Gastos recientes</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8 text-slate-500">
                <Loader2 className="animate-spin mr-2" /> Cargando gastos...
              </div>
            ) : gastos.length === 0 ? (
              <p className="text-slate-500">No hay gastos registrados este mes.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {gastos.slice(0, 6).map(gasto => (
                  <li key={gasto.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg">{iconByCategory(gasto.categoria)}</div>
                      <div>
                        <div className="font-medium text-slate-800">{gasto.categoria}</div>
                        <div className="text-sm text-slate-500">{new Date(gasto.fecha).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-slate-800 font-semibold">${gasto.monto.toLocaleString()}</div>
                      <button
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        onClick={() => handleDelete(gasto.id)}
                        disabled={deleting === gasto.id}
                        aria-label="Eliminar gasto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
