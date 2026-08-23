# Database Setup Instructions

## Quick Setup Guide

### Option 1: Using phpMyAdmin (Recommended)

1. **Open phpMyAdmin**
   - Go to: http://localhost/phpmyadmin
   - Login with your XAMPP MySQL credentials (default: root / no password)

2. **Create Database**
   - Click "New" in the left sidebar
   - Enter database name: `quality_rentals`
   - Click "Create"

3. **Import Schema**
   - Select the `quality_rentals` database
   - Click the "Import" tab at the top
   - Click "Choose File" and navigate to: `database/schema.sql`
   - Click "Go" at the bottom

4. **Import Seed Data**
   - Still in the `quality_rentals` database
   - Click the "Import" tab again
   - Click "Choose File" and navigate to: `database/seed.sql`
   - Click "Go"

5. **Verify Data**
   - Click on each table to verify data was imported
   - You should see:
     - categories: 4 rows
     - products: 7 rows
     - gallery: 3 rows

### Option 2: Using MySQL Command Line

1. **Open MySQL Command Line**
   - Open XAMPP Control Panel
   - Click "Shell" button
   - Type: `mysql -u root -p` (press Enter, no password needed by default)

2. **Run the following commands:**
   ```sql
   SOURCE c:/xampp/htdocs/qualityrentalservices/database/schema.sql;
   SOURCE c:/xampp/htdocs/qualityrentalservices/database/seed.sql;
   ```

3. **Verify:**
   ```sql
   USE quality_rentals;
   SHOW TABLES;
   SELECT COUNT(*) FROM categories;
   SELECT COUNT(*) FROM products;
   ```

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Check your MySQL password in XAMPP
- Update `api/config/database.php` with correct credentials

### "Database already exists"
- Drop existing database first:
  ```sql
  DROP DATABASE IF EXISTS quality_rentals;
  ```

### "Import failed"
- Ensure file paths are correct
- Check file permissions
- Verify SQL syntax in the files

## After Database Setup

Once the database is set up:

1. **Start the React Dev Server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Access the Application:**
   - Open: http://localhost:3000
   - The app will automatically connect to the PHP API

3. **Test the API Endpoints:**
   - http://localhost/qualityrentalservices/api/categories.php
   - http://localhost/qualityrentalservices/api/products.php
   - http://localhost/qualityrentalservices/api/gallery.php

You should see JSON data returned for each endpoint.
