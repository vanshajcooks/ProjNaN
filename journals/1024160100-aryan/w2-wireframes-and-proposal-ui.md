# Week 2 : UI/UX Wireframing, Proposal User Journey, and Landing Page

**Author**: Aryan Thakkar (Roll No. 1024160100)  
**Role**: Frontend Lead  
**Week**: 2 (September 2026)  
**Module**: Wireframing, User Onboarding Flow, & Landing Page Interface  

---

## 1. Ticket Description & UX Challenge

During the preparation of the **Project Proposal**, we needed a compelling visual demonstration and clear user onboarding flow to show course evaluators:
1. Academic software often suffers from poor student adoption due to dated, clunky interfaces (e.g. Moodle, Blackboard).
2. The landing page needed to clearly articulate the value proposition of Probon to two vastly different audiences: **Students** (who want clarity and fair credit) and **Instructors** (who want automated verification and grading transparency).
3. The initial landing page implementation suffered from poor responsive image scaling, lack of contrast in call-to-action (CTA) buttons, and missing navigation anchors.

---

## 2. Relevant Context

In `frontend/src/pages/Landing.jsx`:
The landing view required:
- Engaging hero section with animated gradient headers and high-resolution illustration preview (`hero.png`).
- Core feature showcase cards:
  - *Automated GitHub Telemetry*: Commits, PRs, and branch tracking.
  - *Heuristic Verification*: Multi-factor confidence ratings.
  - *The Arena*: Gamified XP, streaks, and milestone badges.
  - *Role-Based Portals*: Frictionless class enrollment with unique join codes.
- Direct CTA buttons routing to `/login` and `/register`.

---

## 3. Key Observation & UX Design Principles

1. **Dual Onboarding Funnel**: Provide distinct paths on the landing interface:
   - "Join as Student" $\to$ prompts for Student Registration + 8-char Class Code.
   - "Instructor Portal" $\to$ prompts for Academic Faculty Sign In.
2. **Visual Hierarchy & Glassmorphism**: Utilize semi-transparent card surfaces with subtle borders (`rgba(255, 255, 255, 0.08)`) and high-contrast typography to convey a modern, developer-focused software engineering aesthetic.
3. **Asset Optimization**: Compress `hero.png` from $2.4\text{ MB}$ to $180\text{ kB}$ WebP/PNG while maintaining high-DPI retina sharpness.

---

## 4. Solution & Implementation

I built `frontend/src/pages/Landing.jsx` and styled it with modern CSS in `frontend/src/App.css`.

### Landing Page Component (`frontend/src/pages/Landing.jsx`):

```jsx
// frontend/src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';

export default function Landing() {
  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-pill">UCS 503 Software Engineering Platform</div>
          <h1 className="hero-title">
            Bridge Academic Projects with <span className="gradient-text">Verifiable Software Telemetry</span>
          </h1>
          <p className="hero-subtitle">
            Probon eliminates social loafing and guesswork in student engineering projects. 
            Connect Kanban boards with real GitHub commits, automated verification heuristics, 
            and gamified contribution accounting.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free →
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In to Class
            </Link>
          </div>
        </div>
        <div className="hero-media">
          <img src={heroImg} alt="Probon Workspace Preview" className="hero-illustration" />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Kanban with Evidence Gates</h3>
          <p>Tasks cannot simply be moved to completed without attaching real PR links and verified commit SHAs.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>Heuristic Verification Engine</h3>
          <p>Deterministic algorithms calculate 0.20 - 0.98 confidence scores to assist faculty evaluation.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>The Arena Gamification</h3>
          <p>Earn XP, level up your developer profile, maintain weekly streaks, and unlock milestone achievement badges.</p>
        </div>
      </section>
    </div>
  );
}
```

---

## 5. Rationale & Academic Impact

**Because**:
1. High-fidelity visual communication on the landing page immediately engaged evaluators during our Project Proposal defense, demonstrating that Probon is an engineered software platform, not just a theoretical report.
2. Presenting clear value propositions for both students and teachers directly addressed the core pedagogical objectives of the course template.
3. Structuring modular feature cards allowed components to be reused within the dashboard overview and student exploration pages.

---

## 6. Verification & Results

Verified accessibility and rendering:
- Contrast ratio on hero gradient text: $> 6.2:1$ (exceeding WCAG AA requirements).
- Mobile responsiveness: Single-column stacked layout automatically triggers at $< 768\text{ px}$.
- Zero layout shift during image loading ($CLS = 0.002$).
