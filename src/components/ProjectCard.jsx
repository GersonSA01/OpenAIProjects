import { useState } from 'react';
import TabbedCodeBlock from './TabbedCodeBlock';

export default function ProjectCard({ titulo, video, ComponentePrototipo, codePackage }) {
  const [vistaActiva, setVistaActiva] = useState('codigo');
  const [mostrarGuia, setMostrarGuia] = useState(false);
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="max-w-6xl mx-auto mb-16 border border-blue-800 p-6 rounded-lg shadow-lg bg-[#0f172a]/80 backdrop-blur-md text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-sky-600">{titulo}</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* VIDEO */}
        <div className="md:w-6/12 w-full">
        <video
          autoPlay
          muted
          playsInline
          controls
          className="w-full h-auto rounded shadow"
        >
          <source src={video} type="video/mp4" />
          Tu navegador no soporta video.
        </video>

        {codePackage?.description && (
  <p className="mt-3 text-sm text-gray-300 italic">
    {codePackage.description}
  </p>
)}

        </div>

        {/* INTERACCIÓN */}
        <div className="md:w-7/12 w-full flex flex-col gap-4">
          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                setVistaActiva('codigo');
                setMostrarGuia(false);
              }}
              className={`flex-1 px-4 py-2 rounded text-white ${
                vistaActiva === 'codigo' ? 'bg-sky-600' : 'bg-gray-700'
              }`}
            >
              Ver Código
            </button>
            <button
              onClick={() => {
                setVistaActiva('prototipo');
                setMostrarGuia(false);
              }}
              className={`flex-1 px-4 py-2 rounded text-white ${
                vistaActiva === 'prototipo' ? 'bg-sky-600' : 'bg-gray-700'
              }`}
            >
              Ver Prototipo
            </button>
            <button
              onClick={() => setMostrarGuia(!mostrarGuia)}
              className="flex-1 px-4 py-2 rounded text-white bg-emerald-700 hover:bg-emerald-800"
            >
              {mostrarGuia ? 'Ocultar guía' : '¿Cómo resolverlo?'}
            </button>
          </div>

          {/* Contenido dinámico */}
          {vistaActiva === 'codigo' && codePackage && (
            <div className="mt-4">
              <TabbedCodeBlock files={codePackage.files} />
            </div>
          )}

          {mostrarGuia && codePackage?.guide && (
            <div className="mt-4">{codePackage.guide}</div>
          )}

          {vistaActiva === 'prototipo' && ComponentePrototipo && (
            <div className="bg-gray-100 p-4 rounded shadow text-gray-900">
              <label className="block mb-2 font-semibold text-sky-600">
                Inserta tu API key de OpenAI
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border border-gray-300 text-gray-700 rounded mb-2"
                placeholder="sk-xxxxxxxxxxxxxxxx"
              />
              <p className="text-sm text-green-600 mb-1">
                Esta clave solo se usa localmente para probar el prototipo. No se guarda ni se envía a terceros.
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                🔒 Recomendación: crea una clave temporal desde <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="underline">Tu panel OpenAI</a> para probar este demo.
              </p>


              <div className="mt-4">
                <ComponentePrototipo apiKey={apiKey} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
