# Lafiray.ma: Your Marketplace for Used Car Parts

## 🛠️ Project Overview
Lafiray.ma is an online platform designed to revolutionize the used car parts market. It connects individual buyers with verified seller partners, offering a transparent and secure environment to buy and sell used car components. The platform addresses market fragmentation and aims to provide efficient search, quality assurance, and reliable transactions.

## ✨ Key Features

### Buyer Frontend
- **Intuitive Search & Discovery:** Find parts by make, model, year, part name, VIN. Advanced filters available.
- **Available Car Parts:** All available car parts are displayed to all users on the HomePage. The "Featured Car Parts" section has been removed for a streamlined experience.
- **Buy Button:** Each car part card includes a "Buy" button that opens a payment modal for quick purchasing.
- **Secure Transactions:** Integrated shopping cart and secure checkout process.
- **Order Tracking & Reviews:** Monitor orders and provide feedback on sellers and parts.

### Seller Partner Frontend
- **Efficient Listing Management:** Easy interface for adding, updating, and deleting part listings with images and details.
- **Edit & Delete:** Partners can edit and delete their own car part listings directly from the dashboard using a fully functional edit modal.
- **Partner-Specific Filtering:** Each partner only sees and manages the car parts they have created; other partners' parts are not visible in their dashboard.
- **Inventory & Order Tracking:** Manage stock levels and view incoming orders with status updates.
- **Sales Reporting:** Dashboard for sales performance and analytics.

### Admin Panel
- **User & Seller Management:** Control accounts and approve seller applications.
- **Content Moderation & Dispute Resolution:** Oversee listings, reviews, and mediate disputes.
- **Platform Analytics:** Monitor overall platform performance and configure system settings.

## 🚀 Technical Stack

### Frontend:
- React.js
- Tailwind CSS
- Shadcn/UI
- Axios (for API communication)
- React Router (for navigation)
- useState and useEffect (for State Management)

### Backend:
- Node.js with Express.js (RESTful API)
- JSON Web Tokens (JWT) for Authentication
- Protected Routes & Role-Based Access Control (RBAC): Ensures only authorized users (buyers, sellers, admins) can access specific functionalities based on their assigned roles.

### Database:
- MongoDB (NoSQL)
- Mongoose (ODM)

## 🖌️ UI/UX
- **Color Scheme:** All UI components use only black and white colors with skinny borders for a clean, modern look (no blue or other colors).
- **Currency:** Prices are displayed using the "DH" currency symbol in black/white.
- **Feedback:** If no car parts are available, a clear message is shown to the user.

## 🛡️ Validation & Error Handling
- **Robust Validation:** The car part creation form includes robust frontend validation. Submission is prevented and the submit button is disabled if any required field (producer, model, image, name, price) is missing or invalid.
- **Error Messages:** Users receive clear error messages for missing or invalid fields.

## 🧹 Codebase Hygiene
- **Test Files:** All test functions and test files have been removed from the codebase for production readiness.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### Backend Setup
1. Clone the repository: `git clone https://github.com/elbazgit99/L-Afiray.ma.git`
2. Navigate to the backend directory: `cd L-Afiray.ma/Backend`
3. Install dependencies: `npm install`
4. Create a `.env` file with your `DB_URI`, `JWT_SECRET`, and Firebase credentials if using Firestore.
5. Start the backend server: `npm start` or `npm run dev` (if using nodemon).

### Frontend Setup
1. Navigate to the frontend directory: `cd L-Afiray.ma/Frontend`
2. Install dependencies: `npm install`
3. Start the frontend development server: `npm run dev`

## 💡 Future Enhancements
- AI-Powered Part Recognition (Google Lens-like)
- Integrated Logistics & Shipping Solutions
- Mobile Applications (iOS/Android)
- Firestore (for real-time features like chat, order updates)
- Advanced Image Management (Optimization & CDN): Implement robust solutions for serving optimized part images quickly via Content Delivery Networks.
