import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ExcelChatbot from './ExcelChatbot';

export default function ExcelChatAssistant({ apiKey }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [statusMessage, setStatusMessage] = useState('🤖 Hola, por favor sube un archivo Excel para comenzar.');
  const [excelText, setExcelText] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const header = jsonData[0];
      const rows = jsonData.slice(1);

      const MAX_ROWS = 20;
      if (rows.length > MAX_ROWS) {
        setStatusMessage(`⚠️ El archivo tiene demasiadas filas (${rows.length}). Solo se permiten hasta ${MAX_ROWS}.`);
        setData([]);
        setColumns([]);
        setExcelText('');
        return;
      }

      setColumns(header);
      setData(rows);
      setStatusMessage('✅ Archivo cargado. Puedes hacer consultas sobre los datos.');

      const text = [header, ...rows]
        .map((row) => row.join(' | '))
        .join('\n');
      setExcelText(text);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 rounded-2xl bg-white shadow-xl border border-gray-200 max-w-4xl mx-auto mt-6">
      <div className="mb-4 p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm shadow-sm">
        {statusMessage}
      </div>

      {/* 📁 Input de subida */}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
      />

      {/* 🤖 Chatbot visible solo cuando hay datos */}
      {excelText && (
        <>
          <p className="mt-4 text-sm text-gray-600 italic">
            ✔️ Datos cargados. Puedes hacer tus consultas aquí:
          </p>
          <ExcelChatbot
            apiKey={apiKey}
            excelData={excelText}
            rawData={data}
            columnNames={columns}
          />
        </>
      )}
    </div>
  );
}
