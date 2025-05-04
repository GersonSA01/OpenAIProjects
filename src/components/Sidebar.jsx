import { useState } from "react";
import { FiChevronRight, FiFolder, FiFile } from "react-icons/fi";

function SidebarItem({ name, children = null, parentPath = "", onSelectFile }) {
  const [open, setOpen] = useState(false);
  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  const handleClick = () => {
    if (!children) {
      onSelectFile(currentPath); // pasa la ruta completa
    } else {
      setOpen(!open);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-left hover:bg-gray-700 text-white"
      >
        {children ? (
          <FiChevronRight
            className={`transform transition-transform ${open ? "rotate-90" : ""}`}
          />
        ) : (
          <FiFile />
        )}
        {children ? <FiFolder /> : null}
        {name}
      </button>

      {open && children && (
        <div className="pl-6">
          {children.map((child, index) =>
            typeof child === "string" ? (
              <button
                key={index}
                onClick={() => onSelectFile(`${currentPath}/${child}`)}
                className="w-full flex items-center gap-2 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800 text-left"
              >
                <FiFile />
                {child}
              </button>
            ) : (
              <SidebarItem
                key={index}
                {...child}
                parentPath={currentPath}
                onSelectFile={onSelectFile}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ onSelectFile, fileStructure = [] }) {


  return (
    <aside className="bg-gray-950 h-80 p-4 space-y-2 overflow-y-auto text-white border-r border-gray-700">
      <h2 className="text-lg font-bold mb-4">📁 Proyecto</h2>
      {fileStructure.map((item, index) =>
        typeof item === "string" ? (
          <button
            key={index}
            onClick={() => onSelectFile(item)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800 text-left"
          >
            <FiFile />
            {item}
          </button>
        ) : (
          <SidebarItem
            key={index}
            {...item}
            parentPath=""
            onSelectFile={onSelectFile}
          />
        )
      )}
    </aside>
  );
}
