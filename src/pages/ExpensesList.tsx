import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Tag, Edit2, Trash2,
  ShoppingCart, Car, PlusCircle, Loader2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const categoryIcons: Record<string, React.ReactNode> = {
  'Alimentación': <ShoppingCart size={20} />,
  'Transporte': <Car size={20} />,
  'Compras': <Tag size={20} />,
  'Salud': <PlusCircle size={20} />,
  'Otra': <Tag size={20} />,
};

const meses = [
  { label: 'Enero', value: '01' },
  { label: 'Febrero', value: '02' },
  { label: 'Marzo', value: '03' },
  { label: 'Abril', value: '04' },
  { label: 'Mayo', value: '05' },
  { label: 'Junio', value: '06' },
  { label: 'Julio', value: '07' },
  { label: 'Agosto', value: '08' },
  { label: 'Septiembre', value: '09' },
  { label: 'Octubre', value: '10' },
  { label: 'Noviembre', value: '11' },
  { label: 'Diciembre', value: '12' },
];

const categorias = ['Todas', 'Alimentación', 'Transporte', 'Compras', 'Salud', 'Otra'];
const anioActual = new Date().getFullYear();
const anios = [anioActual, anioActual - 1];

export default function ExpensesList() {
  const [gastos, setGastos] = useState<any[]>([]);
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [anioSeleccionado, setAnioSeleccionado] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/expenses`;
        const params = new URLSearchParams();

        if (mesSeleccionado && anioSeleccionado) {
          params.append('month', `${anioSeleccionado}-${mesSeleccionado}`);
        }

        if (categoriaSeleccionada && categoriaSeleccionada !== 'Todas') {
          params.append('category', categoriaSeleccionada);
        }

        if ([...params].length > 0) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        const sorted = data.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setGastos(sorted);
      } catch (err) {
        console.error('Error al cargar gastos', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, [mesSeleccionado, anioSeleccionado, categoriaSeleccionada]);

  const limpiarFiltros = () => {
    setMesSeleccionado('');
    setAnioSeleccionado('');
    setCategoriaSeleccionada('Todas');
  };

  const exportarCSV = () => {
    if (!gastos.length) return;

    const encabezado = ['Fecha', 'Categoría', 'Monto'];
    const filas = gastos.map((g) => [
      new Date(g.fecha).toLocaleDateString('es-AR'),
      g.categoria,
      g.monto.toFixed(2)
    ]);

    const csv = [encabezado, ...filas].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gastos_exportados.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (id: string) => {
    navigate(`/expenses/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('¿Estás seguro de que querés eliminar este gasto?');
    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      setGastos((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error('Error al eliminar el gasto', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <header className="w-full h-16 bg-white flex items-center px-8 mb-8 rounded-t-2xl shadow-lg border-b border-[#e0e7ef]">
        <span className="text-primary font-extrabold text-2xl tracking-tight">Visualizar Gastos</span>
      </header>
      <nav className="flex gap-8 text-secondary mb-4 border-b border-[#e0e7ef]">
        <span className="py-2 px-1 cursor-pointer hover:text-primary transition">Inicio</span>
        <span className="py-2 px-1 border-b-2 border-primary text-primary font-semibold">Gastos</span>
        <span className="py-2 px-1 cursor-pointer hover:text-primary transition">Reportes</span>
      </nav>
      <h2 className="text-3xl font-extrabold mb-4 text-[#1F1F1F]">Lista de Gastos</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-6 rounded-2xl shadow-lg border border-[#e0e7ef]">
        <div>
          <label className="text-sm font-medium text-[#1F1F1F] mb-1 block">Mes</label>
          <select value={mesSeleccionado} onChange={e => setMesSeleccionado(e.target.value)} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl px-4 py-2 border border-blue-200 text-[#1F1F1F] font-semibold shadow">
            <option value="">Todos</option>
            {meses.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-[#1F1F1F] mb-1 block">Año</label>
          <select value={anioSeleccionado} onChange={e => setAnioSeleccionado(e.target.value)} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl px-4 py-2 border border-blue-200 text-[#1F1F1F] font-semibold shadow">
            <option value="">Todos</option>
            {anios.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-[#1F1F1F] mb-1 block">Categoría</label>
          <select value={categoriaSeleccionada} onChange={e => setCategoriaSeleccionada(e.target.value)} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl px-4 py-2 border border-blue-200 text-[#1F1F1F] font-semibold shadow">
            {categorias.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-4">
          <button className="btn text-sm underline text-blue-500 mt-2 hover:text-blue-700" onClick={limpiarFiltros}>Limpiar</button>
          <button
            className={`btn text-sm text-white bg-gradient-to-br from-blue-500 to-blue-400 px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-500 transition mt-2 shadow ${!gastos.length ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={exportarCSV}
            disabled={!gastos.length}
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Lista de gastos */}
      <h3 className="text-xl font-bold mb-4 text-[#1F1F1F]">Gastos Registrados</h3>
      <div className="bg-white rounded-2xl border border-[#e0e7ef] p-6 divide-y divide-[#f0f4ff] shadow-lg overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : gastos.length === 0 ? (
          <div className="text-center text-blue-400 py-12 text-lg">No hay gastos registrados aún. ¡Agrega tu primer gasto!</div>
        ) : gastos.map((g, i) => (
          <div key={g.id || i} className={`flex flex-wrap md:flex-nowrap items-center gap-4 py-4 ${i % 2 === 0 ? 'bg-gradient-to-r from-blue-50 to-blue-100' : ''} rounded-xl transition-all group hover:shadow-xl hover:scale-[1.01]`}>
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-200 text-white font-bold text-lg shadow mr-2" title={categoryIcons[g.categoria] ? g.categoria : 'Categoría desconocida'}>
              {categoryIcons[g.categoria] || <Tag size={20} className="text-icon" />}
            </span>
            <span className="w-32 text-blue-700 font-semibold flex items-center gap-2">
              <Calendar size={16} className="inline-block text-blue-400" />
              {new Date(g.fecha).toLocaleDateString('es-AR')}
            </span>
            <span className="w-32">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs shadow">{g.categoria}</span>
            </span>
            <span className="w-32 text-[#1F1F1F] font-bold">${g.monto.toFixed(2)}</span>
            <button
              className="btn text-icon hover:text-blue-600 transition-colors duration-200 relative group/edit"
              title="Editar"
              aria-label={`Editar gasto del ${g.fecha}`}
              onClick={() => handleEdit(g.id)}
            >
              <Edit2 size={20} />
              <span className="absolute left-1/2 -translate-x-1/2 top-10 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover/edit:opacity-100 transition pointer-events-none z-10">Editar</span>
            </button>
            <button
              className="btn text-icon hover:text-error transition-colors duration-200 relative group/delete"
              title="Eliminar"
              aria-label={`Eliminar gasto del ${g.fecha}`}
              onClick={() => handleDelete(g.id)}
            >
              <Trash2 size={20} />
              <span className="absolute left-1/2 -translate-x-1/2 top-10 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover/delete:opacity-100 transition pointer-events-none z-10">Eliminar</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
