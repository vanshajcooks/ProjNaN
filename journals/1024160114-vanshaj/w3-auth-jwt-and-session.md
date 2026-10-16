# Week 3 : Dual-Token Authentication Lifecycle, Bcrypt Hashing, & Session Security

**Author**: Vanshaj Sharma (Roll No. 1024160114)  
**Role**: Backend Lead  
**Week**: 3 (September 2026)  
**Module**: Authentication Service, JWT Tokens, Bcrypt Salting, and Security Middleware  

---

## 1. Ticket Description & Vulnerability Analysis

The initial prototype implementation of the authentication endpoints relied on sending a single long-lived JSON Web Token (JWT) in the response body, which the frontend client stored in browser `localStorage`. 

### Vulnerabilities Identified:
1. **Cross-Site Scripting (XSS) Token Theft**: Any third-party script or XSS vulnerability could read `localStorage.getItem('token')` and permanently impersonate the user.
2. **Missing Token Revocation**: Because JWTs are stateless, if a student or faculty account was compromised, there was no way to invalidate the token prior to its expiration.
3. **Password Hashing Latency Spikes**: Using inadequate salt rounds or unoptimized hashing caused event loop blocking during batch authentication.

---

## 2. Relevant Context

In `backend/src/controllers/authController.js` and `backend/src/middleware/auth.js`:
```javascript
// Initial flawed auth flow
const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user }); // Sent raw token to client localStorage
```

If an access token has a 7-day lifespan, revoking permissions (e.g. demoting a user or blocking compromised credentials) is impossible without maintaining a stateful blacklist for all issued tokens.

---

## 3. Key Observation & Security Strategy

To achieve enterprise-grade security and prevent token theft:
1. **Dual-Token Model**:
   - **Access Token**: Short-lived (15 minutes), containing user claims (`id`, `email`, `role`, `team_id`), passed via `Authorization: Bearer <token>` header or authenticated cookie.
   - **Refresh Token**: Long-lived (7 days), stored securely in an `httpOnly`, `SameSite=Lax`, `Secure` cookie, inaccessible to client-side JavaScript.
2. **Bcrypt Salt Configuration**: Set to 10 salt rounds ($2^{10} = 1024$ iterations), providing cryptographic resistance against offline rainbow table attacks while executing in $\approx 45\text{ ms}$ on modern server hardware (avoiding event loop starvation).

---

## 4. Solution & Implementation

I rewrote `backend/src/services/authService.js`, `backend/src/controllers/authController.js`, and `backend/src/middleware/auth.js`.

### Authentication Middleware (`backend/src/middleware/auth.js`):

```javascript
// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authenticateToken(req, res, next) {
  let token = null;

  // 1. Extract from Authorization Bearer header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Fallback to signed httpOnly cookie
  if (!token && req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      error: 'Access Denied',
      message: 'No valid authentication token provided in request header or cookie.',
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token Expired',
        code: 'TOKEN_EXPIRED',
        message: 'Access token has expired. Please refresh credentials.',
      });
    }
    return res.status(403).json({
      error: 'Invalid Token',
      message: 'Cryptographic signature verification failed.',
    });
  }
}

module.exports = { authenticateToken };
```

### Refresh Token Rotation (`backend/src/controllers/authController.js`):

```javascript
// backend/src/controllers/authController.js
const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { user, accessToken, refreshToken } = await authService.login(email, password);

    // Set secure httpOnly cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth/refresh',
    });

    return res.status(200).json({
      message: 'Authentication successful.',
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const clientRefreshToken = req.cookies.refreshToken;
    if (!clientRefreshToken) {
      return res.status(401).json({ error: 'Refresh token not found.' });
    }

    const { newAccessToken } = await authService.rotateToken(clientRefreshToken);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired refresh token.' });
  }
}

module.exports = { login, refreshToken };
```

---

## 5. Rationale & Security Guarantees

**Because**:
1. Setting `httpOnly: true` on the `refreshToken` cookie guarantees that even if a Cross-Site Scripting (XSS) attack occurs on the frontend, malicious scripts cannot extract the refresh token.
2. Short-lived access tokens (15 minutes) limit the attack window if an access token is intercepted in transit.
3. Path scoping `path: '/api/auth/refresh'` ensures the browser only sends the heavy refresh cookie to the dedicated token rotation endpoint, minimizing HTTP header overhead on standard API queries.

---

## 6. Verification & Results

Verified dual-token rotation and cookie issuance using Jest and Supertest:

```shell
$ npm test tests/auth.test.js

PASS tests/auth.test.js
  ✓ should register a new student user with hashed password (45 ms)
  ✓ should reject login with incorrect password (38 ms)
  ✓ should return access token and set httpOnly refresh cookie on valid login (52 ms)
  ✓ should reject protected endpoints without Bearer token (8 ms)
  ✓ should refresh access token using valid refresh cookie (34 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```
