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
      const firstWord = line.split(/\s+/)[0]?.toLowerCase();
      const verb = leadingVerbs.includes(firstWord) ? firstWord : undefined;

      return {
        id,
        label: line.replace(/#([\p{L}\p{N}_-]+)/gu, "").trim(),
        group: hashtags[0],
        verb
      };
    });
}
