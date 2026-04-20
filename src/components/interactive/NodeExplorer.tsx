import { useState } from 'react';
import { Send, Server, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  body?: string;
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/health',
    description: 'Check if the Express server is running.',
  },
  {
    method: 'POST',
    path: '/api/ai/query',
    description: 'Send a natural-language query to the AI data layer.',
    body: JSON.stringify({ query: 'show me all projects' }, null, 2),
  },
];

const METHOD_COLOR = {
  GET:  'bg-emerald-900/40 text-emerald-400 border border-emerald-800',
  POST: 'bg-amber-900/40  text-amber-400  border border-amber-800',
};

export default function NodeExplorer() {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading]   = useState(false);
  const [response, setResponse] = useState<{ status: number; data: any } | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const ep = endpoints[selected];

  const send = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const options: RequestInit = {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (ep.method === 'POST' && ep.body) {
        options.body = ep.body;
      }

      const res = await fetch(`http://localhost:5000${ep.path}`, options);
      const data = await res.json().catch(() => ({}));
      setResponse({ status: res.status, data });
    } catch {
      setError('Could not reach server at localhost:5000. Make sure npm run server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Endpoint Selector */}
      <div className="glass-panel p-4 space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Available Endpoints</p>
        {endpoints.map((e, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setResponse(null); setError(null); }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
              selected === i ? 'bg-gray-700 ring-1 ring-electric-blue' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${METHOD_COLOR[e.method]}`}>
              {e.method}
            </span>
            <span className="font-mono text-sm text-gray-200">{e.path}</span>
            <span className="text-xs text-gray-500 ml-auto hidden md:block">{e.description}</span>
          </button>
        ))}
      </div>

      {/* Request Panel */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Request</p>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 font-mono text-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${METHOD_COLOR[ep.method]}`}>{ep.method}</span>
              <span className="text-gray-300">http://localhost:5000<span className="text-electric-blue">{ep.path}</span></span>
            </div>
            <div className="text-gray-600 text-xs">Content-Type: application/json</div>
            {ep.body && (
              <>
                <div className="border-t border-gray-800 my-2" />
                <p className="text-xs text-gray-500">Body:</p>
                <pre className="text-amber-300 text-xs">{ep.body}</pre>
              </>
            )}
          </div>

          <button
            onClick={send}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-electric-blue hover:bg-electric-blue/80 disabled:opacity-50 text-dark-bg font-bold py-3 rounded-xl transition-all"
          >
            {loading
              ? <><div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" /> Sending...</>
              : <><Send size={16} /> Send Request</>
            }
          </button>
        </div>

        {/* Response Panel */}
        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Response</p>
          <motion.div
            key={response ? 'data' : error ? 'error' : 'empty'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-950 border border-gray-800 rounded-xl p-4 min-h-[160px] font-mono text-sm"
          >
            {!response && !error && (
              <p className="text-gray-600 flex items-center gap-2 h-full">
                <Server size={16} /> Hit "Send Request" to fire a live request to your Express API.
              </p>
            )}
            {response && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {response.status < 300
                    ? <CheckCircle size={16} className="text-emerald-400" />
                    : <XCircle size={16} className="text-rose-400" />}
                  <span className={response.status < 300 ? 'text-emerald-400' : 'text-rose-400'}>
                    HTTP {response.status}
                  </span>
                </div>
                <pre className="text-gray-300 text-xs overflow-auto max-h-[200px]">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 text-rose-400">
                <XCircle size={16} className="mt-0.5 shrink-0" />
                <span className="text-xs">{error}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Architecture note */}
      <div className="glass-panel p-4 border-l-4 border-emerald-700">
        <p className="text-xs text-gray-400 font-mono leading-relaxed">
          <span className="text-emerald-400 font-bold">How it works: </span>
          Your browser sends a fetch() call directly to your Node.js + Express server running on port 5000.
          Express routes the request through a Controller → Service → Repository pipeline before returning JSON.
        </p>
      </div>
    </div>
  );
}
