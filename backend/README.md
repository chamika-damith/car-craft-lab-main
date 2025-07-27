# Car Craft Lab Backend API

A Node.js backend server for the Car Craft Lab car modification platform, providing authentication and car customization services.

## 🚀 Features

- **JWT-based Authentication** - Secure user registration, login, and profile management
- **Car Modification Services** - Comprehensive list of car customization services
- **Build Management** - Save and manage car customization builds
- **RESTful API** - Clean, well-documented API endpoints
- **MongoDB Integration** - Robust data persistence with Mongoose ODM
- **Security** - Helmet, CORS, input validation, and error handling
- **Pagination** - Efficient data retrieval with pagination support

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/car-craft-lab
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB** (if using local instance):
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   ```

5. **Seed the database with sample services:**
   ```bash
   npm run seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET /auth/profile
Get authenticated user's profile information.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Services Endpoints

#### GET /services
Get all available car modification services with filtering and pagination.

**Query Parameters:**
- `category` - Filter by service category (exterior, interior, performance, audio, lighting, wheels, other)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `available` - Filter by availability (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sortBy` - Sort field (name, price, duration, category, createdAt)
- `sortOrder` - Sort order (asc, desc)

**Example Request:**
```
GET /services?category=exterior&minPrice=100&maxPrice=1000&page=1&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "_id": "service_id",
        "name": "Custom Paint Job",
        "description": "Professional custom paint job...",
        "category": "exterior",
        "price": 2500,
        "duration": 48,
        "features": ["Premium automotive paint", "Color sanding and buffing"],
        "requirements": ["Vehicle must be clean", "Paint booth required"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 25,
      "itemsPerPage": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### GET /services/:id
Get a specific service by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "service": {
      "_id": "service_id",
      "name": "Custom Paint Job",
      "description": "Professional custom paint job...",
      "category": "exterior",
      "price": 2500,
      "duration": 48
    }
  }
}
```

### Builds Endpoints

#### POST /builds
Create a new car customization build (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "name": "My Dream Car",
  "description": "A complete transformation of my daily driver",
  "carModel": "Civic",
  "carYear": 2020,
  "carMake": "Honda",
  "selectedServices": [
    {
      "service": "service_id_1",
      "quantity": 1,
      "customNotes": "Matte black finish"
    },
    {
      "service": "service_id_2",
      "quantity": 1
    }
  ],
  "isPublic": false,
  "tags": ["sporty", "modern"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Build created successfully",
  "data": {
    "build": {
      "_id": "build_id",
      "name": "My Dream Car",
      "totalPrice": 3300,
      "estimatedDuration": 60,
      "selectedServices": [...]
    }
  }
}
```

#### GET /builds/:userId
Get builds by user ID (public builds for other users, all builds for own user).

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by build status

**Response:**
```json
{
  "success": true,
  "data": {
    "builds": [
      {
        "_id": "build_id",
        "name": "My Dream Car",
        "carModel": "Civic",
        "carMake": "Honda",
        "totalPrice": 3300,
        "status": "saved"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15,
      "itemsPerPage": 10
    }
  }
}
```

#### GET /builds/build/:id
Get a specific build by ID (requires ownership or public access).

**Response:**
```json
{
  "success": true,
  "data": {
    "build": {
      "_id": "build_id",
      "name": "My Dream Car",
      "selectedServices": [
        {
          "service": {
            "_id": "service_id",
            "name": "Custom Paint Job",
            "price": 2500
          },
          "quantity": 1
        }
      ],
      "totalPrice": 3300,
      "estimatedDuration": 60
    }
  }
}
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample services

## 🗄️ Database Schema

### User Model
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `firstName` - User's first name
- `lastName` - User's last name
- `avatar` - Profile picture URL
- `role` - User role (user/admin)
- `isActive` - Account status

### Service Model
- `name` - Service name
- `description` - Service description
- `category` - Service category
- `price` - Service price
- `duration` - Estimated duration in hours
- `features` - Array of service features
- `requirements` - Array of requirements
- `isAvailable` - Service availability

### Build Model
- `user` - Reference to user
- `name` - Build name
- `description` - Build description
- `carModel` - Car model
- `carYear` - Car year
- `carMake` - Car make
- `selectedServices` - Array of selected services with quantities
- `totalPrice` - Calculated total price
- `estimatedDuration` - Calculated total duration
- `status` - Build status
- `isPublic` - Public visibility
- `tags` - Array of tags

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **Input Validation** - express-validator for request validation
- **CORS Protection** - Configurable CORS settings
- **Helmet** - Security headers
- **Error Handling** - Comprehensive error handling and logging

## 🚀 Deployment

1. **Set environment variables for production:**
   ```env
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   CORS_ORIGIN=your_frontend_domain
   ```

2. **Install dependencies:**
   ```bash
   npm install --production
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 