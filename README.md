# Users API

A comprehensive REST API for managing users with JWT authentication, role-based access control, session management, and Files API integration. Built with Node.js, Express, Prisma ORM, PostgreSQL, and integrated with a Files API for file management.

## 🚀 Features

- **User Management**: Create users with different roles (USER, ADMIN, AUDITOR)
- **JWT Authentication**: Secure access and refresh token system
- **Session Management**: Track user sessions with refresh token rotation
- **Role-based Access**: Different access levels for users, admins, and auditors
- **Password Security**: bcrypt password hashing
- **Database**: PostgreSQL with Prisma ORM
- **Cookie Support**: HTTP-only cookies for secure token storage
- **Files API Integration**: Complete file and category management through external Files API
- **File Upload**: PDF file upload with validation and AWS S3 storage
- **Category Management**: Organize files by categories with role-based access

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Session Management**: Custom session tracking with refresh tokens
- **Cookie Parser**: cookie-parser for HTTP-only cookies
- **UUID**: For generating unique refresh token IDs
- **Files API Integration**: Axios for HTTP requests to external Files API
- **File Upload**: Multer for handling multipart file uploads
- **Form Data**: form-data for creating multipart form data

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Files API running (default: http://localhost:8090)
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
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=8080

# JWT Configuration
JWT_ACCESS_SECRET="your-super-secret-access-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
ACCESS_TOKEN_AGE="15m"
REFRESH_TOKEN_AGE="7d"

# Files API Configuration
FILES_API_BASE_URL="http://localhost:8090"
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

## 📁 Files API Integration

This API integrates with an external Files API to provide file and category management capabilities. All file operations are proxied to the Files API running on `http://localhost:8090` (configurable via `FILES_API_BASE_URL`).

### Files Management Endpoints

#### Upload File
- **POST** `/files/upload`
- **Description**: Upload a PDF file to the Files API
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: (file) - The PDF file to upload (required)
  - `description`: (string) - File description
  - `user_id`: (string) - User ID (required)
  - `category_id`: (string) - Category ID (required)
- **Response**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "file_id",
    "url": "https://s3.amazonaws.com/bucket/file.pdf",
    "description": "File description",
    "user_id": "user123",
    "category_id": "cat456",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```
- **File Restrictions**: Only PDF files allowed, maximum 10MB
- **Note**: Only one file per user is allowed. Uploading a new file replaces the existing one.

#### Get All Files
- **GET** `/files/get-all?role=ADMINISTRATOR`
- **Description**: Retrieve all files (requires specific role)
- **Query Parameters**:
  - `role` (required): Must be "ADMINISTRATOR" or "PROFESSOR"
- **Response**:
```json
{
  "success": true,
  "message": "Files retrieved successfully",
  "data": [
    {
      "id": "file_id",
      "url": "https://s3.amazonaws.com/bucket/file.pdf",
      "description": "File description",
      "user_id": "user123",
      "category_id": "cat456",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get File by ID
- **GET** `/files/get?file_id=file123&role=ADMINISTRATOR`
- **Description**: Retrieve a specific file by ID
- **Query Parameters**:
  - `file_id` (required): The ID of the file to retrieve
  - `role` (required): Must be "ADMINISTRATOR" or "PROFESSOR"
- **Response**:
```json
{
  "success": true,
  "message": "File retrieved successfully",
  "data": {
    "id": "file_id",
    "url": "https://s3.amazonaws.com/bucket/file.pdf",
    "description": "File description",
    "user_id": "user123",
    "category_id": "cat456",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Files by User ID
- **GET** `/files/get-user-id?user_id=user123`
- **Description**: Retrieve all files for a specific user
- **Query Parameters**:
  - `user_id` (required): The ID of the user whose files to retrieve
- **Response**:
```json
{
  "success": true,
  "message": "Files retrieved successfully",
  "data": [
    {
      "id": "file_id",
      "url": "https://s3.amazonaws.com/bucket/file.pdf",
      "description": "File description",
      "user_id": "user123",
      "category_id": "cat456",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Update File
- **PUT** `/files/update`
- **Description**: Update file metadata and optionally replace the file
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: (file, optional) - New PDF file to replace existing
  - `user_id`: (string) - User ID (required)
  - `description`: (string) - Updated description
  - `category_id`: (string) - Updated category ID
- **Response**:
```json
{
  "success": true,
  "message": "File updated successfully",
  "data": {
    "id": "file_id",
    "url": "https://s3.amazonaws.com/bucket/file.pdf",
    "description": "Updated description",
    "user_id": "user123",
    "category_id": "cat789",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Delete File
- **DELETE** `/files/delete?user_id=user123&file_id=file123`
- **Description**: Delete a specific file
- **Query Parameters**:
  - `user_id` (required): The ID of the user who owns the file
  - `file_id` (required): The ID of the file to delete
- **Response**:
```json
{
  "success": true,
  "message": "File deleted successfully",
  "data": {
    "id": "file_id",
    "deleted": true
  }
}
```

### Categories Management Endpoints

#### Create Category
- **POST** `/category/create`
- **Description**: Create a new category (ADMINISTRATOR only)
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "category": {
    "name": "Category Name",
    "description": "Category description (optional)"
  },
  "role": "ADMINISTRATOR"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "cat_id",
    "name": "Category Name",
    "description": "Category description",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```
- **Note**: Only users with ADMINISTRATOR role can create categories

#### Get All Categories
- **GET** `/category/get-all`
- **Description**: Retrieve all categories
- **Response**:
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "cat_id",
      "name": "Category Name",
      "description": "Category description",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Update Category
- **PUT** `/category/update`
- **Description**: Update a category (ADMINISTRATOR only)
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "category": {
    "id": "cat123",
    "name": "Updated Category Name",
    "description": "Updated description"
  },
  "role": "ADMINISTRATOR"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "cat123",
    "name": "Updated Category Name",
    "description": "Updated description",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```
- **Note**: Only users with ADMINISTRATOR role can update categories

#### Delete Category
- **DELETE** `/category/delete?id=cat123&role=ADMINISTRATOR`
- **Description**: Delete a category (ADMINISTRATOR only)
- **Query Parameters**:
  - `id` (required): The ID of the category to delete
  - `role` (required): Must be "ADMINISTRATOR"
- **Response**:
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "id": "cat123",
    "deleted": true
  }
}
```
- **Note**: Only users with ADMINISTRATOR role can delete categories

### Files API Usage Examples

#### Upload a File
```bash
curl -X POST http://localhost:8080/files/upload \
  -F "file=@document.pdf" \
  -F "description=My thesis document" \
  -F "user_id=user123" \
  -F "category_id=cat456"
```

#### Get All Files
```bash
curl "http://localhost:8080/files/get-all?role=ADMINISTRATOR"
```

#### Get File by ID
```bash
curl "http://localhost:8080/files/get?file_id=file123&role=ADMINISTRATOR"
```

#### Get Files by User ID
```bash
curl "http://localhost:8080/files/get-user-id?user_id=user123"
```

#### Update a File
```bash
curl -X PUT http://localhost:8080/files/update \
  -F "file=@updated_document.pdf" \
  -F "user_id=user123" \
  -F "description=Updated thesis document" \
  -F "category_id=cat789"
```

#### Delete a File
```bash
curl -X DELETE "http://localhost:8080/files/delete?user_id=user123&file_id=file123"
```

#### Create a Category
```bash
curl -X POST http://localhost:8080/category/create \
  -H "Content-Type: application/json" \
  -d '{"category":{"name":"Computer Science","description":"CS related documents"},"role":"ADMINISTRATOR"}'
```

#### Get All Categories
```bash
curl "http://localhost:8080/category/get-all"
```

#### Update a Category
```bash
curl -X PUT http://localhost:8080/category/update \
  -H "Content-Type: application/json" \
  -d '{"category":{"id":"cat123","name":"Updated Computer Science","description":"Updated CS documents"},"role":"ADMINISTRATOR"}'
```

#### Delete a Category
```bash
curl -X DELETE "http://localhost:8080/category/delete?id=cat123&role=ADMINISTRATOR"
```

### Files API Features

- **File Upload**: Only PDF files allowed, 10MB maximum size
- **Role-based Access**: ADMINISTRATOR and PROFESSOR roles supported
- **Error Handling**: Comprehensive error handling with consistent responses
- **File Validation**: Multer middleware for file type and size validation
- **CORS Support**: Updated CORS configuration for file uploads
- **AWS S3 Integration**: Files are stored in AWS S3 with automatic URL generation
- **One File Per User**: Uploading a new file replaces the existing one

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

### User API Errors
```json
{
  "successful": false,
  "message": "Error description"
}
```

### Files API Errors
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### File Upload Errors
- **File too large**: Maximum size is 10MB
- **Invalid file type**: Only PDF files are allowed
- **Missing required fields**: user_id and category_id are required for file uploads

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `405`: Method Not Allowed
- `413`: Payload Too Large (file too big)
- `415`: Unsupported Media Type (wrong file type)

## 📦 Dependencies

### Core Dependencies
- `express`: Web framework
- `@prisma/client`: Database ORM
- `bcrypt`: Password hashing
- `jsonwebtoken`: JWT token generation
- `cookie-parser`: HTTP-only cookie support
- `uuid`: Unique ID generation
- `dotenv`: Environment variable management

### Files API Integration Dependencies
- `axios`: HTTP client for Files API requests
- `multer`: File upload middleware
- `form-data`: Multipart form data creation

### Development Dependencies
- `nodemon`: Development server with auto-restart
- `prisma`: Database migration and management

## 🔧 Development

### Running in Development Mode
```bash
npm start
```

The server will start with nodemon for automatic restarts on file changes.

### Files API Integration Setup
1. Ensure the Files API is running on `http://localhost:8090` (or configure `FILES_API_BASE_URL`)
2. The integration will automatically proxy requests to the Files API
3. File uploads are handled locally with multer and then forwarded to the Files API

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
