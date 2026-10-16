# Project Proposal Contributions — Vanshaj Sharma

**Author**: Vanshaj Sharma (Roll No. 1024160114)  
**Role**: Backend Lead & Systems Architect  
**Document**: Project Proposal for UCS503P (Software Engineering)  
**Evaluator**: Dr. Anushka  
**Date**: September 2026  

---

## 1. Executive Summary of Contributions

For the **ProjNaN / Probon Project Proposal**, I spearheaded the backend architectural strategy, database feasibility analysis, automated version control telemetry hypothesis, and technical implementation roadmap. Working in coordination with Aryan Thakkar (who led frontend and UI/UX planning), I framed the technical problem statement from an engineering and systems perspective: transforming subjective project grading into objective, verifiable software telemetry.

---

## 2. Key Sections Authored & Formulated

### 2.1 Problem Statement & Pedagogical Dilemma
- Formulated the technical limitations of conventional academic evaluation workflows (compressed zip submissions, periodic slide presentations).
- Highlighted the **"social loafing / free-riding"** challenge in undergraduate team projects where Git commit logs are rarely checked systematically due to teacher time constraints.
- Proposed bridging project management Kanban boards directly with GitHub repository webhooks and REST polling.

### 2.2 System Architecture & Backend Stack Feasibility
- Conducted technology trade-off analysis between monolithic vs. microservices architecture for an academic platform. Selected a modular **Layered Monolith (Express.js + Node.js)** to maximize maintainability, ensure sub-50ms API latencies, and prevent unnecessary network serialization overhead.
- Evaluated database storage engines: designed the initial relational schema for SQLite (configured with Write-Ahead Logging `WAL` mode) for local and lab deployment, with zero-dependency migration scripts forward-compatible with PostgreSQL.
- Structured the four distinct backend tiers:
  1. **HTTP / API Routing Gateway**: Express routes with centralized validation and sanitization.
  2. **Security & Middleware Layer**: JWT authentication with httpOnly cookie storage, rate-limiting, and RBAC authorization.
  3. **Domain Service Layer**: Pure business logic separated from database drivers (enabling independent unit testing).
  4. **Persistence Layer**: Data access layer managing connection lifecycles, transactions, and foreign key constraints.

### 2.3 Automated GitHub Verification Hypothesis
- Defined the core technical hypothesis: *Can student task completion claims be autonomously corroborated with GitHub version control activity using deterministic heuristics?*
- Formulated the four verification criteria proposed for the initial proof-of-concept:
  1. Author identity verification (cross-referencing student GitHub usernames/emails).
  2. Git commit message semantic analysis (matching task identifiers and action verbs).
  3. Pull request merge status validation (ensuring code is merged into the mainline branch).
  4. Diff size and file path relevance (detecting non-trivial code modifications matching the task's functional scope).

### 2.4 Time-to-Value Delivery Roadmap
- Defined the phased delivery milestones:
  - **Milestone 1 (Sprint 1)**: Core backend server bootstrap, relational schema migration, JWT auth, and class/team management endpoints.
  - **Milestone 2 (Sprint 2)**: Task state machine, GitHub Octokit REST sync for repository activity, and task-to-commit linking.
  - **Milestone 3 (Sprint 3)**: Rule-based verification scoring engine, teacher evaluation gates, and immutable contribution logging.
  - **Milestone 4 (Sprint 4)**: Gamification XP/badge computation, contribution velocity analytics, security hardening, and performance benchmarking.

---

## 3. Collaboration with Frontend Lead (Aryan Thakkar)

| Domain | Vanshaj Sharma (Backend) | Aryan Thakkar (Frontend) |
| :--- | :--- | :--- |
| **Interface Contracts** | Designed RESTful JSON API specifications, status code conventions, and error payloads. | Validated payload structures against React component state requirements and form schemas. |
| **Data Flow** | Defined entity lifecycle states (e.g., Task statuses: `planned`, `in_progress`, `verification_pending`, `completed`). | Designed UI Kanban drag-and-drop interactions reflecting state transitions. |
| **Authentication** | Built stateless JWT signing, bcrypt password hashing, and cookie transmission protocols. | Designed client-side `AuthContext`, session persistence, and protected route wrappers. |
| **Verification Gate** | Specified the heuristic scoring mathematical formula producing scores between $0.20$ and $0.98$. | Designed the faculty evaluation dashboard displaying confidence indicators and feedback dialogs. |

---

## 4. Verification & Defense Notes

During the proposal defense before Dr. Anushka, I presented the backend data architecture and addressed faculty inquiries regarding GitHub API rate limits. I demonstrated that by adopting a hybrid strategy—combining deterministic polling intervals with conditional `ETag` HTTP caching headers—the platform can track over 100 student repositories within GitHub's standard hourly rate quota (5,000 requests/hour for authenticated tokens).
