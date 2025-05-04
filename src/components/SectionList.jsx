import { useEffect, useState } from 'react';

export default function SectionList({ proyectos }) {
  const [activo, setActivo] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActivo(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    proyectos.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [proyectos]);

  return (
    <div className="w-52 pt-20 fixed left-0 top-0">
      <div className="flex flex-col space-y-4 ml-4">
        <h2 className="text-sm uppercase text-gray-500 font-semibold tracking-wide">Proyectos</h2>
        {proyectos.map((p) => (
          <a
            key={p.id}
            href={`#${p.id}`}
            className={`relative pl-3 text-sm transition-all duration-200 ${
              activo === p.id ? 'text-blue-600 font-semibold' : 'text-gray-500'
            }`}
          >
            {activo === p.id && (
              <span className="absolute left-0 top-1 h-4 w-[2px] bg-sky-600 rounded" />
            )}
            {p.titulo}
          </a>
        ))}
      </div>
    </div>
  );
}
