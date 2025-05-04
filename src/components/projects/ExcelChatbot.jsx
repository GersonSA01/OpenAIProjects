import { useState } from 'react';
import axios from 'axios';
import alasql from 'alasql';

export default function ExcelChatbot({ apiKey, excelData, rawData, columnNames }) {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const enviarConsulta = async () => {
    setError('');
    setResults([]);
    setQuery('');
    setLoading(true);

    if (!input.trim()) return setError('⚠️ Escribe una consulta válida.');
    if (!apiKey) return setError('⚠️ Proporciona una API Key válida.');

    const newMessage = { role: 'user', content: input };
    const historial = [...messages, newMessage];

    try {
        const res = await axios.post('/api/excelchat', {
          apiKey,
          messages: [
            {
              role: 'system',
              content: `Eres un generador de SQL. Responde SOLO con una consulta SQL que funcione sobre una tabla llamada "data". No expliques nada.`,
            },
            {
              role: 'user',
              content: `Estas son las primeras filas de la tabla:\n${excelData}`,
            },
            ...historial
          ],
        });
      
        let sqlQuery = res.data.reply.replace(/```sql|```/g, '').trim();
        setQuery(sqlQuery);
        setMessages(historial);
      
        // Normalización segura de columnas
        const normalizedColumnNames = columnNames.map(col =>
          col.toString().trim().replace(/\s+/g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        );
      
        const formattedData = rawData.map(row => {
            const obj = {};
            normalizedColumnNames.forEach((col, i) => {
              const val = row[i];
              obj[col] = typeof val === 'string'
                ? val.trim().toLowerCase()
                : val;
            });
            return obj;
          });
          
        // Protege strings SQL antes de normalizar
        const fixedSQL = sqlQuery
          .replace(/"[^"]*"|'[^']*'/g, (match) => `___${match}___`)
          .replace(/([a-zA-Z_]+)/g, match => match.trim().toLowerCase().replace(/\s+/g, '_'))
          .replace(/___("|')([^]*?)\1___/g, (match, quote, str) => `${quote}${str}${quote}`)
          .replace(/;/g, '');
      
        // Ejecutar y capturar error específico
        let result;
        try {
            result = alasql(fixedSQL.replace(/\bdata\b/g, '?'), [formattedData]);

        } catch (sqlErr) {
          console.error('Error SQL:', sqlErr.message);
          setError(`❌ Error al ejecutar SQL: ${sqlErr.message}`);
          return;
        }
      
        setResults(result);
      } catch (err) {
        console.error('Error general:', err);
        setError('❌ Error inesperado al procesar la consulta.');
      }
      

    setLoading(false);
  };

  return (
    <div className="p-4 mt-6 border border-gray-300 rounded bg-white shadow">
      {/* Columnas disponibles */}
      <div className="mb-2 text-sm text-gray-600">
        <strong>Atributos disponibles:</strong> {columnNames.join(', ')}
      </div>

      {/* Entrada del usuario */}
      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarConsulta()}
          className="flex-1 border p-2 rounded text-gray-700"
          placeholder=""
        />
        <button
          onClick={enviarConsulta}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Consultando...' : 'Enviar'}
        </button>
      </div>

      {/* Mensaje de error o SQL generada */}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {query && <p className="text-sm text-gray-500 mb-2 italic">Consulta generada: {query}</p>}

      {query && results.length === 0 && !error && (
  <p className="text-yellow-600 text-sm mt-2 bg-yellow-50 p-3 border border-yellow-200 rounded">
    ⚠️ La consulta no devolvió resultados. Verifica si los datos existen o si hay diferencias en mayúsculas.
  </p>
)}

{results.length > 0 && (
  <div className="mt-4">
    {/* Si la respuesta tiene solo un valor agregado como AVG, SUM, COUNT */}
    {results.length === 1 && Object.keys(results[0]).length === 1 ? (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center shadow">
        <p className="text-sm text-gray-600 mb-2 font-medium flex items-center justify-center gap-2">
          <span className="text-green-700">Resultado:</span>
        </p>

        {/* Mostrar el valor del campo (formateado) */}
        <p className="text-3xl font-bold text-green-700 tracking-widest">
          {(() => {
            const valor = Object.entries(results[0])[0][1];
            return typeof valor === 'number'
              ? valor.toLocaleString('es-EC', { style: 'currency', currency: 'USD' })
              : valor;
          })()}
        </p>

        {/* Nombre del campo */}
        <p className="text-xs text-gray-500 mt-1 italic">
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold">
            <tr>
              {Object.keys(results[0]).map((key) => (
                <th
                  key={key}
                  className="px-5 py-3 text-left border-b border-blue-200 whitespace-nowrap"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors duration-200 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50`}
              >
                {Object.values(row).map((cell, i) => (
                  <td
                    key={i}
                    className="px-5 py-3 border-b border-gray-200 text-gray-700 whitespace-nowrap"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}



    </div>
  );
}
