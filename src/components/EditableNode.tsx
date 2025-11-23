import { useState } from "react";
import type { NodeProps } from "reactflow";

type EditableNodeData = {
  label: string;
  onChange: (value: string) => void;
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
        <span className="leading-tight">{data.label}</span>
      )}
    </div>
  );
}

export default EditableNode;
