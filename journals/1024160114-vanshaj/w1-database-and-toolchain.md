# Week 1 : Environment, Toolchain, and Multi-Environment Database Migration Engine

**Author**: Vanshaj Sharma (Roll No. 1024160114)  
**Role**: Backend Lead  
**Week**: 1 (Late August / Early September 2026)  
**Module**: Toolchain, Database Connection Management, & Migration Engine  

---

## 1. Ticket Description & Error Encountered

During the initial backend bootstrapping of the Express.js server and database initialization, foreign key constraints were silently ignored by the SQLite driver (`better-sqlite3` / `sqlite3`). Consequently, inserting child records (such as `team_members` referencing non-existent `team_id` or `user_id`) did not throw any referential integrity violations. Furthermore, running migrations across test and development environments resulted in inconsistent database states.

### Observed Failure Log:

```shell
[TEST FAIL] tests/db_integrity.test.js
> Expected: SQLiteConstraintError (FOREIGN KEY constraint failed)
> Received: 201 Created (Inserted row with invalid foreign key references)
```

---

## 2. Relevant Context

In the initial database connection utility `backend/src/config/database.js`, the SQLite connection was established without explicitly activating foreign key enforcement pragmas:

```javascript
// backend/src/config/database.js (Initial flawed implementation)
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../data/probon.db');
const db = new Database(dbPath, { verbose: console.log });

module.exports = db;
```

When executing migration scripts (`migrate.js`), the script read the raw SQL definitions and executed them in batch without transaction boundaries or PRAGMA verification.

---

## 3. Key Observation & Root Cause

By default, the SQLite database engine disables foreign key constraint enforcement for backwards compatibility with legacy SQLite 3.0 versions. Every newly opened connection must explicitly issue `PRAGMA foreign_keys = ON;` before executing queries. Additionally:
1. SQLite running in standard `DELETE` rollback journal mode experienced file-lock contention when tests attempted simultaneous read operations during migration writes.
2. In production and continuous integration, connection busy timeouts must be set to allow thread queuing rather than failing immediately with `SQLITE_BUSY`.

---

## 4. Solution & Implementation

I re-engineered `backend/src/config/database.js` to initialize the database with strict WAL mode, enforced foreign key pragmas on every connection instance, and implemented a robust transactional migration runner in `backend/src/db/migrate.js`.

### Corrected Connection Handler:

```javascript
// backend/src/config/database.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : (process.env.DB_PATH || path.join(dbDir, 'probon.db'));

const db = new Database(dbPath, {
  timeout: 5000,
  verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

// Enforce critical pragmas for performance and referential integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');
db.pragma('busy_timeout = 5000');

console.log(`[DB] Connected successfully to SQLite (${process.env.NODE_ENV || 'development'} mode)`);

module.exports = db;
```

### Migration Script with Foreign Key Verification:

```javascript
// backend/src/db/migrate.js
const fs = require('fs');
const path = require('path');
const db = require('../config/database');

function runMigrations() {
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  console.log('[MIGRATE] Verifying foreign key enforcement...');
  const fkStatus = db.pragma('foreign_keys', { simple: true });
  if (!fkStatus) {
    throw new Error('FATAL: Foreign key enforcement could not be enabled!');
  }

  console.log('[MIGRATE] Applying schema definitions in transaction...');
  const applySchema = db.transaction(() => {
    db.exec(schemaSql);
  });

  applySchema();
  console.log('[MIGRATE] All tables and indexes applied successfully.');
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
```

---

## 5. Rationale & Theoretical Validation

**Because**:
1. SQLite requires `PRAGMA foreign_keys = ON` per-connection because pragmas are connection-scoped, not stored in the database file header. Without this, referential integrity rules in table definitions are completely ignored by the query planner.
2. `PRAGMA journal_mode = WAL` (Write-Ahead Logging) replaces the rollback journal with a `.wal` file, permitting concurrent readers and writers without blocking or deadlocks.
3. Transaction wrapping in `db.transaction()` ensures atomicity: if any DDL statement fails, the entire migration rolls back without leaving an orphaned or corrupted schema.

---

## 6. Verification & Test Output

Running the automated test suite confirmed that foreign key violations now cleanly trigger expected SQLite errors:

```shell
$ npm test tests/db_integrity.test.js

PASS tests/db_integrity.test.js
  ✓ should enforce PRAGMA foreign_keys = ON (4 ms)
  ✓ should reject insertion of team_member with non-existent user_id (18 ms)
  ✓ should reject task creation with non-existent project_id (12 ms)
  ✓ should support concurrent read queries under WAL mode (24 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```
