import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import LeadForm1 from './components/LeadForm1'
import Features from './components/Features'
import Technology from './components/Technology'
import Testimonials from './components/Testimonials'
import Quiz from './components/Quiz'
import Catalog from './components/Catalog'
import CostCalculator from './components/CostCalculator'
import Steps from './components/Steps'
import Guarantee from './components/Guarantee'
import Team from './components/Team'
import Comparison from './components/Comparison'
import LeadForm2 from './components/LeadForm2'
import StyleProjectsPage from './pages/StyleProjectsPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import ManagerCalculator from './components/ManagerCalculator/ManagerCalculator'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [pathname, hash]);

  return null;
}

function MainLayout() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      {/* Header placeholders could go here */}

      <main className="flex-grow">
        <Hero />
        <Catalog />
        <Quiz />
        <Benefits />
        <Features />
        <Technology />
        <CostCalculator />
        <Comparison />
        <Steps />
        <Guarantee />
        <Testimonials />
        <Team />
        <LeadForm1 />
        <LeadForm2 />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center pb-8 border-b border-gray-800">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold text-white font-serif tracking-tight">Модуль<span className="text-green-500">Дом</span></span>
              <p className="mt-2 text-sm max-w-xs">Современные модульные дома для круглогодичного проживания на Урале.</p>
            </div>

            <div className="flex gap-6">
              <a href="#catalog" className="hover:text-white transition-colors">Каталог</a>
              <a href="#" className="hover:text-white transition-colors">О нас</a>
              <a href="#" className="hover:text-white transition-colors">Контакты</a>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>© 2026 МодульДом Екатеринбург. Все права защищены.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition-colors">Пользовательское соглашение</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/style/:styleId" element={<StyleProjectsPage />} />
        <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
        {/* Скрытый роут для менеджеров */}
        <Route path="/manager-calculator" element={<ManagerCalculator />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
