import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { setToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isEmailValid(form.email)) {
      setError('Ingresá un email válido');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Credenciales inválidas o usuario no registrado');

      const data = await res.json();
      setToken(data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-blue-100">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-700 mb-8 drop-shadow-sm">
          Iniciar sesión
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 rounded-md px-4 py-2 mb-4 text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
              <input
                type="email"
                name="email"
                placeholder="Ingresá tu email"
                value={form.email}
                onChange={handleChange}
                required
                className="input w-full pl-10 pr-4 py-2 border border-blue-200 bg-blue-50 rounded-lg font-medium text-blue-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" />
              <input
                type="password"
                name="password"
                placeholder="Ingresá tu contraseña"
                value={form.password}
                onChange={handleChange}
                required
                className="input w-full pl-10 pr-4 py-2 border border-blue-200 bg-blue-50 rounded-lg font-medium text-blue-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Botón de login */}
          <button
            type="submit"
            disabled={loading}
            className="btn w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Link a registro */}
        <div className="mt-6 text-center text-sm text-blue-700">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-semibold underline hover:text-blue-900">
            Registrate
          </Link>
        </div>
      </div>
    </div>
  );
}
