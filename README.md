
# E-commerce Microservices Application

A scalable e-commerce application built using microservices architecture, powered by Node.js, Express, MongoDB, and RabbitMQ for inter-service communication.

## Architecture Overview

![diag2](https://github.com/user-attachments/assets/8933ab40-03f0-4540-9b12-03e73bb05d8b)


The application consists of three independent microservices:

### 1. Auth Service (Port: 7070)
- User authentication and registration
- JWT token management
- Dedicated MongoDB instance

### 2. Product Service (Port: 8081)
- Product management
- Inventory control
- Purchase processing
- Dedicated MongoDB instance

### 3. Order Service (Port: 9090)
- Order processing
- Order management
- Dedicated MongoDB instance

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Message Broker**: RabbitMQ
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- RabbitMQ Server
- npm or yarn

## Project Structure
```
D:\ecommerce_microservice\
├── isAuthenticated.js
├── auth-service\
│   ├── index.js
│   └── User.js
├── product-service\
│   ├── index.js
│   └── Product.js
└── order-service\
    ├── index.js
    └── Order.js
```

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd ecommerce_microservice
   ```

2. **Install Dependencies**
   ```bash
   # Install dependencies for each service
   cd auth-service && npm install
   cd ../product-service && npm install
   cd ../order-service && npm install
   ```

3. **Configure Environment**
   - Ensure MongoDB is running
   - Start RabbitMQ server
   - Configure ports if needed

4. **Start Services**
   ```bash
   # Start Auth Service
   cd auth-service && npm start

   # Start Product Service
   cd product-service && npm start

   # Start Order Service
   cd order-service && npm start
   ```

## API Endpoints

### Auth Service
```
POST /auth/register
POST /auth/login
```

### Product Service
```
POST /product/create
POST /product/buy
```

### Order Service
- Handles internal order processing via RabbitMQ

## Message Queue Flow

1. Product Service sends purchase events to "Order" queue
2. Order Service processes purchase events
3. Order confirmations sent to "PRODUCTS" queue

## Database Schemas

### User Schema
```javascript
{
    name: String,
    email: String,
    password: String,
    created_at: Date
}
```

### Product Schema
```javascript
{
    name: String,
    description: String,
    price: Number,
    created_at: Date
}
```

### Order Schema
```javascript
{
    product: [{ product_id: String }],
    user_id: String,
    total_price: Number,
    created_at: Date
}
```


## Future Enhancements

1. Docker containerization
2. API documentation (Swagger)
3. Unit and integration tests
4. Payment service integration
5. Logging system
6. Service discovery
7. Load balancing
8. Circuit breakers
9. API Gateway
10. Monitoring and analytics

