FlowSketch – Product Requirements Document (PRD)

Version: MVP v1.0
Owner: Rusty
Date: 2025-11-23

1. Product Overview

FlowSketch is a lightweight web application that converts a plain-text list of tasks into a clean, auto-generated workflow diagram. It is designed for project managers who need quick, polished workflow diagrams without manual design effort.

The MVP emphasizes simplicity, speed, and zero friction: no logins, free-tier compatible, and able to generate diagrams instantly.

2. Target User

Primary User:

Project Managers who need quick workflow diagrams.

User Intent:

Rapidly visualize a project or process from rough notes.

Export and share diagrams for planning, meetings, or documentation.

3. Core Value Proposition

FlowSketch provides instant, clean workflow diagrams directly from pasted text. No design tools, no complexity — just paste tasks and get a presentable flowchart.

4. Success Criteria

MVP Success = The user can:

Paste a list of tasks

Automatically generate a clean workflow diagram

Make minimal adjustments (drag boxes, rename)

Export the result in PNG, SVG, or PDF

Do all of this without creating an account

5. Functional Requirements
5.1 Task Input

Multi-line text area for task entry.

“Generate Workflow” button triggers parsing.

Each non-empty line becomes a node.

Order follows input sequence.

Auto-Grouping Logic (Basic):

Detect leading verbs (e.g., “Create”, “Review”, “Deploy”).

Detect hashtags (e.g., #design, #build).

Grouping is stored but not displayed visually in MVP.

5.2 Diagram Generation

Diagram Type:

Simple vertical flowchart (top → bottom).

Boxes = nodes.

Straight arrow connectors.

Default clean styling.

Node Behaviors:

Auto-generated IDs (node-1, node-2, ...).

Inline editable text (double-click).

Rendering Engine:
One of:

React Flow

ELK.js

Mermaid (fallback)

5.3 Diagram Editor

Drag nodes to reposition.

Diagram re-routes connectors automatically.

Minimal controls, no complex logic.

5.4 Export Features

Required export formats:

PNG

SVG

PDF

Must be done client-side using:

Canvas toDataURL

SVG extraction

jsPDF

5.5 No Login / No Accounts

No auth required or offered.

No backend storage needed.

6. User Flows
6.1 Primary Flow

User loads the site.

Sees a textarea labeled: “Paste tasks, one per line...”

User pastes tasks.

Clicks Generate Workflow.

Diagram appears in the right panel.

User drags nodes or edits text (optional).

User clicks Export and selects PNG / SVG / PDF.

File downloads locally.

7. UI Requirements
7.1 Layout

Left panel:

Task input textarea

“Generate Workflow” button

Right panel:

Diagram canvas

Toolbar (top-right):

Export dropdown (PNG, SVG, PDF)

7.2 Theme

Minimal gray/white palette

Light and Dark modes

Clean boxes, clean arrows

8. Non-Functional Requirements

Performance: Diagram renders < 500ms for up to 50 tasks.

Availability: Deployed on free-tier hosting (Vercel).

Scalability: Layout holds up to 100 nodes.

Security: No user data stored; HTTPS required.

Browser Support: Chrome, Firefox, Edge, Safari (latest 2 versions).

9. Tech Stack Recommendation
Frontend

Next.js

TypeScript

React Flow or ELK.js

TailwindCSS

Exports

PNG via canvas

SVG from diagram library

PDF via jsPDF

Hosting

Vercel (free tier)

10. Out of Scope (MVP)

Swimlane diagrams

Branching logic (if/else paths)

Real-time collaboration

Third-party integrations (Jira, Notion, ServiceNow)

User accounts/logins

AI-based workflow improvement

Database or cloud persistence

11. Future Enhancements

V2

Color-coded task grouping

AI “Improve Workflow” button

Save/share via unique generated link

Export as Mermaid code

Basic branching logic

V3

Swimlanes

Integrations with PM tools

Templates

Team accounts and real-time collaboration

12. Acceptance Criteria

The MVP is considered complete when a user can:

Paste at least 10 tasks

Generate a vertical workflow diagram

Drag nodes without layout breaking

Edit node text inline

Export PNG, SVG, and PDF

Complete all steps within 30 seconds

Perform all functions without logging in