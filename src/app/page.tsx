/* eslint-disable react/no-unescaped-entities */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  ConnectionMode,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  Node,
  NodeChange,
  MarkerType,
  Position,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge
} from "reactflow";
import "reactflow/dist/style.css";
import { toPng, toSvg } from "html-to-image";
import jsPDF from "jspdf";
import clsx from "clsx";
import { parseTasks } from "@/lib/parseTasks";
import EditableNode from "@/components/EditableNode";

type ExportType = "png" | "svg" | "pdf";

const defaultText = `Create project outline
Identify stakeholders #team
Draft requirements
Review with leads
Design solution #design
Build prototype
Test internally
Deploy to staging
Collect feedback
Ship to production`;

const nodeTypes = { editableNode: EditableNode };

type FlowState = {
  nodes: Node[];
  edges: Edge[];
};

function createFlow(tasks: ReturnType<typeof parseTasks>, autoConnect: boolean): FlowState {
  const ySpacing = 160;
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let prevIds: string[] = [];

  tasks.forEach((task, index) => {
    const y = index * ySpacing;
    const nextTask = tasks[index + 1];

    // Connect previous nodes to this task's entry (decision or task)
    const connectPrev = (targetId: string) => {
      if (!autoConnect) return;
      prevIds.forEach((pid) => {
        edges.push({
          id: `${pid}-${targetId}`,
          source: pid,
          sourceHandle: "sb",
          target: targetId,
          targetHandle: "t",
          type: "smoothstep",
          animated: false,
          style: { strokeWidth: 2 }
        });
      });
    };

    if (task.kind === "decision") {
      const prevChain = [...prevIds];
      const decisionId = task.id;
      nodes.push({
        id: decisionId,
        type: "editableNode",
        position: { x: 0, y },
        data: {
          label: task.label,
          group: task.group,
          verb: task.verb,
          kind: "decision",
          shape: "diamond"
        },
        style: {
          borderStyle: "solid",
          borderColor: "#cbd5e1",
          background: "white"
        }
      });
      connectPrev(decisionId);

      if (autoConnect && nextTask) {
        edges.push({
          id: `${decisionId}-${nextTask.id}-yes`,
          source: decisionId,
          sourceHandle: "sr",
          target: nextTask.id,
          targetHandle: "t",
          type: "smoothstep",
          label: "Yes",
          animated: false,
          style: { strokeWidth: 2 }
        });
      }

      const noTarget = prevChain[prevChain.length - 1];
      if (autoConnect && noTarget) {
        edges.push({
          id: `${decisionId}-${noTarget}-no`,
          source: decisionId,
          sourceHandle: "sl",
          target: noTarget,
          targetHandle: "t",
          type: "smoothstep",
          label: "No",
          animated: false,
          style: { strokeWidth: 2 }
        });
      }

      prevIds = [decisionId];
    } else {
      const nodeId = task.id;
      nodes.push({
        id: nodeId,
        type: "editableNode",
        position: { x: 0, y },
        data: {
          label: task.label,
          group: task.group,
          verb: task.verb,
          kind: "task",
          shape: task.shape || "process"
        }
      });
      connectPrev(nodeId);
      prevIds = [nodeId];
    }
  });

  return { nodes, edges };
}

function DiagramApp() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [text, setText] = useState(defaultText);
  const [flow, setFlow] = useState<FlowState>(() =>
    createFlow(parseTasks(defaultText), true)
  );
  const flowRef = useRef<FlowState>(flow);
  const [history, setHistory] = useState<FlowState[]>([flow]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [exporting, setExporting] = useState<ExportType | null>(null);
  const [gridSize, setGridSize] = useState(10);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [autoConnectSequence, setAutoConnectSequence] = useState(true);
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  useEffect(() => {
    flowRef.current = flow;
  }, [flow]);

  const pushFlow = useCallback(
    (next: FlowState) => {
      setFlow(next);
      setHistory((prev) => {
        const truncated = prev.slice(0, historyIndex + 1);
        return [...truncated, next];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    setHistoryIndex((prev) => {
      if (prev <= 0) return prev;
      const nextIdx = prev - 1;
      setFlow(history[nextIdx]);
      return nextIdx;
    });
  }, [history]);

  const redo = useCallback(() => {
    setHistoryIndex((prev) => {
      if (prev >= history.length - 1) return prev;
      const nextIdx = prev + 1;
      setFlow(history[nextIdx]);
      return nextIdx;
    });
  }, [history]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (selectedNodes.length === 0 && selectedEdges.length === 0) return;
      const current = flowRef.current;
      const nodeSet = new Set(selectedNodes);
      const edgeSet = new Set(selectedEdges);
      pushFlow({
        nodes: current.nodes.filter((n) => !nodeSet.has(n.id)),
        edges: current.edges.filter(
          (e) => !edgeSet.has(e.id) && !nodeSet.has(e.source) && !nodeSet.has(e.target)
        )
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedNodes, selectedEdges, pushFlow]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const current = flowRef.current;
      pushFlow({ ...current, nodes: applyNodeChanges(changes, current.nodes) });
    },
    [pushFlow]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const current = flowRef.current;
      pushFlow({ ...current, edges: applyEdgeChanges(changes, current.edges) });
    },
    [pushFlow]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const current = flowRef.current;
      pushFlow({ ...current, edges: updateEdge(oldEdge, newConnection, current.edges) });
    },
    [pushFlow]
  );

  const onSelectionChange = useCallback((params: { nodes: Node[]; edges: Edge[] }) => {
    setSelectedNodes(params.nodes.map((n) => n.id));
    setSelectedEdges(params.edges.map((e) => e.id));
  }, []);

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const ids = new Set(deleted.map((n) => n.id));
      const current = flowRef.current;
      pushFlow({
        nodes: current.nodes.filter((n) => !ids.has(n.id)),
        edges: current.edges.filter((e) => !ids.has(e.source) && !ids.has(e.target))
      });
    },
    [pushFlow]
  );

  const handleEdgeDelete = useCallback(
    (id: string) => {
      const current = flowRef.current;
      pushFlow({ ...current, edges: current.edges.filter((e) => e.id !== id) });
    },
    [pushFlow]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const current = flowRef.current;
      pushFlow({
        ...current,
        edges: addEdge(
          {
            ...connection,
            type: "smoothstep"
          },
          current.edges
        )
      });
    },
    [pushFlow]
  );

  const regenerate = useCallback(() => {
    const parsed = parseTasks(text);
    const nextFlow = createFlow(parsed, autoConnectSequence);
    const current = flowRef.current;
    pushFlow({
      nodes: nextFlow.nodes,
      edges: autoConnectSequence ? nextFlow.edges : current.edges
    });
  }, [text, autoConnectSequence, pushFlow]);

  const handleNodeLabelChange = useCallback((id: string, label: string) => {
    const current = flowRef.current;
    pushFlow({
      ...current,
      nodes: current.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label } } : node
      )
    });
  }, [pushFlow]);

  const canExport = flow.nodes.length > 0;
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const exportDiagram = useCallback(
    async (type: ExportType) => {
      if (!diagramRef.current || !canExport) return;
      setExporting(type);
      const element = diagramRef.current;
      const { width, height } = element.getBoundingClientRect();
      const backgroundColor = theme === "dark" ? "#0f172a" : "#f8fafc";

      try {
        if (type === "png") {
          const dataUrl = await toPng(element, {
            backgroundColor,
            pixelRatio: 2
          });
          const link = document.createElement("a");
          link.download = "flowsketch.png";
          link.href = dataUrl;
          link.click();
        }

        if (type === "svg") {
          const dataUrl = await toSvg(element, { backgroundColor });
          const link = document.createElement("a");
          link.download = "flowsketch.svg";
          link.href = dataUrl;
          link.click();
        }

        if (type === "pdf") {
          const dataUrl = await toPng(element, {
            backgroundColor,
            pixelRatio: 2
          });
          const orientation = width > height ? "l" : "p";
          const doc = new jsPDF({
            orientation,
            unit: "px",
            format: [width, height]
          });
          doc.addImage(dataUrl, "PNG", 0, 0, width, height);
          doc.save("flowsketch.pdf");
        }
      } finally {
        setExporting(null);
      }
    },
    [canExport, theme]
  );

  const groupedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    flow.nodes.forEach((node) => {
      const group = (node.data as { group?: string })?.group;
      if (group) counts[group] = (counts[group] || 0) + 1;
    });
    return counts;
  }, [flow.nodes]);

  return (
    <div
      className={clsx(
        "min-h-screen bg-gradient-to-b from-white via-surface-light to-surface-light px-6 py-8 text-slate-900 transition dark:from-surface-dark dark:via-slate-950 dark:to-surface-dark",
        "sm:px-10 lg:px-14"
      )}
    >
      <header className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            FlowSketch
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Paste → Generate → Export
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Turn rough task lists into clean, draggable workflow diagrams in seconds.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost"
            onClick={() =>
              setTheme((t) => (t === "light" ? "dark" : "light"))
            }
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <a
            className="btn-primary"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(320px,380px)_1fr]">
        <section className="glass-panel h-fit">
          <div className="flex items-center justify-between border-b border-border-light px-6 py-4 dark:border-border-dark">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Input
              </p>
              <h2 className="text-lg font-semibold">Tasks</h2>
            </div>
            <button className="btn-ghost text-xs" onClick={regenerate}>
              Generate workflow
            </button>
          </div>

          <div className="space-y-4 p-6">
              <textarea
                className="input-base h-[280px] font-mono text-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste tasks, one per line..."
              />

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{flow.nodes.length} nodes</span>
                <button
                  className="btn-ghost text-xs"
                  onClick={() => setText(defaultText)}
                >
                  Reset sample
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="glass-panel px-4 py-3">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Auto-grouping
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Verb detection + #hashtags stored for future lanes.
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.entries(groupedCounts).length === 0 ? (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      none detected
                    </span>
                  ) : (
                    Object.entries(groupedCounts).map(([group, count]) => (
                      <span
                        key={group}
                        className="rounded-full bg-accent-soft px-2 py-1 text-[11px] text-accent"
                      >
                        #{group} ({count})
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div className="glass-panel px-4 py-3">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Tips
                </p>
                <ul className="list-disc space-y-1 pl-4 text-slate-500 dark:text-slate-400">
                  <li>Double-click a box to edit text</li>
                  <li>Drag nodes; connectors reroute automatically</li>
                  <li>Use #tags to hint grouping</li>
                </ul>
              </div>
              <div className="glass-panel px-4 py-3">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Branching
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Use IF/THEN/ELSE lines to create decisions automatically. Example: “IF approve THEN Ship ELSE Rework”. “if”, “test”, “check” also infer decisions.
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Connectors follow Yes/No automatically; both branches are created and linked forward. Click an edge to delete if needed.
                </p>
                <div className="mt-2">
                  <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoConnectSequence}
                      onChange={(e) => setAutoConnectSequence(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Auto-connect sequentially</span>
                  </label>
                </div>
              </div>
              <div className="glass-panel px-4 py-3">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Grid & snapping
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <span className="text-[12px] uppercase tracking-[0.08em]">
                      Size
                    </span>
                    <input
                      type="number"
                      min={4}
                      max={80}
                      value={gridSize}
                      onChange={(e) =>
                        setGridSize(
                          Math.min(
                            80,
                            Math.max(4, Number(e.target.value) || 10)
                          )
                        )
                      }
                      className="w-20 rounded-lg border border-border-light bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-border-dark dark:bg-slate-900 dark:text-slate-100"
                    />
                    <span className="text-xs text-slate-400">px</span>
                  </label>
                </div>
                <div className="mt-3">
                  <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={snapToGrid}
                      onChange={(e) => setSnapToGrid(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Snap to grid</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel relative min-h-[540px] overflow-hidden">
          <div className="flex items-center justify-between border-b border-border-light px-6 py-4 dark:border-border-dark">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Diagram
              </p>
              <h2 className="text-lg font-semibold">Workflow preview</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="toolbar">
                <button className="btn-ghost text-xs" onClick={undo} disabled={!canUndo}>
                  Undo
                </button>
                <button className="btn-ghost text-xs" onClick={redo} disabled={!canRedo}>
                  Redo
                </button>
              </div>
              <div className="toolbar">
              <button
                className="btn-ghost text-xs"
                disabled={!canExport || Boolean(exporting)}
                onClick={() => exportDiagram("png")}
              >
                {exporting === "png" ? "Exporting..." : "PNG"}
              </button>
              <button
                className="btn-ghost text-xs"
                disabled={!canExport || Boolean(exporting)}
                onClick={() => exportDiagram("svg")}
              >
                {exporting === "svg" ? "Exporting..." : "SVG"}
              </button>
              <button
                className="btn-primary text-xs"
                disabled={!canExport || Boolean(exporting)}
                onClick={() => exportDiagram("pdf")}
              >
                {exporting === "pdf" ? "Exporting..." : "PDF"}
              </button>
              </div>
            </div>
          </div>

          <div className="relative h-[620px] w-full">
            <div ref={diagramRef} className="h-full w-full">
              <ReactFlow
            nodes={flow.nodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                onChange: (value: string) =>
                  handleNodeLabelChange(node.id, value)
              }
            }))}
                edges={flow.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            onNodesDelete={onNodesDelete}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            onEdgeClick={(e, edge) => {
              e.stopPropagation();
              handleEdgeDelete(edge.id);
            }}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            connectionMode={ConnectionMode.Loose}
            edgeUpdaterRadius={12}
            snapToGrid={snapToGrid}
            snapGrid={[gridSize, gridSize]}
            defaultEdgeOptions={{
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: theme === "dark" ? "#e2e8f0" : "#0f172a"
              },
              style: {
                stroke: theme === "dark" ? "#94a3b8" : "#0f172a",
                strokeWidth: 2
                  }
                }}
              >
                <MiniMap
                  pannable
                  zoomable
                  maskColor={theme === "dark" ? "#0f172acc" : "#f8fafccc"}
                  nodeColor={() => (theme === "dark" ? "#334155" : "#dbeafe")}
                />
                <Controls showInteractive={false} />
                <Background
                  gap={gridSize}
                  color={theme === "dark" ? "#475569" : "#cbd5e1"}
                  size={1.2}
                  style={{ opacity: 0.9 }}
                />
              </ReactFlow>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ReactFlowProvider>
      <DiagramApp />
    </ReactFlowProvider>
  );
}
