# Quick Start Guide

## Start the Application

### 1. Start Backend (Laravel)
```bash
cd backend
php artisan serve
```
Backend runs at: http://localhost:8000

### 2. Start Frontend (Next.js)
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:3000

## Add Sample Data

The easiest way to add sample data is using Laravel seeders (already created with real product images from Unsplash):

```bash
cd backend
php artisan migrate:fresh --seed
```

This will create:
- **6 Categories** (Mobile Phones, Laptops, Tablets, Smartwatches, Earbuds, Accessories)
- **8 Brands** (Apple, Samsung, Xiaomi, OnePlus, Google, Sony, Dell, HP)
- **12 Products** with real images, detailed descriptions, features, and specifications:
  - iPhone 15 Pro Max
  - Samsung Galaxy S24 Ultra
  - MacBook Pro 14" M3
  - iPad Air M2
  - AirPods Pro 2nd Gen
  - Apple Watch Series 9
  - Samsung Galaxy Tab S9
  - Google Pixel 8 Pro
  - Dell XPS 13
  - Sony WH-1000XM5
  - OnePlus 12
  - Xiaomi 13 Pro

**Note:** All products include real images from Unsplash, complete specifications, and detailed features!

## Test the Application

1. Visit http://localhost:3000
2. Browse products on the homepage with real product images
3. Click on a product to view full details with specifications
4. Add items to cart
5. View cart at http://localhost:3000/cart
6. Browse products by category or brand

## API Testing

Test the API directly:

```bash
# Get all products
curl http://localhost:8000/api/products

# Get featured products
curl http://localhost:8000/api/products/featured

# Get new arrivals
curl http://localhost:8000/api/products/new-arrivals

# Get single product
curl http://localhost:8000/api/products/iphone-15-pro-max

# Get categories
curl http://localhost:8000/api/categories

# Get brands
curl http://localhost:8000/api/brands

# Search products
curl http://localhost:8000/api/products/search?q=iphone
```

## Sample Products Included

### Mobile Phones
- **iPhone 15 Pro Max** - ৳145,000 (Featured, New)
- **Samsung Galaxy S24 Ultra** - ৳125,000 (Featured, New)
- **Google Pixel 8 Pro** - ৳95,000 (Featured, New)
- **OnePlus 12** - ৳78,000 (New)
- **Xiaomi 13 Pro** - ৳72,000

### Laptops
- **MacBook Pro 14" M3** - ৳235,000 (Featured)
- **Dell XPS 13** - ৳135,000

### Tablets
- **iPad Air M2** - ৳75,000
- **Samsung Galaxy Tab S9** - ৳65,000 (New)

### Smartwatches
- **Apple Watch Series 9** - ৳45,000 (New)

### Earbuds & Headphones
- **AirPods Pro 2nd Gen** - ৳28,000 (Featured)
- **Sony WH-1000XM5** - ৳35,000 (Featured)

## Troubleshooting

### Frontend can't connect to backend
- Check that Laravel is running on port 8000
- Verify `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
- Restart both servers

### Database connection error
- Check MySQL is running
- Verify database credentials in `backend/.env`
- Ensure database `ecom` exists
- Run migrations: `php artisan migrate:fresh --seed`

### Images not loading
- Product images are hosted on Unsplash (https://images.unsplash.com)
- Ensure you have internet connection
- Images are loaded directly from external URLs

### CORS errors
- CORS is configured in `backend/bootstrap/app.php`
- Restart Laravel server after changes
- Check that HandleCors middleware is enabled

### Products not showing
- Ensure you ran the seeder: `php artisan db:seed`
- Check API response in browser: http://localhost:8000/api/products
- Check browser console for errors

## Next Steps

1. **Customize Products** - Add your own products through database or create an admin panel
2. **Add Authentication** - Implement user login/registration
3. **Complete Checkout** - Build the checkout and payment flow
4. **Add Reviews** - Allow customers to review products
5. **Admin Panel** - Create backend interface for managing products
