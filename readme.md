# L'Afiray.ma - Car Parts Marketplace

A comprehensive car parts marketplace platform built with React, Node.js, and MongoDB. The platform connects car parts producers/partners with buyers, featuring a robust approval system and email notifications.

## 🚀 Features

### Core Features
- **Multi-Role User System**: Moderators, Partners (Producers), and Buyers
- **Partner Approval System**: Moderators approve/reject partner applications
- **Email Notifications**: Automatic email notifications for approval/rejection
- **Car Parts Management**: Add, edit, and manage car parts inventory
- **Car Models Management**: Organize parts by car models
- **User Management**: Complete user CRUD operations
- **Responsive Design**: Modern UI with dark/light theme support

### User Roles

#### 🛡️ Moderator
- Approve/reject partner applications
- Manage all users and partners
- View platform analytics
- Content moderation
- Email notifications for partner status changes

#### 🏢 Partner (Producer)
- Register company information
- Add car models and parts
- Manage inventory
- View sales reports
- Order management
- Profile management

#### 🛒 Buyer
- Browse car parts catalog
- Search and filter parts
- Place orders
- View order history
- Profile management

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** components
- **React Router** for navigation
- **Axios** for API calls
- **Sonner** for notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email notifications
- **Multer** for file uploads
- **CORS** enabled

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git

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

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
JWT_SECRET=your-jwt-secret-key-here

# Database Configuration
DB_URI=mongodb://localhost:27017/lafiray_db
# Or use MongoDB Atlas:
# DB_URI=mongodb+srv://username:password@cluster.mongodb.net/lafiray_db

# Email Configuration (for partner notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173

# Moderator Configuration
MODERATOR_EMAIL=lafiray@moderator.ma
MODERATOR_PASSWORD=lafiray@moderator.ma
MODERATOR_NAME=L'Afiray Moderator
MODERATOR_PHONE=+2125 000 00000

# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Setup Moderator Account
```bash
npm run setup-moderator
```

### 5. Start the Application

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

### Test Partner Account
- **Email**: `lafiray@partner4.ma`
- **Password**: (set during registration)
- **Status**: Approved

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
- `POST /api/carparts` - Create new car part
- `PUT /api/carparts/:id` - Update car part
- `DELETE /api/carparts/:id` - Delete car part

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

## 📧 Email System

The platform includes automatic email notifications for partner approval/rejection:

### Email Templates
- **Partner Approved**: Welcome email with login instructions
- **Partner Rejected**: Professional rejection with next steps

### Email Configuration
For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `EMAIL_PASSWORD`

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Input validation
- Secure file uploads

## 🎨 UI Components

The application uses a custom UI component library built with:
- Radix UI primitives
- Tailwind CSS styling
- Dark/light theme support
- Responsive design
- Accessibility features

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
│   │   └── ...
│   ├── Middleware/
│   │   ├── AuthMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── Models/
│   │   ├── User.js
│   │   ├── CarParts.js
│   │   └── ...
│   ├── Routes/
│   │   ├── User.route.js
│   │   ├── CarParts.route.js
│   │   └── ...
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── ...
│   │   ├── features/
│   │   │   ├── moderator/
│   │   │   ├── partner/
│   │   │   └── buyer/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── ...
│   └── ...
├── uploads/
└── package.json
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB (local or cloud)
2. Configure environment variables
3. Install dependencies: `npm install`
4. Start server: `npm run dev` or `npm start`

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure API base URL for production

## 🧪 Testing

### Test Email Configuration
Visit: `http://localhost:5000/api/users/test-email`

### Test Partner Registration
1. Register as a partner
2. Check approval status
3. Verify email notifications

### Test Moderator Functions
1. Login as moderator
2. Approve/reject partners
3. Manage users and content

## 🔧 Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check email credentials in `.env`
   - Verify SMTP settings
   - Test email configuration endpoint

2. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure database exists

3. **Login Issues**
   - Verify user exists in database
   - Check approval status for partners
   - Ensure correct credentials

4. **CORS Issues**
   - Check frontend URL in CORS configuration
   - Verify API base URL in frontend

### Debug Steps
1. Check server logs for errors
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for frontend errors

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
- Email: support@lafiray.ma
- Phone: +212 5 00 00 00 00

---

**L'Afiray.ma** - Connecting car parts producers with buyers worldwide 🚗🔧