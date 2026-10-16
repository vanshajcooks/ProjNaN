# Aryan’s Engineering Journal

**Roll No.**: `1024160100`  
**Name**: Aryan Thakkar  
**Group**: `3P14` (BE Third Year, Computer Engineering)  
**Role**: Frontend Lead & UI/UX Architect  
**Email**: `athakkar_be24@thapar.edu`  
**GitHub**: [`aryan18thakkar`](https://github.com/aryan18thakkar)  
**Project**: **Probon** (An Educational Collaborative Project Management and Contribution Verification Platform)  
**Course**: UCS 503 — Software Engineering  
**Instructor / Guide**: Dr. Anushka  

---

## Executive Summary & Core Responsibilities

As the **Frontend Lead and UI/UX Architect** for Probon, my primary responsibility was architecting and delivering a modern, responsive Single Page Application (SPA) using React 19 and Vite. I designed the complete user journey across all roles (Students, Team Leaders, Instructors, Evaluators), implementing high-performance interactive interfaces for task planning, real-time collaboration, GitHub telemetry visualization, and gamified progress accounting.

### Core Architectural Contributions
1. **Design System & Component Architecture**: Established the atomic design token system, responsive layout containers, glassmorphic visual hierarchy, and reusable UI components across 9 complete views (`Landing`, `Dashboard`, `Project`, `Tasks`, `Arena`, `Explore`, `Profile`, `Chat`, `Auth`).
2. **Interactive Kanban Task Workspace**: Engineered an interactive drag-and-drop Kanban board with optimistic state updates, multi-column task categorisation (`Planned`, `In Progress`, `Verification Pending`, `Completed`), and smooth error rollbacks.
3. **Faculty Verification Portal & Evidence Dialogs**: Built the dedicated instructor review interface with confidence score badges (High/Medium/Low confidence), modal dialogs for inspecting student commit/PR evidence, and rubric feedback forms.
4. **Gamification & Contribution Telemetry**: Created the *Arena* module with animated XP meters, streak counters, milestone achievement badges, and visual GitHub activity feed widgets.
5. **Client State & Build Optimization**: Architected the centralized `AuthContext`, unified Axios/Fetch client with automatic token refresh interceptors, code-splitting with `React.lazy`, and production bundle optimization ($412.44\text{ kB}$ JS / $113.60\text{ kB}$ gzip).

---

## Major Milestone Document Contributions

+ [**Project Proposal Contributions**](./project-proposal-contributions.md)  
  *UX problem formulation for project-based learning, persona design, interactive wireframes, frontend framework trade-off study (Vite + React 19), and milestone planning.*
+ [**Software Requirements Specification (SRS) Contributions**](./srs-contributions.md)  
  *Authorship of Chapter 1 Introduction, Chapter 2 User Hierarchy & Roles, Chapter 3 Client Interface Functional Modules (FR-1, FR-2, FR-3, FR-8, FR-9, FR-11), Chapter 4 Usability and Accessibility Requirements, and PlantUML workflow diagrams.*
+ [**Project Report (Prototype Stage) Contributions**](./project-report-contributions.md)  
  *Detailed documentation of the React component hierarchy, state flow diagrams, bundle analysis metrics, Lighthouse performance audit ($96/100$), and client-side challenge resolutions.*

---

## Weekly Development Journals & Ticket Resolutions

+ [**Week 1 : Frontend Toolchain, Design System Tokens, and App Shell Layout**](./w1-toolchain-and-design-system.md)  
  *Configured Vite + React 19, implemented CSS custom property design tokens, and resolved flexbox/grid overflow issues in the primary navigation App Shell.*
+ [**Week 2 : UI/UX Wireframing, Proposal User Journey, and Landing Page**](./w2-wireframes-and-proposal-ui.md)  
  *Formulated user journeys for students and faculty, translated wireframes into responsive hero and feature components, and integrated proposal documentation.*
+ [**Week 3 : AuthContext State Management, Protected Routes, & Form Validation**](./w3-auth-context-and-forms.md)  
  *Engineered global authentication state in React, built protected route wrappers, and implemented client-side input validation and error toast notifications.*
+ [**Week 4 : Interactive Kanban Board with Optimistic Drag-and-Drop & SRS Formulation**](./w4-kanban-board-and-srs.md)  
  *Built the drag-and-drop Kanban board (`Tasks.jsx`), implemented optimistic UI state updates with rollback on network failure, and authored SRS Chapter 1 & 2.*
+ [**Week 5 : GitHub Telemetry Feed, Evidence Modal, & Repository Linking UI**](./w5-telemetry-ui-and-evidence-modal.md)  
  *Constructed repository linking dialogs, commit and pull request preview feeds, and the task completion evidence submission modal.*
+ [**Week 6 : Teacher Verification Portal, Feedback Modals, & Arena Gamification**](./w6-teacher-portal-and-gamification.md)  
  *Engineered the instructor verification interface with heuristic confidence badges, rejection feedback dialogs, and the Arena XP leaderboard dashboard.*
+ [**Week 7 : Production Bundle Optimization, Tree-Shaking, and Prototype Report Audit**](./w7-bundle-optimization-and-audit.md)  
  *Optimized Vite production build to $412.44\text{ kB}$ JS ($113.60\text{ kB}$ gzip), conducted Lighthouse audit, and authored the frontend evaluation section of the prototype report.*
