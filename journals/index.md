# Team Engineering Journals — Probon

**Course**: UCS 503 — Software Engineering (2026–27 ODD)  
**Project**: **Probon** (An Educational Collaborative Project Management and Contribution Verification Platform)  
**Laboratory Group**: `3P14`  
**Department**: Computer Science and Engineering Department, Thapar Institute of Engineering and Technology, Patiala  
**Course Instructor / Faculty Guide**: Dr. Anushka  
**Evaluation Date**: October 16, 2026 (Mid-Semester Prototype Milestone)  

---

## 👥 Student Engineering Team & Work Division

The Probon platform was engineered through an equal, complementary **50% / 50% division of responsibility** between Backend Systems Engineering and Frontend UI/UX Architecture:

| Team Member | Roll Number | Role | Primary Domains & Technical Ownership | Direct Journal Link |
| :--- | :--- | :--- | :--- | :--- |
| **Vanshaj Sharma** | `1024160114` | **Backend Lead & Systems Architect** | SQLite WAL Persistence, Express REST API Services, Octokit GitHub Telemetry Engine, Deterministic Heuristic Verification, RBAC Security, Automated 52-Test Suite. | [**Vanshaj’s Journal ↗**](./1024160114-vanshaj/index.md) |
| **Aryan Thakkar** | `1024160100` | **Frontend Lead & UI/UX Architect** | React 19 SPA Architecture, Design System Tokens, Interactive Drag-and-Drop Kanban Board, Faculty Review Portal, Arena Gamification, Vite Optimization ($412\text{ kB}$ bundle). | [**Aryan’s Journal ↗**](./1024160100-aryan/index.md) |

---

## 📑 Core Milestone Document Contributions

Both team members contributed equally to all major academic and engineering deliverables:

```
├── Project Proposal (September 2026)
│   ├── Backend Feasibility, Architecture, & GitHub Verification Hypothesis: Vanshaj Sharma
│   └── UX Problem Formulation, Wireframing, & Frontend Stack Selection: Aryan Thakkar
│
├── Software Requirements Specification (SRS v1.0) (October 2026)
│   ├── Ch. 2 System Architecture & Persistence Models (PlantUML): Vanshaj Sharma
│   ├── Ch. 3 Backend Modules (State Machine, GitHub Sync, Heuristics, RBAC): Vanshaj Sharma
│   ├── Ch. 1 Introduction, Scope, & User Hierarchy (PlantUML): Aryan Thakkar
│   ├── Ch. 3 Frontend Modules (Kanban Board, Teacher Portal, Gamification): Aryan Thakkar
│   └── Ch. 4 Non-Functional Requirements (Security, Latency, a11y): Joint Authorship
│
└── Project Report (Prototype Stage) (October 16, 2026)
    ├── Backend Services Implementation, WAL Benchmarks, & 52/52 Tests: Vanshaj Sharma
    └── Frontend 9-View Implementation, Lighthouse Audit (96/100), & Bundling: Aryan Thakkar
```

---

## 🗓️ Weekly Development Timeline (Weeks 1 – 7)

```
[Week 1] ─── Bootstrapping, Toolchain, & Design System
            ├─ Vanshaj: Database WAL mode & migration runner
            └─ Aryan: Vite + React 19, CSS tokens, & App Shell

[Week 2] ─── Proposal Architecture & Data Modeling
            ├─ Vanshaj: 11-table relational schema & idempotent seeding
            └─ Aryan: Personas, low/high-fi wireframes, & responsive Landing page

[Week 3] ─── Authentication & Session Infrastructure
            ├─ Vanshaj: Dual-token JWT (access + httpOnly refresh) & bcrypt
            └─ Aryan: AuthContext global state & <ProtectedRoute> navigation guards

[Week 4] ─── Kanban State Machine & SRS Formulation
            ├─ Vanshaj: Deterministic finite state machine & SRS Ch 2, 3, 4
            └─ Aryan: Optimistic drag-and-drop Kanban board & SRS Ch 1, 2, 3

[Week 5] ─── GitHub Telemetry Sync & Evidence Ingestion
            ├─ Vanshaj: Octokit REST sync with composite key deduplication
            └─ Aryan: Telemetry feed cards & commit picker evidence dialog

[Week 6] ─── Heuristic Verification Engine & Gamification
            ├─ Vanshaj: Rule-based confidence scoring engine (0.20 - 0.98)
            └─ Aryan: Faculty review queue & Arena XP gamification dashboard

[Week 7] ─── Mid-Semester Prototype Consolidation & Audits
            ├─ Vanshaj: RBAC endpoint hardening & 52/52 automated test suite
            └─ Aryan: Vite chunk splitting ($412 kB JS) & Lighthouse audit (96/100)
```

---

## 🔗 Quick Links to Individual Journals

* **Vanshaj Sharma (Backend Lead)**:
  * [Journal Index](./1024160114-vanshaj/index.md)
  * [Proposal Contributions](./1024160114-vanshaj/project-proposal-contributions.md)
  * [SRS Contributions](./1024160114-vanshaj/srs-contributions.md)
  * [Project Report Contributions](./1024160114-vanshaj/project-report-contributions.md)

* **Aryan Thakkar (Frontend Lead)**:
  * [Journal Index](./1024160100-aryan/index.md)
  * [Proposal Contributions](./1024160100-aryan/project-proposal-contributions.md)
  * [SRS Contributions](./1024160100-aryan/srs-contributions.md)
  * [Project Report Contributions](./1024160100-aryan/project-report-contributions.md)
