import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validaciones básicas
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
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.status === 409) {
        throw new Error('El email ya está registrado. Iniciá sesión o usá otro email.');
      }

      if (!res.ok) {
        throw new Error('No se pudo registrar. Intentalo más tarde.');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <div className="w-full max-w-sm p-8 bg-white/90 rounded-2xl shadow-2xl border border-blue-100">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-700 drop-shadow">
          Crear cuenta
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 mb-4 text-center font-semibold shadow">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 rounded-lg px-4 py-2 mb-4 text-center font-semibold shadow">
            ¡Cuenta creada exitosamente! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-700">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Ingresá tu email"
                value={form.email}
                onChange={handleChange}
                required
                className="input w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-900 shadow"
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-700">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Ingresá tu contraseña"
                value={form.password}
                onChange={handleChange}
                required
                className="input w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-900 shadow"
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="btn w-full py-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 text-white font-bold text-lg shadow hover:from-blue-600 hover:to-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {/* Link a login */}
        <div className="mt-6 text-center text-blue-700">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-bold underline hover:text-blue-900">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
