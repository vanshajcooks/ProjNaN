# 🌐 ProjNaN — Collaborative Developer Web Client

<p align="center">
  <img src="./src/assets/hero.png" alt="ProjNaN Platform Hero" width="760" style="border-radius: 14px; box-shadow: 0 16px 48px rgba(124, 58, 237, 0.28);" />
</p>

<p align="center">
  <strong>"Build ideas. Build together. Grow your developer reputation."</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/React_Router-7.18-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router 7" />
  <img src="https://img.shields.io/badge/React_Compiler-Enabled-7928CA?style=for-the-badge&logo=babel&logoColor=white" alt="React Compiler" />
  <img src="https://img.shields.io/badge/Lighthouse-96%2F100-00CC66?style=for-the-badge&logo=lighthouse&logoColor=white" alt="Lighthouse 96/100" />
  <img src="https://img.shields.io/badge/Design_Tokens-Dark_Glassmorphism-8b5cf6?style=for-the-badge" alt="Design Tokens" />
  <img src="https://img.shields.io/badge/Bundle_Size-412_kB-38bdf8?style=for-the-badge" alt="Bundle Size" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

---

## 📌 Frontend Client Overview

This directory contains the production Single Page Application (SPA) web client for **ProjNaN**. Built using **React 19**, **Vite 8**, and **React Router DOM 7**, the web client delivers a dark-mode glassmorphic user experience tailored for university software engineering students and faculty.

---

## 🗺️ Web Route Architecture

The web client encompasses **9 complete views**:

| Route | View Component | Access Level | Description |
| :--- | :--- | :---: | :--- |
| `/` | `Landing.jsx` | **Public** | High-impact marketing showcase with dynamic statistics and hero preview. |
| `/login` | `Login.jsx` | **Public** | Role-aware login with demo credentials (`aryan@example.com`, `teacher@example.com`). |
| `/register` | `Register.jsx` | **Public** | Student/Teacher account registration with email validation. |
| `/dashboard` | `Dashboard.jsx` | **Protected** | Main developer mission control, course rosters, and quick task creations. |
| `/projects` | `Explore.jsx` | **Protected** | Searchable project repository with tag and technology filtering. |
| `/projects/:id` | `Project.jsx` | **Protected** | Workspace hub with milestones, GitHub commit feeds, PRs, and teacher reviews. |
| `/tasks` | `Tasks.jsx` | **Protected** | 4-Column drag-and-drop Kanban workspace with evidence dialogs. |
| `/arena` | `Arena.jsx` | **Protected** | Competitive gamification hub: weekly challenges, evidence review, and leaderboard. |
| `/profile` | `Profile.jsx` | **Protected** | Student developer portfolio, earned badges, XP breakdown, and class memberships. |
| `/chat` | `Chat.jsx` | **Protected** | Real-time project discussions across `#general`, `#dev`, and `#announcements`. |

---

## 🎨 UI/UX Design System Tokens

Located in `src/App.css`, the website uses CSS custom property tokens:

```css
:root {
  --bg-canvas: #08090d;          /* Deep canvas background */
  --bg-surface: #0d0e13;         /* Container surface */
  --bg-card: #111218;            /* Card surface */
  --border-subtle: #1f2028;      /* Borders */
  --border-highlight: #3b2a5c;   /* Accent border */
  --accent-violet: #8b5cf6;      /* Primary electric violet */
  --accent-violet-glow: #a78bfa; /* Lavender glow */
  --status-completed: #22c55e;   /* Success / Completed */
  --status-pending: #eab308;     /* Warning / Pending */
  --status-progress: #3b82f6;    /* Progress */
  --status-urgent: #ef4444;      /* Urgent */
}
```

---

## 🚀 Running the Web Client Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```

Visit `http://localhost:5173` to explore the website. All `/api` calls are automatically proxied to `http://localhost:5000` via `vite.config.js`.

### 3. Build for Production
```bash
npm run build
```

Production bundle size: $412.44\text{ kB}$ JS ($113.60\text{ kB}$ gzip), $29.64\text{ kB}$ CSS ($6.30\text{ kB}$ gzip).
Google Lighthouse performance score: **96 / 100**.

---

## 👥 Authors
- **Aryan Thakkar** (`1024160100`) — *Frontend Lead & UI/UX Architect*
- **Vanshaj Sharma** (`1024160114`) — *Backend Lead & Systems Architect*
- **Faculty Guide**: **Dr. Anushka**, Computer Science & Engineering Department, TIET Patiala.
