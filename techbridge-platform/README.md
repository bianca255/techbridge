\# 🎓 TechBridge 



\## Project Description

TechBridge is a comprehensive online learning management system designed to bridge the digital skills gap by providing accessible, structured, and interactive digital skills training. The platform supports three user roles (Students, Teachers, and Admins) with features including course management, interactive assessments, progress tracking, and collaborative forums.



\## 🌟 Features



\### For Students

\- ✅ Browse and enroll in courses

\- ✅ Access structured learning materials

\- ✅ Take interactive quizzes with instant feedback

\- ✅ Track learning progress and performance

\- ✅ Participate in course discussion forums

\- ✅ Earn points for completing lessons and quizzes

\- ✅ View personal dashboard with statistics



\### For Teachers

\- ✅ Create and manage courses

\- ✅ Add lessons and learning materials

\- ✅ Create quizzes and assessments

\- ✅ Monitor student progress

\- ✅ Grade assignments

\- ✅ Participate in course forums



\### For Admins

\- ✅ Manage all users (Students, Teachers, Admins)

\- ✅ View platform-wide statistics

\- ✅ Access all courses and content

\- ✅ Generate system reports

\- ✅ Monitor platform activities



\## 🛠️ Technology Stack



\### Frontend

\- React.js 18

\- CSS3 (Custom styling)

\- JavaScript ES6+



\### Backend

\- Node.js

\- Express.js

\- JWT (JSON Web Tokens) for authentication

\- bcryptjs for password hashing



\### Database

\- In-memory storage (for demo purposes)

\- Can be easily upgraded to MongoDB, PostgreSQL, or MySQL



\## 📋 Prerequisites



Before you begin, ensure you have the following installed:

\- \*\*Node.js\*\* (v16 or higher) - \[Download here](https://nodejs.org/)

\- \*\*npm\*\* (v8 or higher) - Comes with Node.js

\- \*\*Git\*\* - \[Download here](https://git-scm.com/)



To verify installation:

```bash

node --version

npm --version

git --version

```



\## 🚀 Installation Steps



\### Step 1: Clone the Repository

```bash

git clone https://github.com/bianca255/techbridge.git

cd techbridge

```



\### Step 2: Install Backend Dependencies

```bash

cd backend

npm install

```



\### Step 3: Install Frontend Dependencies

```bash

cd ../frontend-new

npm install

```



\### Step 4: Start the Backend Server

Open Terminal 1:

```bash

cd backend

npm start

```



You should see:

```

✅ TechBridge API running on port 5000

🌐 http://localhost:5000

```



\*\*Keep this terminal running!\*\*



\### Step 5: Start the Frontend (New Terminal)

Open Terminal 2:

```bash

cd frontend-new

npm start

```



When asked about port 3000, press \*\*Y\*\*.



The app will automatically open at `http://localhost:3001`



\## 🔐 Demo Accounts



\### Student Account

\- \*\*Email\*\*: student@techbridge.com

\- \*\*Password\*\*: Student123!



\### Teacher Account

\- \*\*Email\*\*: teacher@techbridge.com

\- \*\*Password\*\*: Teacher123!



\### Admin Account

\- \*\*Email\*\*: admin@techbridge.com

\- \*\*Password\*\*: Admin123!



\## 📖 How to Use TechBridge



\### Quick Start:

1\. Open the app at `http://localhost:3001`

2\. Click one of the three demo login buttons

3\. Click the "Login" button

4\. Explore the platform!



\### As a Student:



1\. \*\*Browse Courses\*\*

&nbsp;  - Click "Browse Courses" in the navigation

&nbsp;  - View all available courses with descriptions



2\. \*\*Enroll in a Course\*\*

&nbsp;  - Click "Enroll Now" on any course card

&nbsp;  - Course will be added to "My Courses"



3\. \*\*Complete Lessons\*\*

&nbsp;  - Go to "My Courses"

&nbsp;  - Click "Open" on an enrolled course

&nbsp;  - Read lesson content

&nbsp;  - Click "Complete" to earn +10 points



4\. \*\*Take Quizzes\*\*

&nbsp;  - Navigate to the "Quizzes" tab

&nbsp;  - Click "Start" on any quiz

&nbsp;  - Answer all questions

&nbsp;  - Submit to see your score

&nbsp;  - Pass to earn +50 bonus points!



5\. \*\*Track Progress\*\*

&nbsp;  - Click "Progress" to view your statistics

&nbsp;  - See enrolled courses, completed lessons, quiz scores, and total points



\### As a Teacher:



1\. \*\*View Dashboard\*\*

&nbsp;  - See your created courses

&nbsp;  - Monitor student enrollments



2\. \*\*Manage Courses\*\*

&nbsp;  - Access courses you've created

&nbsp;  - View enrolled students

&nbsp;  - Monitor student progress



\### As an Admin:



1\. \*\*Platform Statistics\*\*

&nbsp;  - View total users, courses, students, and enrollments



2\. \*\*User Management\*\*

&nbsp;  - Click "Admin" to see all users

&nbsp;  - View user details (ID, name, email, role)



3\. \*\*System Oversight\*\*

&nbsp;  - Access all platform data

&nbsp;  - Monitor system-wide activities



\## 📁 Project Structure

```

techbridge/

├── backend/

│   ├── server.js           # Main backend server

│   ├── package.json        # Backend dependencies

│   └── node\_modules/

├── frontend-new/

│   ├── src/

│   │   ├── App.js          # Main React component

│   │   ├── App.css         # Styling

│   │   └── index.js        # React entry point

│   ├── public/

│   │   └── index.html      # HTML template

│   ├── package.json        # Frontend dependencies

│   └── node\_modules/

└── README.md

```



\## 🐛 Troubleshooting



\### Issue: Port 5000 already in use

\*\*Solution:\*\*

```bash

\# Windows

netstat -ano | findstr :5000

taskkill /PID <PID\_NUMBER> /F



\# Mac/Linux

lsof -i :5000

kill -9 <PID>

```



\### Issue: Backend not connecting

\*\*Solution:\*\*

1\. Ensure backend is running: Check Terminal 1

2\. Visit `http://localhost:5000` - should show API message

3\. Check for error messages in backend terminal



\### Issue: Frontend shows blank page

\*\*Solution:\*\*

1\. Open browser console (F12)

2\. Check for errors in Console tab

3\. Ensure backend is running on port 5000

4\. Clear browser cache and reload



\### Issue: npm install fails

\*\*Solution:\*\*

```bash

\# Delete node\_modules and package-lock.json

rm -rf node\_modules package-lock.json



\# Clear npm cache

npm cache clean --force



\# Reinstall

npm install

```



\## 🎯 Features Demonstrated



\- ✅ User authentication (Login/Register)

\- ✅ Role-based access control (Student, Teacher, Admin)

\- ✅ Course browsing and enrollment

\- ✅ Lesson completion tracking with points

\- ✅ Interactive quizzes with automatic scoring

\- ✅ Progress tracking and analytics

\- ✅ Admin dashboard with user management

\- ✅ Responsive design

\- ✅ Real-time data updates

\- ✅ Secure JWT authentication

\- ✅ Password hashing with bcrypt



\## 📊 System Features



\### Authentication

\- Secure JWT-based authentication

\- Password hashing with bcrypt

\- Session management

\- Role-based access control



\### Course Management

\- Create and publish courses

\- Add lessons with content

\- Organize learning materials

\- Track enrollment numbers



\### Assessment System

\- Create quizzes with multiple questions

\- Automatic scoring

\- Pass/fail threshold (60%)

\- Instant feedback

\- Points reward system



\### Progress Tracking

\- Lesson completion tracking

\- Quiz score history

\- Total points accumulation

\- Performance analytics



\### User Roles

\- \*\*Student\*\*: Enroll, learn, take quizzes

\- \*\*Teacher\*\*: Create courses, monitor students

\- \*\*Admin\*\*: Full platform management



\## 🌐 Deployment



\### Backend Deployment (Render.com)

1\. Create account on \[Render.com](https://render.com)

2\. Create new Web Service

3\. Connect GitHub repository

4\. Set environment variables

5\. Deploy



\### Frontend Deployment (Vercel)

1\. Create account on \[Vercel.com](https://vercel.com)

2\. Import GitHub repository

3\. Configure build settings

4\. Set environment variable: `REACT\_APP\_API\_URL`

5\. Deploy



\## 📝 API Endpoints



\### Authentication

\- `POST /api/auth/register` - Register new user

\- `POST /api/auth/login` - Login user

\- `GET /api/auth/me` - Get current user



\### Courses

\- `GET /api/courses` - Get all courses

\- `GET /api/courses/:id` - Get single course

\- `POST /api/courses/:id/enroll` - Enroll in course

\- `GET /api/users/enrolled-courses` - Get user's courses



\### Quizzes

\- `GET /api/courses/:id/quizzes` - Get course quizzes

\- `POST /api/quizzes/:id/submit` - Submit quiz answers



\### Progress

\- `GET /api/progress` - Get user progress

\- `POST /api/lessons/:id/complete` - Mark lesson complete



\### Admin

\- `GET /api/admin/users` - Get all users

\- `GET /api/admin/stats` - Get platform statistics



\## 👥 Author



\*\*Bianca\*\* - \*Full Stack Developer\*

\- GitHub: \[@bianca255](https://github.com/bianca255)



\## 🙏 Acknowledgments



\- Built as part of Software Development coursework

\- Inspired by modern learning management systems

\- React.js for frontend framework

\- Express.js for backend API



\## 📞 Support



For issues or questions:

\- Open an issue on GitHub

\- Check the troubleshooting section above



\## 🔮 Future Enhancements



\- \[ ] Add video streaming capabilities

\- \[ ] Implement real-time chat

\- \[ ] Add payment integration

\- \[ ] Certificate generation with PDF download

\- \[ ] Email notifications

\- \[ ] Course ratings and reviews

\- \[ ] Multi-language support

\- \[ ] Mobile app version



---



\*\*⭐ If you find this project helpful, please give it a star!\*\*



\*\*📺 Demo Video:\*\* \[Link to your demo video]



\*\*🌐 Live Demo:\*\* \[Link to deployed application]



\*\*📄 SRS Document:\*\* \[Link to your SRS document]



---



© 2024 TechBridge. Built for educational purposes.

