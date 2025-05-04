import { FiMail } from 'react-icons/fi';

export default function Navbar() {
  return (
<nav  className="fixed w-full py-4 z-50 backdrop-blur-md shadow-lg">
<div className="flex justify-between items-center max-w-screen-xl mx-14 xl:mx-auto">
      <a href="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
        <span className="text-xl font-bold text-blue-500 transition">
          GersonSA
        </span>
      </a>




        <div className="hidden lg:flex gap-6 items-center">
          <a
            href="#contacto"
            className="flex items-center gap-2 text-lg font-semibold text-blue-500 hover:text-blue-600 transition"
          >
            <FiMail className="text-xl" />
            Contacto
          </a>
        </div>
      </div>
    </nav>
  );
}
