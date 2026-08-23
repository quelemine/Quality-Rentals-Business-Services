# Quality Rental Services - Deployment Guide

## Environment Variables

### Required for Production
Set these environment variables before deploying to production:

```bash
# Application Environment
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database Configuration (Required)
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_secure_database_password

# Security Configuration (Required)
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
SESSION_SECRET=your_session_secret_key_minimum_32_characters

# Email Configuration (Required for password reset)
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@yourdomain.com
SMTP_FROM_NAME=Quality Rental Services
```

### Development Mode (Optional)
For local development, these variables have safe defaults:

```bash
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:5173

DB_HOST=localhost
DB_NAME=quality_rentals
DB_USER=root
DB_PASSWORD=
```

## Setup Instructions

### 1. Environment Configuration
```bash
# Copy the example file
cp .env.example .env

# Edit with your actual values
nano .env
```

### 2. Database Setup
```bash
# Import schema
mysql -u root -p < database/schema.sql

# Import seed data (optional)
mysql -u root -p quality_rentals < database/seed.sql

# Run migration scripts
php database/add_admin_table.php
php database/add_password_reset_tokens.php
php database/add_color_settings.php
```

### 3. Create Admin Account
```bash
# Connect to database
mysql -u root -p quality_rentals

# Insert admin user (replace with secure password)
INSERT INTO admin (username, email, password) 
VALUES ('admin', 'admin@yourdomain.com', '$2y$10$hashedpasswordhere');
```

### 4. Frontend Build
```bash
cd frontend
npm install
npm run build
```

### 5. Web Server Configuration

#### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^api/(.*)$ api/$1.php [L]
</IfModule>
```

#### Nginx
```nginx
location /api/ {
  rewrite ^/api/(.*)$ /api/$1.php last;
}
```

## Security Checklist

- [ ] Set APP_ENV=production
- [ ] Set strong database password
- [ ] Set JWT_SECRET (minimum 32 characters)
- [ ] Set SESSION_SECRET (minimum 32 characters)
- [ ] Configure SMTP for password reset
- [ ] Change default admin password
- [ ] Enable HTTPS
- [ ] Set up firewall rules
- [ ] Configure backup strategy
- [ ] Monitor error logs

## Production Deployment

### File Permissions
```bash
# Set proper permissions
chmod 755 /var/www/html
chmod 644 /var/www/html/*.php
chmod 600 /var/www/html/.env
```

### Apache Virtual Host
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    Redirect permanent / https://yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com
    DocumentRoot /var/www/html
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

## Troubleshooting

### Database Connection Failed
- Check environment variables are set
- Verify database credentials
- Ensure MySQL service is running
- Check firewall allows connection

### Password Reset Not Working
- Verify SMTP configuration
- Check email server logs
- Ensure email is not blocked by spam filters

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)
- Verify package.json is intact
