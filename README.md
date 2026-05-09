# AssetFlow - Enterprise Asset Management System

AssetFlow is a full-stack application designed to manage the lifecycle of corporate assets, from initial request to retirement. This project features a React frontend, a Node.js/Express backend, and a MongoDB database, all orchestrated via Docker.

## Quick Start

To run this application immediately, ensure you have **Docker** and **Docker Compose** installed.

1. **Clone the repository:**
   ```bash
   git clone git@github.com:atmavi/AssetFlow.git
   cd AssetFlow
2. **Start the application:**
   ```bash
   docker-compose up --build

2. **Access the Application:**
    - Frontend: http://localhost:5173
    - Backend API: http://localhost:5000

## Important Notes
Authentication: A mock login page is provided. You can use any credentials to enter, or use the seeded admin account details found in the backend seeding script.

Environment Variables: Environment variables are pre-configured in the docker-compose.yml to ensure the application runs correctly out of the box without manual .env setup.