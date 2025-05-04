import { FiMail } from 'react-icons/fi';

export default function Navbar() {
  return (
    <nav className="fixed w-full py-4 z-50 backdrop-blur-md shadow-lg">
      <div className="flex justify-between items-center max-w-screen-xl mx-6 xl:mx-auto">
        <a href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition">
          GersonSA
        </a>

        {/* Navegación solo en escritorio */}
        <div className="hidden lg:flex gap-6 items-center">
          <a
            href="#contacto"
            className="flex items-center gap-2 text-lg font-semibold text-gray-600 hover:text-blue-600 transition"
          >
            <FiMail className="text-xl" />
            Contacto
          </a>
        </div>
      </div>
    </nav>
  );
}
