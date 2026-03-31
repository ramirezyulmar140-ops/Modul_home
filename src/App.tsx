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

import Header from './components/Header'
import Footer from './components/Footer'
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
      <Header />

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

      <Footer />
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
