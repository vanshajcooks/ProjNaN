# Project Proposal Contributions — Aryan Thakkar

**Author**: Aryan Thakkar (Roll No. 1024160100)  
**Role**: Frontend Lead & UI/UX Architect  
**Document**: Project Proposal for UCS503P (Software Engineering)  
**Evaluator**: Dr. Anushka  
**Date**: September 2026  

---

## 1. Executive Summary of Contributions

For the **ProjNaN / Probon Project Proposal**, my primary focus was establishing the user experience (UX) paradigm, designing intuitive workflows for both student learners and faculty instructors, conducting the frontend technical feasibility study, and defining UI/UX delivery milestones.

While Vanshaj Sharma led the backend data modeling and version control telemetry ingestion, I analyzed the human factors: how to eliminate friction for students tracking tasks while providing instructors with clear, instantaneous insight into individual contributions.

---

## 2. Key Sections Authored & Formulated

### 2.1 User-Centric Problem Formulation & Personas
- Analyzed existing commercial project management software (Jira, Trello, Asana) and identified why they fail in university laboratory settings:
  1. *High Setup Friction*: Enterprise tools require complex backlog grooming and permissions unsuited for 12-week course projects.
  2. *Disconnect from Git Telemetry*: Commercial boards do not verify whether a moved ticket corresponds to merged code or individual authorship.
  3. *Instructor Cognitive Overload*: Instructors supervising 15+ student teams cannot realistically open every repository to verify individual contributions manually.
- Created concrete primary personas:
  - **Student Developer ("Rohan")**: Needs to claim discrete tasks, link commits with minimal effort, track individual milestones, and receive fair recognition.
  - **Student Team Leader ("Simran")**: Needs high-level visibility over team velocity, unblocking bottlenecks, and monitoring sprint burndown.
  - **Faculty Course Instructor ("Dr. Anushka")**: Needs a single unified dashboard to inspect class sections, view verified student participation, review completion evidence, and assign course grades objectively.

### 2.2 Frontend Framework Evaluation & Tech Stack Justification
- Evaluated client-side technology stacks:
  - **Next.js (App Router)**: High build complexity, SSR overhead unnecessary for a behind-login educational dashboard.
  - **Plain HTML/CSS/Vanilla JS**: Lacks reactive state synchronization required for real-time Kanban boards and chat.
  - **Vite + React 19 SPA**: Chosen for ultra-fast Hot Module Replacement (HMR $<50\text{ ms}$), lean bundle footprint, standard component ecosystem, and rich ecosystem for drag-and-drop interactions.
- Selected custom CSS variable design tokens over heavy component libraries (e.g. MUI) to retain complete stylistic control, prevent bundle bloat, and achieve modern glassmorphic visual aesthetics.

### 2.3 Interactive Wireframing & Information Architecture
- Designed low-fidelity wireframes in Figma and Excalidraw for the primary application views:
  1. *Landing Page & Portal Gateway*: Clear CTA for student and faculty onboarding.
  2. *Interactive Kanban Board*: 4-column swimlane with card badges, assignee avatars, and drag handles.
  3. *Instructor Verification Modal*: Side-by-side evidence inspection (PR diff preview + confidence rating).
  4. *Arena Gamification*: XP level bars, weekly streak counters, and achievement badges.
- Mapped user journeys: enrollment via 8-character class join codes, instant team creation, and frictionless evidence submission.

### 2.4 Frontend Delivery Milestones
- Structured the frontend milestone schedule across sprints:
  - **Milestone 1**: Project shell, atomic UI components, responsive layout, and authentication views.
  - **Milestone 2**: Interactive Kanban board, task creation modals, and team workspace dashboards.
  - **Milestone 3**: Repository connection modal, GitHub telemetry feeds, and evidence submission modals.
  - **Milestone 4**: Instructor verification interface, Arena gamification, chat window, and bundle optimization.

---

## 3. Collaboration with Backend Lead (Vanshaj Sharma)

| Interface Domain | Aryan Thakkar (Frontend) | Vanshaj Sharma (Backend) |
| :--- | :--- | :--- |
| **Data Contracts** | Specified client-side JSON schema requirements (fields, nested objects, pagination markers). | Built matching Express controller response serializers and status codes. |
| **Task State Transitions** | Implemented drag-and-drop event listeners with optimistic UI rendering. | Implemented finite state machine validation and database transaction locks. |
| **Evidence Submission** | Built intuitive modal dialog with auto-filling PR links and commit SHA validators. | Processed submitted evidence through the heuristic scoring engine. |
| **Error Handling** | Designed responsive floating toast alerts for network timeouts and validation failures. | Structured centralized error payloads with machine-readable error codes. |

---

## 4. Proposal Defense Outcomes

During our joint proposal presentation before Dr. Anushka, I demonstrated interactive wireframes showing the student and teacher views. In response to questions on usability in poor network conditions, I explained our client-side caching strategy and optimistic UI updates, ensuring students can organize tasks seamlessly without visual stutter.
