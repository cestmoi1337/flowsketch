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

      <div className="px-2 py-2" onDoubleClick={() => setEditing(true)}>
        <NodeShape shape={data.shape || (data.kind === "decision" ? "diamond" : "process")} label={editing ? undefined : data.label} />
        {editing && (
          <input
            autoFocus
            className="absolute left-1/2 top-1/2 w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border-light bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
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
        )}
      </div>
    </div>
  );
}

const NodeShape = ({ shape, label }: { shape: EditableNodeData["shape"]; label?: string }) => {
  const stroke = "#6ea8ff";
  const fill = "#fff";
  const shadow = "0 8px 18px rgba(15, 23, 42, 0.12)";

  if (shape === "diamond") {
    return (
      <svg width={160} height={160} viewBox="0 0 160 160" className="drop-shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
        <polygon
          points="80,0 160,80 80,160 0,80"
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
        />
        {label && (
          <text x="80" y="85" textAnchor="middle" fontSize="14" fill="#0f172a" fontWeight="600">
            {label}
          </text>
        )}
      </svg>
    );
  }

  if (shape === "wave") {
    return (
      <svg width={220} height={100} viewBox="0 0 220 100" className="drop-shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
        <path
          d="M0,25 C40,45 80,5 120,25 L220,25 L220,100 L0,100 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
          rx={14}
        />
        <rect x="0" y="25" width="220" height="75" fill={fill} stroke="none" />
        {label && (
          <text x="110" y="65" textAnchor="middle" fontSize="14" fill="#0f172a" fontWeight="600">
            {label}
          </text>
        )}
      </svg>
    );
  }

  const radius = shape === "pill" ? 999 : 12;
  return (
    <svg width={220} height={70} viewBox="0 0 220 70" className="drop-shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
      <rect x="0" y="0" width="220" height="70" rx={radius} ry={radius} fill={fill} stroke={stroke} strokeWidth={2} />
      {label && (
        <text x="110" y="40" textAnchor="middle" fontSize="14" fill="#0f172a" fontWeight="600">
          {label}
        </text>
      )}
    </svg>
  );
};

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
