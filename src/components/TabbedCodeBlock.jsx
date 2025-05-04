import { useEffect, useRef, useState } from "react";
import { FiCopy, FiCheck  } from "react-icons/fi";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { FaHtml5, FaCss3Alt, FaJs, FaBrain, FaFile } from "react-icons/fa";

import Sidebar from "./Sidebar"; // Asegúrate de tenerlo en el mismo directorio o ajusta el path
const generateFileStructure = (files) => {
  const structure = {};

  Object.keys(files).forEach((filePath) => {
    const parts = filePath.split("/");

    let current = structure;

    parts.forEach((part, i) => {
      if (!current[part]) {
        current[part] = i === parts.length - 1 ? null : {};
      }
      if (current[part] !== null) {
        current = current[part];
      }
    });
  });

  const toArray = (obj) =>
    Object.entries(obj).map(([key, value]) =>
      value === null
        ? key
        : {
            name: key,
            children: toArray(value),
          }
    );

  return toArray(structure);
};


const getFileMetadata = (key = "") => {
  if (key.endsWith(".html")) return { icon: <FaHtml5 />, lang: "html" };
  if (key.endsWith(".css")) return { icon: <FaCss3Alt />, lang: "css" };
  if (key.endsWith(".js")) {
    return {
      icon: key.toLowerCase().includes("api") ? <FaBrain /> : <FaJs />,
      lang: "javascript",
    };
  }
  return { icon: <FaFile />, lang: "plaintext" };
};

export default function TabbedCodeBlock({ files }) {
  const [activeTab, setActiveTab] = useState(Object.keys(files)[0]);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  // Proteger en caso de que se seleccione un archivo no presente
  const safeActiveTab = files[activeTab] ? activeTab : Object.keys(files)[0];
  const { lang } = getFileMetadata(safeActiveTab);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(files[safeActiveTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [safeActiveTab]);

  return (
    <div className="flex w-full border rounded bg-[#0f172a] text-white shadow-lg overflow-hidden h-[330px]">
      {/* Sidebar tipo árbol personalizado */}
      <div className="w-44 h-[330px] border-r border-gray-700 bg-gray-900 overflow-y-auto">
      <Sidebar
  onSelectFile={(file) => setActiveTab(file)}
  fileStructure={generateFileStructure(files)}
/>

      </div>

      {/* Panel de código */}
      <div className="flex-1 relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-4 px-3 py-1 bg-gray-800 text-sm rounded hover:text-green-300 z-10"
        >
{copied ? (
  <>
    <FiCheck className="inline mr-1 text-green-400" />
    Copiado
  </>
) : (
  <>
    <FiCopy className="inline mr-1" />
    Copiar
  </>
)}
        </button>

        <pre className="p-4 h-[330px] w-[450px] overflow-auto text-sm bg-black scroll-hover">
          <code
            ref={codeRef}
            className={`language-${lang}`}
            dangerouslySetInnerHTML={{
              __html: hljs.highlightAuto(files[safeActiveTab], [lang]).value,
            }}
          />
        </pre>
      </div>
    </div>
  );
}
