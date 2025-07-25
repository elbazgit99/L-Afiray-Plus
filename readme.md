# L'Afiray.ma - Auto Parts Marketplace

## Features

### Category Filtering
The homepage includes a comprehensive category filtering system that allows users to browse car parts by category:

- **Categories Available**: Tires, Brakes, Filters, Electrics, Depreciations, Cooling System, Exhaust System, Sealing Rings, Accessories, Connections, Repair Set, Illuminated, Bearings, Air System, Gearbox, Planetary Joint
- **Smart Matching**: The system uses intelligent category matching that handles variations in naming (e.g., "tire" matches "tires", "brake" matches "brakes")
- **Part Count Display**: Each category shows the number of available parts
- **View All Option**: Users can view all parts across all categories
- **Smooth Navigation**: Clicking a category smoothly scrolls to the filtered results
- **Enhanced UX**: Visual feedback shows which category is currently selected

### How to Use Category Filtering
1. Navigate to the homepage
2. Scroll down to the "Categories" section
3. Click on any category card (e.g., "Tires", "Brakes", etc.)
4. The page will automatically scroll to show all parts in that category
5. Use the "View All" option to see all parts across all categories
6. Click "← Back" to return to the categories view

# L'Afiray.ma - Car Parts Marketplace

A comprehensive car parts marketplace platform built with React, Node.js, and MongoDB. The platform connects car parts producers/partners with buyers, featuring a robust approval system and email notifications.

## 🚀 Features

### Core Features
- **Multi-Role User System**: Moderators, Partners (Producers), and Buyers
- **Partner Approval System**: Moderators approve/reject partner applications
- **Email Notifications**: Automatic email notifications for approval/rejection
- **Car Parts Management**: Add, edit, and manage car parts inventory
- **Car Models Management**: Organize parts by car models
- **Featured Car Parts**: Moderators can feature specific parts on homepage
- **User Management**: Complete user CRUD operations
- **Responsive Design**: Modern UI with black/white theme
- **AI Chatbot**: Intelligent customer support with vehicle recognition
- **Payment Integration**: Secure payment processing
- **Order Management**: Complete order lifecycle management

### User Roles

#### 🛡️ Moderator
- Approve/reject partner applications
- Manage all users and partners
- View platform analytics
- Content moderation
- Feature/unfeature car parts
- Email notifications for partner status changes
- User management with proper UI dialogs

#### 🏢 Partner (Producer)
- Register company information
- Add car models and parts
- Manage inventory
- View sales reports
- Order management
- Profile management
- Pending approval status with clean UI

#### 🛒 Buyer
- Browse car parts catalog
- Search and filter parts
- Place orders
- View order history
- Profile management
- Featured car parts display

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** components
- **React Router** for navigation
- **Axios** for API calls with authentication
- **Sonner** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email notifications
- **Multer** for file uploads
- **CORS** enabled
- **OpenAI API** for chatbot functionality

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git
- Gmail account with 2FA enabled (for email notifications)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/elbazgit99/L-Afiray.ma.git
cd L-Afiray.ma
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd Frontend
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the **Backend** directory:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_URI=mongodb://localhost:27017/l-afiray
USER_NAME=lafirayApp
PASSWORD=pstqXKcXOZAHrpZO

# Email Configuration (Gmail)
EMAIL_USER=lafiray@moderator.ma
EMAIL_PASSWORD=lafiray@moderator.ma

# Service Email (for partner notifications)
EMAIL_SERVICE=lafirayservice@gmail.com
SERVICE_EMAIL_PASSWORD=your-16-character-app-password

# JWT Secret (authentication)
JWT_SECRET=your-jwt-secret-key-here

# OpenAI API Key (for chatbot)
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Gmail Setup for Email Notifications

1. **Enable 2-Factor Authentication** on `lafirayservice@gmail.com`
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Copy the 16-character password
3. **Update .env file** with the app password

### 5. Setup Moderator Account
```bash
npm run setup-moderator
```

### 6. Start the Application

#### Start Backend Server
```bash
npm run dev
```
Backend will run on: `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd Frontend
npm run dev
```
Frontend will run on: `http://localhost:5173` or `http://localhost:5174`

## 👥 Default Users

### Moderator Account
- **Email**: `lafiray@moderator.ma`
- **Password**: `lafiray@moderator.ma`
- **Access**: Full moderator dashboard

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/test-email` - Test email configuration

### User Management (Moderator Only)
- `GET /api/users` - Get all users
- `GET /api/users/partners` - Get all partners
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/approve` - Approve partner
- `PUT /api/users/:id/reject` - Reject partner

### Car Parts Management
- `GET /api/carparts` - Get all car parts
- `GET /api/carparts/featured` - Get featured car parts
- `POST /api/carparts` - Create new car part
- `PUT /api/carparts/:id` - Update car part
- `DELETE /api/carparts/:id` - Delete car part
- `PUT /api/carparts/:id/feature` - Toggle featured status

### Car Models Management
- `GET /api/models` - Get all car models
- `POST /api/models` - Create new car model
- `PUT /api/models/:id` - Update car model
- `DELETE /api/models/:id` - Delete car model

### Producer Management
- `GET /api/producers` - Get all producers
- `POST /api/producers` - Create new producer
- `PUT /api/producers/:id` - Update producer
- `DELETE /api/producers/:id` - Delete producer

### Chat System
- `POST /api/chat` - Send message to AI chatbot

## 📧 Email System

The platform includes automatic email notifications for partner approval/rejection:

### Email Templates
- **Partner Approved**: Welcome email with login instructions
- **Partner Rejected**: Professional rejection with next steps

### Email Configuration
- **Service Email**: `lafirayservice@gmail.com`
- **Gmail App Password**: Required for authentication
- **Automatic Notifications**: Sent on approval/rejection

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Input validation
- Secure file uploads
- Protected API routes

## 🎨 UI Components & Design

### Theme
- **Black and White Design**: Clean, minimalist interface
- **Dark/Light Mode**: Automatic theme switching
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

### Recent UI Improvements
- Removed unnecessary status icons and notices
- Streamlined approval pending page
- Improved error handling without duplicate toasts
- Better navigation with proper authentication
- Clean contact support integration

## 📁 Project Structure

```
L-Afiray.ma/
├── Backend/
│   ├── Config/
│   │   ├── database.js
│   │   └── emailService.js
│   ├── Constants/
│   │   └── UserRoles.js
│   ├── Controllers/
│   │   ├── User.controller.js
│   │   ├── CarParts.controller.js
│   │   ├── CarModel.controller.js
│   │   ├── Chat.controller.js
│   │   └── Moderation.controller.js
│   ├── Middleware/
│   │   ├── AuthMiddleware.js
│   │   ├── Roles.js
│   │   └── uploadMiddleware.js
│   ├── Models/
│   │   ├── User.js
│   │   ├── CarParts.js
│   │   ├── CarModel.js
│   │   └── Producer.js
│   ├── Routes/
│   │   ├── User.route.js
│   │   ├── CarParts.route.js
│   │   ├── CarModel.route.js
│   │   ├── Chat.route.js
│   │   └── Moderation.route.js
│   ├── uploads/
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── ApprovalPendingBanner.tsx
│   │   │   ├── ChatBot.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── features/
│   │   │   ├── moderator/
│   │   │   ├── partner/
│   │   │   ├── buyer/
│   │   │   └── pages/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── hooks/
│   └── ...
├── .env
└── package.json
```

## 🚀 Recent Updates

### v2.1.0 - Email & UI Improvements
- ✅ **Fixed Email Configuration**: Proper Gmail app password setup
- ✅ **Updated Service Email**: Now using `lafirayservice@gmail.com`
- ✅ **UI Cleanup**: Removed unnecessary elements and improved design
- ✅ **Authentication Fixes**: Proper token handling in API requests
- ✅ **Error Handling**: Improved error messages and toast notifications
- ✅ **Featured Car Parts**: Moderators can feature/unfeature parts
- ✅ **Chatbot Improvements**: Better vehicle recognition and responses
- ✅ **Navigation Fixes**: Proper logout and redirect functionality

### v2.0.0 - Core Features
- ✅ **Partner Approval System**: Complete approval workflow
- ✅ **Email Notifications**: Automatic approval/rejection emails
- ✅ **Car Parts Management**: Full CRUD operations
- ✅ **User Management**: Role-based access control
- ✅ **Responsive Design**: Mobile-friendly interface

## 🧪 Testing

### Test Email Configuration
1. Ensure Gmail 2FA is enabled
2. Generate app password
3. Update `.env` file
4. Test partner approval/rejection

### Test Partner Registration
1. Register as a partner
2. Check approval status
3. Verify email notifications
4. Test login after approval

### Test Moderator Functions
1. Login as moderator
2. Approve/reject partners
3. Manage users and content
4. Feature/unfeature car parts

## 🔧 Troubleshooting

### Common Issues

1. **Email Not Sending**
   - ✅ Check Gmail 2FA is enabled
   - ✅ Verify app password in `.env`
   - ✅ Ensure `EMAIL_SERVICE` and `SERVICE_EMAIL_PASSWORD` are set
   - ✅ Test email configuration

2. **Authentication Errors**
   - ✅ Check JWT token in localStorage
   - ✅ Verify API base URL
   - ✅ Ensure proper CORS configuration

3. **Database Connection Issues**
   - ✅ Verify MongoDB is running
   - ✅ Check connection string in `.env`
   - ✅ Ensure database exists

4. **Frontend API Errors**
   - ✅ Check authentication token
   - ✅ Verify backend server is running
   - ✅ Check browser console for errors

### Debug Steps
1. Check server logs for errors
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for frontend errors
5. Verify email configuration with test endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Hamza Elbaz**
- GitHub: [@elbazgit99](https://github.com/elbazgit99)
- Project: [L'Afiray.ma](https://github.com/elbazgit99/L-Afiray.ma)

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: lafirayservice@gmail.com
- Phone: +212 5 00 00 00 00

---

**L'Afiray.ma** - Connecting car parts producers with buyers worldwide 🚗🔧