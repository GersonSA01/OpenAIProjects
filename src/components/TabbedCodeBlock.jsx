import { useEffect, useRef, useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { FaHtml5, FaCss3Alt, FaJs, FaBrain, FaFile } from "react-icons/fa";

import Sidebar from "./Sidebar";

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
  const [view, setView] = useState("sidebar"); // "sidebar" o "code"
  const codeRef = useRef(null);

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
    <div className="w-full border rounded bg-[#0f172a] text-white shadow-lg overflow-hidden h-[330px] relative">
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${
          view === "sidebar" ? "translate-x-0 opacity-100 z-10" : "-translate-x-full opacity-0 z-0"
        }`}
      >
        <div className="w-full h-full overflow-y-auto bg-gray-900 border-r border-gray-700">
          <Sidebar
            onSelectFile={(file) => {
              setActiveTab(file);
              setView("code");
            }}
            fileStructure={generateFileStructure(files)}
          />
        </div>
      </div>
  
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${
          view === "code" ? "translate-x-0 opacity-100 z-10" : "translate-x-full opacity-0 z-0"
        }`}
      >
        <div className="relative h-full w-full">
          <button
            onClick={() => setView("sidebar")}
            className="absolute top-3 left-4 px-3 py-1 bg-gray-800 text-sm rounded hover:text-blue-400 z-10"
          >
            ⬅ Volver
          </button>
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
          <pre className="p-4 h-full w-full overflow-auto text-sm bg-black scroll-hover">
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
    </div>
  );
  
}
