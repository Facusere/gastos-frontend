import { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import { getToken, setToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.email) {
          setForm(f => ({ ...f, email: payload.email }));
        }
      } catch {
        console.warn('Token inválido');
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo actualizar el perfil.');
        return res.json();
      })
      .then(data => {
        if (data.token) setToken(data.token);
        setSuccess(true);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 drop-shadow">Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="bg-white/90 rounded-xl shadow p-6 flex flex-col gap-4 border border-blue-100 w-full max-w-md">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          <input
            className="input pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-900 w-full shadow"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          <input
            className="input pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold text-blue-900 w-full shadow"
            name="password"
            type="password"
            placeholder="Nueva contraseña"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button
          className="btn w-full py-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 text-white font-bold text-lg shadow hover:from-blue-600 hover:to-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>

        {success && (
          <div className="bg-green-100 text-green-700 rounded-lg px-4 py-2 mt-2 text-center font-semibold shadow">
            ¡Perfil actualizado!
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 mt-2 text-center font-semibold shadow">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
