# Project Management Tool - Full Stack

A complete project management application with role-based access control built with Django REST Framework backend and React.js frontend.

## Overview

This application allows users to create and manage projects and tasks with different permission levels for Admins and End Users. Admins can verify projects and have full access, while End Users can only access their own projects and verified projects from others.

## Tech Stack

### Backend
- Django
- Django REST Framework
- SQLite (default database)
- JWT Authentication
- CORS Headers

### Frontend
- React 18+
- React Router
- Axios
- Tailwind CSS
- shadcn/ui

## Features

- User authentication and registration
- Role-based access control (Admin/End User)
- Project creation and management
- Task management within projects
- Project verification system
- Responsive web interface
- RESTful API

## Project Structure

```
project-management-tool/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── project_manager/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── authentication/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   └── projects/
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       ├── permissions.py
│       └── urls.py
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── routes/
    ├── package.json
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- pip
- npm or yarn

## Installation

### Backend Setup

1. Navigate to backend directory
```bash
cd backend
```

2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Run migrations
```bash
python manage.py makemigrations authentication
python manage.py makemigrations projects
python manage.py migrate
```


5. Start backend server
```bash
python manage.py runserver
```

Backend will run on http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Start frontend server
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- POST `/api/auth/register/` - Register new user
- POST `/api/auth/login/` - User login
- POST `/api/auth/logout/` - User logout
- GET `/api/auth/profile/` - Get user profile

### Projects
- GET `/api/projects/` - List accessible projects
- POST `/api/projects/` - Create new project
- GET `/api/projects/{id}/` - Get project details
- PUT `/api/projects/{id}/` - Update project
- DELETE `/api/projects/{id}/` - Delete project
- POST `/api/projects/{id}/verify/` - Verify project (Admin only)

### Tasks
- GET `/api/projects/{project_id}/tasks/` - List project tasks
- POST `/api/projects/{project_id}/tasks/` - Create task
- GET `/api/projects/{project_id}/tasks/{id}/` - Get task details
- PUT `/api/projects/{project_id}/tasks/{id}/` - Update task
- DELETE `/api/projects/{project_id}/tasks/{id}/` - Delete task

## User Roles

### End User
- Create new projects (unverified by default)
- View own projects and verified projects from others
- Manage tasks in accessible projects
- Cannot verify projects or access admin features

### Admin
- View all projects (verified and unverified)
- Verify any project
- Full CRUD access to all projects and tasks
- Access Django admin panel

## Usage

### Registration
```json
POST /api/auth/register/
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "user"
}
```

### Login
```json
POST /api/auth/login/
{
    "username": "john_doe",
    "password": "securepassword123"
}
```

### Create Project
```json
POST /api/projects/
{
    "name": "My Project",
    "description": "Project description"
}
```

### Create Task
```json
POST /api/projects/1/tasks/
{
    "title": "Task title",
    "description": "Task description",
    "status": "pending"
}
```

## Development

### Backend Development
```bash
cd backend
python manage.py runserver
```

### Frontend Development
```bash
cd frontend
npm run dev
```


## Database Models

### User Profile
- user (OneToOne with Django User)
- role (admin/end_user)
- created_at

### Project
- name
- description
- verified (boolean)
- owner (Foreign Key to User)
- created_at, updated_at

### Task
- title
- description
- status (pending/in_progress/completed)
- project (Foreign Key to Project)
- created_at, updated_at

## Admin Panel

Access Django admin at http://localhost:8000/admin/

Features:
- User management
- Project verification
- Bulk actions for projects and tasks
- System monitoring
