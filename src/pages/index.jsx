import Navbar from '../components/Navbar';
import SectionList from '../components/SectionList';
import ProjectCard from '../components/ProjectCard';
import MiniChatbot from '../components/projects/MiniChatbot';
import ExcelAnalyzer from '../components/projects/ExcelAnalyzer';
import DynamicBackground from '../components/DynamicBackground';
import Footer from '../components/Footer';
import MiniChatbotPackage from '../components/codeSnippets/MiniChatbotPackage';
import ExcelAnalyzerPackage from '../components/codeSnippets/ExcelAnalyzerPackage';

export default function Home() {
  const proyectos = [
    {
      id: 'chatbot',
      titulo: 'Mini Chatbot con GPT',
      video: '/chatbot.mp4',
      ComponentePrototipo: MiniChatbot,
      codePackage: MiniChatbotPackage, // aquí lo pasas
    },
    {
      id: 'excel',
      titulo: 'Análisis de Datos desde Excel',
      video: '/excelchatbot.mp4',
      ComponentePrototipo: ExcelAnalyzer,
      codePackage: ExcelAnalyzerPackage, // otro proyecto que no tenga código asociado aún
    },
  ];

  return (
    <div>
      <DynamicBackground />
      <Navbar />

      <div className="flex pt-20">
        <SectionList proyectos={proyectos} />
        <main className="ml-52 p-8 space-y-16 w-full" id="portafolio">
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
