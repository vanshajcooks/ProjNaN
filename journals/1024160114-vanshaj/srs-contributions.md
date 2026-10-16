# Software Requirements Specification (SRS) Contributions — Vanshaj Sharma

**Author**: Vanshaj Sharma (Roll No. 1024160114)  
**Role**: Backend Lead & Systems Architect  
**Document**: Software Requirements Specification for PROBON (Version 1.0)  
**Course**: UCS 503 — Software Engineering  
**Supervisor**: Dr. Anushka  
**Date**: October 2026  

---

## 1. Scope of Responsibility in SRS Authoring

In the creation of the 17-page **Probon Software Requirements Specification (SRS)** conforming to the official UCS 503 template (`scrreprt` class), my primary ownership covered the **System Architecture**, **Data Models**, **Backend Functional Requirements**, and **Non-Functional Security and Performance Specifications**.

Together with Aryan Thakkar (who authored the Introduction, User Characteristics, and Client Interface requirements), we established an exhaustive technical contract defining all system behaviors, invariants, and database entities.

---

## 2. Direct Section Contributions in `srs.tex`

### 2.1 Chapter 2: Overall Description
* **Section 2.3: System Architecture & Subsystem Decomposition**:
  * Designed the simplified 4-Tier Architecture delineated in **Figure 2.3** (`system_architecture.png`):
    1. *Client Layer*: React 19 Single Page Application.
    2. *API Gateway Layer*: Express.js HTTP routing, request sanitization, token verification, and sliding-window rate limiting.
    3. *Domain Service Layer*: Modular services executing core business logic (`TaskService`, `GitHubService`, `VerificationEngine`, `GamificationService`, `FeedbackService`).
    4. *Persistence Layer*: Relational database running in SQLite WAL mode alongside the external GitHub REST API v3.
* **Section 2.4: Persistence and Relational Entity Modeling**:
  * Designed the core entity relationship architecture shown in **Figure 2.2** (`data_overview.png`).
  * Defined entity schemas, data types, primary keys, and foreign key cascades across:
    `users`, `classes`, `class_members`, `teams`, `team_members`, `projects`, `tasks`, `task_verifications`, `contributions`, `repositories`, `github_activities`, and `notifications`.

### 2.2 Chapter 3: Specific Functional Requirements
I authored the detailed functional requirement specifications, operational preconditions, input formats, processing steps, output structures, and error states for the following core modules:

* **Module 4: Kanban Task State Machine & Lifecycle (FR-4.1 to FR-4.5)**:
  * Specified the mathematical state transitions: $\mathcal{S} \in \{\text{Planned}, \text{In Progress}, \text{Verification Pending}, \text{Completed}\}$.
  * Enforced strict transition rules: prohibiting direct transitions from `Planned` to `Completed` without prior assignment, in-progress logging, and evidence submission.
* **Module 5: GitHub Telemetry Synchronization (FR-5.1 to FR-5.4)**:
  * Specified automated ingestion of commits, PRs, and issues via `@octokit/rest`.
  * Detailed rate-limit tracking, pagination handling, and timestamp synchronization.
* **Module 6: Deterministic Heuristic Verification Engine (FR-6.1 to FR-6.5)**:
  * Formulated the weighted scoring equation:
    $$\text{Confidence Score} = w_1 \cdot C_{\text{author}} + w_2 \cdot C_{\text{branch}} + w_3 \cdot C_{\text{msg}} + w_4 \cdot C_{\text{pr\_state}}$$
    with baseline clamping between $0.20$ and $0.98$.
  * Specified penalty calculations for mismatched commit authors and unmerged pull requests.
* **Module 7: Immutable Contribution Ledger & Idempotency (FR-7.1 to FR-7.3)**:
  * Specified the append-only ledger invariant: once a verified task is recorded, contribution records cannot be mutated or deleted.
  * Specified cryptographic SHA-256 deduplication and composite uniqueness constraints on `(team_id, external_id, type)`.
* **Module 10: Role-Based Access Control (RBAC) & Endpoint Security (FR-10.1 to FR-10.4)**:
  * Formulated the permission matrix governing 4 distinct authorization roles: `Student`, `Team Leader`, `Teacher`, and `System Administrator`.

### 2.3 Chapter 4: Non-Functional Requirements
* **Section 4.1: Performance Requirements**:
  * Response time requirement: 95th percentile response time for internal API endpoints must remain $< 50\text{ ms}$ under a load of 100 concurrent requests.
  * Database read/write throughput: SQLite WAL mode configured to allow concurrent read connections during active write transactions without table locks.
* **Section 4.2: Security & Protection Invariants**:
  * Password storage: minimum 10 salt rounds with `bcrypt` (or `argon2id`).
  * Session isolation: JWT access tokens signed with SHA-256 (HMAC-SHA256) with 15-minute expiration, paired with 7-day refresh tokens transmitted strictly via `httpOnly`, `SameSite=Lax` cookies.
* **Section 4.3: Software Quality Attributes & Reliability**:
  * Graceful degradation under GitHub API unavailability or rate throttling.
  * ACID transaction compliance during simultaneous task state updates.

---

## 3. Diagrammatic Artifacts Produced

To support the SRS document, I created and compiled the following technical PlantUML diagram models:

1. **`SRS/diagrams/system_architecture.puml`**:
   - Visualized the 4-tier architectural boundary, protocol channels (HTTPS / JSON), middleware pipeline, and data isolation between memory, filesystem, and external APIs.
2. **`SRS/diagrams/data_overview.puml`**:
   - Engineered the comprehensive relational entity diagram displaying cardinalities ($1:1$, $1:N$, $N:M$) and key fields across all 11 database tables.

---

## 4. Requirement Verification & Traceability

I established a complete Requirements Traceability Matrix (RTM) linking every functional requirement in Chapter 3 to its implementation in `backend/src/services/` and its corresponding automated test case in `backend/tests/`. This ensured that all 11 functional modules were rigorously validated prior to the prototype milestone evaluation.
