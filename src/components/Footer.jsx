import { FiGithub, FiLinkedin, FiMail, FiUser } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer
      id="contacto" // <--- Añade este id aquí
      className="bg-transparent text-white py-10 px-6 w-full mx-auto shadow-lg backdrop-blur"
    >
      <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
        {/* Sección de trabajo en conjunto */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          <h2 className="uppercase italic text-4xl font-bold text-center lg:text-left">
            Trabajemos juntos
          </h2>
          <p className="text-sm text-gray-400 text-center lg:text-left max-w-xs">
            ¿Quieres conocer más sobre mí? Visita mi{' '}
            <a
              href="https://gersonsa01.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 underline hover:text-blue-300"
            >
              <FiUser className="text-base" /> Portafolio
            </a>.
          </p>
        </div>

        {/* Sección de redes sociales */}
        <div className="flex flex-col items-center lg:items-start gap-3">
          <h2 className="uppercase italic text-2xl text-center lg:text-left">
            Redes Sociales
          </h2>
          <div className="flex gap-6 flex-wrap">
            <a
              href="https://github.com/GersonSA01"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
            >
              <FiGithub className="text-xl" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/gerson-alexander-suarez-aguirre-8a1864296/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
            >
              <FiLinkedin className="text-xl" /> LinkedIn
            </a>
            <a
              href="mailto:gsuareza3@unemi.edu.ec"
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
            >
              <FiMail className="text-xl" /> Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
