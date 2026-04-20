import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, RefreshCw } from 'lucide-react';

interface Props {
  label: string;
  color: 'blue' | 'green' | 'red' | 'purple';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  rounded: boolean;
  outlined: boolean;
  icon: boolean;
}

const colorMap = {
  blue:   { bg: 'bg-blue-600',   border: 'border-blue-600',   text: 'text-blue-400',   hex: '#2563eb' },
  green:  { bg: 'bg-emerald-600', border: 'border-emerald-600', text: 'text-emerald-400', hex: '#059669' },
  red:    { bg: 'bg-rose-600',   border: 'border-rose-600',   text: 'text-rose-400',   hex: '#e11d48' },
  purple: { bg: 'bg-violet-600', border: 'border-violet-600', text: 'text-violet-400', hex: '#7c3aed' },
};

const sizeMap = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg',
};

const defaults: Props = { label: 'Click Me', color: 'blue', size: 'md', disabled: false, rounded: false, outlined: false, icon: false };

function generateJSX(p: Props) {
  const lines = [`<Button`];
  lines.push(`  label="${p.label}"`);
  lines.push(`  color="${p.color}"`);
  lines.push(`  size="${p.size}"`);
  if (p.disabled)  lines.push(`  disabled`);
  if (p.rounded)   lines.push(`  rounded`);
  if (p.outlined)  lines.push(`  outlined`);
  if (p.icon)      lines.push(`  icon`);
  lines.push(`/>`);
  return lines.join('\n');
}

export default function ReactPlayground() {
  const [props, setProps] = useState<Props>(defaults);
  const c = colorMap[props.color];
  
  const buttonClass = [
    sizeMap[props.size],
    props.rounded ? 'rounded-full' : 'rounded-md',
    props.outlined
      ? `bg-transparent border-2 ${c.border} ${c.text}`
      : `${c.bg} text-white`,
    props.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:opacity-90 active:scale-95',
    'font-semibold transition-all duration-150 flex items-center gap-2 select-none',
  ].join(' ');

  const set = (key: keyof Props, val: any) => setProps(p => ({ ...p, [key]: val }));

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6">
      {/* Controls Panel */}
      <div className="glass-panel p-5 space-y-5">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Prop Editor</h3>

        {/* Label */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">label</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-electric-blue"
            value={props.label}
            onChange={e => set('label', e.target.value)}
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400">color</label>
          <div className="flex gap-2">
            {(['blue', 'green', 'red', 'purple'] as const).map(c => (
              <button
                key={c}
                onClick={() => set('color', c)}
                style={{ backgroundColor: colorMap[c].hex }}
                className={`w-7 h-7 rounded-full transition-all ${props.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400">size</label>
          <div className="flex gap-2">
            {(['sm', 'md', 'lg'] as const).map(s => (
              <button
                key={s}
                onClick={() => set('size', s)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${props.size === s ? 'bg-electric-blue text-dark-bg' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        {(['disabled', 'rounded', 'outlined', 'icon'] as const).map(key => (
          <div key={key} className="flex items-center justify-between">
            <label className="text-xs text-gray-400">{key}</label>
            <button
              onClick={() => set(key, !(props as any)[key])}
              className={`w-10 h-5 rounded-full transition-colors relative ${(props as any)[key] ? 'bg-electric-blue' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${(props as any)[key] ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}

        <button
          onClick={() => setProps(defaults)}
          className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-300 py-2 border border-gray-700 rounded hover:border-gray-500 transition-colors"
        >
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      {/* Preview + Code */}
      <div className="space-y-4">
        {/* Live Preview */}
        <div className="glass-panel p-8 flex items-center justify-center min-h-[160px]">
          <motion.button
            layoutId="live-btn"
            disabled={props.disabled}
            className={buttonClass}
          >
            {props.icon && <Layout size={16} />}
            {props.label}
          </motion.button>
        </div>

        {/* JSX Output */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 font-mono text-sm">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest">Generated JSX</p>
          <pre className="text-emerald-400 whitespace-pre-wrap">{generateJSX(props)}</pre>
        </div>

        {/* Re-render counter */}
        <p className="text-xs text-gray-600 text-right italic">
          Props drive re-renders — every toggle instantly updates the component tree.
        </p>
      </div>
    </div>
  );
}
