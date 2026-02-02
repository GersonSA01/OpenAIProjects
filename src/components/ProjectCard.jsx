import { useState } from 'react';
import TabbedCodeBlock from './TabbedCodeBlock';
import { Eye, EyeOff, Code, Play, HelpCircle } from 'lucide-react';

export default function ProjectCard({ titulo, video, ComponentePrototipo, codePackage }) {
  const [vistaActiva, setVistaActiva] = useState('codigo');
  const [mostrarGuia, setMostrarGuia] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Coming Soon / Placeholder Mode
  if (!ComponentePrototipo && !codePackage) {
    return (
      <div className="max-w-6xl mx-auto mb-16 border border-blue-800/30 p-12 rounded-2xl shadow-2xl bg-[#0f172a]/80 backdrop-blur-xl text-white flex flex-col items-center justify-center min-h-[300px] text-center space-y-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />

        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 uppercase tracking-widest z-10">
          Muy Pronto
        </h2>

        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full z-10" />

        <h3 className="text-2xl font-bold text-gray-300 z-10 max-w-2xl">
          {titulo}
        </h3>

        <p className="text-gray-500 z-10">
          Estamos trabajando en este experimento. Mantente atento.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mb-16 border border-blue-800/50 p-1 rounded-2xl shadow-2xl bg-[#0f172a]/90 backdrop-blur-xl text-white overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{titulo}</h2>
          <button
            onClick={() => setMostrarGuia(!mostrarGuia)}
            className="text-gray-400 hover:text-emerald-400 transition flex items-center gap-2 text-sm font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-emerald-500/50"
          >
            <HelpCircle size={16} />
            {mostrarGuia ? 'Ocultar Guía' : '¿Cómo funciona?'}
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Column: Video & Info */}
          <div className="xl:w-5/12 w-full space-y-6">
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/40 aspect-video flex items-center justify-center relative group">
              {video ? (
                <video
                  autoPlay
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                >
                  <source src={video} type="video/mp4" />
                  Tu navegador no soporta video.
                </video>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 gap-3">
                  <Play size={48} className="opacity-20" />
                  <span className="text-sm font-medium uppercase tracking-widest opacity-60">
                    Video en desarrollo
                  </span>
                </div>
              )}
            </div>

            {codePackage?.description && (
              <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-200/80 italic leading-relaxed">
                "{codePackage.description}"
              </div>
            )}
          </div>

          {/* Right Column: Interaction Area */}
          <div className="xl:w-7/12 w-full flex flex-col">

            {/* Segmented Control */}
            <div className="flex bg-black/30 p-1.5 rounded-xl mb-6 border border-white/10">
              <button
                onClick={() => {
                  setVistaActiva('codigo');
                  setMostrarGuia(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${vistaActiva === 'codigo'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Code size={18} /> Ver Código
              </button>
              <button
                onClick={() => {
                  setVistaActiva('prototipo');
                  setMostrarGuia(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${vistaActiva === 'prototipo'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Play size={18} /> Probar Prototipo
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-[400px]">
              {vistaActiva === 'codigo' && codePackage && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <TabbedCodeBlock files={codePackage.files} />
                </div>
              )}

              {mostrarGuia && codePackage?.guide && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl text-emerald-100 text-sm leading-relaxed mb-6">
                  {codePackage.guide}
                </div>
              )}

              {vistaActiva === 'prototipo' && ComponentePrototipo && (
                <div className="animate-in fade-in zoom-in-95 duration-500 bg-white/5 border border-white/10 p-6 rounded-xl">

                  {/* Secure API Key Input */}
                  <div className="mb-6 relative group">
                    <label className="block text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
                      TU API KEY DE OPENAI
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 text-white rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono text-sm placeholder-gray-600"
                        placeholder="sk-..."
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <div className="flex items-start gap-2 mt-3 text-xs text-gray-400">
                      <span className="text-emerald-400 text-lg">🔒</span>
                      <p>
                        Tu clave se usa <strong>estrictamente en tu navegador</strong> para comunicarte con OpenAI.
                        No se guarda, no se envía a ningún servidor backend.
                      </p>
                    </div>
                  </div>

                  {/* Prototype Component */}
                  <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                    <ComponentePrototipo apiKey={apiKey} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
