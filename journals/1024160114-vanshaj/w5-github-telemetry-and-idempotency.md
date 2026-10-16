# Week 5 : GitHub Octokit REST Telemetry Synchronization & Idempotent Ingestion

**Author**: Vanshaj Sharma (Roll No. 1024160114)  
**Role**: Backend Lead  
**Week**: 5 (Early October 2026)  
**Module**: GitHub Telemetry Ingestion, Octokit API Client, & Activity Deduplication  

---

## 1. Ticket Description & Data Duplication Bug

To provide instructors with visibility into student coding habits, Probon integrates with remote GitHub repositories via `@octokit/rest`. However, upon testing the periodic sync endpoint (`POST /api/github/sync/:projectId`), multiple critical issues occurred:
1. Re-syncing the same repository duplicated existing commits and pull requests in `github_activities`, causing distorted analytics and artificially inflated contribution graphs.
2. Inconsistent author identification: students used different Git configuration emails (`vsharma2_be24@thapar.edu` vs `vanshaj.personal@gmail.com`) compared to their registered platform emails.
3. Unauthenticated requests to GitHub were rapidly throttled after 60 requests/hour (`403 API rate limit exceeded`).

---

## 2. Relevant Context

In `backend/src/services/githubService.js`:
```javascript
// Initial flawed sync query
for (const commit of commits) {
  db.prepare(`
    INSERT INTO github_activities (team_id, type, external_id, title, author, timestamp)
    VALUES (?, 'commit', ?, ?, ?, ?)
  `).run(teamId, commit.sha, commit.commit.message, commit.commit.author.name, commit.commit.author.date);
}
```

Because `external_id` (the Git commit SHA) lacked a compound unique constraint scoped to the team, repeated synchronizations resulted in exponential row proliferation.

---

## 3. Key Observation & Engineering Decisions

1. **Idempotent Ingestion via Composite Keys**: A Git commit SHA, PR number, or issue ID is globally unique within a specific repository/team context. The database must enforce `UNIQUE(team_id, external_id, type)` on `github_activities`.
2. **Author Identity Resolution Pipeline**: To resolve student Git identities, the ingestion engine must implement a dual-lookup strategy:
   - Match by normalized GitHub username (`login`).
   - Match by committer email address against registered student profiles in `users`.
   - Fall back to an unverified external committer flag if no platform user matches.
3. **Octokit Client Token Injection**: Authenticate requests using a designated team/instructor Personal Access Token (PAT), expanding the rate limit from 60 to 5,000 requests/hour.

---

## 4. Solution & Implementation

I updated `backend/src/db/schema.sql` to enforce composite uniqueness and rebuilt `backend/src/services/githubService.js`.

### Database Schema Constraint:

```sql
CREATE TABLE IF NOT EXISTS github_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'commit' | 'pull_request' | 'issue'
    external_id TEXT NOT NULL,
    title TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    matched_user_id INTEGER,
    url TEXT,
    timestamp DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (matched_user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(team_id, external_id, type)
);

CREATE INDEX IF NOT EXISTS idx_gh_activities_team_time ON github_activities(team_id, timestamp);
```

### Idempotent Synchronization Engine (`backend/src/services/githubService.js`):

```javascript
// backend/src/services/githubService.js
const { Octokit } = require('@octokit/rest');
const db = require('../config/database');

async function syncRepositoryActivities(teamId, repoOwner, repoName, personalAccessToken = null) {
  const octokit = new Octokit({
    auth: personalAccessToken || process.env.GITHUB_DEFAULT_TOKEN,
  });

  console.log(`[GITHUB] Syncing ${repoOwner}/${repoName} for Team #${teamId}...`);

  // 1. Fetch recent commits (latest 50)
  const { data: commits } = await octokit.repos.listCommits({
    owner: repoOwner,
    repo: repoName,
    per_page: 50,
  });

  // 2. Fetch pull requests
  const { data: pullRequests } = await octokit.pulls.list({
    owner: repoOwner,
    repo: repoName,
    state: 'all',
    per_page: 30,
  });

  const insertActivity = db.prepare(`
    INSERT INTO github_activities (
      team_id, type, external_id, title, author_name, author_email, matched_user_id, url, timestamp
    ) VALUES (
      @team_id, @type, @external_id, @title, @author_name, @author_email, @matched_user_id, @url, @timestamp
    )
    ON CONFLICT(team_id, external_id, type) DO UPDATE SET
      title = excluded.title,
      matched_user_id = COALESCE(excluded.matched_user_id, github_activities.matched_user_id)
  `);

  const syncTx = db.transaction(() => {
    let newEntries = 0;

    for (const c of commits) {
      const email = c.commit.author?.email?.toLowerCase();
      // Match with enrolled student
      const user = email ? db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(email) : null;

      const result = insertActivity.run({
        team_id: teamId,
        type: 'commit',
        external_id: c.sha,
        title: c.commit.message.split('\n')[0].substring(0, 255),
        author_name: c.commit.author?.name || 'Unknown',
        author_email: email,
        matched_user_id: user ? user.id : null,
        url: c.html_url,
        timestamp: c.commit.author?.date || new Date().toISOString(),
      });

      if (result.changes > 0) newEntries++;
    }

    return { totalCommits: commits.length, newEntries };
  });

  const stats = syncTx();
  console.log(`[GITHUB] Synchronized successfully. New activities ingested: ${stats.newEntries}`);
  return stats;
}

module.exports = { syncRepositoryActivities };
```

---

## 5. Rationale & Mathematical Justification

**Because**:
1. Applying `ON CONFLICT(team_id, external_id, type) DO UPDATE` ensures strict idempotency: multiple simultaneous sync invocations will result in the exact same state without producing duplicate records ($\forall k, f(f(k)) = f(k)$).
2. Truncating commit titles to the initial newline prevents multiline commit descriptions from corrupting tabular UI layouts while preserving the concise functional intent.
3. Caching and mapping commit author emails dynamically with `matched_user_id` allows analytics queries to aggregate contributions using high-speed relational index lookups (`WHERE matched_user_id = ?`) rather than slow string equality scans.

---

## 6. Verification & Test Output

```shell
$ npm test tests/github.test.js

PASS tests/github.test.js
  ✓ should mock octokit and fetch repository commits (42 ms)
  ✓ should ingest new commits into database (24 ms)
  ✓ should not duplicate activities on consecutive sync calls (18 ms)
  ✓ should map commit author email to enrolled student user (16 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```
