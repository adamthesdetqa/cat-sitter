# Cat Sitter Backend

This project has been updated to use a custom Node.js/Express backend connected to a PostgreSQL database using Sequelize ORM.

## Setup Instructions

### 1. PostgreSQL Database
You need a running PostgreSQL server.
Create a database named `catsitter`.

```bash
# Example (Linux)
sudo -u postgres psql
CREATE DATABASE catsitter;
ALTER USER postgres PASSWORD 'your_password';
\q
```

### 2. Environment Variables
In the `backend` folder, create a `.env` file based on your database configuration.
```env
DATABASE_URL=postgres://postgres:your_password@localhost:5432/catsitter
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
```

### 3. Install Dependencies and Run
Navigate into the backend directory and install dependencies:
```bash
cd backend
npm install
```

Start the backend server (this will also auto-sync the database schema):
```bash
node src/index.js
# Or for development with nodemon:
npx nodemon src/index.js
```
The server runs on port 3000 by default.

### 4. Admin Setup
By default, all registered users are given the `user` role.
To grant admin privileges (the cat sitter), you must manually update the user in the database:
```sql
UPDATE "Users" SET role = 'admin' WHERE email = 'your@email.com';
```

## Frontend Connection
The frontend Angular application has been updated to communicate with this backend.
In `src/environments/environment.ts`, the `apiUrl` should point to the backend (e.g., `http://localhost:3000/api`).
