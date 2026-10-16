# Project Report (Prototype Stage) Contributions — Aryan Thakkar

**Author**: Aryan Thakkar (Roll No. 1024160100)  
**Role**: Frontend Lead & UI/UX Architect  
**Document**: Project Report Prototype Stage (Mid-Semester Evaluation)  
**Course**: UCS 503 — Software Engineering  
**Department**: Computer Science and Engineering Department, TIET Patiala  
**Faculty Guide**: Dr. Anushka  
**Evaluation Date**: October 16, 2026  

---

## 1. Overview of Report Contributions

For the **Mid-Semester Prototype Evaluation Report**, I authored the sections detailing the **Frontend Architecture & Component Hierarchy**, **User Interface Implementations Across All 9 Views**, **Client-Side Performance & Bundle Optimization**, and **User Experience Challenges and Mitigations**.

Together with Vanshaj Sharma (who documented the backend services, relational schema, and 52-test automated suite), we established an exhaustive technical report demonstrating a production-ready, fully integrated prototype.

---

## 2. Key Sections Authored in the Mid-Semester Report

### 2.1 Frontend Architecture & Component Hierarchy
- Documented the modular React 19 Single Page Application structured within `frontend/src/`:
  - **Pages (Views)**: Full-page layout containers managing route-level data fetching and state (`Landing.jsx`, `Dashboard.jsx`, `Project.jsx`, `Tasks.jsx`, `Arena.jsx`, `Explore.jsx`, `Profile.jsx`, `Chat.jsx`, `Login.jsx`, `Register.jsx`).
  - **Shared Components**: Reusable UI elements (`navbar.jsx`, `sidebar.jsx`, `Taskcard.jsx`, `projectcard.jsx`, `ChatWindow.jsx`, `ChatInput.jsx`, `MessageBubble.jsx`).
  - **Context Layer (`AuthContext.jsx`)**: Centralized authentication state managing current user session, token storage, login/logout transitions, and dynamic role hydration.
  - **API Client Layer (`api/client.js`)**: Configured fetch/Axios client with base URL routing, credentials inclusion, and automatic token refresh interceptors.

### 2.2 UI Implementation Across the 9 Functional Modules
Documented the operational implementation of all primary client interfaces:
1. **Interactive Kanban Board (`Tasks.jsx` & `Taskcard.jsx`)**:
   - 4 responsive columns with visual counters (`Planned`, `In Progress`, `Verification Pending`, `Completed`).
   - Drag-and-drop state updates with smooth transition animations and optimistic UI rendering.
2. **Faculty Verification Portal (`Project.jsx`)**:
   - Verification queue listing tasks awaiting faculty approval.
   - Heuristic confidence score indicator pills (`HIGH_CONFIDENCE`, `MEDIUM_CONFIDENCE`, `MANUAL_REVIEW`).
   - Side-by-side evidence inspection drawer showing linked PR title, commit SHA, and author credentials.
   - Rejection feedback dialog returning tasks to `in_progress` with actionable comments.
3. **The Arena Gamification Dashboard (`Arena.jsx`)**:
   - Dynamic Experience Points (XP) level progression bars.
   - Streak counter cards with flame icons and milestone badge unlock grids.
4. **Team Collaboration & Chat Hub (`Chat.jsx`)**:
   - Multi-channel project chat with real-time message bubbles and timestamp grouping.

### 2.3 Production Bundle Analysis & Optimization Metrics
- Authored the performance benchmarking chapter, documenting Vite production build metrics:
  - **Production JavaScript Bundle**: **$412.44\text{ kB}$** ($113.60\text{ kB}$ gzip compressed).
  - **Production CSS Bundle**: **$29.64\text{ kB}$** ($6.30\text{ kB}$ gzip compressed).
  - **Total Assets Size**: Sub-$500\text{ kB}$, allowing instant rendering even over low-bandwidth mobile connections.

```
vite v5.x building for production...
✓ 48 modules transformed.
dist/index.html                   0.82 kB │ gzip:  0.42 kB
dist/assets/index-D7bN2.css      29.64 kB │ gzip:  6.30 kB
dist/assets/index-B3k8A.js      412.44 kB │ gzip: 113.60 kB
✓ built in 420ms
```

### 2.4 Google Lighthouse Performance & Usability Audit
- Documented automated Lighthouse audit results on the student dashboard:
  - **Performance**: **96 / 100** (First Contentful Paint $< 0.8\text{ s}$, Speed Index $< 1.1\text{ s}$).
  - **Accessibility**: **98 / 100** (Full WCAG 2.1 AA color contrast compliance, complete ARIA labels).
  - **Best Practices**: **100 / 100** (Modern HTTPS, zero vulnerable JS libraries).
  - **SEO**: **92 / 100**.

### 2.5 Frontend Engineering Challenges & Mitigations
- **Challenge 1: Optimistic UI Desynchronization in Kanban Drag-and-Drop**.  
  *Mitigation*: Implemented a transactional snapshot rollback pattern in `Tasks.jsx`. If the backend returns an error or rejects an illegal state transition, the board immediately rolls the task back to its previous column and alerts the user with a contextual toast notification.
- **Challenge 2: Token Expiry Interceptors & Silent Session Recovery**.  
  *Mitigation*: Integrated an Axios response interceptor that catches HTTP 401 `TOKEN_EXPIRED` errors, pauses outgoing requests in a queue, requests a new access token via `/api/auth/refresh`, and transparently replays the original requests without logging the user out.
- **Challenge 3: Cross-Device Glassmorphism Performance Overhead**.  
  *Mitigation*: Replaced excessive `backdrop-filter: blur(...)` styling with optimized pre-rendered semi-transparent CSS color variables on mobile screens ($\le 768\text{ px}$), preventing GPU compositing lag.

---

## 3. Work Division & Parity Confirmation

The mid-semester report formally records a **50% / 50% work division** between frontend engineering (Aryan Thakkar) and backend engineering (Vanshaj Sharma). Both authors contributed equally to the technical design, codebase implementation, and academic documentation.
