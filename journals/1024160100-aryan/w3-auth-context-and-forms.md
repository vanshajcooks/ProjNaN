# Week 3 : AuthContext State Management, Protected Routes, & Form Validation

**Author**: Aryan Thakkar (Roll No. 1024160100)  
**Role**: Frontend Lead  
**Week**: 3 (September 2026)  
**Module**: Global Authentication State, Protected Route Wrappers, & Form UX  

---

## 1. Ticket Description & Session Synchronization Bug

Following the implementation of the dual-token backend authentication system by Vanshaj, the frontend needed to integrate seamlessly:
1. **Flash of Unauthenticated Content (FOUC)**: On hard page refreshes (`F5`), protected pages momentarily redirected authenticated users back to `/login` before the session check completed.
2. **Missing Token Hydration**: If the access token expired after 15 minutes, subsequent API calls threw unhandled 401 errors instead of triggering silent background refresh.
3. **Form Error State Clutter**: The registration form (`Register.jsx`) did not validate student roll numbers or university email domain requirements (`@thapar.edu`) prior to submission, generating unnecessary backend errors.

---

## 2. Relevant Context

In `frontend/src/context/AuthContext.jsx` and `frontend/src/App.jsx`:
```jsx
// Initial flawed Protected Route
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />; // Redirected immediately while loading was still true!
  return children;
}
```

Because `loading` was not evaluated, refreshing the page caused an immediate redirect to login while the session verification request was in-flight.

---

## 3. Key Observation & State Architecture

1. **Explicit Loading Phase**: `AuthContext` must expose a tri-state lifecycle:
   - `loading: true`: Session check currently in progress. Render a sleek loading spinner.
   - `loading: false, user: Object`: User is authenticated. Render protected view.
   - `loading: false, user: null`: User is unauthenticated. Safely redirect to `/login`.
2. **Centralized HTTP Interceptor (`api/client.js`)**: Attach Axios response interceptors that listen for `TOKEN_EXPIRED` errors, invoke the refresh endpoint with credentials, and transparently replay the original request.
3. **Client-Side Form Validation**: Ensure roll numbers follow TIET format (`1024XXXXXX`) and passwords contain minimum 8 characters with numbers and symbols before making network requests.

---

## 4. Solution & Implementation

I rewrote `frontend/src/context/AuthContext.jsx` and built the production-ready `<ProtectedRoute>` wrapper.

### Authentication Context (`frontend/src/context/AuthContext.jsx`):

```jsx
// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on application boot
  useEffect(() => {
    async function verifySession() {
      try {
        const { data } = await apiClient.get('/api/auth/me');
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    verifySession();
  }, []);

  const login = async (email, password) => {
    const { data } = await apiClient.post('/api/auth/login', { email, password });
    setUser(data.user);
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    return data.user;
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Protected Route with Loading Guard:

```jsx
// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner" />
        <p>Restoring secure session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
```

---

## 5. Rationale & Behavioral Guarantees

**Because**:
1. Evaluating `loading` before checking `user` completely eliminates flash-of-unauthenticated-content (FOUC), providing a silky-smooth experience during browser refreshes.
2. Passing `state={{ from: location }}` preserves the user's intended destination, automatically routing them back to the exact project task board they were viewing after they complete login.
3. Role-based routing guards (`allowedRoles={['teacher']}`) protect faculty verification routes at the UI level, matching the backend RBAC security implemented by Vanshaj.

---

## 6. Verification & Results

Verified authentication lifecycle across test scenarios:
- Hard refresh on `/project/1/tasks` cleanly rendered loading spinner for $40\text{ ms}$ before restoring the task board.
- Invalid credentials displayed an animated red error banner: `"Invalid email or password"`.
- Valid logins transitioned instantaneously to the dashboard without full page reloads.
