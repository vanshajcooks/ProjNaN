# Week 1 : Frontend Toolchain, Design System Tokens, and App Shell Layout

**Author**: Aryan Thakkar (Roll No. 1024160100)  
**Role**: Frontend Lead  
**Week**: 1 (Late August / Early September 2026)  
**Module**: Vite Setup, Design System Tokens, & App Shell Layout  

---

## 1. Ticket Description & Layout Overflow Defect

During initial client bootstrapping with Vite and React 19, the core application shell experienced layout breakage:
1. In `frontend/src/App.jsx`, nested flex containers caused the sidebar navigation to shrink unexpectedly when viewport heights were resized, causing nav links to overflow beyond the screen bottom.
2. Inconsistent color palette and font rendering across different OS browsers (Windows Chrome vs macOS Safari) due to hardcoded hex values in component CSS files.
3. React 19 strict mode double-invoking mount effects caused flicker in initial responsive window resize listeners.

### Observed Layout Defect:
```
[CSS OVERFLOW] Sidebar content truncated on viewports < 900px height.
Body scrollbar active despite fixed app shell container.
```

---

## 2. Relevant Context

In `frontend/src/components/sidebar.jsx` and `frontend/src/index.css`:
```css
/* Initial flawed sidebar CSS */
.sidebar {
  width: 250px;
  height: 100%;
  position: absolute; /* Broke responsive flex flow */
  background: #1e1e2f;
}
```

Using absolute positioning decoupled the sidebar from the main content viewport, causing overlaps when the main page content rendered tables or long card grids.

---

## 3. Key Observation & Design System Strategy

1. **Centralized CSS Custom Properties (Design Tokens)**: Instead of arbitrary hex codes across components, define semantic design tokens in `:root` for surface colors, borders, typography, and glassmorphic elevations.
2. **CSS Grid App Shell**: A 2-column, 2-row CSS Grid layout (`sidebar`, `navbar`, `main-content`) guarantees that the navigation sidebar remains anchored, the top navbar stays pinned, and only the main workspace area scrolls vertically.
3. **Typography Standard**: Standardized on Inter / system-ui sans-serif with modular font sizing ($0.875\text{ rem}$ body, $1.125\text{ rem}$ headings, $1.75\text{ rem}$ display titles).

---

## 4. Solution & Implementation

I established global design tokens in `frontend/src/index.css` and rebuilt the application shell in `frontend/src/App.jsx` and `frontend/src/components/sidebar.jsx`.

### Design Tokens (`frontend/src/index.css`):

```css
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: rgba(30, 41, 59, 0.7);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(99, 102, 241, 0.5);
  
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  
  --accent-primary: #6366f1;
  --accent-hover: #4f46e5;
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  
  --status-planned: #94a3b8;
  --status-progress: #38bdf8;
  --status-pending: #fbbf24;
  --status-completed: #34d399;
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}
```

### App Shell Grid Layout (`frontend/src/App.css`):

```css
.app-container {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "sidebar navbar"
    "sidebar main";
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app-sidebar {
  grid-area: sidebar;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.app-navbar {
  grid-area: navbar;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.app-main {
  grid-area: main;
  overflow-y: auto;
  padding: 24px 32px;
}
```

---

## 5. Rationale & Architecture Validation

**Because**:
1. Utilizing CSS Grid template areas (`sidebar`, `navbar`, `main`) guarantees that content resizing in the main viewport never distorts navigation geometry or forces horizontal scrollbars.
2. Encapsulating visual constants in CSS Custom Properties (`--bg-card`, `--accent-primary`) enables zero-runtime theming, high performance (no JavaScript style recalculation), and complete design consistency across all 9 pages.
3. Using `overflow-y: auto` strictly on `.app-main` isolates scroll events to the content view, preventing the entire document window from shifting during fast trackpad gestures.

---

## 6. Verification & Results

Verified responsive behavior across Chrome DevTools responsive viewports:
- Desktop ($1920 \times 1080$): Seamless grid with anchored sidebar.
- Laptop ($1366 \times 768$): Crisp layout with zero visual cutoff.
- Tablet ($768 \times 1024$): Clean mobile drawer toggle activated via media query.
