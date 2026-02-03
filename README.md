# Book Tracker App

A full-stack web application for managing your reading list, built with Flask and React.

<p align="center">
  <img src="./assets/home.png" height="200" alt="Home" />
  <img src="./assets/library.png" height="200" alt="Library" />
</p>

## 📝 Submission Details

This is the submission for the **Fullstack** role.

- **Role**: Fullstack Engineer
- **Features Implemented**:
  - **Browse Library**: Complete CRUD (Create, Read, Update, Delete) functionality for books.
  - **Backend API**: Robust REST API with Flask, structured using Controller-Service-Repository pattern.
  - **Frontend Integration**: Linked React frontend with backend API using `axios` and `react-query` (tanstack query).
  - **Validation**:
    - Backend: Input validation using `marshmallow`/schemas.
    - Frontend: Form validation using `zod` and `react-hook-form`.
  - **CI/CD**: Added GitHub Actions workflows for both backend (testing) and frontend (linting/build).
  - **UI/UX**: Enhanced UI with loading skeletons and error handling (using Shadcn UI).

### How to Run/Test

1. **Backend**:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   python app.py
   ```

   _Run Tests_: `pytest`

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   _Run Linting_: `npm run lint`

---

## Features

- 📚 **Book Management**: Add, view, update, and delete books.
- 📖 **Tracking**: Track reading status (unread/reading/completed).
- ⚡ **Modern Stack**: Built with React 18, Vite, and Flask.
- 🎨 **Responsive Design**: Beautiful UI with Tailwind CSS and Shadcn Components.
- 🛡️ **Type Safety**: TypeScript on the frontend.
- 🏗️ **Clean Architecture**: Scalable backend structure.

## Tech Stack

### Backend

- **Core**: Python 3.x, Flask
- **Database**: SQLAlchemy (SQLite)
- **Architecture**: MVC (Controller-Service-Repository)
- **Testing**: Pytest

### Frontend

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI, Lucide Icons
- **State/Fetching**: TanStack Query, Axios
- **Forms**: React Hook Form, Zod

## Project Structure

```
book-app/
├── backend/
│   ├── controllers/      # Request handlers (API Layer)
│   ├── models/           # Database models
│   ├── repositories/     # Data access logic
│   ├── routes/           # Route definitions
│   ├── schemas/          # Data validation schemas
│   ├── services/         # Business logic
│   ├── tests/            # Unit and integration tests
│   └── app.py            # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Main page views
│   │   ├── services/     # API integration functions
│   │   ├── types/        # TypeScript type definitions
│   │   └── App.tsx       # Main application component
│   └── package.json
└── .github/workflows/    # CI/CD pipelines
```

## API Documentation

### Book Endpoints

**Base URL**: `/api`

| Method   | Endpoint     | Description       | Body                        |
| :------- | :----------- | :---------------- | :-------------------------- |
| `GET`    | `/books`     | Get all books     | -                           |
| `POST`   | `/books`     | Create a new book | `{ title, author, status }` |
| `PUT`    | `/books/:id` | Update a book     | `{ title, author, status }` |
| `DELETE` | `/books/:id` | Delete a book     | -                           |

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## License

MIT
