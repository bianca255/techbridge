# 🎓 TechBridge - Digital Skills Enhancement Platform

## Project Description
TechBridge is a comprehensive online learning management system designed to bridge the digital skills gap by providing accessible, structured, and interactive digital skills training. The platform supports three user roles (Students, Teachers, and Admins) with features including course management, interactive assessments, progress tracking, and collaborative forums.

## 🌟 Features

### For Students
- ✅ Browse and enroll in courses
- ✅ Access structured learning materials
- ✅ Take interactive quizzes with instant feedback
- ✅ Track learning progress and performance
- ✅ Participate in course discussion forums
- ✅ View personal dashboard with statistics
- ✅ Earn points for completing lessons

### For Teachers
- ✅ Create and manage courses
- ✅ Add lessons and learning materials
- ✅ Create quizzes and assessments
- ✅ Monitor student progress
- ✅ Grade assignments
- ✅ Participate in course forums

### For Admins
- ✅ Manage all users (Students, Teachers, Admins)
- ✅ View platform-wide statistics
- ✅ Access all courses and content
- ✅ Generate system reports
- ✅ Monitor platform activities

## 🛠️ Technology Stack

### Frontend
- React.js 18
- CSS3 (Custom styling)
- JavaScript ES6+

### Backend
- Node.js
- Express.js
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing

### Database
- In-memory storage (for demo purposes)
- Can be easily upgraded to MongoDB, PostgreSQL, or MySQL

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

To verify installation, run:
```bash
node --version
npm --version
git --version
```

## 🚀 Installation Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/techbridge-platform.git
cd techbridge-platform
```

### Step 2: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

**Create a `.env` file in the backend directory:**
```
PORT=5000
JWT_SECRET=techbridge_secret_key_2024
NODE_ENV=development
```

### Step 3: Set Up Frontend

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

**Create a `.env` file in the frontend directory:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start the Application

**Option A: Development Mode (Recommended)**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
You should see: `TechBridge API server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
The app will automatically open at `http://localhost:3000`

**Option B: Production Mode**
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

## 🔐 Default Login Credentials

### Student Account
- **Email:** student@techbridge.com
- **Password:** Student123!

### Teacher Account
- **Email:** teacher@techbridge.com
- **Password:** Teacher123!

### Admin Account
- **Email:** admin@techbridge.com
- **Password:** Admin123!

## 📁 Project Structure

```
techbridge-platform/
├── backend/
│   ├── server.js           # Main backend server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styling
│   │   └── index.js       # React entry point
│   ├── package.json       # Frontend dependencies
│   └── .env              # Frontend environment variables
└── README.md
```

## 🎯 How to Use TechBridge

### As a Student:
1. **Register/Login** - Create an account or use demo credentials
2. **Browse Courses** - Navigate to "Browse Courses" to see available courses
3. **Enroll** - Click "Enroll Now" on any course
4. **Learn** - Access course lessons from "My Courses"
5. **Complete Lessons** - Mark lessons as complete to earn points
6. **Take Quizzes** - Test your knowledge with interactive quizzes
7. **Participate** - Join course discussions in forums
8. **Track Progress** - View your learning statistics in the Progress page

### As a Teacher:
1. **Login** - Use teacher credentials
2. **Create Course** - Click "Create New Course" from dashboard
3. **Add Content** - Add lessons, quizzes, and materials to your courses
4. **Monitor Students** - View enrolled students and their progress
5. **Grade Work** - Review and grade student assignments
6. **Engage** - Participate in course forums and provide guidance

### As an Admin:
1. **Login** - Use admin credentials
2. **View Analytics** - See platform-wide statistics on dashboard
3. **Manage Users** - View all users and their roles
4. **Oversee Courses** - Access and manage all courses
5. **Generate Reports** - Create system-wide reports

## 🐛 Troubleshooting

### Issue: Port 5000 already in use
**Solution 1:** Kill the process using the port
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Solution 2:** Change the port in `backend/.env`
```
PORT=5001
```
And update `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5001/api
```

### Issue: npm install fails
**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Issue: "Cannot find module" error
**Solution:**
```bash
# Make sure you're in the correct directory
# Reinstall dependencies
npm install
```

### Issue: API connection error in browser
**Solution:**
1. Ensure backend server is running
2. Check backend terminal for errors
3. Verify `REACT_APP_API_URL` in frontend `.env`
4. Check browser console for CORS errors

### Issue: React app won't start
**Solution:**
```bash
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clear React cache
npm start
```

## 🌐 Deployment

### Deploy Backend to Heroku

1. **Install Heroku CLI**
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login and Deploy**
```bash
cd backend
heroku login
heroku create techbridge-api
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

3. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
```

### Deploy Frontend to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel login
vercel
```

3. **Set Environment Variables**
- Go to Vercel dashboard
- Add `REACT_APP_API_URL` with your Heroku backend URL

### Deploy Frontend to Netlify

1. **Build the app**
```bash
cd frontend
npm run build
```

2. **Deploy**
- Go to [Netlify](https://netlify.com)
- Drag and drop the `build` folder
- Or connect GitHub repository

3. **Configure Environment**
- Add `REACT_APP_API_URL` in Netlify environment variables

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Teacher/Admin)
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/users/enrolled-courses` - Get user's enrolled courses

### Quizzes
- `GET /api/courses/:id/quizzes` - Get course quizzes
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Forum
- `GET /api/courses/:id/forum` - Get forum posts
- `POST /api/courses/:id/forum` - Create forum post

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/lessons/:id/complete` - Mark lesson complete

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/stats` - Get platform statistics (Admin only)

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration works
- [ ] User login works with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Student can browse courses
- [ ] Student can enroll in courses
- [ ] Student can view enrolled courses
- [ ] Student can complete lessons
- [ ] Student can take quizzes
- [ ] Quiz scoring is accurate
- [ ] Forum posts can be created
- [ ] Progress tracking updates correctly
- [ ] Teacher can create courses
- [ ] Admin can view all users
- [ ] Admin can see platform statistics
- [ ] Logout functionality works

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built as part of Software Development coursework
- Inspired by modern learning management systems
- Thanks to all contributors and testers

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

## 🔮 Future Enhancements

- [ ] Add video streaming capabilities
- [ ] Implement real-time chat between students and teachers
- [ ] Add payment integration for paid courses
- [ ] Implement certificate generation with PDF download
- [ ] Add email notifications for course updates
- [ ] Implement course ratings and reviews
- [ ] Add multi-language support
- [ ] Integrate with third-party authentication (Google, Facebook)
- [ ] Add mobile app version
- [ ] Implement advanced analytics and reporting

---

**⭐ If you find this project helpful, please give it a star!**

**📺 Demo Video:** [Link to your demo video]

**🌐 Live Demo:** [Link to deployed application]

**📄 SRS Document:** [Link to your SRS document]

# TechBridge

A web and mobile-web application to bridge the digital divide by providing digital literacy content to underprivileged African children.

## Features
- User registration and login
- Course listing and details
- Lessons and quizzes
- Progress tracking
- Forum/chat for each course

## Setup Instructions

### 1. Clone the repository
```sh
# Clone your repo
```

### 2. Set up MongoDB
- Local: Install MongoDB and run it (`mongodb://localhost:27017/techbridge`)
- Cloud: Use MongoDB Atlas and update your `.env` in `techbridge-platform/backend`

### 3. Install dependencies
```sh
cd techbridge-platform/backend
npm install
cd ../../frontend
npm install
```

### 4. Seed sample data
```sh
cd techbridge-platform/backend
node seed.js
```

### 5. Run the backend server
```sh
npm run dev
```

### 6. Run the frontend
```sh
cd ../../frontend
npm start
```

### 7. Access the app
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)

## Demo
- Register/login as a user
- View courses, lessons, quizzes, progress, and forum
- Submit quiz and post in forum

## Deployment
- Backend: Deploy to Heroku (guide available on request)
- Frontend: Deploy to Vercel/Netlify (guide available on request)

## SRS & Video Demo
- [Link to SRS Document](#)
- [Link to Demo Video](#)

## License
MIT