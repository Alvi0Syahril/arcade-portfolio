import Hero from '../components/Hero';
import ModelViewer from '../components/interactive/ModelViewer';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import AIChat from '../components/AIChat';
import SOLIDCaseStudy from '../components/interactive/SOLIDCaseStudy';

export default function Home() {
  return (
    <div className="space-y-32">
      <div id="hero"><Hero /></div>
      <main className="max-w-6xl mx-auto space-y-32">
        <div id="3d-model"><ModelViewer /></div>
        <div id="about"><About /></div>
        <div id="skills"><Skills /></div>
        <div id="projects"><Projects /></div>
        <div id="casestudy"><SOLIDCaseStudy /></div>
        <div id="aichat"><AIChat /></div>
      </main>
    </div>
  );
}
