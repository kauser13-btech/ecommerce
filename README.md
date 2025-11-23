# E-Commerce Application

A full-stack e-commerce application inspired by Apple Gadgets BD, built with Next.js (frontend) and Laravel (backend).

## Features

- Modern, responsive UI with Tailwind CSS
- Server-side rendering (SSR) with Next.js
- Product catalog with categories and brands
- Product search and filtering
- Shopping cart functionality
- Featured products and new arrivals
- RESTful API backend with Laravel
- MySQL database

## Tech Stack

### Frontend
- Next.js 16 (JavaScript)
- Tailwind CSS 4
- Server-side rendering
- Fetch API for data fetching

### Backend
- Laravel 11
- MySQL database
- Laravel Sanctum for API authentication
- RESTful API architecture

## Project Structure

```
ecommerce/
├── frontend/          # Next.js application
│   ├── app/
│   │   ├── components/    # Reusable components (Header, Footer, ProductCard)
│   │   ├── products/      # Product listing and detail pages
│   │   ├── cart/          # Shopping cart page
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Homepage
│   ├── lib/
│   │   └── api.js         # API utility functions
│   └── public/            # Static assets
│
└── backend/           # Laravel application
    ├── app/
    │   ├── Models/        # Eloquent models
    │   └── Http/Controllers/Api/  # API controllers
    ├── database/
    │   └── migrations/    # Database migrations
    └── routes/
        └── api.php        # API routes
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- PHP 8.2+
- Composer
- MySQL 8.0+

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE ecom;
```

2. Update database credentials in `backend/.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecom
DB_USERNAME=root
DB_PASSWORD=root
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Run database migrations:
```bash
php artisan migrate
```

4. Start the Laravel development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (already created):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Start the Next.js development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
  - Query params: `category`, `brand`, `search`, `filter`
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrival products
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/{slug}` - Get single product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{slug}` - Get category with products

### Brands
- `GET /api/brands` - Get all brands
- `GET /api/brands/{slug}` - Get brand with products

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

## Database Schema

### Categories
- id, name, slug, description, icon, sort_order, is_active, timestamps

### Brands
- id, name, slug, description, logo, is_active, timestamps

### Products
- id, name, slug, description, features, specifications (JSON), price, original_price, sku, stock, image, images (JSON), category_id, brand_id, is_featured, is_new, is_active, timestamps

### Orders
- id, order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, billing_address, subtotal, tax, shipping_cost, discount, total, payment_method, payment_status, order_status, notes, timestamps

### Order Items
- id, order_id, product_id, product_name, price, quantity, subtotal, timestamps

## Development

### Adding Sample Data

You can use Laravel seeders or manually insert data into the database:

```sql
INSERT INTO categories (name, slug, icon, is_active, created_at, updated_at) VALUES
('Mobile Phones', 'mobile-phones', '📱', 1, NOW(), NOW()),
('Laptops', 'laptops', '💻', 1, NOW(), NOW()),
('Tablets', 'tablets', '📱', 1, NOW(), NOW());

INSERT INTO brands (name, slug, is_active, created_at, updated_at) VALUES
('Apple', 'apple', 1, NOW(), NOW()),
('Samsung', 'samsung', 1, NOW(), NOW()),
('Xiaomi', 'xiaomi', 1, NOW(), NOW());

INSERT INTO products (name, slug, price, original_price, sku, stock, category_id, brand_id, is_featured, is_new, is_active, created_at, updated_at) VALUES
('iPhone 15 Pro Max 256GB', 'iphone-15-pro-max-256gb', 145000, 155000, 'IP15PM256', 10, 1, 1, 1, 1, 1, NOW(), NOW());
```

### Frontend Pages

- `/` - Homepage with hero, featured products, categories
- `/products` - Product listing with filters
- `/products/[slug]` - Product detail page
- `/cart` - Shopping cart page

### Running in Production

#### Frontend
```bash
cd frontend
npm run build
npm start
```

#### Backend
Configure your web server (Apache/Nginx) to serve the Laravel application.

## Features Implemented

- ✅ Responsive header with search and category menu
- ✅ Product listing with filters (category, brand, search)
- ✅ Product detail page with images and specifications
- ✅ Shopping cart functionality
- ✅ Featured products section
- ✅ New arrivals section
- ✅ Category and brand filtering
- ✅ Footer with links and contact info
- ✅ Server-side rendering (SSR)
- ✅ RESTful API with Laravel
- ✅ Database migrations
- ✅ CORS configuration

## Future Enhancements

- User authentication and registration
- Checkout and payment integration
- Order tracking
- Product reviews and ratings
- Wishlist functionality
- Admin panel for managing products
- Image upload functionality
- Email notifications
- Search autocomplete
- Product comparisons
- EMI calculator

## License

This project is open-source and available under the MIT License.
