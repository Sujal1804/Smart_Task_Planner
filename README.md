# Smart Task Planner

A full-stack **Smart Task Planner** web application that uses AI to transform high-level goals into structured, actionable task plans. Built with Node.js, Express, MongoDB, React, and integrated with Groq AI for intelligent plan generation.

## 🎯 Features

- **AI-Powered Plan Generation**: Convert goals into detailed task plans using Groq AI (with fallback to mocked generation)
- **User Authentication**: Secure JWT-based authentication with signup and login
- **Task Management**: Create, edit, and manage tasks with dependencies, priorities, and time estimates
- **Plan Persistence**: Save and retrieve plans with full CRUD operations
- **Dependency Tracking**: Visualize and manage task dependencies
- **Auto-save**: Automatic saving of plan changes
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: Instant feedback and updates across the application

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (ES modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **AI Integration**: Groq SDK (Llama 3.1, Mixtral models)
- **Testing**: Jest with Supertest
- **Code Quality**: ESLint

### Frontend
- **Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API (AuthContext)
- **HTTP Client**: Fetch API

### Infrastructure
- **Database**: MongoDB Atlas (cloud-hosted)
- **Development**: Nodemon for hot reloading
- **Package Management**: npm

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18
- **npm** >= 8
- **MongoDB Atlas account** (free tier works)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Smart-Task-Planner
```

### 2. Set Up MongoDB Atlas

1. Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free shared cluster
3. Create a database user with username and password
4. Configure network access:
   - For development: Allow access from anywhere (`0.0.0.0/0`)
   - For production: Whitelist specific IP addresses
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database user credentials
   - Add your database name (e.g., `smart_task_planner`)

Example connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/smart_task_planner?retryWrites=true&w=majority
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory:

```env
# Server Configuration
PORT=4000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_task_planner?retryWrites=true&w=majority

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# JWT Secret (generate a random string for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AI/LLM Configuration (Optional - falls back to mocked generation if not set)
LLM_API_KEY=your-groq-api-key-here
# Alternative: GROQ_API_KEY=your-groq-api-key-here
```

**Important Notes:**
- `JWT_SECRET`: Use a strong, random string in production (e.g., generate with `openssl rand -base64 32`)
- `LLM_API_KEY`: Optional. Get a free API key from [Groq](https://console.groq.com/). If not provided, the app will use mocked plan generation.
- Never commit the `.env` file to version control

### 4. Install Dependencies

From the project root:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

Or install all at once:
```bash
npm install && cd server && npm install && cd .. && cd client && npm install && cd ..
```

### 5. Run the Application

#### Development Mode (Both Frontend and Backend)

From the project root:

```bash
npm run dev
```

This starts both the backend and frontend concurrently:
- **Backend**: `http://localhost:4000`
- **Frontend**: `http://localhost:5173`

#### Run Separately

```bash
# Backend only
npm run server

# Frontend only
npm run client
```

#### Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 📚 Available Scripts

### Root Level
- `npm run dev` - Start both backend and frontend in development mode
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm start` - Start production server
- `npm test` - Run backend unit tests
- `npm run lint` - Lint both server and client code
- `npm run lint:server` - Lint server code only
- `npm run lint:client` - Lint client code only

### Server Scripts (from `server/` directory)
- `npm run dev` - Start server with nodemon (hot reload)
- `npm start` - Start server in production mode
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint

### Client Scripts (from `client/` directory)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Documentation

Base URL (development): `http://localhost:4000`

All endpoints return JSON. Authentication is required for plan endpoints (except `/api/plans/generate`).

### Authentication Endpoints

#### POST `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response 201:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response 200:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### GET `/api/auth/me`

Get current authenticated user (requires JWT token in Authorization header).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response 200:**
```json
{
  "_id": "user-id",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Plan Endpoints

#### POST `/api/plans/generate`

Generate a plan from a goal using AI (no authentication required, but plan is not saved).

**Request Body:**
```json
{
  "goal": "Launch a personal productivity blog",
  "horizonDays": 21
}
```

**Response 200:**
```json
{
  "goal": "Launch a personal productivity blog",
  "horizonDays": 21,
  "title": "Launch a personal productivity blog",
  "tasks": [
    {
      "id": "uuid-1",
      "title": "Define blog vision and audience",
      "description": "Clarify purpose and target readers.",
      "estHours": 2,
      "startDate": "2025-12-03T12:00:00.000Z",
      "dueDate": "2025-12-04T12:00:00.000Z",
      "dependsOn": [],
      "status": "pending",
      "priority": 1,
      "assignee": null
    }
  ],
  "meta": {
    "reasoning": "AI-generated explanation of the plan structure"
  }
}
```

#### POST `/api/plans`

Create and save a new plan (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "title": "Launch productivity blog",
  "goal": "Launch a personal productivity blog",
  "horizonDays": 21,
  "tasks": [
    {
      "id": "uuid-1",
      "title": "Define blog vision and audience",
      "description": "Clarify purpose and target readers.",
      "estHours": 2,
      "startDate": "2025-12-03T12:00:00.000Z",
      "dueDate": "2025-12-04T12:00:00.000Z",
      "dependsOn": [],
      "status": "pending",
      "priority": 1,
      "assignee": null
    }
  ],
  "meta": {}
}
```

**Response 201:**
Returns the saved plan with `_id` and `userId`.

#### GET `/api/plans`

List all plans for the authenticated user with pagination.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Response 200:**
```json
{
  "data": [
    {
      "_id": "plan-id",
      "title": "Launch productivity blog",
      "goal": "Launch a personal productivity blog",
      "horizonDays": 21,
      "createdAt": "2025-12-03T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### GET `/api/plans/:id`

Get a single plan with all tasks (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response 200:**
```json
{
  "_id": "plan-id",
  "userId": "user-id",
  "title": "Launch productivity blog",
  "goal": "Launch a personal productivity blog",
  "horizonDays": 21,
  "createdAt": "2025-12-03T12:00:00.000Z",
  "tasks": [
    {
      "id": "uuid-1",
      "title": "Define blog vision and audience",
      "description": "Clarify purpose and target readers.",
      "estHours": 2,
      "startDate": "2025-12-03T12:00:00.000Z",
      "dueDate": "2025-12-04T12:00:00.000Z",
      "dependsOn": [],
      "status": "pending",
      "priority": 1,
      "assignee": null
    }
  ],
  "meta": {
    "reasoning": "AI-generated explanation"
  }
}
```

#### PUT `/api/plans/:id`

Update an existing plan (requires authentication). Partial updates are supported.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
Same structure as POST `/api/plans`, but only provided fields are updated.

**Response 200:**
Returns the updated plan.

#### DELETE `/api/plans/:id`

Delete a plan (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response 204:**
Empty response body.

### Health Check

#### GET `/health`

Check if the server is running.

**Response 200:**
```json
{
  "status": "ok"
}
```

## 📁 Project Structure

```
Smart-Task-Planner/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── DependencyList.jsx
│   │   │   ├── GoalForm.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PlanDetail.jsx
│   │   │   ├── PlanEditor.jsx
│   │   │   ├── PlanList.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── TaskList.jsx
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── services/       # API service functions
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── styles.css      # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.cjs
│   └── vite.config.js
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   └── db.js       # MongoDB connection
│   │   ├── controllers/    # Route controllers
│   │   │   ├── authController.js
│   │   │   └── planController.js
│   │   ├── middleware/     # Express middleware
│   │   │   ├── auth.js     # JWT authentication
│   │   │   └── errorHandler.js
│   │   ├── models/         # Mongoose models
│   │   │   ├── Plan.js
│   │   │   └── User.js
│   │   ├── routes/         # API routes
│   │   │   ├── auth.js
│   │   │   └── plans.js
│   │   ├── services/       # Business logic
│   │   │   ├── llm.js      # AI/LLM integration
│   │   │   └── planService.js
│   │   ├── utils/          # Utility functions
│   │   │   └── dateUtils.js
│   │   ├── app.js          # Express app setup
│   │   └── index.js        # Server entry point
│   ├── tests/              # Test files
│   │   └── planService.test.js
│   ├── jest.config.cjs
│   └── package.json
├── scripts/                # Documentation scripts
│   ├── demo-script.md
│   └── snapshots-notes.md
├── .env                    # Environment variables (not in git)
├── package.json            # Root package.json
├── postman_collection.json # API testing collection
├── Attributions.md         # Third-party attributions
└── README.md               # This file
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

This runs Jest tests located in `server/tests/`. The test suite includes unit tests for plan generation and service logic.

## 🔐 Security Considerations

1. **JWT Secret**: Always use a strong, random secret in production
2. **MongoDB**: Use strong database credentials and restrict network access
3. **CORS**: Configure `CLIENT_URL` appropriately for your deployment
4. **Environment Variables**: Never commit `.env` files to version control
5. **API Keys**: Keep LLM API keys secure and rotate them regularly

## 🤖 AI Integration

The application uses **Groq AI** for intelligent plan generation. The system:

1. **Primary**: Uses Groq API with models like Llama 3.1 and Mixtral
2. **Fallback**: Automatically falls back to mocked plan generation if:
   - API key is not configured
   - API quota is exceeded
   - API request fails

To enable AI features:
1. Sign up at [Groq Console](https://console.groq.com/)
2. Get your API key
3. Add it to `.env` as `LLM_API_KEY` or `GROQ_API_KEY`

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark color scheme optimized for productivity
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Loading states and error messages
- **Auto-save**: Plans are automatically saved after edits
- **Dependency Visualization**: View task dependencies in a clear format
- **Task Management**: Edit tasks inline with status, priority, and time tracking

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your MongoDB Atlas connection string
- Check network access settings in MongoDB Atlas
- Ensure your IP is whitelisted

### Authentication Errors
- Verify `JWT_SECRET` is set in `.env`
- Check that tokens are being sent in the Authorization header
- Ensure token hasn't expired

### AI Generation Not Working
- Check if `LLM_API_KEY` is set correctly
- Verify API key is valid and has quota remaining
- Check server logs for API errors
- The app will automatically fall back to mocked generation

### CORS Errors
- Verify `CLIENT_URL` matches your frontend URL
- Check that the frontend is running on the expected port




