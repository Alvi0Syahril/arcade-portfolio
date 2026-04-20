import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import AIChat from '../components/AIChat';
import SOLIDCaseStudy from '../components/interactive/SOLIDCaseStudy';

export default function Home() {
  return (
    <div className="space-y-32">
      <Hero />
      <main className="max-w-6xl mx-auto space-y-32">
        <About />
        <Skills />
        <Projects />
        <SOLIDCaseStudy />
        <AIChat />
      </main>
    </div>
  );
}
