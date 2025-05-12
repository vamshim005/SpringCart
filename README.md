# E-commerce Application

A full-stack e-commerce application built with React and Spring Boot.

## Features

- User authentication (Google OAuth 2.0 and Username/Password)
- Product search with suggestions
- Product filtering and sorting
- Shopping cart functionality
- Secure payment processing with Stripe
- Responsive design for all devices
- Redis caching for improved performance
- MySQL database for data persistence

## Tech Stack

### Frontend
- React.js
- Material-UI
- Redux for state management
- Axios for API calls

### Backend
- Spring Boot 2.0
- Spring Security
- Spring Data JPA
- Redis for caching

### Database
- MySQL

### Other Tools
- Docker & Docker Compose
- Redis
- Stripe Payment API
- Google OAuth 2.0

## Project Structure
```
ecommerceApp/
├── client/          # React frontend
├── server/          # Spring Boot backend
└── mysql-db/        # Database initialization scripts
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js and npm
- Java 11 or higher
- Maven

### Setup Instructions
1. Clone the repository
2. Configure environment variables
3. Run the application using Docker Compose

More detailed setup instructions will be added as we build the application.

## Setup Instructions

### 1. Environment Variables

Before running the app, you must set the following environment variables (in a `.env` file or your shell):

- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
- `JWT_SECRET_KEY` - (Optional) Your JWT signing secret (default is `mysecretkey123456`)

**Do NOT commit your secrets to the repository.**

Example `.env` file:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET_KEY=your_jwt_secret
```

### 2. Running with Docker Compose

1. Copy `.env.example` to `.env` and fill in your secrets (or create `.env` as above).
2. Start the app:
   ```bash
   docker-compose up --build
   ```
3. The backend will be available at `http://localhost:8080` and the frontend at `http://localhost:3000`.

### 3. Local Development

- **Backend:**
  - Set environment variables in your shell or IDE.
  - Run with Maven:
    ```bash
    cd server
    mvn spring-boot:run
    ```
- **Frontend:**
  - Start React app:
    ```bash
    cd client
    npm install
    npm start
    ```

### 4. Security
- Never commit secrets to the repository.
- If you accidentally commit a secret, remove it from your git history using BFG Repo-Cleaner or similar tools.

### 5. Features
- Google OAuth2 login
- Username/password login
- Stripe payments
- Product management
- MySQL, Redis, Docker Compose

---

For more details, see the code and comments in each service. 

## Changelog

### May 2025
- Fixed product filtering and sorting logic in backend controller
- Ensured compatibility with Java 8 by replacing `.toList()` with `.collect(Collectors.toList())`
- Improved backend/frontend integration for product listing and filtering 