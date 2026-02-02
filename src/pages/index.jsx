import Navbar from '../components/Navbar';
import SectionList from '../components/SectionList';
import ProjectCard from '../components/ProjectCard';
import MiniChatbot from '../components/projects/MiniChatbot';
import ExcelAnalyzer from '../components/projects/ExcelAnalyzer';
import DynamicBackground from '../components/DynamicBackground';
import Footer from '../components/Footer';
import MiniChatbotPackage from '../components/codeSnippets/MiniChatbotPackage';
import ExcelAnalyzerPackage from '../components/codeSnippets/ExcelAnalyzerPackage';
import ContextChat from '../components/projects/ContextChat';
import ContextChatPackage from '../components/codeSnippets/ContextChatPackage ';

export default function Home() {
  const proyectos = [
    {
      id: 'chatbot',
      titulo: 'Mini Chatbot con GPT',
      video: '/chatbot.mp4',
      ComponentePrototipo: MiniChatbot,
      codePackage: MiniChatbotPackage,
    },
    {
      id: 'excel',
      titulo: 'Análisis de Datos desde Excel',
      video: '/excelchatbot.mp4',
      ComponentePrototipo: ExcelAnalyzer,
      codePackage: ExcelAnalyzerPackage,
    },
    {
      id: 'contextchat',
      titulo: 'Chat Contextual con OpenAI',
      video: null,
      ComponentePrototipo: ContextChat,
      codePackage: ContextChatPackage,
    },
    {
      id: 'audio-chat',
      titulo: 'Chat conversacional con audio',
      video: null,
      ComponentePrototipo: null,
      codePackage: null,
    },
    {
      id: 'video-interaction',
      titulo: 'Aplicación de interacción con video',
      video: null,
      ComponentePrototipo: null,
      codePackage: null,
    },
  ];


  return (
    <div>
      <DynamicBackground />
      <Navbar />

      <div className="pt-20 lg:flex">
        <div className="hidden lg:block">
          <SectionList proyectos={proyectos} />
        </div>

        <main className="p-4 lg:p-8 lg:ml-52 space-y-16 w-full" id="portafolio">

          <div className="mb-10 text-center lg:text-left lg:ml-8">
            <h1 className="text-3xl font-bold text-blue-500">
              Explora Proyectos con IA e Intégralos Tú Mismo
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Aprende a usar inteligencia artificial con tu propia API Key. Aquí puedes probar prototipos funcionales, analizar su código y aplicarlos fácilmente en tus propios proyectos.
            </p>
          </div>

          {proyectos.map((p) => (
            <div key={p.id} id={p.id}>
              <ProjectCard
                titulo={p.titulo}
                video={p.video}
                ComponentePrototipo={p.ComponentePrototipo}
                codePackage={p.codePackage}
              />
            </div>
          ))}

          <Footer />
        </main>
      </div>
    </div>
  );
}
