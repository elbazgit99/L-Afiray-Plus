# Lafiray.ma: Your Marketplace for Used Car Parts

## 🛠️ Project Overview
Lafiray.ma is an online platform designed to revolutionize the used car parts market. It connects individual buyers with verified seller partners, offering a transparent and secure environment to buy and sell used car components. The platform addresses market fragmentation and aims to provide efficient search, quality assurance, and reliable transactions.

## ✨ Key Features

### Buyer Frontend
Intuitive Search & Discovery: Find parts by make, model, year, part name, VIN. Advanced filters available.

Secure Transactions: Integrated shopping cart and secure checkout process.

Order Tracking & Reviews: Monitor orders and provide feedback on sellers and parts.

### Seller Partner Frontend
Efficient Listing Management: Easy interface for adding, updating, and deleting part listings with images and details.

Inventory & Order Tracking: Manage stock levels and view incoming orders with status updates.

Sales Reporting: Dashboard for sales performance and analytics.

### Admin Panel
User & Seller Management: Control accounts and approve seller applications.

Content Moderation & Dispute Resolution: Oversee listings, reviews, and mediate disputes.

Platform Analytics: Monitor overall platform performance and configure system settings.

## 🚀 Technical Stack

### Frontend:

React.js

Tailwind CSS

Shadcn/UI

Axios (for API communication)

React Router (for navigation)

useState and useEffect (for State Management)

### Backend:

Node.js with Express.js (RESTful API)

JSON Web Tokens (JWT) for Authentication

Protected Routes & Role-Based Access Control (RBAC): Ensures only authorized users (buyers, sellers, admins) can access specific functionalities based on their assigned roles.

### Database:

MongoDB (NoSQL)

Mongoose (ODM)

## 📦 Getting Started

Prerequisites
Node.js (v18+)

MongoDB Atlas account or local MongoDB instance

Clone the repository: git clone https://github.com/elbazgit99/L-Afiray.ma.git

Navigate to the backend directory: cd L'Afiray.ma/Backend

Install dependencies: npm install

Create a .env file with your DB_URI, JWT_SECRET, and Firebase credentials if using Firestore.

Start the backend server: npm start or npm run dev (if using nodemon).

Frontend Setup
Navigate to the frontend directory: cd L'Afiray.ma/Frontend (or wherever your React app is).

Install dependencies: npm install

Start the frontend development server: npm run dev

## 💡 Future Enhancements
AI-Powered Part Recognition (Google Lens-like)

Integrated Logistics & Shipping Solutions

Mobile Applications (iOS/Android)

Firestore (for real-time features like chat, order updates)

Advanced Image Management (Optimization & CDN): Implement robust solutions for serving optimized part images quickly via Content Delivery Networks.