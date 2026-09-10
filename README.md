# ElectroMart

ElectroMart is a full-stack MERN e-commerce project built for a final-year BCA portfolio and professional showcase. It includes a modern storefront, category browsing, product detail pages, cart, wishlist, checkout, admin panel, and vendor workflows.

## Overview

This project demonstrates a real-world e-commerce flow with:

- React frontend with responsive pages and reusable UI patterns
- Express.js backend with REST API endpoints
- MongoDB and Mongoose data modeling
- JWT-based authentication and role checks
- Product management, cart, wishlist, checkout, reviews, and orders
- Admin and vendor dashboards
- File upload support for product and category images

## Features

- User registration and login
- Admin access control and dashboard
- Vendor registration and login
- Product catalog with categories, brands, and filters
- Product detail and related product suggestions
- Wishlist and cart management
- Checkout and order creation flow
- Order tracking and status views
- Reviews and ratings
- Image upload workflows for catalog data
- Responsive merchandising UI for desktop and mobile

## Tech Stack

- React
- React Router
- Bootstrap
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- dotenv

## Folder Structure

```bash
project2/
├── backend/
│   ├── uploads/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── package-lock.json
```

## Environment Variables

Create a local `.env` file in the project root and set the values you need. A sample is included in `.env.example`.

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/electrostore
JWT_SECRET=change_me_in_production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Installation

1. Clone the repository.
2. Open the project root.
3. Install root dependencies:

```bash
npm install
```

4. Install backend dependencies:

```bash
cd backend && npm install
```

5. Install frontend dependencies:

```bash
cd frontend && npm install
```

## Running the App

Start the backend and frontend together:

```bash
npm run dev
```

The backend runs on port 8000 and the frontend runs on port 3000 by default.

## API Overview

Key endpoints include:

- `POST /api/register` — user registration
- `POST /api/login` — user login
- `POST /api/vendorregister` — vendor registration
- `POST /api/vlog` — vendor login
- `GET /api/getproduct` — fetch all products
- `POST /api/product` — add product
- `GET /api/getcategory` — fetch categories
- `POST /api/checkout` — create order
- `GET /api/myorder/:id` — fetch user's orders
- `POST /api/reviews` — submit review
- `GET /api/getreview/:id` — fetch product reviews

## User Roles

- User
- Vendor
- Admin

Role checks are enforced on the backend wherever protected access is required.

## Screenshots

Add screenshots in this section as the project matures.

## Future Improvements

- Payment gateway integration
- Real admin analytics and more advanced charts
- Search indexing and product filtering improvements
- Email verification and password reset flow
- Deployment setup for Vercel/Render/Railway

## Notes

- Do not commit your `.env` file.
- Keep secrets out of source control.
- Use production-safe environment values when deploying.
