# KrishiBondhu

KrishiBondhu is a full-stack **MERN** web platform that bridges the gap between farmers, agricultural experts, and bulk buyers — providing real-time weather intelligence, AI-powered crop advisory, disease detection support, and a direct farmer–buyer marketplace, designed to promote sustainable farming and social impact in Bangladesh.

---

## Overview

**KrishiBondhu** is a comprehensive agricultural ecosystem built with the **MERN stack** (MongoDB, Express.js, React, Node.js). The platform integrates:

- **Real-time weather intelligence** to help farmers plan irrigation and harvesting
- **AI-powered crop recommendations** based on soil type, season, and region
- **Disease detection library** with symptoms, treatments, and prevention methods
- **Direct farmer–buyer marketplace** for transparent, fair-price transactions
- **Admin dashboard** for managing users, crops, diseases, experts, and platform content

By combining these features, KrishiBondhu provides a **seamless, data-driven, and trustworthy** agricultural ecosystem for farmers, businesses, and administrators across Bangladesh.

---

## Screenshots

<div align="center">
  <img src="screenshots/home1.png" width="800" alt="Landing Page">
  <p><em>Landing page — "The Digital Farm Assistant Bangladesh Has Been Waiting For"</em></p>
</div>

<table>
  <tr>
    <td align="center">
      <img src="screenshots/fdashboard1.png" width="400" alt="Farmer Dashboard">
      <p><em>Farmer dashboard — live season tracking, market price, and field alerts</em></p>
    </td>
    <td align="center">
      <img src="screenshots/fdashboard4.png" width="400" alt="AI Crop Recommendations">
      <p><em>AI crop recommendations with soil-based match percentages</em></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="screenshots/bmarketplace2.png" width="400" alt="Buyer Marketplace">
      <p><em>Buyer marketplace — verified farmer listings with live pricing</em></p>
    </td>
    <td align="center">
      <img src="screenshots/bdashboard2.png" width="400" alt="Procurement Analytics">
      <p><em>Buyer procurement analytics — monthly spend chart and order overview</em></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="screenshots/disease1.png" width="400" alt="Disease Library">
      <p><em>Disease library — high-severity alerts with symptom identification</em></p>
    </td>
    <td align="center">
      <img src="screenshots/consultation2.png" width="400" alt="Expert Consultation">
      <p><em>Expert directory — certified agronomists available for direct consultation</em></p>
    </td>
  </tr>
</table>

<div align="center">
  <img src="screenshots/admindashboard.png" width="800" alt="Admin Panel">
  <p><em>Admin control panel — live platform overview with user management and quick actions</em></p>
</div>

---

## Key Features

### For Farmers

| Feature | Description |
|---------|-------------|
| **Smart Dashboard** | Real-time weather forecasts, crop growth tracking, and personalized advisory |
| **Crop Library** | Explore crops by season, type, region, and growing period |
| **Disease Library** | Identify crop diseases with severity levels, symptoms, and treatments |
| **AI Crop Recommendations** | Get crop suggestions based on soil type and location |
| **Market Price Updates** | View live market prices across Bangladesh |
| **Expert Consultation** | Connect directly with certified agronomists via call or message |
| **Notification System** | Real-time alerts for new crops, diseases, and weather warnings |

### For Buyers (Businesses)

| Feature | Description |
|---------|-------------|
| **Marketplace** | Browse verified farmer listings with price trends and availability |
| **Order Management** | Place orders, track status, and view order history |
| **Farmer Directory** | Connect directly with farmers across 8 divisions of Bangladesh |
| **Procurement Analytics** | Track monthly spending and procurement patterns |
| **Business Profile** | Manage company information and procurement preferences |
| **Document Verification** | Submit trade license and TIN for admin approval |

### For Admin

| Feature | Description |
|---------|-------------|
| **Dashboard Overview** | Live platform statistics (farmers, buyers, crops, listings, experts) |
| **User Management** | Approve / reject / suspend buyer accounts, view uploaded documents |
| **Crop Library Management** | Add, edit, or remove crops with images, descriptions, and tags |
| **Disease Library Management** | Manage crop diseases with symptoms, treatments, and severity levels |
| **Marketplace Management** | Manage listings, feature products, control visibility |
| **Expert Directory** | Add/edit agricultural experts available for consultation |
| **Content Management** | Update dashboard banners and alert messages in real-time |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, Vite, React Router DOM, Swiper |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), bcrypt password hashing |
| **File Uploads** | Multer + Cloudinary |
| **Styling** | Custom CSS with modern responsive design |
| **API Architecture** | RESTful |
| **Weather** | OpenWeatherMap API |
| **Animations** | LottieFiles |

---

## Project Structure

```
krishibondhu/
├── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── BuyerLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicOnlyRoute.jsx
│   │   ├── context/                  # AuthContext for global auth state
│   │   ├── utils/                    # authStorage.js (API calls, token management)
│   │   ├── css_files/                # All component stylesheets
│   │   └── jsx_files/                # Page components
│   │       ├── admin_page/           # Admin dashboard
│   │       ├── buyer_page/           # Marketplace, orders, profile, directory
│   │       ├── farmerDashboard_page/ # Dashboard, crop library, disease library
│   │       ├── home_page/            # Landing page (header, body, footer)
│   │       ├── login_page/           # Login and admin login
│   │       └── signup_page/          # Farmer and business signup (multi-step)
│   └── public/                       # Static assets (Lottie animations, SVG map)
│
├── backend/                          # Node.js + Express backend
│   ├── config/                       # Database connection, Cloudinary config
│   ├── controllers/                  # Business logic (auth, admin, buyer, user)
│   ├── middleware/                   # Auth middleware, file upload handler
│   ├── models/                       # Mongoose schemas
│   │   ├── User.js                   # Farmer / Business / Admin
│   │   ├── Crop.js
│   │   ├── Disease.js
│   │   ├── Listing.js
│   │   ├── Order.js
│   │   ├── Expert.js
│   │   ├── Notification.js
│   │   └── Content.js
│   ├── routes/                       # API route definitions
│   ├── seedAdmin.js                  # One-time admin account seeder
│   ├── server.js                     # Entry point
│   └── .env                          # Environment variables (not committed)
│
└── README.md
```

---

## Installation & Setup

### Prerequisites

Before running the project, ensure you have the following:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- [Cloudinary](https://cloudinary.com/) account (for image uploads)
- [OpenWeatherMap](https://openweathermap.org/) API key (for weather data)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/AimanCrafts/KrishiBondhu.git
cd krishibondhu
```

---

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/krishibondhu
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### Step 3: Seed Admin Account *(Run Once)*

```bash
node seedAdmin.js
```

This creates the default admin account:

- **Email:** `admin@krishibondhu.com`
- **Password:** `Admin@1234`

---

### Step 4: Start the Backend Server

```bash
node server.js
```

> Backend runs on `http://localhost:5000`

---

### Step 5: Frontend Setup *(Open a New Terminal)*

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

---

### Step 6: Start the Frontend Dev Server

```bash
npm run dev
```

> Frontend runs on `http://localhost:5173`

---

## Quick Start Reference

```bash
# ── Terminal 1 : Backend ──────────────────────────
cd backend
npm install        # First time only
node seedAdmin.js  # Run once to create admin account
node server.js     # Start backend server

# ── Terminal 2 : Frontend ─────────────────────────
cd frontend
npm install        # First time only
npm run dev        # Start frontend dev server
```

---

## Default Admin Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@krishibondhu.com` | `Admin@1234` |

> ⚠️ Change the admin password after your first login.

---

## API Endpoints Overview

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Auth** | `POST /api/auth/farmer/signup` | Farmer registration |
| | `POST /api/auth/farmer/login` | Farmer login (phone + password) |
| | `POST /api/auth/buyer/signup` | Business registration (with docs) |
| | `POST /api/auth/buyer/login` | Business login (email + password) |
| **Admin** | `POST /api/admin/login` | Admin login |
| | `GET /api/admin/stats` | Platform statistics |
| | `GET /api/admin/users` | List all users |
| | `PATCH /api/admin/users/:id/status` | Update user status |
| | `CRUD /api/admin/crops` | Manage crop library |
| | `CRUD /api/admin/diseases` | Manage disease library |
| | `CRUD /api/admin/experts` | Manage expert directory |
| | `CRUD /api/admin/marketplace` | Manage marketplace listings |
| | `GET/PUT /api/admin/content/:key` | Manage dashboard content |
| **Buyer** | `GET /api/buyer/marketplace` | Get active listings |
| | `POST /api/buyer/orders` | Place an order |
| | `GET /api/buyer/orders` | Get order history |
| | `GET /api/buyer/farmers` | Get farmer directory |
| **User** | `GET/PUT/DELETE /api/user/profile` | Manage user profile |
| | `PUT /api/user/change-password` | Change password |
| **Notifications** | `GET /api/notifications` | Get user notifications |
| | `PATCH /api/notifications/:id/read` | Mark notification as read |

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend — `frontend/.env`

| Variable | Description |
|----------|-------------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API key for weather data |

---

## Project Goals

- **Empower farmers** with real-time weather, crop intelligence, and disease support
- **Connect farmers directly with buyers** for transparent, fair-price transactions
- **Promote sustainable farming** through data-driven recommendations
- **Reduce crop loss** with early disease detection and prevention guidance
- **Build a trusted agricultural ecosystem** with verified farmers and businesses

---

## Challenges

- Integrating multiple external services (**OpenWeatherMap, Cloudinary, MongoDB Atlas**) into a unified platform
- Implementing **role-based authentication** with JWT for three distinct user types
- Building a **responsive, modern UI** consistent across all three user portals
- Managing **real-time notifications** with role-based audience targeting
- Handling **file uploads** for both images and business verification documents

---

## Future Enhancements

- **AI-powered disease detection** using image recognition
- **Multi-language support** (Bengali and English)
- **Mobile application** using React Native
- **Payment gateway integration** for direct in-platform transactions
- **Farmer chatbot** for instant advisory support
- **Advanced analytics dashboard** with exportable reports

---

## Team

| Name | Role |
|------|------|
| **Abdur Rahman Aiman** | Lead Developer & UI Designer |
| **Munawar Mahtab Moon** | Backend Developer |
| **Raisul Islam Sifat** | Database & API Integration |

---

## Acknowledgements

- [Unsplash](https://unsplash.com) — Royalty-free images
- [LottieFiles](https://lottiefiles.com) — Animations
- [Font Awesome](https://fontawesome.com) — Icons
- [OpenWeatherMap](https://openweathermap.org) — Weather API
- [Cloudinary](https://cloudinary.com) — Image and file hosting

---

## License

This project is licensed under the [MIT License](LICENSE).
