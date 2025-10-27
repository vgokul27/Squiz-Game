# Online Multiplayer Quiz Application

## Overview
This project is an online multiplayer quiz application built using the MERN stack (MongoDB, Express, React, Node.js) along with Tailwind CSS for styling and Framer Motion for animations. The application allows users to create and join quiz rooms, participate in real-time quizzes, and view leaderboards.

## Features
- User Authentication (JWT/Google OAuth)
- Create/Join Quiz Rooms
- Real-time Multiplayer using Socket.IO
- Quiz Timer, Scores, and Leaderboard
- Admin Panel for Quiz Creation
- MongoDB to store users, quizzes, and results

## Project Structure
```
server
├── config
│   ├── db.js
│   └── socket.js
├── controllers
│   ├── authController.js
│   ├── quizController.js
│   ├── roomController.js
│   └── resultController.js
├── middlewares
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models
│   ├── User.js
│   ├── Quiz.js
│   ├── Room.js
│   └── Result.js
├── routes
│   ├── authRoutes.js
│   ├── quizRoutes.js
│   ├── roomRoutes.js
│   └── resultRoutes.js
├── sockets
│   └── quizSocket.js
├── utils
│   ├── generateToken.js
│   └── helpers.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```
   DB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   JWT_SECRET=<your_jwt_secret>
   PORT=5000
   SOCKET_PORT=3000
   NODE_ENV=development
   ```

4. **Run the Application**
   ```bash
   npm start
   ```

## Usage
- Navigate to `http://localhost:5000` to access the application.
- Use the provided authentication methods to log in or register.
- Create or join quiz rooms to start participating in quizzes.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.