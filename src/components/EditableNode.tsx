import React, { useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

type EditableNodeData = {
  label: string;
  onChange: (value: string) => void;
  kind?: "decision" | "task";
  shape?: "pill" | "process" | "wave" | "diamond";
};

export function EditableNode({ data }: NodeProps<EditableNodeData>) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.label);

  const commit = () => {
    const value = draft.trim();
    data.onChange(value.length ? value : data.label);
    setEditing(false);
  };

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} id="t" style={handleViz} />
      <Handle type="target" position={Position.Left} id="l" style={handleViz} />
      <Handle type="target" position={Position.Right} id="r" style={handleViz} />
      <Handle type="target" position={Position.Bottom} id="b" style={handleViz} />
      <Handle type="source" position={Position.Top} id="st" style={handleViz} />
      <Handle type="source" position={Position.Left} id="sl" style={handleViz} />
      <Handle type="source" position={Position.Right} id="sr" style={handleViz} />
      <Handle type="source" position={Position.Bottom} id="sb" style={handleViz} />

      <div
        className={`min-w-[180px] max-w-[260px] px-4 py-3 text-sm transition ${
          data.kind === "decision"
            ? "border border-slate-300 bg-white"
            : "border border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark"
        }`}
        style={deriveShapeStyle(data.shape || (data.kind === "decision" ? "diamond" : "process"))}
        onDoubleClick={() => setEditing(true)}
      >
        {editing ? (
          <input
            autoFocus
            className="w-full rounded-lg border border-border-light bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-border-dark dark:bg-slate-900 dark:text-slate-100"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit();
              }
              if (e.key === "Escape") {
                setDraft(data.label);
                setEditing(false);
              }
            }}
          />
        ) : (
          <div className="space-y-1 text-center">
            <span className="leading-tight block text-center">
              {data.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const deriveShapeStyle = (
  shape: "pill" | "process" | "wave" | "diamond"
): React.CSSProperties => {
  if (shape === "pill") return { borderRadius: 999 };
  if (shape === "wave")
    return {
      borderRadius: "14px",
      clipPath: "path('M0 18 C25 36, 75 0, 100 18 L100 100 L0 100 Z')",
      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.14)",
      border: "1px solid #cbd5e1",
      background: "white"
    };
  if (shape === "diamond")
    return {
      borderRadius: 10,
      padding: 18,
      minWidth: 220,
      minHeight: 140,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.14)",
      border: "1px solid #cbd5e1",
      background: "white"
    };
  return { borderRadius: 14, boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)" };
};

const handleViz: React.CSSProperties = {
  width: 10,
  height: 10,
  background: "#0f172a",
  border: "2px solid #fff",
  boxShadow: "0 0 0 2px #0f172a",
  zIndex: 2
};


export default EditableNode;
