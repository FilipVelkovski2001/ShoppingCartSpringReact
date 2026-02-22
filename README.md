# Abysalto – Mid Developer Technical Task

A full-stack shopping cart application built with **Spring Boot** (backend) and **React + TypeScript** (frontend), using the [DummyJSON API](https://dummyjson.com) as an external product data source.

---

## 📁 Project Structure

```
mid/
├── backend/                  # Spring Boot REST API
│   ├── src/
│   │   └── main/
│   │       ├── java/com/abysalto/mid/
│   │       │   ├── config/           # Security, CORS, app config
│   │       │   ├── controller/       # REST controllers
│   │       │   ├── dto/
│   │       │   │   ├── request/      # Login, Register, AddItem, UpdateQuantityRequest
│   │       │   │   └── response/     # ApiResponse, AuthDto, UserDto, CartDto, CartItemDto
│   │       │   ├── entity/           # User, Cart, CartItem
│   │       │   ├── exception/        # GlobalExceptionHandler, ResourceNotFoundException
│   │       │   ├── repository/       # JPA repositories
│   │       │   ├── security/         # JwtTokenProvider, JwtAuthenticationFilter
│   │       │   └── service/          # Service interfaces + implementations
│   │       └── resources/
│   │           └── application.yaml
│   └── pom.xml
│
└── frontend/                 # React + TypeScript SPA
    ├── src/
    │   ├── api/              # Typed Axios API client
    │   ├── components/
    │   │   └── layout/       # Navbar
    │   ├── context/          # AuthContext, CartContext
    │   ├── dto/              # TypeScript interfaces mirroring backend DTOs
    │   │   ├── request.ts
    │   │   ├── response.ts
    │   │   └── index.ts
    │   └── pages/            # LoginPage, RegisterPage, ProductsPage, ProductDetailPage, CartPage, ProfilePage
    ├── package.json
    ├── tsconfig.json
    └── tailwind.config.js
```

---

## ✅ Features

### Users
- User registration with validation
- User login with JWT authentication
- Retrieve currently logged-in user info

### Products *(powered by DummyJSON API)*
- Retrieve all products with **pagination** and **sorting**
- Search products by keyword
- Filter by category
- Retrieve a single product by ID
- Add / remove products from favorites

### Cart
- Add products to cart
- Remove products from cart
- Update item quantities
- Retrieve the user's current cart with subtotals and total
- Clear entire cart

### Bonus
- ✅ Clean Architecture — Controller → Service Interface → Service Impl → Repository
- ✅ Data caching with **Caffeine** (5 minute TTL, 200 item max) to reduce DummyJSON API calls
- ✅ TypeScript frontend with typed DTOs mirroring backend response/request classes
- ✅ Global exception handling with consistent `ApiResponse<T>` envelope
- ✅ Soft, elegant UI built with **Tailwind CSS**

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 4 | Framework |
| Spring Security 7 | Authentication & authorization |
| Spring Data JPA | ORM & repositories |
| MySQL | Relational database |
| JWT (jjwt 0.12) | Stateless token-based auth |
| Caffeine Cache | In-memory product caching |
| Lombok | Boilerplate reduction |
| Bean Validation | Request validation |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript 4 | Type safety |
| React Router 6 | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| React Toastify | Notifications |

---

## 🚀 Running Locally

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ & npm
- MySQL 8+

---

### 1. Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE shoppingCart;
```

---

### 2. Backend

Update `backend/src/main/resources/application.yaml` with your MySQL credentials:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/shoppingCart?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
    username: your_username
    password: your_password
```

Then run:

```bash
cd backend
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**

Spring will automatically create all database tables on first run via `ddl-auto: update`.

---

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

The frontend starts on **http://localhost:3000** and proxies all `/api` requests to the backend automatically.

---

## 📡 API Reference

All protected endpoints require the header:
```
Authorization: Bearer <jwt_token>
```

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | Yes | Get current user info + favorites |
| POST | `/api/users/favorites/{productId}` | Yes | Add product to favorites |
| DELETE | `/api/users/favorites/{productId}` | Yes | Remove product from favorites |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Yes | Get all products |
| GET | `/api/products?limit=12&skip=0&sortBy=price&order=asc` | Yes | With pagination & sorting |
| GET | `/api/products?search=phone` | Yes | Search products |
| GET | `/api/products/{id}` | Yes | Get single product |
| GET | `/api/products/categories` | Yes | Get all categories |
| GET | `/api/products/category/{category}` | Yes | Get products by category |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | Yes | Get user's cart |
| POST | `/api/cart/items` | Yes | Add item to cart |
| PATCH | `/api/cart/items/{productId}` | Yes | Update item quantity |
| DELETE | `/api/cart/items/{productId}` | Yes | Remove item from cart |
| DELETE | `/api/cart` | Yes | Clear entire cart |

---

## 📦 API Response Format

Every endpoint returns a consistent envelope:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ...",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

## 🔐 Authentication Flow

1. User registers or logs in → backend returns a **JWT token**
2. Frontend stores the token in `localStorage`
3. Every subsequent request includes `Authorization: Bearer <token>`
4. `JwtAuthenticationFilter` validates the token on every request
5. On 401, the frontend automatically redirects to `/login`

---

## 🗄️ Caching Strategy

Product data from DummyJSON is cached using **Caffeine**:

- Cache expiry: **5 minutes**
- Max entries: **200**
- Cache keys include pagination, sorting, and search parameters

This means repeated requests for the same product list are served from memory without hitting the DummyJSON API.

---

## 💡 Example API Calls

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"secret123","firstName":"John","lastName":"Doe"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret123"}'
```

**Add to Cart:**
```bash
curl -X POST http://localhost:8080/api/cart/items \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2,"productTitle":"iPhone 9","productPrice":549.99,"productThumbnail":"https://..."}'
```

**Project screenshots:**

<img width="1905" height="860" alt="image" src="https://github.com/user-attachments/assets/226bee3d-2c78-41b4-b89c-3defb0417be3" />
<img width="1915" height="855" alt="image" src="https://github.com/user-attachments/assets/6eabb29d-b7d3-440b-9eee-640b8b27fc25" />
<img width="1916" height="863" alt="image" src="https://github.com/user-attachments/assets/d7840e05-5f97-4bcc-98df-672218f39b5e" />
<img width="1919" height="859" alt="image" src="https://github.com/user-attachments/assets/73bd710b-25a2-4008-bd08-f94f446d165c" />
<img width="954" height="946" alt="image" src="https://github.com/user-attachments/assets/29fdeaa6-22ba-403d-8982-feb04ed8c65b" />
