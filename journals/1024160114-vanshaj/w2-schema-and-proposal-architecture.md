# Week 2 : Relational Schema Modeling, Foreign Keys, & Data Seeding Engine

**Author**: Vanshaj Sharma (Roll No. 1024160114)  
**Role**: Backend Lead  
**Week**: 2 (September 2026)  
**Module**: Relational Schema Design, Foreign Key Cascades, & Seeding Architecture  

---

## 1. Ticket Description & Architectural Challenge

During the formulation of the **Project Proposal**, we needed a complete relational entity model reflecting university classroom dynamics:
- Instructors create academic classes and generate unique join codes.
- Students enroll in classes and form collaborative teams.
- Each team creates a project workspace linked to a GitHub repository.
- Tasks are created within projects and assigned to specific team members.

The challenge arose with **cascade deletion semantics** and **composite uniqueness constraints**:
1. When an academic class is deleted or archived, all associated team memberships and project records must maintain audit trails or cascade cleanly.
2. Students must not be permitted to register for the same class or team more than once.
3. Seeding scripts repeatedly failed with duplicate primary key collisions when executed multiple times in local development.

---

## 2. Relevant Context

In the initial draft of `schema.sql`, join tables like `class_members` and `team_members` lacked compound primary keys, allowing duplicate join relationships. Furthermore, tasks were linked directly to teams rather than projects, creating ambiguity when teams undertook multiple iterative project modules:

```sql
-- Initial flawed schema excerpt
CREATE TABLE IF NOT EXISTS class_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER,
    user_id INTEGER,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
    -- Missing UNIQUE(class_id, user_id)
);
```

---

## 3. Key Observation & Engineering Decisions

1. **Compound Keys vs Surrogate Keys**: Join tables representing mathematical relations between two entities (e.g. `class_id` and `user_id`) should enforce composite unique constraints `UNIQUE(class_id, user_id)` to prevent race conditions during student enrollment.
2. **Deterministic Unique Class Code Generation**: Class codes must be human-readable alphanumeric strings (e.g. `UCS503-G14-2026`) that are uniquely indexed for instant lookup during student onboarding.
3. **Idempotent Data Seeding (`seed.js`)**: Developer productivity requires running `node src/db/seed.js` repeatedly without throwing primary key collision errors or generating duplicate dummy test users.

---

## 4. Solution & Implementation

I structured the official `backend/src/db/schema.sql` defining 11 normalized relational entities with explicit `ON DELETE CASCADE` rules, and engineered an idempotent seeder (`seed.js`) using `INSERT OR IGNORE`.

### Excerpt from `backend/src/db/schema.sql`:

```sql
-- =========================================================================
-- ACADEMIC HIERARCHY TABLES
-- =========================================================================

CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    course_code TEXT NOT NULL,
    section TEXT NOT NULL,
    join_code TEXT NOT NULL UNIQUE,
    instructor_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_classes_join_code ON classes(join_code);

CREATE TABLE IF NOT EXISTS class_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(class_id, user_id)
);

CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class_id INTEGER NOT NULL,
    leader_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE RESTRICT,
    UNIQUE(class_id, name)
);

CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role TEXT DEFAULT 'member', -- 'leader' | 'member'
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(team_id, user_id)
);
```

### Idempotent Seeder Implementation (`backend/src/db/seed.js`):

```javascript
// backend/src/db/seed.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  console.log('[SEED] Beginning idempotent data population...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (email, name, password_hash, role, roll_number)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET name = excluded.name
  `);

  const seedTransaction = db.transaction(() => {
    // 1. Seed Faculty Guide
    insertUser.run('anushka@thapar.edu', 'Dr. Anushka', passwordHash, 'teacher', 'FAC-UCS-01');

    // 2. Seed Student Developers
    insertUser.run('vsharma2_be24@thapar.edu', 'Vanshaj Sharma', passwordHash, 'student', '1024160114');
    insertUser.run('athakkar_be24@thapar.edu', 'Aryan Thakkar', passwordHash, 'student', '1024160100');

    console.log('[SEED] Core users verified/seeded.');
  });

  seedTransaction();
  console.log('[SEED] Database seeding completed cleanly.');
}

if (require.main === module) {
  seedDatabase().catch(err => {
    console.error('[SEED] Failure:', err);
    process.exit(1);
  });
}
```

---

## 5. Rationale & Theoretical Validation

**Because**:
1. Applying `UNIQUE(class_id, user_id)` and `UNIQUE(team_id, user_id)` enforces domain invariants at the persistence layer, guaranteeing that even under asynchronous concurrent enrollment requests, a student cannot double-enroll.
2. Using SQLite's `ON CONFLICT(...) DO UPDATE` pattern converts destructive insertions into idempotent upserts, allowing developers to reset and re-seed test databases instantly without running manual teardown queries.
3. Placing index `idx_classes_join_code` on `join_code` transforms class enrollment lookups from $O(N)$ full table scans into $O(\log N)$ B-tree lookups.

---

## 6. Verification & Results

Verified schema migration and seeding through test scripts:
```shell
$ node src/db/migrate.js
[MIGRATE] Verifying foreign key enforcement...
[MIGRATE] Applying schema definitions in transaction...
[MIGRATE] All tables and indexes applied successfully.

$ node src/db/seed.js
[SEED] Beginning idempotent data population...
[SEED] Core users verified/seeded.
[SEED] Database seeding completed cleanly.
```
