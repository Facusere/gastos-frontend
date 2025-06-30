// src/App.tsx
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light text-text font-inter">
      <header className="bg-primary text-white p-4 text-center text-lg md:text-xl font-semibold shadow-sm">
        Gasto Manager
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <AppRouter />
      </main>

      <footer className="bg-background-light text-text-muted text-center text-sm p-4 border-t border-separator">
        © 2025 - Todos los derechos reservados
      </footer>
    </div>
  );
}

export default App;
