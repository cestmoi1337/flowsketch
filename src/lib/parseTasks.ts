const decisionVerbs = ["if", "test", "check", "review"];
const leadingVerbs = [
  "create",
  "design",
  "draft",
  "review",
  "approve",
  "plan",
  "define",
  "build",
  "test",
  "deploy",
  "release",
  "audit",
  "publish"
];

export type ParsedTask = {
  id: string;
  label: string;
  group?: string;
  verb?: string;
  kind?: "decision" | "task";
  branchYes?: string;
  branchNo?: string;
  shape?: "pill" | "process" | "wave" | "diamond";
};

export function parseTasks(input: string): ParsedTask[] {
  const lines = input.split("\n");

  return lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, index) => {
      const id = `node-${index + 1}`;
      const hashtags = Array.from(line.matchAll(/#([\p{L}\p{N}_-]+)/gu)).map(
        (match) => match[1]
      );
      const shapeMatch = line.match(/^\{(pill|process|wave|diamond)\}\s*/i);
      const shape = shapeMatch ? (shapeMatch[1].toLowerCase() as ParsedTask["shape"]) : undefined;
      const lineWithoutShape = shapeMatch ? line.replace(shapeMatch[0], "").trim() : line;
      const firstWord = line.split(/\s+/)[0]?.toLowerCase();
      const verb = leadingVerbs.includes(firstWord) ? firstWord : undefined;
      const decisionMatch = line.match(
        /^if\s+(.+?)\s+then\s+(.+?)(?:\s+else\s+(.+))?$/i
      );
      const isDecision =
        !!decisionMatch ||
        line.startsWith("?") ||
        decisionVerbs.some((v) => line.toLowerCase().startsWith(v));

      const branchYes = decisionMatch ? decisionMatch[2].trim() : undefined;
      const branchNo = decisionMatch ? decisionMatch[3]?.trim() : undefined;
      const condition =
        decisionMatch && decisionMatch[1]
          ? decisionMatch[1].trim()
          : lineWithoutShape.replace(/^\?/, "").replace(/#([\p{L}\p{N}_-]+)/gu, "").trim();

      const inferredShape = (() => {
        if (shape) return shape;
        if (isDecision) return "diamond";
        const verbsToProcess = ["create", "design", "draft", "build", "implement", "deploy", "order"];
        const verbsToPill = ["call", "meet"];
        const verbsToWave = ["report", "form", "document"];
        if (verbsToProcess.includes(firstWord || "")) return "process";
        if (verbsToPill.includes(firstWord || "")) return "pill";
        if (verbsToWave.includes(firstWord || "")) return "wave";
        return "process";
      })();

      return {
        id,
        label: isDecision
          ? condition
          : lineWithoutShape.replace(/#([\p{L}\p{N}_-]+)/gu, "").trim(),
        group: hashtags[0],
        verb,
        kind: isDecision ? "decision" : "task",
        branchYes,
        branchNo,
        shape: inferredShape
      };
    });
}
