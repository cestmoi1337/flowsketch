# flowsketch
FlowSketch
Instant workflow diagrams from plain text.

FlowSketch is a lightweight web app that transforms a simple list of tasks into a clean, auto-generated workflow diagram. Designed for project managers, team leads, and anyone who wants fast, beautiful process diagrams without the overhead of complex design tools.

🚀 Features

- Paste-to-Workflow: Convert plain text into a vertical flowchart instantly
- Clean Auto-Layout: Simple boxes + arrows, neatly arranged
- Lightweight Editor: Drag nodes, edit text inline (double-click)
- Zero Friction: No login required, no saved data
- Exports: Download diagrams as PNG, SVG, or PDF (client-side)
- Light/Dark: Toggleable UI with clean palette
- Fast & Free: Runs entirely on the client, deployable on free-tier hosting

🧠 Why FlowSketch?

Most diagram tools are powerful but slow to start. FlowSketch skips the setup and jumps straight to a professional-looking workflow diagram from raw text like:

Create project plan
Identify stakeholders
Develop requirements
Review with team
Finalize scope


One click → instant diagram.

📸 Screenshots

(Add screenshots here once the UI is built)

🏗️ Tech Stack

Next.js (frontend framework)

React Flow or ELK.js (diagram engine)

TypeScript

TailwindCSS (styling)

jsPDF (PDF export)

Deployed on Vercel

No backend required.

📄 How It Works

Users paste tasks into the left-side input panel.

FlowSketch parses each non-empty line into a diagram node.

Nodes are arranged vertically in order of appearance.

Users may drag nodes or edit text directly.

Diagram can be exported as PNG, SVG, or PDF.

All processing happens client-side — nothing is stored.

🧪 MVP Scope

This repository implements the MVP defined in the PRD:

Simple vertical flowchart

Auto-grouping logic internally (not displayed)

Inline editing + drag-to-move

PNG / SVG / PDF export

No authentication

No database

No AI (will be added in v2)

🛠️ Local development

1) Install deps: `npm install`
2) Run dev server: `npm run dev` then open http://localhost:3000
3) Build: `npm run build` (for Vercel deployment)

Notes
- Uses React Flow with a custom editable node for inline text updates.
- Auto-grouping detects leading verbs + #hashtags; counts are surfaced for future swimlanes.
- Exports are fully client-side (html-to-image + jsPDF) to avoid backend work.
