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
      <Handle type="target" position={Position.Top} id="t" style={getHandleStyle(data.shape, "t")} />
      <Handle type="target" position={Position.Left} id="l" style={getHandleStyle(data.shape, "l")} />
      <Handle type="target" position={Position.Right} id="r" style={getHandleStyle(data.shape, "r")} />
      <Handle type="target" position={Position.Bottom} id="b" style={getHandleStyle(data.shape, "b")} />
      <Handle type="source" position={Position.Top} id="st" style={getHandleStyle(data.shape, "t")} />
      <Handle type="source" position={Position.Left} id="sl" style={getHandleStyle(data.shape, "l")} />
      <Handle type="source" position={Position.Right} id="sr" style={getHandleStyle(data.shape, "r")} />
      <Handle type="source" position={Position.Bottom} id="sb" style={getHandleStyle(data.shape, "b")} />

      <div
        className={`min-w-[180px] max-w-[260px] px-4 py-3 text-sm transition ${
          data.kind === "decision"
            ? "border bg-white"
            : "border bg-card-light dark:bg-card-dark"
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
            <span className="leading-tight block text-center">{data.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const deriveShapeStyle = (
  shape: "pill" | "process" | "wave" | "diamond"
): React.CSSProperties => {
  if (shape === "pill")
    return {
      borderRadius: 999,
      border: "1.5px solid #93c5fd",
      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.14)",
      background: "white"
    };
  if (shape === "wave")
    return {
      borderRadius: 18,
      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.14)",
      border: "1.5px solid #93c5fd",
      background: "white",
      paddingTop: 20,
      paddingBottom: 20
    };
  if (shape === "diamond")
    return {
      position: "relative",
      minWidth: 120,
      minHeight: 120,
      padding: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 8px 18px rgba(15, 23, 42, 0.12), 0 0 0 1.5px #93c5fd",
      border: "1.5px solid #93c5fd",
      background: "#fff",
      overflow: "visible",
      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
    };
  return {
    borderRadius: 14,
    border: "1.5px solid #93c5fd",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
    background: "white"
  };
};

const handleViz: React.CSSProperties = {
  width: 10,
  height: 10,
  background: "#0f172a",
  border: "2px solid #fff",
  boxShadow: "0 0 0 2px #0f172a",
  zIndex: 2
};

const getHandleStyle = (shape: EditableNodeData["shape"], pos: "t" | "b" | "l" | "r") => {
  if (shape !== "diamond") return handleViz;
  const base: React.CSSProperties = {
    ...handleViz,
    position: "absolute"
  };
  if (pos === "t") return { ...base, top: "-10px", left: "50%", transform: "translateX(-50%)" };
  if (pos === "b") return { ...base, bottom: "-10px", left: "50%", transform: "translateX(-50%)" };
  if (pos === "l") return { ...base, left: "-10px", top: "50%", transform: "translateY(-50%)" };
  if (pos === "r") return { ...base, right: "-10px", top: "50%", transform: "translateY(-50%)" };
  return base;
};

export default EditableNode;
