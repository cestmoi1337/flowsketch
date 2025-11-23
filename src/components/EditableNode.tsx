import { useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

type EditableNodeData = {
  label: string;
  onChange: (value: string) => void;
  kind?: "decision" | "task";
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
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="target" position={Position.Right} id="r" />
      <Handle type="target" position={Position.Bottom} id="b" />
      <Handle type="source" position={Position.Top} id="st" />
      <Handle type="source" position={Position.Left} id="sl" />
      <Handle type="source" position={Position.Right} id="sr" />
      <Handle type="source" position={Position.Bottom} id="sb" />

      <div
        className="min-w-[180px] max-w-[260px] rounded-xl border border-border-light bg-card-light px-4 py-3 text-sm shadow-card transition dark:border-border-dark dark:bg-card-dark"
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
          <div className="space-y-1">
            {data.kind === "decision" && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
                Decision
              </span>
            )}
            <span className="leading-tight">{data.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditableNode;
