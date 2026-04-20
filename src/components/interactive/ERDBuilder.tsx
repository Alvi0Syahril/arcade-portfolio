import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Database, Key, Type, List, Trash2, Link } from 'lucide-react';

interface Column {
  id: string; // Add internal ID for map keys
  name: string;
  type: string;
  isPk: boolean;
  isFk: boolean;
  referencesTable?: string;
}

interface TableData {
  id: string;
  name: string;
  columns: Column[];
  x: number;
  y: number;
}

const initialPortfolioSchema: TableData[] = [
  {
    id: 'projects',
    name: 'projects',
    x: 50,
    y: 50,
    columns: [
      { id: '1', name: 'id', type: 'INT', isPk: true, isFk: false },
      { id: '2', name: 'title', type: 'VARCHAR(255)', isPk: false, isFk: false },
      { id: '3', name: 'description', type: 'TEXT', isPk: false, isFk: false },
      { id: '4', name: 'tech_stack', type: 'JSON', isPk: false, isFk: false },
    ]
  },
  {
    id: 'skills',
    name: 'skills',
    x: 400,
    y: 50,
    columns: [
      { id: '5', name: 'id', type: 'INT', isPk: true, isFk: false },
      { id: '6', name: 'name', type: 'VARCHAR(100)', isPk: false, isFk: false },
      { id: '7', name: 'category', type: 'VARCHAR(100)', isPk: false, isFk: false },
      { id: '8', name: 'proficiency', type: 'INT', isPk: false, isFk: false },
      // Example FK
      { id: '9', name: 'project_id', type: 'INT', isPk: false, isFk: true, referencesTable: 'projects' },
    ]
  }
];

// Helper Component for Inline Editing without triggering table drags
const EditableText = ({ 
  value, 
  onSave, 
  className 
}: { 
  value: string; 
  onSave: (val: string) => void; 
  className?: string; 
}) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  if (editing) {
    return (
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => { setEditing(false); onSave(val); }}
        onKeyDown={(e) => { 
          if (e.key === 'Enter') { setEditing(false); onSave(val); }
        }}
        onPointerDown={(e) => e.stopPropagation()} // Stop Framer Motion Drag!
        className={`bg-gray-950 text-emerald-400 outline-none rounded border border-emerald-900/50 px-1 py-0 min-w-[50px] shadow-inner ${className}`}
        style={{ width: `${Math.max(3, val.length + 1)}ch` }}
      />
    );
  }

  return (
    <span 
      onClick={() => setEditing(true)} 
      onPointerDown={(e) => e.stopPropagation()} 
      className={`cursor-text hover:bg-gray-800 rounded px-1 transition-colors ${className}`}
    >
      {value || '___'}
    </span>
  );
};

export default function ERDBuilder() {
  const [tables, setTables] = useState<TableData[]>(initialPortfolioSchema);
  const tableRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const svgRef = useRef<SVGSVGElement>(null);

  const addTable = () => {
    const newTable: TableData = {
      id: `table_${Date.now()}`,
      name: `new_table`,
      x: 100 + (tables.length * 20),
      y: 100 + (tables.length * 20),
      columns: [
        { id: `col_${Date.now()}`, name: 'id', type: 'INT', isPk: true, isFk: false }
      ]
    };
    setTables([...tables, newTable]);
  };

  const updateTable = (id: string, newName: string) => {
    setTables(tabs => tabs.map(t => t.id === id ? { ...t, name: newName } : t));
  };

  const addColumn = (tableId: string) => {
    setTables(tabs => tabs.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          columns: [...t.columns, { id: `col_${Date.now()}`, name: 'new_col', type: 'VARCHAR', isPk: false, isFk: false }]
        };
      }
      return t;
    }));
  };

  const updateColumn = (tableId: string, colId: string, updates: Partial<Column>) => {
    setTables(tabs => tabs.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          columns: t.columns.map(c => c.id === colId ? { ...c, ...updates } : c)
        };
      }
      return t;
    }));
  };

  const removeColumn = (tableId: string, colId: string) => {
    setTables(tabs => tabs.map(t => {
      if (t.id === tableId) { return { ...t, columns: t.columns.filter(c => c.id !== colId) }; }
      return t;
    }));
  };

  // Ultra high-performance SVG drawing loop. Never triggers React renders when dragging!
  useEffect(() => {
    let animationFrameId: number;
    const drawLines = () => {
      if (!svgRef.current) return;
      let paths = '';
      
      const canvasRect = svgRef.current.getBoundingClientRect();

      tables.forEach(table => {
        const fromEl = tableRefs.current[table.id];
        if (!fromEl) return;
        const fromRect = fromEl.getBoundingClientRect();
        
        table.columns.forEach(col => {
          if (col.isFk && col.referencesTable) {
            const targetTable = tables.find(t => t.name === col.referencesTable);
            if (targetTable) {
              const toEl = tableRefs.current[targetTable.id];
              if (toEl) {
                const toRect = toEl.getBoundingClientRect();
                
                // Calculate center points relative to the SVG Canvas bounding box
                const startX = fromRect.left - canvasRect.left + (fromRect.width / 2);
                const startY = fromRect.top - canvasRect.top + (fromRect.height / 2);
                const endX = toRect.left - canvasRect.left + (toRect.width / 2);
                const endY = toRect.top - canvasRect.top + (toRect.height / 2);
                
                // Bezier Curve
                paths += `<path d="M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}" stroke="#10B981" stroke-width="2" fill="none" stroke-dasharray="5,5" />`;
                // Add an arrowhead at the end (roughly)
                paths += `<circle cx="${endX}" cy="${endY}" r="4" fill="#F59E0B" />`;
              }
            }
          }
        });
      });
      svgRef.current.innerHTML = paths;
      animationFrameId = requestAnimationFrame(drawLines);
    };
    drawLines();
    return () => cancelAnimationFrame(animationFrameId);
  }, [tables]);

  return (
    <div className="w-full h-[600px] bg-dark-bg border border-gray-800 rounded-xl overflow-hidden relative shadow-inner flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-900 border-b border-gray-800 p-3 flex justify-between items-center z-50">
        <div className="flex gap-4 items-center pl-2">
          <Database className="text-electric-blue" size={20} />
          <h3 className="font-mono text-sm text-gray-300">Interactive Canvas</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={addTable}
            className="flex items-center gap-2 bg-emerald-accent/10 text-emerald-accent hover:bg-emerald-accent/20 px-4 py-1.5 rounded-lg text-sm transition-colors border border-emerald-accent/30"
          >
            <Plus size={16} /> Add Table
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-grow w-full relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#2d3748 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        
        {/* Dynamic Foreign Key Vector Lines */}
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {tables.map(table => (
          <motion.div
            key={table.id}
            drag
            dragMomentum={false}
            initial={{ x: table.x, y: table.y }}
            ref={el => tableRefs.current[table.id] = el!}
            className="absolute bg-gray-900 border border-gray-700 min-w-[250px] rounded-lg shadow-xl cursor-grab active:cursor-grabbing flex flex-col z-10"
          >
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 border-b border-gray-600 flex items-center justify-between">
              <EditableText 
                value={table.name} 
                onSave={(val) => updateTable(table.id, val)} 
                className="font-bold text-emerald-400 text-sm tracking-wide"
              />
              <List size={14} className="text-gray-400" />
            </div>

            {/* Columns Data */}
            <div className="p-2 space-y-1 bg-dark-bg/80 flex-grow">
              {table.columns.map((col) => (
                <div key={col.id} className="group flex items-center justify-between py-1 px-1 hover:bg-gray-800 rounded">
                  <div className="flex items-center gap-2">
                     
                    {/* PK Toggle */}
                    <button 
                       onPointerDown={(e) => e.stopPropagation()}
                       onClick={() => updateColumn(table.id, col.id, { isPk: !col.isPk })}
                       className={`p-1 rounded hover:bg-gray-700 transition-colors ${col.isPk ? 'bg-yellow-500/10' : ''}`}
                    >
                       <Key size={12} className={col.isPk ? 'text-yellow-500' : 'text-gray-600'} />
                    </button>

                    <EditableText 
                      value={col.name} 
                      onSave={(val) => updateColumn(table.id, col.id, { name: val })}
                      className={`text-xs ${col.isPk ? 'text-yellow-500 font-bold' : 'text-gray-300'}`}
                    />

                    {/* FK visual string */}
                    {col.isFk && (
                       <div className="flex items-center text-[10px] text-gray-400 bg-gray-800 px-1 rounded ml-1">
                          <Link size={8} className="mr-1 text-emerald-500" />
                          <EditableText 
                             value={col.referencesTable || ''}
                             onSave={(val) => updateColumn(table.id, col.id, { referencesTable: val })}
                             className="text-emerald-400 italic"
                          />
                       </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <EditableText 
                       value={col.type}
                       onSave={(val) => updateColumn(table.id, col.id, { type: val })}
                       className="text-[10px] text-gray-500 font-mono text-right uppercase"
                    />

                    {/* FK Toggle */}
                    <button
                       onPointerDown={(e) => e.stopPropagation()}
                       onClick={() => updateColumn(table.id, col.id, { isFk: !col.isFk, referencesTable: !col.isFk ? 'table' : undefined })}
                       className={`p-1 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity ${col.isFk ? 'opacity-100 bg-emerald-500/10' : ''}`}
                    >
                       <Link size={12} className={col.isFk ? 'text-emerald-500' : 'text-gray-600'} />
                    </button>

                    {/* Delete Column Button */}
                    <button 
                       onPointerDown={(e) => e.stopPropagation()}
                       onClick={() => removeColumn(table.id, col.id)}
                       className="text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 p-1 rounded transition-all"
                    >
                       <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Form */}
            <div className="border-t border-gray-800 bg-gray-900 p-2">
               <button 
                 onPointerDown={(e) => e.stopPropagation()}
                 onClick={() => addColumn(table.id)}
                 className="text-[11px] text-gray-400 hover:text-emerald-400 flex items-center justify-center w-full py-1 hover:bg-gray-800 rounded transition-colors"
               >
                 <Plus size={12} className="mr-1" /> Add Column
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
