import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Captura errores de renderizado de cualquier componente hijo.
 * Sin esto, una excepcion en React desmonta todo el arbol y el usuario
 * se queda mirando una pagina en blanco, sin pista de que paso.
 *
 * Tiene que ser un componente de clase: React no expone todavia un
 * equivalente con hooks para componentDidCatch.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Se ejecuta durante el render: solo marca el estado para pintar el fallback.
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Se ejecuta despues del render: aqui es donde se registra el error real.
  componentDidCatch(error, info) {
    console.error('Error de renderizado capturado por ErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <h1 className="text-lg font-bold text-white mb-2">Algo se rompió en esta pantalla</h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            No es culpa tuya. Recargar suele resolverlo; si vuelve a pasar, el detalle
            técnico queda en la consola del navegador.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recargar la página</span>
          </button>
        </div>
      </div>
    );
  }
}
