# Quality Rental Business Services - Event Rental Web Application

A fully responsive event rental web application with interactive features, dynamic workflows, and state management. Built with PHP/MySQL backend and React frontend.

## Technology Stack

- **Backend**: PHP 8+ (XAMPP), MySQL database
- **Frontend**: React 18, Vite, TailwindCSS, Lucide React icons
- **Architecture**: Hybrid - PHP REST API + React SPA frontend
- **State Management**: React Context API

## Project Structure

```
qualityrentalservices/
├── api/                      # PHP Backend API
│   ├── config/
│   │   └── database.php     # MySQL connection
│   ├── categories.php        # Categories endpoint
│   ├── products.php          # Products endpoint
│   ├── quote-requests.php    # Quote submissions
│   └── gallery.php           # Gallery endpoint
├── database/                  # Database files
│   ├── schema.sql           # Database schema
│   └── seed.sql             # Initial data
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Context providers
│   │   ├── services/        # API services
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Installation & Setup

### Prerequisites

- XAMPP installed with Apache and MySQL running
- Node.js and npm installed
- Modern web browser

### Step 1: Database Setup

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Click on "New" to create a new database
3. Name the database: `quality_rentals`
4. Click "Create"

5. Import the schema:
   - Select the `quality_rentals` database
   - Click "Import" tab
   - Choose file: `database/schema.sql`
   - Click "Go"

6. Import seed data:
   - Still in `quality_rentals` database
   - Click "Import" tab
   - Choose file: `database/seed.sql`
   - Click "Go"

### Step 2: Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The React app will run on: http://localhost:3000

### Step 3: API Configuration

The API is configured to work with XAMPP. The PHP files are in the `api/` directory and will be accessible via:
- http://localhost/qualityrentalservices/api/categories.php
- http://localhost/qualityrentalservices/api/products.php
- etc.

The Vite proxy in `vite.config.js` handles CORS and routes API calls correctly.

## Features Implemented

### Core Features

✅ **Header & Navigation**
- Top bar with contact info and social links
- Responsive navigation with hamburger menu
- "Get a Quote" CTA button

✅ **Hero Section**
- Split layout with text and image
- Twin CTA buttons (WhatsApp & Quote)
- Value proposition icons

✅ **Product Catalog**
- Dynamic category filtering (All, Tents, Tables, Water Tanks, Equipment)
- 4-column responsive grid
- Product cards with hover effects
- "Add to Quote Request" functionality
- Quantity controls in quote drawer

✅ **Quote Drawer (Multistep Form)**
- Step 1: Item summary with quantity controls
- Step 2: Scheduling (date, duration, delivery type)
- Step 3: Contact information
- Form validation
- Loading states
- Toast notification on success

✅ **Events We Serve**
- Interactive icon grid with hover effects
- 6 event types displayed

✅ **Footer**
- 4-column layout (desktop)
- Mobile accordion (responsive)
- Contact information
- Social links

✅ **Mobile Navigation**
- Fixed bottom taskbar
- Quote item count badge
- Quick-action buttons

### Advanced Features

✅ **Lightbox Gallery**
- Masonry grid layout
- Full-screen modal with blur backdrop
- Keyboard navigation (arrows, escape)
- Image metadata display

✅ **WhatsApp Widget**
- Floating pulsing icon
- Chat card with agent info
- Message encoding with page URL
- Opens WhatsApp on send

## Color Palette

- **Primary Accent**: #D4A337 (Gold/Amber)
- **Secondary/Backgrounds**: #0A2540 (Deep Navy), #FFFFFF (White), #F8F9FA (Light Grey)
- **Typography**: Playfair Display (serif headers), Inter (sans-serif UI)

## API Endpoints

- `GET /api/categories.php` - List all categories
- `GET /api/products.php` - List all products (optional ?category_id filter)
- `GET /api/products.php?id=X` - Get single product
- `POST /api/quote-requests.php` - Submit quote request
- `GET /api/gallery.php` - List gallery items

## Database Schema

### Tables
- `categories` - Product categories
- `products` - Product inventory
- `quote_requests` - Quote submissions
- `quote_items` - Quote line items (junction table)
- `gallery` - Gallery images

## Development

### Build for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`. Copy these to your web server or configure Apache to serve them.

### Running on XAMPP

1. Ensure Apache and MySQL are running in XAMPP
2. Place the project in `htdocs/qualityrentalservices`
3. Access via: http://localhost/qualityrentalservices/frontend

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running in XAMPP
- Check credentials in `api/config/database.php` (default: root/empty password)
- Verify database name is `quality_rentals`

### API CORS Issues
- The Vite proxy handles CORS in development
- For production, configure Apache headers or use PHP CORS headers

### TailwindCSS Not Working
- Ensure dependencies are installed
- Check `tailwind.config.js` is properly configured
- Verify `index.css` has Tailwind directives

## Future Enhancements

- User authentication system
- Admin dashboard for managing inventory
- Real-time stock updates
- Payment integration
- Email notifications
- Advanced search and filtering
- Product reviews and ratings

## License

This project is proprietary software for Quality Rental Business Services.
