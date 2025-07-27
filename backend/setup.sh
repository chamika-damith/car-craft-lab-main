#!/bin/bash

echo "🚗 Car Craft Lab Backend Setup"
echo "=============================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/car-craft-lab

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB first:"
        echo "   Ubuntu/Debian: sudo systemctl start mongod"
        echo "   macOS: brew services start mongodb-community"
        echo "   Windows: Start MongoDB service"
    fi
else
    echo "❌ MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

# Seed the database
echo "🌱 Seeding database with sample services..."
npm run seed

echo ""
echo "🎉 Setup completed!"
echo ""
echo "To start the development server:"
echo "   npm run dev"
echo ""
echo "To test the API:"
echo "   node test-api.js"
echo ""
echo "API will be available at: http://localhost:5000"
echo "Health check: http://localhost:5000/health" 