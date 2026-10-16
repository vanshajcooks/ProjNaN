# Week 4 : Finite State Machine for Kanban Tasks & SRS Requirement Formalization

**Author**: Vanshaj Sharma (Roll No. 1024160114)  
**Role**: Backend Lead  
**Week**: 4 (Late September 2026)  
**Module**: Task Lifecycle State Machine & SRS Requirements Formulation  

---

## 1. Ticket Description & State Machine Vulnerability

During the initial integration of the Kanban task board, tasks could be updated to any arbitrary status via `PUT /api/tasks/:id`. Consequently:
1. Students could move tasks directly from `planned` to `completed` without committing code, assigning an owner, or submitting completion evidence.
2. Rejected tasks in `in_progress` could not be audited to see previous instructor feedback.
3. Concurrent drag-and-drop actions by different team members resulted in conflicting states.

In parallel, we were formalizing the **Software Requirements Specification (SRS)**, necessitating a rigorous mathematical definition of task states and transitions.

---

## 2. Relevant Context

In `backend/src/services/taskService.js`:
```javascript
// Flawed direct status update
async function updateTaskStatus(taskId, newStatus) {
  const query = 'UPDATE tasks SET status = ? WHERE id = ?';
  db.prepare(query).run(newStatus, taskId); // No state machine validation!
}
```

Allowing arbitrary state transitions undermined the core premise of Probon: authentic contribution verification.

---

## 3. Key Observation & State Machine Specification

A Task in Probon must be modeled as a **Deterministic Finite State Machine (FSM)**:

$$\mathcal{S} = \{\text{planned}, \text{in\_progress}, \text{verification\_pending}, \text{completed}\}$$

### Allowed State Transitions:
1. $\text{planned} \to \text{in\_progress}$: Occurs when a student claims a task or is assigned. Requires `assignee_id`.
2. $\text{in\_progress} \to \text{verification\_pending}$: Triggered when the student submits completion evidence (PR link, commit SHA, description). Requires non-empty evidence payload.
3. $\text{verification\_pending} \to \text{completed}$: Only permitted by an instructor (or automated rule engine with teacher approval).
4. $\text{verification\_pending} \to \text{in\_progress}$: Instructor rejection; transitions task back to `in_progress` accompanied by feedback comments.
5. All other transitions (e.g. $\text{planned} \to \text{completed}$ or $\text{completed} \to \text{planned}$) are **strictly prohibited** ($400\text{ Bad Request}$).

---

## 4. Solution & Implementation

I implemented the finite state machine transition logic in `backend/src/services/taskService.js` and defined the corresponding requirements in **SRS Chapter 3 (FR-4.1 - FR-4.5)**.

### State Machine Implementation (`backend/src/services/taskService.js`):

```javascript
// backend/src/services/taskService.js
const db = require('../config/database');

const VALID_TRANSITIONS = {
  planned: ['in_progress'],
  in_progress: ['verification_pending', 'planned'],
  verification_pending: ['completed', 'in_progress'],
  completed: [] // Terminal state unless reopened by instructor
};

function transitionTaskStatus(taskId, targetStatus, user, evidence = null) {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!task) {
    const error = new Error('Task not found.');
    error.status = 404;
    throw error;
  }

  const currentStatus = task.status;
  const allowed = VALID_TRANSITIONS[currentStatus] || [];

  if (!allowed.includes(targetStatus)) {
    const error = new Error(
      `Illegal state transition: Cannot move task from '${currentStatus}' to '${targetStatus}'.`
    );
    error.status = 400;
    throw error;
  }

  // Precondition checks
  if (targetStatus === 'in_progress' && !task.assignee_id && !user.id) {
    const error = new Error('Task must have an assignee before moving to in_progress.');
    error.status = 400;
    throw error;
  }

  if (targetStatus === 'verification_pending') {
    if (!evidence || (!evidence.pr_link && !evidence.commit_hash)) {
      const error = new Error('Task completion evidence (PR link or commit SHA) is required for verification.');
      error.status = 400;
      throw error;
    }
  }

  if (targetStatus === 'completed' && user.role !== 'teacher' && user.role !== 'admin') {
    const error = new Error('Only faculty instructors or authorized evaluators can approve tasks to completed.');
    error.status = 403;
    throw error;
  }

  // Execute transition atomically
  const updateTransaction = db.transaction(() => {
    db.prepare(`
      UPDATE tasks 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(targetStatus, taskId);

    if (evidence) {
      db.prepare(`
        INSERT INTO task_verifications (task_id, submitted_by, pr_link, commit_hash, notes, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
      `).run(taskId, user.id, evidence.pr_link, evidence.commit_hash, evidence.notes || '');
    }
  });

  updateTransaction();
  return { id: taskId, previousStatus: currentStatus, newStatus: targetStatus };
}

module.exports = { transitionTaskStatus };
```

---

## 5. Rationale & Formal Guarantees

**Because**:
1. Enforcing transition rules on the server eliminates client-side bypasses (e.g. executing direct curl commands or manipulating web developer tools).
2. Requiring completion evidence at the transition moment ensures that no unverified task enters the instructor's grading queue.
3. Restricting the `completed` transition to `teacher` / `admin` roles upholds academic integrity, guaranteeing that students cannot award themselves course credit.

---

## 6. Verification & Results

Automated state transition tests in `tests/tasks.test.js`:

```shell
$ npm test tests/tasks.test.js

PASS tests/tasks.test.js
  ✓ should create task in planned state (15 ms)
  ✓ should allow transition from planned to in_progress with assignee (18 ms)
  ✓ should reject illegal transition from planned directly to completed (12 ms)
  ✓ should reject verification_pending transition without evidence (14 ms)
  ✓ should allow verification_pending transition with valid PR link (22 ms)
  ✓ should reject student attempting to complete verification_pending task (16 ms)
  ✓ should allow teacher to approve task to completed (28 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```
