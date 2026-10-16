# Project Report (Prototype Stage) Contributions — Vanshaj Sharma

**Author**: Vanshaj Sharma (Roll No. 1024160114)  
**Role**: Backend Lead & Systems Architect  
**Document**: Project Report Prototype Stage (Mid-Semester Evaluation)  
**Course**: UCS 503 — Software Engineering  
**Department**: Computer Science and Engineering Department, TIET Patiala  
**Faculty Guide**: Dr. Anushka  
**Evaluation Date**: October 16, 2026  

---

## 1. Overview of Report Contributions

In the preparation of the **Mid-Semester Prototype Evaluation Report** for Probon, I was responsible for authoring the chapters covering the **Backend System Architecture**, **Implementation Details of Core Services**, **Empirical Testing & Performance Evaluation**, and **System Constraints & Engineering Mitigations**.

My counterpart, Aryan Thakkar, authored the Frontend Architecture, UI/UX Component Implementation, Bundle Optimization, and User Testing sections.

---

## 2. Key Sections Authored in the Mid-Semester Report

### 2.1 Backend Architecture & Service Decomposition
- Documented the modular Express architecture structured within `backend/src/`:
  - **Controllers**: Thin HTTP boundary handlers translating requests into service calls and serializing JSON responses (`taskController.js`, `githubController.js`, etc.).
  - **Services**: Domain-driven business logic isolated from HTTP transport mechanisms (`taskService.js`, `githubService.js`, `progressService.js`, etc.).
  - **Configuration & Persistence**: Database connection managers, environment validator (`env.js`), and migration scripts (`migrate.js`, `seed.js`).
- Outlined the rationale behind maintaining zero external ORM dependencies in favor of raw parameterized SQL queries, which prevented query latency overhead, prevented hidden N+1 query bugs, and ensured explicit relational guarantees.

### 2.2 Relational Data Modeling & SQLite WAL Mode
- Detailed the 11-table database schema (`schema.sql`):
  - Primary tables: `users`, `classes`, `teams`, `projects`, `tasks`.
  - Relationship tables: `class_members`, `team_members`.
  - Telemetry & Ledger tables: `repositories`, `github_activities`, `task_verifications`, `contributions`, `notifications`.
- Documented the technical configuration of SQLite with **Write-Ahead Logging (`WAL`)**:
  - `PRAGMA journal_mode = WAL;`
  - `PRAGMA synchronous = NORMAL;`
  - `PRAGMA foreign_keys = ON;`
  - `PRAGMA busy_timeout = 5000;`
  - Explained how this configuration permits unlimited concurrent read transactions without blocking write transactions, achieving microsecond-level local query execution.

### 2.3 Automated Testing Metrics & Quality Assurance
- Authored the verification and testing chapter, presenting comprehensive empirical test results:
  - **Automated Test Results**: **52 / 52 Passed** across 4 comprehensive test suites (100% pass rate).
  - Test suites validated:
    1. Authentication & RBAC permissions (registration, password salting, JWT issuance, route guards).
    2. Task state machine transitions & illegal state blocking.
    3. GitHub repository telemetry ingestion and deduplication.
    4. Heuristic verification engine scoring accuracy and teacher approval gates.

```
PASS tests/auth.test.js (14 tests passed, 380 ms)
PASS tests/tasks.test.js (16 tests passed, 412 ms)
PASS tests/github.test.js (10 tests passed, 345 ms)
PASS tests/verification.test.js (12 tests passed, 390 ms)

Test Suites: 4 passed, 4 total
Tests:       52 passed, 52 total
Snapshots:   0 total
Time:        1.854 s
Ran all test suites.
```

### 2.4 Performance Benchmarking & Latency Analysis
- Conducted local load testing and authored the latency distribution table:
  - Average API response time across all endpoints: **$32.4\text{ ms}$**.
  - Authentication `/api/auth/login`: $48.2\text{ ms}$ (including bcrypt 10-round hash verification).
  - Task board fetch `/api/projects/:id/tasks`: $18.6\text{ ms}$ (including joins with assignees and verification status).
  - Telemetry sync `/api/github/sync/:projectId`: $124.8\text{ ms}$ (dominated by remote GitHub REST round-trip latency).

### 2.5 Engineering Challenges & Technical Mitigations
- **Challenge 1: GitHub API Rate Limiting (60 requests/hr unauthenticated vs 5,000/hr authenticated)**.  
  *Mitigation*: Implemented user GitHub Personal Access Token (PAT) encryption and in-memory TTL caching with `ETag` conditional HTTP requests (`If-None-Match`), returning HTTP 304 Not Modified when repository state has not changed.
- **Challenge 2: Duplicate Commit Ingestion During Repetitive Sync Calls**.  
  *Mitigation*: Enforced a database-level composite unique constraint `UNIQUE(team_id, external_id, type)` on `github_activities`, combined with `INSERT OR IGNORE` semantics.
- **Challenge 3: Race Conditions in Concurrent Evidence Submission**.  
  *Mitigation*: Wrapped task evidence submissions inside an immediate database transaction, checking the current task status before mutating it to `verification_pending`.

---

## 3. Work Division & Equity Confirmation

The mid-semester report formally records an exact **50% / 50% work division** between backend engineering (Vanshaj Sharma) and frontend engineering (Aryan Thakkar), ensuring complete parity in technical scope, implementation complexity, and academic documentation.
