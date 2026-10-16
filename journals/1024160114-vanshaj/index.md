# Vanshaj’s Engineering Journal

**Roll No.**: `1024160114`  
**Name**: Vanshaj Sharma  
**Group**: `3P14` (BE Third Year, Computer Engineering)  
**Role**: Backend Lead & Systems Architect  
**Email**: `vsharma2_be24@thapar.edu`  
**GitHub**: [`vanshajcooks`](https://github.com/vanshajcooks)  
**Project**: **Probon** (An Educational Collaborative Project Management and Contribution Verification Platform)  
**Course**: UCS 503 — Software Engineering  
**Instructor / Guide**: Dr. Anushka  

---

## Executive Summary & Core Responsibilities

As the **Backend Lead and Systems Architect** for Probon, my primary responsibility was engineering the scalable server-side infrastructure, relational data models, automated version control telemetry ingestion, deterministic verification scoring engine, and role-based access security for the platform.

### Core Architectural Contributions
1. **System & Database Architecture**: Designed and implemented the complete normalized relational schema across SQLite (with Write-Ahead Logging `WAL`) and PostgreSQL readiness, structuring 11 relational tables with strict foreign key constraints, indexing, and automated migration/seeding tooling.
2. **RESTful Service Layer**: Implemented modular Express.js controllers and business services across 11 functional domains: Authentication, Academic Classes, Student Teams, Project Workspaces, Kanban Task State Machines, GitHub Telemetry Sync, Heuristic Verification, Instructor Reviews, Gamified XP/Badges, Notification Ingestion, and Analytics.
3. **GitHub Telemetry Ingestion Engine**: Integrated GitHub REST API v3 via `@octokit/rest`, building an idempotent polling and webhook sync engine that maps student commits, pull requests, and issues directly to project tasks with cryptographic SHA deduplication.
4. **Deterministic Heuristic Verification Engine**: Developed the rule-based verification scoring algorithm computing multi-factor confidence scores ($0.20 - 0.98$) from commit messages, author metadata, branch naming conventions, and PR merge statuses.
5. **Security & Quality Assurance**: Implemented RBAC middleware, secure cookie-based JWT session authentication, input sanitization, sliding-window rate limiting, and authored 52 automated integration tests achieving a 100% test pass rate.

---

## Major Milestone Document Contributions

+ [**Project Proposal Contributions**](./project-proposal-contributions.md)  
  *Backend feasibility analysis, database design scope, automated GitHub verification hypothesis, and technical milestone roadmap.*
+ [**Software Requirements Specification (SRS) Contributions**](./srs-contributions.md)  
  *Authorship of Chapter 2 System Architecture (4-tier model), Chapter 3 Backend Functional Modules (FR-4, FR-5, FR-6, FR-7, FR-10), Chapter 4 Non-Functional Requirements, and PlantUML data/architecture models.*
+ [**Project Report (Prototype Stage) Contributions**](./project-report-contributions.md)  
  *Detailed documentation of the Express REST API services, SQLite WAL persistence, 52/52 automated test suite metrics, API latency benchmarks, and concurrency mitigation strategies.*

---

## Weekly Development Journals & Ticket Resolutions

+ [**Week 1 : Environment, Toolchain, and Multi-Environment Database Migration Engine**](./w1-database-and-toolchain.md)  
  *Configured Node.js/Express environment, resolved SQLite foreign key enforcement bugs via PRAGMA configuration, and established automated schema migration runners.*
+ [**Week 2 : Relational Schema Modeling, Foreign Keys, & Data Seeding Engine**](./w2-schema-and-proposal-architecture.md)  
  *Designed the normalized database schema (`schema.sql`), resolved cascade deletion anomalies across classes and teams, and integrated core proposal requirements.*
+ [**Week 3 : Dual-Token Authentication Lifecycle, Bcrypt Hashing, & Session Security**](./w3-auth-jwt-and-session.md)  
  *Engineered stateless JWT access tokens with secure httpOnly refresh tokens, implemented password salting/hashing, and resolved token race conditions.*
+ [**Week 4 : Finite State Machine for Kanban Tasks & SRS Requirement Formalization**](./w4-kanban-state-machine-and-srs.md)  
  *Implemented a deterministic finite state machine governing task transitions (`Planned` $\to$ `In Progress` $\to$ `Verification Pending` $\to$ `Completed`), blocking illegal transitions.*
+ [**Week 5 : GitHub Octokit REST Telemetry Synchronization & Idempotent Ingestion**](./w5-github-telemetry-and-idempotency.md)  
  *Engineered GitHub repository polling using Octokit, resolved duplicate commit insertion errors through composite unique constraint keys `(team_id, external_id, type)`.*
+ [**Week 6 : Deterministic Rule-Based Task Verification & Confidence Scoring Engine**](./w6-heuristic-verification-engine.md)  
  *Built the multi-factor scoring engine evaluating PR links, branch naming heuristics, and commit message tags to compute confidence scores for faculty verification.*
+ [**Week 7 : RBAC Endpoint Hardening, Sliding-Window Rate Limiting, & 52-Test Automation Suite**](./w7-security-rbac-and-test-suite.md)  
  *Hardened API endpoints using granular RBAC roles (`student`, `team_leader`, `teacher`, `admin`), implemented in-memory rate limiting, and achieved 100% test pass rate across 52 unit tests.*
