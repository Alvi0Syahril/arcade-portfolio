import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Database, Layout, Code, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import ERDBuilder from '../components/interactive/ERDBuilder';
import ReactPlayground from '../components/interactive/ReactPlayground';
import TypeScriptExplorer from '../components/interactive/TypeScriptExplorer';
import NodeExplorer from '../components/interactive/NodeExplorer';

const skillConfig: Record<string, {
  icon: JSX.Element;
  title: string;
  description: string;
  demo: JSX.Element;
  demoTitle: string;
}> = {
  'react--vite': {
    icon: <Layout className="text-blue-400" size={40} />,
    title: 'React / Vite',
    description: 'Component Architecture, Hooks, Context API, Performance Profiling. Below is a live prop editor — tweak any property and watch the component re-render instantly.',
    demoTitle: '⚡ Live Component Playground',
    demo: <ReactPlayground />,
  },
  'typescript': {
    icon: <Code className="text-blue-600" size={40} />,
    title: 'TypeScript',
    description: 'Generics, Strict Mode, Utility Types, Interface Design. Explore real TypeScript patterns with syntax-highlighted examples below.',
    demoTitle: '🔬 Type System Explorer',
    demo: <TypeScriptExplorer />,
  },
  'nodejs--express': {
    icon: <Server className="text-green-500" size={40} />,
    title: 'Node.js / Express',
    description: 'RESTful APIs, Middleware, Event Loop, Stream Processing. Use the live API simulator below to fire real requests to the running Express server.',
    demoTitle: '🚀 Live API Request Simulator',
    demo: <NodeExplorer />,
  },
  'mysql--db-arch': {
    icon: <Database className="text-orange-400" size={40} />,
    title: 'MySQL / DB Architecture',
    description: "Schema Design, Normalization, Indexing, Query Optimization. Below is an interactive sandboxed workspace for visual Entity-Relationship diagrams. You can view the actual schema used in this application, and click 'Add Table' to simulate building out extended data layers.",
    demoTitle: '🗄️ Interactive ERD Canvas',
    demo: <ERDBuilder />,
  },
};

export default function SkillDetail() {
  const { id } = useParams();
  const skill = id ? skillConfig[id] : null;

  return (
    <div className="max-w-6xl mx-auto py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-electric-blue transition-colors mb-10">
        <ArrowLeft size={20} /> Back to Portfolio
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {skill ? (
          <>
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-4">
              {skill.icon}
              {skill.title}
            </h1>

            <p className="text-gray-300 text-lg mb-12 max-w-3xl">
              {skill.description}
            </p>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                {skill.demoTitle}
              </h2>
              {skill.demo}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4 capitalize">{id?.replace(/-/g, ' ')}</h1>
            <p className="text-gray-400">Detailed exploration of this competency. Check back later!</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
