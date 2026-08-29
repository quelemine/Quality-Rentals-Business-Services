# Hostinger Deployment Guide
## Quality Rental Business Services

---

## Overview

| Layer | Technology | Where it runs |
|---|---|---|
| Frontend | React + Vite (built to static files) | Hostinger `public_html/` |
| Backend | PHP REST API | Hostinger `public_html/api/` |
| Database | MySQL | Hostinger MySQL Databases panel |

---

## Step 1 — Create the MySQL Database on Hostinger

1. Log in to **Hostinger hPanel**
2. Go to **Databases → MySQL Databases**
3. Create a new database, e.g. `quality_rentals`
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

To generate a bcrypt hash for your password, use this PHP snippet in any PHP file:

```php
<?php echo password_hash('YourPassword', PASSWORD_BCRYPT); ?>
```

Or simply log in with your **existing credentials** — they were migrated from local.

---

## Step 4 — Upload the Backend (PHP API)

Upload these folders/files to `public_html/` on Hostinger via **File Manager** or FTP:

```
public_html/
├── api/
│   ├── auth/
│   │   ├── login.php
│   │   ├── forgot-password.php
│   │   ├── reset-password.php
│   │   └── change-password.php
│   ├── config/
│   │   └── database.php
│   ├── .htaccess
│   ├── categories.php
│   ├── chat-logs.php
│   ├── color-settings.php
│   ├── contact.php
│   ├── gallery.php
│   ├── products.php
│   ├── quote-requests.php
│   └── search-products.php
```

---

## Step 5 — Configure Database Credentials on Hostinger

Edit `api/config/database.php` **on the server** and update the development defaults to match your Hostinger database:

```php
$this->host = getenv('DB_HOST') ?: 'localhost';
$this->db_name = getenv('DB_NAME') ?: 'your_hostinger_db_name';
$this->username = getenv('DB_USER') ?: 'your_hostinger_db_user';
$this->password = getenv('DB_PASSWORD') ?: 'your_hostinger_db_password';
```

> **Tip:** Hostinger Business plan supports environment variables via hPanel → Advanced → PHP Configuration. Set `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` there so credentials are never in code.

---

## Step 6 — Build & Upload the Frontend

Run the production build locally:

```bash
cd frontend
npm run build
```

This creates `frontend/dist/` with these files:

```
dist/
├── index.html
├── .htaccess
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── images/
│   └── QualityRentalServices-logo.jpeg
└── upload/
    └── (product images)
```

Upload the **entire contents** of `frontend/dist/` to `public_html/` on Hostinger.

> **Important:** Upload the *contents* of `dist/`, not the `dist/` folder itself. So `index.html` should be at `public_html/index.html`.

---

## Step 7 — Upload Product Images

Upload `frontend/public/upload/` folder contents to `public_html/upload/` on Hostinger.
Upload `frontend/public/images/` folder contents to `public_html/images/` on Hostinger.

---

## Step 8 — Verify the .htaccess Files

Make sure these two `.htaccess` files are in place:

**`public_html/.htaccess`** — handles React routing + HTTPS redirect (already in `dist/`)

**`public_html/api/.htaccess`** — secures the API directory (already in `api/`)

---

## Step 9 — Test the Deployment

Visit your domain and check:

| URL | Expected result |
|---|---|
| `https://yourdomain.com` | Homepage loads |
| `https://yourdomain.com/#/rentals` | Products load from DB |
| `https://yourdomain.com/#/admin-login` | Login page loads |
| `https://yourdomain.com/api/products.php` | Returns JSON |
| `https://yourdomain.com/api/categories.php` | Returns JSON |

---

## Step 10 — Admin Login After Deployment

Go to `https://yourdomain.com/#/admin-login`

- Username: `Susanna` (or whatever you set)
- Password: `Paye!12345` (or whatever you set)

---

## Folder Structure on Hostinger (Final)

```
public_html/
├── index.html              ← React app entry point
├── .htaccess               ← React routing + HTTPS
├── favicon.ico
├── assets/                 ← JS + CSS bundles
├── images/                 ← Logo and static images
├── upload/                 ← Product images
└── api/                    ← PHP backend
    ├── .htaccess
    ├── config/
    │   └── database.php
    ├── auth/
    │   └── *.php
    └── *.php
```

---

## Troubleshooting

### Blank page after upload
- Make sure `index.html` is at `public_html/index.html` (not inside a subfolder)
- Check `.htaccess` is uploaded (File Manager hides dot files — enable "Show hidden files")

### API returns 404
- Confirm `api/` folder is at `public_html/api/`
- Check PHP version in hPanel is 8.0+

### Database connection error
- Verify credentials in `api/config/database.php`
- On Hostinger, the DB host is usually `localhost` — not an IP

### Images not showing
- Make sure `upload/` folder is at `public_html/upload/`
- File names are case-sensitive on Linux — match exactly

### CORS errors in browser console
- The `api/*.php` files already set `Access-Control-Allow-Origin: *`
- If issues persist, add this to `public_html/.htaccess`:
  ```apache
  Header always set Access-Control-Allow-Origin "*"
  ```

---

## Security Checklist Before Going Live

- [ ] Change admin password from default
- [ ] Set database credentials via environment variables (not hardcoded)
- [ ] Confirm HTTPS is active (Hostinger provides free SSL — enable in hPanel)
- [ ] Verify `api/config/database.php` is not publicly accessible
- [ ] Remove any test or debug files
