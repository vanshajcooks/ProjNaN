# Software Requirements Specification (SRS) Contributions — Aryan Thakkar

**Author**: Aryan Thakkar (Roll No. 1024160100)  
**Role**: Frontend Lead & UI/UX Architect  
**Document**: Software Requirements Specification for PROBON (Version 1.0)  
**Course**: UCS 503 — Software Engineering  
**Supervisor**: Dr. Anushka  
**Date**: October 2026  

---

## 1. Scope of Responsibility in SRS Authoring

In authoring the **Probon Software Requirements Specification (SRS)** conforming to the 5-chapter UCS 503 course standard, my primary ownership focused on **User Perspectives**, **System Scope**, **Frontend Functional Interfaces**, and **Usability & Accessibility Non-Functional Requirements**.

Working in tandem with Vanshaj Sharma (who authored the system architecture, persistence models, and backend functional modules), we created a unified specification connecting user actions to automated technical mechanisms.

---

## 2. Direct Section Contributions in `srs.tex`

### 2.1 Chapter 1: Introduction
* **Section 1.1: Purpose**:
  * Authored the pedagogical problem statement: analyzing how social loafing and lack of commit transparency harm student teams and burden course instructors.
  * Formulated the platform vision: unifying classroom administration with automated GitHub contribution tracking.
* **Section 1.2: Intended Audience and Reading Suggestions**:
  * Outlined document navigation paths tailored for course instructors, student developers, academic evaluators, and software architects.
* **Section 1.3: Project Scope & Core Workflows**:
  * Authored the dual-cycle interaction description illustrated in **Figure 1.1** (`workflow.png`):
    - *Student Cycle*: Class enrollment, team formation, Kanban task management, GitHub code commits, evidence submission, and gamified XP rewards.
    - *Teacher Cycle*: Course section creation, team oversight, evidence inspection alongside heuristic confidence scores, authoritative grading, and effort distribution analytics.

### 2.2 Chapter 2: Overall Description
* **Section 2.1: User Hierarchy & Operational Responsibilities**:
  * Designed the complete user taxonomy and role responsibilities documented in **Figure 2.1** (`user_types.png`):
    1. *Course Instructors (Teachers)*: Create course sections, generate join codes, review evidence, assign XP, and grade projects.
    2. *Student Team Leaders*: Register teams, manage repository links, coordinate team task boards, and invite peers.
    3. *Student Developers*: Claim tasks, push commits, submit completion evidence, and monitor progress.
    4. *System Administrators*: Manage server infrastructure, database backups, and institutional tenant settings.
* **Section 2.2: Operating Environment & Client Compatibility**:
  * Specified client execution constraints: modern ECMAScript 2023+ browsers (Google Chrome 110+, Mozilla Firefox 115+, Apple Safari 16+, Microsoft Edge), responsive viewport support from mobile ($375\text{ px}$) to 4K displays ($3840\text{ px}$).

### 2.3 Chapter 3: Specific Functional Requirements (Frontend Modules)
I authored the operational steps, user input constraints, state validations, and visual response specifications for the following modules:

* **Module 1: Class Enrollment & Join Code Interface (FR-1.1 to FR-1.4)**:
  * Specified one-click join code copying, client-side format validation, and automated redirection to the class workspace.
* **Module 2: Team Formation & Collaborative Workspace (FR-2.1 to FR-2.3)**:
  * Specified team creation forms, peer invitation dialogs, and role badge indicators.
* **Module 3: Interactive Kanban Board Interface (FR-3.1 to FR-3.6)**:
  * Specified visual card components, status column swimlanes, priority badges, drag-and-drop feedback states, and filtering by assignee and priority.
* **Module 8: Instructor Verification Portal & Review Dialogs (FR-8.1 to FR-8.4)**:
  * Specified the instructor evaluation interface, confidence score visual badges (High $\ge 0.75$, Medium $0.50-0.74$, Low $< 0.50$), side-by-side evidence inspection, and feedback comments modal.
* **Module 9: Gamified XP Leaderboards & Badges (FR-9.1 to FR-9.4)**:
  * Specified the Arena interface: XP level progress bars, consecutive day streak counters, and unlocked milestone badges.
* **Module 11: Team Chat Window & Notification Drawer (FR-11.1 to FR-11.3)**:
  * Specified real-time messaging UI, unread message badges, and slide-out notification drawer.

### 2.4 Chapter 4: Usability & User Experience Requirements
* **Section 4.4: Usability and Ergonomics**:
  * Specified WCAG 2.1 AA accessibility standards (minimum contrast ratio of $4.5:1$ for body text).
  * UI latency invariant: Visual feedback on user interaction (clicks, drags, modal opens) must render within $\le 100\text{ ms}$.
  * Form error handling: Inline contextual error messages beneath invalid input fields, eliminating generic alert popups.

---

## 3. Diagrammatic Artifacts Produced

I designed and compiled the following PlantUML diagrams integrated directly into the compiled SRS document:

1. **`SRS/diagrams/workflow.puml`** (**Figure 1.1**):
   - Mapped the end-to-end interactions between the Student Development Cycle and the Faculty Verification Cycle.
2. **`SRS/diagrams/user_types.puml`** (**Figure 2.1**):
   - Created the hierarchical user role diagram defining permissions and operational scopes for Teachers, Team Leaders, Students, and Administrators.
3. **`SRS/diagrams/task_activity.puml`** (**Figure 2.4**):
   - Modeled the complete task lifecycle activity flow, illustrating teacher approval/rejection decision branches.

---

## 4. Requirement Verification & UI Test Matrix

I created the UI verification matrix ensuring every functional requirement in Chapter 3 mapped to a verified React component and user acceptance test flow in `frontend/src/pages/` and `frontend/src/components/`.
