import { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// NOTE: This single-file React component is intended to be used in a project
// that already has TailwindCSS configured and the packages installed:
// "zustand", "html2canvas", "jspdf" (or via CDN in an HTML wrapper)
// Save as App.tsx or paste into a previewable React environment.

/* =====================
   Types
   ===================== */

type Rule = {
  id: string;
  text: string;
};

type Subtask = {
  id: string;
  text: string;
};

type Block = {
  id: string;
  title: string;
  subtitle?: string;
  subtasks: Subtask[];
};

/* =====================
   Util helpers
   ===================== */

const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

/* =====================
   Zustand Store (with persist)
   ===================== */

type BuilderState = {
  rules: Rule[];
  blocks: Block[];
  // actions
  addRule: (text: string) => void;
  editRule: (id: string, text: string) => void;
  deleteRule: (id: string) => void;
  addBlock: (title?: string) => void;
  editBlockTitle: (id: string, title: string) => void;
  deleteBlock: (id: string) => void;

  addSubtask: (blockId: string, text: string) => void;
  editSubtask: (blockId: string, subtaskId: string, text: string) => void;
  deleteSubtask: (blockId: string, subtaskId: string) => void;
  reset: () => void;
};

export const useBuilderStore = create<BuilderState>(
  persist(
    (set, get) => ({
      rules: [
        { id: uid("rule"), text: "Use a single fixed slot for unstructured leisure" },
        { id: uid("rule"), text: "Stick to the defined categories" },
      ],
      blocks: [
        {
          id: uid("block"),
          title: "Problem Solving",
          subtitle: "Focus on algorithm practice",
          subtasks: [
            { id: uid("task"), text: "LeetCode - Top 30" },
            { id: uid("task"), text: "Read solution notes" },
          ],
        },
      ],

      addRule: (text: string) =>
        set((s) => ({ rules: [...s.rules, { id: uid("rule"), text }] })),

      editRule: (id: string, text: string) =>
        set((s) => ({ rules: s.rules.map((r) => (r.id === id ? { ...r, text } : r)) })),

      deleteRule: (id: string) => set((s) => ({ rules: s.rules.filter((r) => r.id !== id) })),

      addBlock: (title = "New Block") =>
        set((s) => ({
          blocks: [
            ...s.blocks,
            { id: uid("block"), title, subtitle: "", subtasks: [{ id: uid("task"), text: "New Task" }] },
          ],
        })),

      editBlockTitle: (id: string, title: string) =>
        set((s) => ({ blocks: s.blocks.map((b) => (b.id === id ? { ...b, title } : b)) })),

      deleteBlock: (id: string) => set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) })),

      addSubtask: (blockId: string, text: string) =>
        set((s) => ({
          blocks: s.blocks.map((b) =>
            b.id === blockId ? { ...b, subtasks: [...b.subtasks, { id: uid("task"), text }] } : b
          ),
        })),

      editSubtask: (blockId: string, subtaskId: string, text: string) =>
        set((s) => ({
          blocks: s.blocks.map((b) =>
            b.id === blockId
              ? { ...b, subtasks: b.subtasks.map((t) => (t.id === subtaskId ? { ...t, text } : t)) }
              : b
          ),
        })),

      deleteSubtask: (blockId: string, subtaskId: string) =>
        set((s) => ({
          blocks: s.blocks.map((b) =>
            b.id === blockId ? { ...b, subtasks: b.subtasks.filter((t) => t.id !== subtaskId) } : b
          ),
        })),

      reset: () =>
        set(() => ({
          rules: [],
          blocks: [],
        })),
    }),
    {
      name: "lockin-builder-storage",
    }
  )
);

/* =====================
   Small presentational components
   ===================== */

const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-2 py-1 rounded-md text-sm hover:opacity-90 transition-shadow shadow-sm ${className}`}
  >
    {children}
  </button>
);

/* =====================
   Main App
   ===================== */

export default function App() {
  const {
    rules,
    blocks,
    addRule,
    editRule,
    deleteRule,
    addBlock,
    editBlockTitle,
    deleteBlock,
    addSubtask,
    editSubtask,
    deleteSubtask,
    reset,
  } = useBuilderStore();

  const [newRuleText, setNewRuleText] = useState("");
  const [newBlockTitle, setNewBlockTitle] = useState("");

  // PDF export refs
  const planRef = useRef<HTMLDivElement | null>(null);

  // lazy import to avoid SSR issues in environments that don't have window
  const handleExportPDF = async () => {
    if (!planRef.current) return;
    // dynamic imports
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const element = planRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("lockin-plan.pdf");
  };

  useEffect(() => {
    // ensure there's at least one block when starting (optional)
    if (blocks.length === 0) addBlock("Block A");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Lock-In Block Builder</h1>
          <p className="mt-2 text-gray-600">Create a daily plan with rules, blocks and subtasks — saved to your browser.</p>
        </header>

        {/* Controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex gap-2 items-center">
            <input
              value={newBlockTitle}
              onChange={(e) => setNewBlockTitle(e.target.value)}
              placeholder="New block title"
              className="px-3 py-2 rounded-lg border border-gray-200 shadow-sm"
            />
            <IconButton
              onClick={() => {
                addBlock(newBlockTitle || "New Block");
                setNewBlockTitle("");
              }}
              className="bg-blue-600 text-white"
            >
              + Add Block
            </IconButton>
          </div>

          <div className="flex gap-2">
            <IconButton onClick={() => reset()} className="bg-red-50 text-red-700 border border-red-100">
              Reset
            </IconButton>
            <IconButton onClick={handleExportPDF} className="bg-green-600 text-white">
              Download PDF
            </IconButton>
          </div>
        </div>

        {/* The plan to export */}
        <div ref={planRef} className="bg-white rounded-2xl shadow p-6">
          {/* Header inside plan */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">Daily Structure</h2>
            <p className="text-sm text-gray-500 mt-1">Customize your blocks and rules — this is what gets exported.</p>
          </div>

          <hr className="my-4" />

          {/* Rules section */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Rules</h3>
              <div className="flex gap-2 items-center">
                <input
                  value={newRuleText}
                  onChange={(e) => setNewRuleText(e.target.value)}
                  placeholder="Add a rule..."
                  className="px-3 py-2 rounded-lg border border-gray-200 shadow-sm"
                />
                <IconButton
                  onClick={() => {
                    if (!newRuleText.trim()) return;
                    addRule(newRuleText.trim());
                    setNewRuleText("");
                  }}
                  className="bg-indigo-600 text-white"
                >
                  Add
                </IconButton>
              </div>
            </div>

            <div className="space-y-2">
              {rules.map((r) => (
                <RuleRow key={r.id} rule={r} onEdit={editRule} onDelete={deleteRule} />
              ))}
            </div>
          </section>

          <hr className="my-4" />

          {/* Blocks */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Blocks</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blocks.map((b) => (
                <BlockCard
                  key={b.id}
                  block={b}
                  onEditTitle={editBlockTitle}
                  onDelete={() => deleteBlock(b.id)}
                  onAddSubtask={(text) => addSubtask(b.id, text)}
                  onEditSubtask={(subId, text) => editSubtask(b.id, subId, text)}
                  onDeleteSubtask={(subId) => deleteSubtask(b.id, subId)}
                />
              ))}
            </div>
          </section>

          <hr className="my-4" />

          {/* Motivational end */}
          <div className="text-center mt-6">
            <p className="italic text-gray-600">Stay consistent. Stay locked in.</p>
          </div>
        </div>

        <footer className="text-center text-xs text-gray-400 mt-6">Built with React + Zustand + Tailwind</footer>
      </div>
    </div>
  );
}

/* =====================
   RuleRow component
   ===================== */

const RuleRow: React.FC<{ rule: Rule; onEdit: (id: string, text: string) => void; onDelete: (id: string) => void }> = ({ rule, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(rule.text);

  useEffect(() => setText(rule.text), [rule.text]);

  return (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
      <div className="flex-1">
        {!editing ? (
          <p className="text-sm">{rule.text}</p>
        ) : (
          <input value={text} onChange={(e) => setText(e.target.value)} className="w-full px-3 py-2 rounded border" />
        )}
      </div>

      {!editing ? (
        <div className="flex gap-2">
          <IconButton onClick={() => setEditing(true)} className="bg-yellow-50 text-yellow-700">
            Edit
          </IconButton>
          <IconButton onClick={() => onDelete(rule.id)} className="bg-red-50 text-red-700">
            Delete
          </IconButton>
        </div>
      ) : (
        <div className="flex gap-2">
          <IconButton
            onClick={() => {
              onEdit(rule.id, text.trim() || "Untitled rule");
              setEditing(false);
            }}
            className="bg-green-50 text-green-700"
          >
            Save
          </IconButton>
          <IconButton onClick={() => setEditing(false)} className="bg-gray-50 text-gray-700">
            Cancel
          </IconButton>
        </div>
      )}
    </div>
  );
};

/* =====================
   BlockCard component
   ===================== */

const BlockCard: React.FC<{
  block: Block;
  onEditTitle: (id: string, title: string) => void;
  onDelete: () => void;
  onAddSubtask: (text: string) => void;
  onEditSubtask: (subId: string, text: string) => void;
  onDeleteSubtask: (subId: string) => void;
}> = ({ block, onEditTitle, onDelete, onAddSubtask, onEditSubtask, onDeleteSubtask }) => {
  const [titleEditing, setTitleEditing] = useState(false);
  const [title, setTitle] = useState(block.title);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => setTitle(block.title), [block.title]);

  return (
    <div className="p-4 rounded-xl border border-gray-100 shadow-sm bg-white">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          {!titleEditing ? (
            <h4 className="text-lg font-bold">{block.title}</h4>
          ) : (
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="px-3 py-2 rounded border w-full" />
          )}
          {block.subtitle && <p className="text-sm text-gray-500 mt-1">{block.subtitle}</p>}
        </div>
        <div className="flex gap-2">
          {!titleEditing ? (
            <IconButton onClick={() => setTitleEditing(true)} className="bg-yellow-50 text-yellow-700">
              Edit
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                onEditTitle(block.id, title.trim() || "Untitled Block");
                setTitleEditing(false);
              }}
              className="bg-green-50 text-green-700"
            >
              Save
            </IconButton>
          )}

          <IconButton onClick={onDelete} className="bg-red-50 text-red-700">
            Delete
          </IconButton>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {block.subtasks.map((t) => (
          <SubtaskRow key={t.id} subtask={t} onEdit={(text) => onEditSubtask(t.id, text)} onDelete={() => onDeleteSubtask(t.id)} />
        ))}

        <div className="flex gap-2 items-center">
          <input
            placeholder="New subtask"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            className="px-3 py-2 rounded border flex-1"
          />
          <IconButton
            onClick={() => {
              if (!newSubtask.trim()) return;
              onAddSubtask(newSubtask.trim());
              setNewSubtask("");
            }}
            className="bg-indigo-600 text-white"
          >
            +
          </IconButton>
        </div>
      </div>
    </div>
  );
};

/* =====================
   SubtaskRow component
   ===================== */

const SubtaskRow: React.FC<{ subtask: Subtask; onEdit: (text: string) => void; onDelete: () => void }> = ({ subtask, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(subtask.text);

  useEffect(() => setText(subtask.text), [subtask.text]);

  return (
    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded">
      <div className="flex-1">
        {!editing ? <p className="text-sm">{subtask.text}</p> : <input value={text} onChange={(e) => setText(e.target.value)} className="w-full px-2 py-1 rounded" />}
      </div>

      {!editing ? (
        <div className="flex gap-2">
          <IconButton onClick={() => setEditing(true)} className="bg-yellow-50 text-yellow-700">
            Edit
          </IconButton>
          <IconButton onClick={onDelete} className="bg-red-50 text-red-700">
            Delete
          </IconButton>
        </div>
      ) : (
        <div className="flex gap-2">
          <IconButton
            onClick={() => {
              onEdit(text.trim() || "Untitled Task");
              setEditing(false);
            }}
            className="bg-green-50 text-green-700"
          >
            Save
          </IconButton>
          <IconButton onClick={() => setEditing(false)} className="bg-gray-50 text-gray-700">
            Cancel
          </IconButton>
        </div>
      )}
    </div>
  );
};
