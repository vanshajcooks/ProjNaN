# Week 4 : Interactive Kanban Board with Optimistic Drag-and-Drop & SRS Formulation

**Author**: Aryan Thakkar (Roll No. 1024160100)  
**Role**: Frontend Lead  
**Week**: 4 (Late September 2026)  
**Module**: Kanban Task Board, Drag-and-Drop State Machine, & SRS Specification  

---

## 1. Ticket Description & Drag-and-Drop Desynchronization

The Kanban task board is the core everyday workspace where students organize project features and track sprint progress (`frontend/src/pages/Tasks.jsx`).

### Problems Encountered:
1. **Network Latency Lag**: In the first prototype, moving a card waited for the server HTTP response before visually moving the card. On mobile or high-latency Wi-Fi, cards "snapped back" for $300\text{ ms}$ before updating, causing high user frustration.
2. **State Desynchronization on Rejection**: If the server rejected an illegal transition (e.g. moving a task directly from `planned` to `completed`), the UI was out of sync with the database until the entire page was manually reloaded.
3. In parallel, we were drafting the **Software Requirements Specification (SRS)**, requiring explicit modeling of the UI swimlanes and task card data presentation.

---

## 2. Relevant Context

In `frontend/src/pages/Tasks.jsx` and `frontend/src/components/Taskcard.jsx`:
The board organizes tasks across 4 canonical columns:
1. `planned` (Backlog / To Do)
2. `in_progress` (Active Implementation)
3. `verification_pending` (Awaiting Faculty Review)
4. `completed` (Verified & Graded)

When a user drags a card from Column A to Column B, the UI must handle both the visual feedback and the network dispatch.

---

## 3. Key Observation & Optimistic UI Architecture

1. **Optimistic State Snapshot Pattern**:
   - Step 1: Capture a memory snapshot of the current tasks array: `const previousTasks = [...tasks];`
   - Step 2: Optimistically update local React state immediately so the card moves instantaneously ($0\text{ ms}$ perceived latency).
   - Step 3: Dispatch asynchronous `apiClient.patch(...)` to the backend.
   - Step 4: If successful, silently commit the updated task attributes.
   - Step 5: If the backend returns an error (e.g. `400 Illegal state transition`), **revert** local state to `previousTasks` and display a clear explanatory toast.
2. **Evidence Modal Interceptor**: If the user drags a card into `verification_pending`, intercept the drop and open the **Evidence Submission Modal** rather than completing the move blindly.

---

## 4. Solution & Implementation

I implemented the optimistic drag-and-drop state machine in `frontend/src/pages/Tasks.jsx` and detailed the functional requirements in **SRS Chapter 3 (FR-3.1 - FR-3.6)**.

### Optimistic Task Transition Handler (`frontend/src/pages/Tasks.jsx`):

```jsx
// Excerpt from frontend/src/pages/Tasks.jsx
import React, { useState } from 'react';
import apiClient from '../api/client';
import Taskcard from '../components/Taskcard';
import EvidenceModal from '../components/EvidenceModal';

export default function Tasks({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [activeEvidenceTask, setActiveEvidenceTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDragEnd = async (taskId, targetColumn) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === targetColumn) return;

    // Intercept transitions requiring evidence
    if (targetColumn === 'verification_pending') {
      setActiveEvidenceTask(task);
      return; // Open modal dialog; do not move card until evidence submitted
    }

    // 1. Snapshot previous state for rollback
    const previousTasks = [...tasks];

    // 2. Optimistic update
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: targetColumn } : t))
    );

    try {
      // 3. Dispatch to backend state machine
      await apiClient.patch(`/api/tasks/${taskId}/status`, { status: targetColumn });
      setErrorMessage(null);
    } catch (err) {
      // 4. Rollback on rejection
      setTasks(previousTasks);
      const reason = err.response?.data?.message || 'Failed to update task status.';
      setErrorMessage(reason);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  return (
    <div className="kanban-board-container">
      {errorMessage && <div className="toast-error">{errorMessage}</div>}
      
      <div className="kanban-grid">
        {['planned', 'in_progress', 'verification_pending', 'completed'].map(col => (
          <div key={col} className={`kanban-column col-${col}`}>
            <div className="column-header">
              <h3>{col.replace('_', ' ').toUpperCase()}</h3>
              <span className="count-badge">
                {tasks.filter(t => t.status === col).length}
              </span>
            </div>
            <div className="cards-list">
              {tasks
                .filter(t => t.status === col)
                .map(t => (
                  <Taskcard key={t.id} task={t} onMove={handleDragEnd} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {activeEvidenceTask && (
        <EvidenceModal
          task={activeEvidenceTask}
          onClose={() => setActiveEvidenceTask(null)}
          onSuccess={updatedTask => {
            setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
            setActiveEvidenceTask(null);
          }}
        />
      )}
    </div>
  );
}
```

---

## 5. Rationale & Formal Guarantees

**Because**:
1. Optimistic updates provide zero-latency tactile feedback, matching the responsiveness of desktop applications like Trello while maintaining backend authority.
2. Intercepting the `verification_pending` drop event guarantees that the user cannot transition a card without satisfying the backend requirement for PR links and commit SHAs.
3. Preserving previous state snapshots guarantees data integrity across unstable campus Wi-Fi connections.

---

## 6. Verification & Results

Verified interaction behavior across test cases:
- Dragging from `planned` to `in_progress` renders instantaneously.
- Attempting to drag directly from `planned` to `completed` triggers immediate rollback and displays: `"Illegal state transition: Cannot move task from 'planned' to 'completed'."`
- Submitting valid evidence in the modal cleanly advances the task to `verification_pending` with an orange badge indicator.
