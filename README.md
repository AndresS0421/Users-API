# Users API

A comprehensive REST API for managing users with JWT authentication, role-based access control, and session management. Built with Node.js, Express, Prisma ORM, and PostgreSQL.

## 🚀 Features

- **User Management**: Create users with different roles (USER, ADMIN, AUDITOR)
- **JWT Authentication**: Secure access and refresh token system
- **Session Management**: Track user sessions with refresh token rotation
- **Role-based Access**: Different access levels for users, admins, and auditors
- **Password Security**: bcrypt password hashing
- **Database**: PostgreSQL with Prisma ORM
- **Cookie Support**: HTTP-only cookies for secure token storage

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Session Management**: Custom session tracking with refresh tokens
- **Cookie Parser**: cookie-parser for HTTP-only cookies
- **UUID**: For generating unique refresh token IDs

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Environment variables configured

## 🔧 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Users_API
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with the following variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=8080
JWT_ACCESS_SECRET="your-super-secret-access-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
ACCESS_TOKEN_AGE="15m"
REFRESH_TOKEN_AGE="7d"
```

4. Set up the database
```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the server
```bash
npm start
```

## 📚 API Endpoints

### User Management Endpoints

#### Create User
- **POST** `/user/create`
- **Description**: Create a new user account (always creates with USER role)
- **Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```
- **Response**:
```json
{
  "successful": true,
  "message": "User created successfully",
  "data": {
    "id": "user_id",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "USER",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```
- **Note**: Role is automatically set to "USER" - any role provided in the request will be ignored

#### Register Admin
- **POST** `/user/register-admin`
- **Description**: Create a new admin user account
- **Body**:
```json
{
  "first_name": "Admin",
  "last_name": "User",
  "email": "admin@example.com",
  "password": "adminpassword"
}
```
- **Response**:
```json
{
  "successful": true,
  "message": "Admin user created successfully",
  "data": {
    "id": "admin_id",
    "first_name": "Admin",
    "last_name": "User",
    "email": "admin@example.com",
    "role": "ADMIN",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Register Auditor
- **POST** `/user/register-auditor`
- **Description**: Create a new auditor user account
- **Body**:
```json
{
  "first_name": "Auditor",
  "last_name": "User",
  "email": "auditor@example.com",
  "password": "auditorpassword"
}
```
- **Response**:
```json
{
  "successful": true,
  "message": "Auditor user created successfully",
  "data": {
    "id": "auditor_id",
    "first_name": "Auditor",
    "last_name": "User",
    "email": "auditor@example.com",
    "role": "AUDITOR",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Authentication Endpoints

#### User Login
- **POST** `/user/login`
- **Description**: Authenticate user and get JWT tokens
- **Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```
- **Response**:
```json
{
  "successful": true,
  "data": {
    "id": "user_id",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "USER",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "session_id": "session_id"
  }
}
```
- **Cookies Set**:
  - `refresh_token`: HTTP-only cookie with refresh token (7 days)
  - `session_id`: HTTP-only cookie with session ID (7 days)

#### Refresh Token
- **POST** `/user/refresh-token`
- **Description**: Refresh access token using refresh token
- **Cookies Required**:
  - `refresh_token`: Refresh token from login
  - `session_id`: Session ID from login
- **Response**:
```json
{
  "successful": true,
  "data": {
    "id": "user_id",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "USER",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "session_id": "session_id"
  }
}
```

## 🔐 User Roles

- **USER**: Basic user with standard access
- **ADMIN**: Administrative privileges with full access
- **AUDITOR**: Audit and monitoring capabilities

## 📁 Database Schema

The API uses the following main entities:
- **Users**: User accounts with role-based access
- **Sessions**: User session tracking with refresh tokens
- **Credentials**: User authentication credentials (password hashes)

### Database Models

#### Users Table
```sql
model Users {
  id             String      @id @default(cuid())
  first_name     String
  last_name      String
  email          String      @unique
  role           Role        @default(USER)
  created_at     DateTime    @default(now())
  updated_at     DateTime    @updatedAt
  sessions       Sessions[]
  credential     Credential?
}
```

#### Sessions Table
```sql
model Sessions {
  id         String   @id @default(cuid())
  user_id    String
  refresh_id String?
  expires_at DateTime
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  users      Users    @relation(fields: [user_id], references: [id], onDelete: Cascade)
}
```

#### Credentials Table
```sql
model Credential {
  id         String   @id @default(cuid())
  credential String
  user_id    String   @unique
  user       Users    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}
```

## 🔐 JWT Authentication

### How it works:
1. **Login**: User provides email/password → receives access token + refresh token
2. **Access Token**: Short-lived (15 minutes) for API requests
3. **Refresh Token**: Long-lived (7 days) stored in HTTP-only cookie
4. **Session Management**: Database tracks active sessions with refresh token rotation
5. **Credential Separation**: Passwords are stored separately in the `Credential` table

### Using Access Tokens:
Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Testing with Postman:
1. **Login**: POST to `/user/login` → Get tokens in response + cookies
2. **Refresh**: POST to `/user/refresh-token` → Uses cookies automatically
3. **Protected Routes**: Add `Authorization: Bearer <token>` header

### Security Features:
- **Password Hashing**: All passwords are hashed using bcrypt
- **HTTP-Only Cookies**: Refresh tokens are stored in secure cookies
- **Token Rotation**: Refresh tokens are rotated on each refresh
- **Session Tracking**: Database tracks all active sessions

## 🚨 Error Handling

All endpoints return consistent error responses:
```json
{
  "successful": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `405`: Method Not Allowed

## 🔧 Development

### Running in Development Mode
```bash
npm start
```

The server will start with nodemon for automatic restarts on file changes.

### Database Migrations
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
