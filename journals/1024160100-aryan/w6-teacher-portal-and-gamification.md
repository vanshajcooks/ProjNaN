# Week 6 : Teacher Verification Portal, Feedback Modals, & Arena Gamification

**Author**: Aryan Thakkar (Roll No. 1024160100)  
**Role**: Frontend Lead  
**Week**: 6 (October 2026)  
**Module**: Teacher Review Interface, Confidence Badges, & Arena Gamification Dashboard  

---

## 1. Ticket Description & Interface Requirements

With the backend verification engine and gamification tables completed:
1. **Instructor Decision Fatigue**: Faculty instructors (Dr. Anushka) needed an ergonomic, high-throughput verification queue to inspect submitted tasks without digging through nested pages.
2. **Confidence Score Visualization**: The backend produces confidence ratings ($0.20 - 0.98$). The UI needed to present this score cleanly as an assistive aid—never overwhelming the teacher with raw decimals, but highlighting low-confidence anomalies (e.g. mismatched authors or unmerged PRs).
3. **The Arena Gamification Experience (`Arena.jsx`)**: To motivate student teams, the platform needed an interactive gamification view rendering XP level progress bars, active weekly streaks, and milestone badges (e.g. *"First PR Merged"*, *"Clean Architecture"*, *"Sprint Champion"*).

---

## 2. Relevant Context

In `frontend/src/pages/Project.jsx` (Instructor View) and `frontend/src/pages/Arena.jsx`:
- Faculty members can toggle between the Student Kanban view and the **Faculty Review Queue**.
- In the review queue, each pending verification item displays:
  - Task title and assigned student.
  - Heuristic confidence badge:
    - $\ge 75\%$: Emerald badge (`HIGH_CONFIDENCE`).
    - $50\% - 74\%$: Amber badge (`MEDIUM_CONFIDENCE`).
    - $< 50\%$: Crimson badge (`MANUAL_REVIEW`).
  - Action buttons: `Approve & Award XP` (Green) or `Request Changes` (Red).

---

## 3. Key Observation & UI Ergonomics

1. **Rubric Rejection Dialog**: If an instructor clicks `Request Changes`, never just flip the state back silently. Open a modal requiring feedback comments so the student receives specific pedagogical direction.
2. **Gamification Micro-Interactions**: In `Arena.jsx`, render smooth CSS-animated XP progress bars that fill from left to right on page load (`transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1)`).
3. **Badge Unlocking Grid**: Distinguish unlocked badges (glowing gold with particle effects) from locked milestone badges (grayscale $50\%$ opacity with lock iconography).

---

## 4. Solution & Implementation

I developed the Faculty Verification Review Component in `frontend/src/pages/Project.jsx` and built the gamified dashboard in `frontend/src/pages/Arena.jsx`.

### Teacher Verification Component Excerpt:

```jsx
// Excerpt from Teacher Review Interface in Project.jsx
export function VerificationQueue({ verifications, onApprove, onReject }) {
  const getConfidenceBadge = (score) => {
    if (score >= 0.75) {
      return <span className="badge badge-success">High Confidence ({(score * 100).toFixed(0)}%)</span>;
    } else if (score >= 0.50) {
      return <span className="badge badge-warning">Medium ({(score * 100).toFixed(0)}%)</span>;
    }
    return <span className="badge badge-danger">Review Required ({(score * 100).toFixed(0)}%)</span>;
  };

  return (
    <div className="verification-queue-card">
      <div className="card-header">
        <h3>Pending Faculty Verifications ({verifications.length})</h3>
      </div>
      <div className="queue-list">
        {verifications.map(item => (
          <div key={item.id} className="verification-row">
            <div className="row-info">
              <h4>{item.task_title}</h4>
              <p>Submitted by: <strong>{item.student_name}</strong> ({item.roll_number})</p>
              <div className="evidence-links">
                {item.pr_link && <a href={item.pr_link} target="_blank" rel="noreferrer">View Pull Request ↗</a>}
                {item.commit_hash && <code>SHA: {item.commit_hash.substring(0, 7)}</code>}
              </div>
            </div>

            <div className="row-scoring">
              {getConfidenceBadge(item.confidence_score)}
              <div className="score-breakdown">
                <span>Author match: {(item.breakdown?.authorMatch * 100).toFixed(0)}%</span>
                <span>Semantic: {(item.breakdown?.semanticRelevance * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="row-actions">
              <button className="btn btn-success" onClick={() => onApprove(item.id)}>
                ✓ Approve (+50 XP)
              </button>
              <button className="btn btn-outline-danger" onClick={() => onReject(item.id)}>
                ✕ Request Revision
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Arena Gamification Dashboard (`frontend/src/pages/Arena.jsx`):

```jsx
// Excerpt from frontend/src/pages/Arena.jsx
import React from 'react';

export default function Arena({ userStats, leaderboard }) {
  const xpPercentage = Math.min(100, (userStats.current_xp % 100));

  return (
    <div className="arena-container">
      {/* User Progress Header */}
      <div className="user-hero-card">
        <div className="user-level-badge">
          <span className="level-number">Lvl {userStats.level || 1}</span>
          <span className="level-title">Full-Stack Architect</span>
        </div>
        <div className="xp-meter-wrapper">
          <div className="xp-labels">
            <span>Progress to Next Rank</span>
            <span>{userStats.current_xp} / {(userStats.level * 100)} XP</span>
          </div>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${xpPercentage}%` }} />
          </div>
        </div>
        <div className="streak-indicator">
          <span className="flame-icon">🔥</span>
          <span className="streak-count">{userStats.streak_days || 3} Day Streak</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="badges-section">
        <h2>Milestone Achievement Badges</h2>
        <div className="badges-grid">
          {userStats.badges?.map(b => (
            <div key={b.id} className={`badge-card ${b.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="badge-icon">{b.icon || '🏅'}</div>
              <h4>{b.name}</h4>
              <p>{b.description}</p>
              <span className="badge-status">{b.unlocked ? 'Unlocked' : 'Locked'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Rationale & Pedagogical Value

**Because**:
1. Surface-level gamification (XP and badges) has been shown in pedagogical research (Sommerville, Pressman) to increase student commit frequency and reduce end-of-semester cramming.
2. Breaking down the heuristic confidence score into transparent sub-factors empowers the instructor to make fair decisions in seconds, eliminating manual Git archaeology.
3. Requiring explicit feedback on rejections prevents frustration, turning grading moments into formative learning feedback.

---

## 6. Verification & User Acceptance

Evaluated during laboratory demo:
- Approving a task dynamically added +50 XP, triggered an animated toast notification, and incremented the student's level bar in `Arena.jsx`.
- Rejecting a task prompted the revision modal and moved the card cleanly back to `in_progress`.
