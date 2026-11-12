# Hostinger Deployment Guide
## Quality Rental Business Services

---

## Overview

| Layer | Technology | Where it runs |
|---|---|---|
| Frontend | React + Vite (built to static files) | Hostinger `public_html/` |
| Backend | PHP REST API | Hostinger `public_html/api/` |
| Database | MySQL | Hostinger MySQL Databases panel |

> **Routing note:** The app uses `BrowserRouter` (not hash routing). All frontend
> URLs are normal paths (`/rentals`, `/admin-login`). The SPA fallback in
> `public_html/.htaccess` (shipped in `dist/`) rewrites unknown paths to
> `index.html`. Do NOT use `/#/...` URLs — they are outdated.

---

## Step 1 — Create the MySQL Database on Hostinger

1. Log in to **Hostinger hPanel**
2. Go to **Databases → MySQL Databases**
3. Create a new database, e.g. `uXXXXXXXXX_rentals`
4. Create a database user and assign it to the database with **All Privileges**
5. Note down:
   - Database host (usually `localhost`)
   - Database name
   - Database username
   - Database password

---

## Step 2 — Import the Database Schema

1. In hPanel go to **Databases → phpMyAdmin**
2. Select your database
3. Click the **Import** tab
4. Upload `database/schema.sql` → click **Go**
5. Then import `database/seed.sql` for the default categories and products

> `database/` must **never** be uploaded to `public_html/` — it is protected
> locally by `database/.htaccess`, but keep SQL files off the server entirely.

---

## Step 3 — Create the Admin Account

In phpMyAdmin, run this SQL (replace the values):

```sql
INSERT INTO admin (username, email, password)
VALUES (
  'YourUsername',
  'your@email.com',
  '$2y$10$REPLACE_WITH_BCRYPT_HASH'
);
```

To generate a bcrypt hash for your password, use this PHP snippet:

```php
<?php echo password_hash('YourPassword', PASSWORD_BCRYPT); ?>
```

---

## Step 4 — Upload the Backend (PHP API)

Upload these folders/files to `public_html/` on Hostinger via **File Manager** or FTP:

```
public_html/
└── api/
    ├── auth/
    │   ├── login.php
    │   ├── logout.php          ← NEW: destroys server session
    │   ├── forgot-password.php
    │   ├── reset-password.php
    │   └── change-password.php
    ├── config/
    │   ├── database.php
    │   ├── auth.php            ← NEW: session + requireAdmin()
    │   └── local.php           ← created ON server in Step 5 (never uploaded)
    ├── .htaccess
    ├── categories.php
    ├── chat-logs.php
    ├── color-settings.php
    ├── contact.php
    ├── gallery.php
    ├── products.php
    ├── quote-requests.php
    └── search-products.php
```

**Do NOT upload:** `api/config/local.php` is the ONLY secrets file — see Step 5.
Also never upload: `database/*.sql`, `*.zip`, `ftp-upload.ps1`, `node_modules/`,
`.env`, or the `frontend/` source folder.

---

## Step 5 — Configure Credentials & Settings on Hostinger

Every setting is resolved in this order (first match wins):

1. Environment variable of the same name
2. `QRS_LOCAL_CONFIG` env var → path to a PHP file returning settings
   (can live OUTSIDE `public_html`, e.g. `/home/uXXXXXXXX/domaindata/app.php`)
3. `api/config/local.php` inside the api folder (web-blocked by `.htaccess`)
4. Safe defaults (localhost DB defaults, built-in CORS origins — will NOT
   fully work on Hostinger)

**Recommended on Hostinger shared hosting — `local.php` on the server:**

1. hPanel → **Files → File Manager** → open `public_html/api/config/`
   (or create the file OUTSIDE `public_html` and set `QRS_LOCAL_CONFIG`)
2. Create `local.php` (permissions `644` — readable by PHP, blocked by
   `.htaccess` so it returns 403 in a browser; verified)
3. Paste (replace placeholders with your real values):

```php
<?php
return array(
    // Database credentials (lowercase keys)
    'host'     => 'localhost',
    'name'     => 'your_hostinger_db_name',
    'user'     => 'your_hostinger_db_user',
    'password' => 'your_hostinger_db_password',

    // Optional settings — same names as the env vars they replace
    'APP_URL'         => 'https://yourdomain.com',
    'CORS_ORIGINS'    => 'https://yourdomain.com,https://www.yourdomain.com',
    // 'TRUSTED_PROXIES' => '173.245.48.0/20,...',  // only if fronting with Cloudflare
);
```

> Hostinger shared hosting has **no UI for arbitrary PHP env vars**.
> `SetEnv` in `.htaccess` sometimes works under LiteSpeed but is unreliable —
> `local.php` (or `QRS_LOCAL_CONFIG` pointing outside `public_html`) is the
> dependable method, and it supports ALL settings: DB credentials plus
> `APP_URL`, `CORS_ORIGINS`, and `TRUSTED_PROXIES`.
> Never commit `local.php` — it is gitignored.

Where each setting is read:
- `APP_URL` → password-reset link base in `api/auth/forgot-password.php`,
  and added to the CORS allowlist in `api/config/database.php`
- `CORS_ORIGINS` → CORS allowlist in `api/config/database.php` (`qrs_allowed_origins()`)
- `TRUSTED_PROXIES` → `clientIp()` in `api/config/auth.php` — forwarding
  headers (`X-Forwarded-For`/`X-Real-IP`) are trusted ONLY when the direct
  peer is in this list; otherwise `REMOTE_ADDR` is used (safe default).
  Without it, rate limits key on the real connecting IP.

---

## Step 6 — Build & Upload the Frontend

```bash
cd frontend
npm run build
```

Upload the **contents** of `frontend/dist/` to `public_html/`:

```
dist/
├── index.html
├── .htaccess          ← SPA fallback + security headers
├── assets/
├── images/
└── upload/            ← includes upload/.htaccess (blocks script execution)
```

> `index.html` must end up at `public_html/index.html`, not inside a subfolder.

---

## Step 7 — Verify the .htaccess Files

| File | Purpose |
|---|---|
| `public_html/.htaccess` | SPA fallback (BrowserRouter) + security headers |
| `public_html/api/.htaccess` | Blocks `config/*.php` + security headers |
| `public_html/upload/.htaccess` | Blocks PHP/script execution in uploads |

File Manager hides dot files — enable "Show hidden files" to verify.

---

## Step 8 — Test the Deployment

| URL | Expected result |
|---|---|
| `https://yourdomain.com` | Homepage loads |
| `https://yourdomain.com/rentals` | Products page loads (refresh should NOT 404) |
| `https://yourdomain.com/admin-login` | Login page loads |
| `https://yourdomain.com/api/products.php` | Returns JSON |
| `https://yourdomain.com/api/categories.php` | Returns JSON |
| `https://yourdomain.com/api/quote-requests.php` (logged out) | `401` JSON |

---

## Step 9 — Admin Login After Deployment

Go to `https://yourdomain.com/admin-login`

- Use the username/password you created in Step 3.
- Login creates a server-side PHP session (HttpOnly + SameSite=Lax cookie).
- Admin-only API endpoints now require that session — the old
  `?admin=1` URL trick alone no longer grants API access.

---

## Folder Structure on Hostinger (Final)

```
public_html/
├── index.html              ← React app entry point
├── .htaccess               ← SPA fallback + security headers
├── favicon.ico
├── assets/                 ← JS + CSS bundles
├── images/                 ← Logo and static images
├── upload/                 ← Product images (+ .htaccess lockdown)
└── api/                    ← PHP backend
    ├── .htaccess           ← blocks config/*.php
    ├── config/
    │   ├── database.php
    │   ├── auth.php
    │   └── local.php       ← credentials (web-blocked, gitignored)
    ├── auth/
    │   └── *.php
    └── *.php
```

---

## Security Notes (current implementation)

- **Auth:** PHP sessions; `login.php` regenerates the session ID, sets
  HttpOnly + SameSite=Lax cookies, expires after **8 hours absolute**
  (login timestamp stored server-side) and 8h inactivity; `logout.php`
  destroys the session fully.
- **Authorization:** `requireAdmin()` guards all admin reads/writes
  (products/categories writes, quote/contact/chat-log reads, color-settings
  writes, change-password). Public endpoints: product/category/gallery GETs,
  quote/contact/chat-log POSTs, search, login/forgot/reset.
- **Rate limits:** login 10/15min, forgot-password 5/15min, quote & contact
  30/10min, chat-logs 120/10min — per client IP (trusted-proxy aware via
  `TRUSTED_PROXIES`), stored in temp files. Public-form limits are deliberately
  generous so customers on shared/carrier-grade NAT are never blocked; the
  honeypot + input validation do the real spam filtering.
- **Spam:** honeypot `hp_check` field (autofill-resistant name, hidden,
  `tabindex=-1`, `autocomplete=off`) on quote/contact/chat forms; drops are
  counted and written to the PHP error log.
- **Passwords:** bcrypt (`password_hash`/`password_verify`); reset tokens are
  SHA-256 hashed, expire in 1h, single-use, and all tokens for an email are
  invalidated on successful reset.
- **CORS:** allowlist only — `APP_URL`/`CORS_ORIGINS` (env or `local.php`) + localhost dev.
  Wildcard `*` is no longer emitted.
- **Headers:** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy` on frontend; `X-Frame-Options: DENY` on API.
  HSTS line is present but commented — uncomment after HTTPS is confirmed.

---

## Troubleshooting

### Blank page after upload
- Make sure `index.html` is at `public_html/index.html` (not inside a subfolder)
- Check `.htaccess` is uploaded (File Manager hides dot files)

### API returns 404
- Confirm `api/` folder is at `public_html/api/`
- Check PHP version in hPanel is 8.0+

### Database connection error
- Verify credentials via env vars or `api/config/local.php`
- On Hostinger, the DB host is usually `localhost` — not an IP
- A `500 {"success":false,"message":"Service temporarily unavailable."}`
  response means the DB connection failed — check credentials, not the code

### Images not showing
- Make sure `upload/` folder is at `public_html/upload/`
- File names are case-sensitive on Linux — match exactly

### CORS errors in browser console
- CORS is now allowlist-based. Ensure `APP_URL`/`CORS_ORIGINS` include your
  exact domain (with `https://`, no trailing slash)
- Same-origin requests never trigger CORS — errors mean the frontend and API
  are on different origins

### Admin gets 401 "Authentication required"
- Session expired (8h) or cookie blocked — log in again at `/admin-login`
- Ensure `session.cookie_secure` isn't forcing Secure cookies on plain HTTP
  (auth.php only sets Secure when HTTPS is detected)

### Password reset email never arrives
- Hostinger `mail()` works but is basic — for reliable delivery configure SMTP
  (e.g. Hostinger SMTP or a transactional service) and replace `mail()` calls
- The reset link uses `APP_URL` — set it to your real domain or links will be wrong

---

## Security Checklist Before Going Live

- [ ] Rotate the DB password (the old one existed in git history)
- [ ] Rotate the admin password
- [ ] Set `APP_URL` and `CORS_ORIGINS`/`DB_*` env vars or `local.php`
- [ ] Confirm HTTPS/SSL is active in hPanel, then uncomment the HSTS line
- [ ] Verify `api/config/local.php`, `database.php`, `auth.php` return 403 when fetched directly
- [ ] Verify `/database/` is NOT present under `public_html/`
- [ ] Remove `frontend/` source, `node_modules/`, `*.zip`, `ftp-upload.ps1` from server
- [ ] Run the post-deploy curl checks (see audit report / verification checklist)

---

## Zero-Downtime Deploy Order

Follow this order so credentials and code never disagree:

1. **Rotate the DB password** in hPanel → MySQL Databases.
2. **Update `api/config/local.php` on the server** with the NEW password
   (File Manager edit) — do this BEFORE uploading code that depends on it.
   The site keeps working because old and new code both read the same file.
3. **Upload `frontend/dist/` contents** to `public_html/` (overwrites old assets).
4. **Upload `api/` folder** to `public_html/api/` — EXCEPT `config/local.php`
   (you already edited it on-server in step 2; skip it in the upload).
5. **Run the verification curls** (see audit checklist): 401s on admin
   endpoints, 403 on foreign Origin, 429 after login brute-force, 403 on
   `/api/config/*` and `/database/*`.
6. **Log in at `/admin-login`** and click through: tabs, add/edit modal,
   change password, toast, logout.
7. **Rotate the admin password** from the panel.

If a step fails: re-upload the previous `dist/` contents and previous `api/`
files (keep a dated backup folder on your PC). DB schema is unchanged, so no
database rollback is needed.

---

## Removing Secrets from Git History

Audit finding: the production DB password was **never committed** (it only
existed in the local working tree). The admin password that appeared in an
old `DEPLOYMENT.md` **was** committed once. To purge it (replace
`OLD_SECRET` below with the real old password — do not commit it):

```bash
# 1. Install git-filter-repo (one time)
pip install git-filter-repo

# 2. BACKUP the remote before rewriting anything (pick ONE):
git clone --mirror https://github.com/quelemine/Quality-Rentals-Business-Services.git backup-remote.git
# or: git bundle create backup-$(date +%F).bundle --all

# 3. Create a replacements file (one secret per line: old==>new)
printf 'OLD_SECRET==>***REMOVED***\n' > replacements.txt

# 4. Rewrite ALL branches/tags, replacing the secret everywhere
#    (run from the repo root; commit or stash local changes first)
git filter-repo --replace-text replacements.txt --force

# 5. filter-repo removes the 'origin' remote — re-add it
git remote add origin https://github.com/quelemine/Quality-Rentals-Business-Services.git

# 6. Verify the secret is gone from every commit
git log --all -p | grep -c "OLD_SECRET"        # expect: 0
git rev-list --all | while read c; do git grep -l "OLD_SECRET" $c; done

# 7. Force-push the rewritten history
git push origin --force --all
git push origin --force --tags
```

> Warning: this rewrites history — anyone else with a clone must re-clone.
> Keep the `backup-remote.git` mirror (or bundle) until you are sure nothing
> is missing. Rotate the admin password BEFORE or right after, since the old
> one was public on GitHub.

---

## Post-Deploy Check — Visitor IP Behind Hostinger's Proxy

Rate limiting keys on the IP the server sees. If Hostinger proxies traffic,
all visitors may share one IP and legit users could hit the limit together.

> Note: `api/auth/session-info.php` is **excluded from automated deploys**
> (it is a temporary diagnostic). Upload it manually for this check, then
> delete it afterward.

1. Upload `api/auth/session-info.php` to `public_html/api/auth/` via
   File Manager (permissions `644`).
2. Log in at `/admin-login`, then in the browser console on the site run:
   ```js
   fetch('/api/auth/session-info.php', {credentials:'include'})
     .then(r => r.json()).then(console.log)
   ```
   Or with curl using your session cookie:
   ```bash
   curl -s -b cookies.txt https://yourdomain.com/api/auth/session-info.php
   ```
3. Compare `client_ip` with `remote_addr`/`xff`:
   - If `remote_addr` is always a Hostinger/LiteSpeed proxy IP for every
     visitor → ask Hostinger support which header carries the real visitor
     IP, add those proxy IPs to `TRUSTED_PROXIES` in `local.php`, and retest.
   - If `remote_addr` varies per visitor → no change needed; delete the file.
4. **Remove afterward:** delete `api/auth/session-info.php` from the server
   (File Manager) — it is a diagnostic and should not stay deployed.


---

## Automated Deployment (GitHub Actions → Hostinger FTP)

`.github/workflows/deploy.yml` runs on every push to `main` and on manual
dispatch. Pipeline: checkout (full history) → `npm ci` + `vite build` →
`php -l` on every file in `api/` → secret scan → stage `dist/` + `api/` minus
exclusions → upload via **FTPS only** → smoke tests against
https://suerental.com. Actions are pinned to commit SHAs. A `concurrency`
group prevents overlapping deploys.

### When does it actually upload? (trigger safety)

- **Push to `main` → dry run by default.** It builds, lints, scans, stages
  and connects via FTPS to show what *would* change — but uploads nothing
  and runs no smoke tests.
- **Automatic deploys:** set repository **variable** `AUTO_DEPLOY_ENABLED`
  = `true` (Settings → Secrets and variables → Actions → Variables tab).
  Only AFTER your first verified manual deployment — then every push to
  `main` performs a real FTPS deploy + smoke tests automatically.
- **Real upload → manual run:** Actions → "Deploy to Hostinger" → Run
  workflow with `dry_run` unchecked. This is also the only way to roll
  back (set `ref` to an earlier commit SHA or tag).
- All paths require approval if you configure the `production` environment
  (below).

### Prerequisites BEFORE the first real deployment

Do all of these first — the pipeline assumes the server is already safe:

1. **Rotate the DB password** (hPanel → MySQL) and the **admin password**
   (admin panel or phpMyAdmin), then create `api/config/local.php` **on the
   server** with the new DB password (see Step 5 — it is never uploaded).
2. **Back up `public_html`** (hPanel → Files → Compress, or download via
   File Manager) so you can restore the whole site if needed.
3. **Clean git history** if you haven't (see "Removing Secrets from Git
   History") — the old admin password is still readable in old commits.
4. **Rotate the FTP password** — it was stored in plaintext in the now-
   deleted `ftp-upload.ps1`.

### One-time GitHub setup

1. Repo → **Settings → Secrets and variables → Actions → Secrets** — add
   exactly these names:
   - `FTP_SERVER` = `157.173.208.134`
   - `FTP_PORT` = `21`
   - `FTP_USERNAME` = `u721020447`
   - `FTP_PASSWORD` = *(your FTP password — never paste it in chat or code)*
2. Optional repo **variable** (Settings → Secrets and variables → Actions →
   Variables tab): `FTP_SERVER_DIR` — only set this if the dry run fails
   with a "cannot change directory" error. Default is `public_html`, correct
   if your FTP login lands inside the domain folder; if it lands at the
   account home, set it to `domains/suerental.com/public_html`.
3. **Settings → Environments → New environment** named `production`, add
   yourself as **required reviewer** — every deploy then waits for your
   approval in the Actions UI.
4. Optional: **Settings → Branches** → protect `main` (require PR + status
   checks).

### First deploy — dry run, then real

1. Push your commits to `main` — the push-triggered run is automatically a
   dry run. Check the staged file list and the FTP connection in the log.
2. If FTP fails on `server-dir`, set the `FTP_SERVER_DIR` variable and
   re-run.
3. When the dry run looks right: Actions → Run workflow → **uncheck
   `dry_run`** → approve in the `production` environment → watch the smoke
   tests.

### FTPS only — no plain-FTP fallback

The workflow uses **FTPS (explicit TLS, port 21)** exclusively. If FTPS
fails, the job fails with a clear error and the password is never sent
unencrypted. Do NOT work around this by switching to plain FTP — fix FTPS
on the Hostinger side or contact Hostinger support.

### What is never uploaded / never deleted

Staging contains only `frontend/dist/` contents + `api/` minus
`local.php`, `session-info.php`, `test-*.php`, `fix-*.php`, `*.sql`,
`*.zip`, `.env*`, `node_modules`. `dangerous-clean-slate: false` means the
sync **only adds/updates** files — it never deletes anything on the server.
`public_html/api/config/local.php` (DB credentials + APP_URL/CORS_ORIGINS/
TRUSTED_PROXIES) and `public_html/upload/` (admin-uploaded images) are
untouched.

### Sync-state file

FTP-Deploy-Action writes `.ftp-deploy-sync-state.json` into
`public_html/`. The root `.htaccess` denies web access (403), and the
pipeline smoke-tests that it returns 403/404.

### If smoke tests fail after a real deploy

The new version is **already live** at that point. In order of preference:

1. **Immediate rollback:** Actions → Run workflow → set `ref` to the last
   known-good commit SHA/tag, `dry_run` unchecked → approve → deploy.
   (Tag your known-good commits — e.g. `git tag stable-2025-01 && git push
   origin stable-2025-01` — so rollback is one dropdown away.)
2. Or revert the bad commit on `main` and push — but note the push itself
   is only a dry run, so you must then do a manual run to actually deploy
   the revert.
3. Check what failed in the smoke-test output first — a 401-vs-200 mixup
   may be a config issue (`local.php`/`APP_URL`) rather than bad code.

### Rotating the FTP password later

1. Change it in hPanel → FTP Accounts.
2. GitHub → Settings → Secrets → `FTP_PASSWORD` → update value.
3. Push a trivial commit (dry run) to confirm the new password works, then
   do a real deploy.
