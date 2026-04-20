import { useState } from 'react';
import { Code } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  {
    id: 'generics',
    label: 'Generics',
    description: 'Write one function that works for any type, safely.',
    code: `// A generic identity function
function identity<T>(value: T): T {
  return value;
}

// Works with any type — fully type-safe!
const num  = identity<number>(42);       // → number
const str  = identity<string>("hello");  // → string
const arr  = identity<number[]>([1, 2]); // → number[]

// Generic with constraints
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

getLength("hello");    // ✅ 5
getLength([1, 2, 3]);  // ✅ 3
getLength(42);         // ❌ Type Error! number has no .length`,
  },
  {
    id: 'utility',
    label: 'Utility Types',
    description: 'Built-in TypeScript helpers to transform existing types.',
    code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial — make all fields optional
type UpdatePayload = Partial<User>;
// → { id?: number; name?: string; email?: string; ... }

// Pick — select only specific fields
type PublicUser = Pick<User, "id" | "name">;
// → { id: number; name: string }

// Omit — exclude specific fields
type SafeUser = Omit<User, "password">;
// → { id: number; name: string; email: string }

// Readonly — freeze the shape
type FrozenUser = Readonly<User>;
// frozen.name = "x"; // ❌ Cannot assign to read-only property`,
  },
  {
    id: 'strict',
    label: 'Strict Mode',
    description: 'Catch entire classes of runtime bugs at compile time.',
    code: `// tsconfig.json: "strict": true

// --- strictNullChecks ---
function greet(name: string | null) {
  // Without strict, this silently crashes at runtime!
  // With strict: TypeScript forces you to handle null:
  if (name === null) {
    return "Hello, stranger!";
  }
  return \`Hello, \${name}!\`;
}

// --- noImplicitAny ---
// This is banned in strict mode:
function process(data) { // ❌ 'data' implicitly has 'any' type
  return data.value;
}

// This is the correct form:
function process(data: { value: string }): string {
  return data.value; // ✅ Fully safe
}

// --- strictFunctionTypes ---
type Handler = (event: MouseEvent) => void;
const handler: Handler = (e: Event) => {}; // ❌ Wrong - parameter type mismatch`,
  },
  {
    id: 'interface',
    label: 'Interface Design',
    description: 'Define the shape of objects and contracts between components.',
    code: `// Basic interface
interface Point {
  x: number;
  y: number;
}

// Extension — build from existing types
interface Point3D extends Point {
  z: number;
}

// Optional + Readonly fields
interface Config {
  readonly apiKey: string;     // Can never be changed
  timeout?: number;            // Optional — may be undefined
  retries: number;
}

// Function signatures inside interfaces
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: number): Promise<void>;
}

// Implementing an interface
class UserRepository implements Repository<User> {
  async findById(id: number) { /* ... */ return null; }
  async findAll() { return []; }
  async save(user: User) { return user; }
  async delete(id: number) { /* ... */ }
}`,
  },
];

// Step 1: HTML-escape the raw code so < > & are safe
// Step 2: Apply colour rules once — patterns only match plain text, never injected HTML
function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlight(code: string) {
  const escaped = escapeHtml(code);

  // We split on newlines so comment detection works per-line,
  // then apply keyword/literal colours to the whole block.
  const lines = escaped.split('\n').map(line => {
    // Comments — must run before keyword pass so keywords inside comments stay grey
    return line.replace(/^(.*?)(\/\/.*)$/, (_m, before, comment) => {
      return before + `<span class="text-gray-500 italic">${comment}</span>`;
    });
  });

  return lines.join('\n')
    // Keywords — only match outside already-wrapped spans (plain text segments)
    .replace(/\b(interface|type|function|const|class|implements|extends|return|if|async|await|new)\b(?![^<]*<\/span>)/g,
      '<span class="text-violet-400">$1</span>')
    // Type names
    .replace(/\b(string|number|boolean|void|null|Promise|Partial|Pick|Omit|Readonly)\b(?![^<]*<\/span>)/g,
      '<span class="text-blue-400">$1</span>')
    // Quoted strings — &quot; form from escaping
    .replace(/&quot;([^&]*)&quot;/g,
      '<span class="text-amber-400">&quot;$1&quot;</span>')
    // Numeric literals
    .replace(/\b(\d+)\b(?![^<]*<\/span>)/g,
      '<span class="text-orange-400">$1</span>')
    // Emoji markers
    .replace(/(✅|❌)/g, '<span>$1</span>');
}

export default function TypeScriptExplorer() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const tab = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all ${
              activeTab === t.id
                ? 'bg-electric-blue text-dark-bg shadow-[0_0_12px_#00F0FF55]'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Description card */}
        <div className="glass-panel p-4 border-l-4 border-electric-blue flex items-start gap-3">
          <Code size={18} className="text-electric-blue mt-0.5 shrink-0" />
          <p className="text-gray-300 text-sm">{tab.description}</p>
        </div>

        {/* Code block */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 text-xs text-gray-500 font-mono">example.ts</span>
          </div>
          <pre
            className="p-5 text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlight(tab.code) }}
          />
        </div>
      </motion.div>
    </div>
  );
}
