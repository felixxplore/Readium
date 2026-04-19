# 📝 Blog Management System (BMS) - Readium

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-7.0-red.svg)](https://redis.io/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-yellow.svg)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

A modern, full-stack **Blog Management Platform** inspired by Medium, built with a focus on **clean architecture, scalability, and real-world backend/frontend practices**.

This platform allows users to **write, publish, and interact with blogs**, while also focusing on **improving the writing experience and user engagement**.

---

## 🌟 Unique Value Proposition

Unlike traditional blogging platforms, this system is designed not just for publishing content, but for **helping users become better writers**.

### 💡 Key Differentiators:

* ✍️ AI-Powered Writing Assistance *(planned)*
* 💬 Meaningful feedback system beyond simple likes *(planned)*
* 📊 Writer-focused analytics *(planned)*

> 🎯 Goal: Build a platform where users don't just post content — they **grow as creators**.

---

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based Authentication** (Access + Refresh Token)
- **Google OAuth2 Integration** for social login
- **Secure API access** with role-based permissions
- **Password encryption** and secure token management

### ✍️ Blog Management
- **Create, Update, Delete** blog posts
- **Rich text content** with HTML support
- **Image uploads** via Cloudinary integration
- **Tag-based categorization**
- **Public and private posts**
- **Pagination support** for efficient data loading

### 💬 Comments & Discussions
- **Add comments** on blog posts
- **Update/Delete comments** (author-only)
- **Nested replies** (threaded discussions)
- **Comment likes** and engagement tracking

### ❤️ Social Engagement
- **Like/Unlike posts** and comments
- **Follow/Unfollow users**
- **User profiles** with follower/following counts
- **Real-time notifications** (planned)

### 👤 User Management
- **User registration** and email verification
- **Profile management** (bio, avatar, etc.)
- **Saved posts** feature for bookmarking
- **Admin user creation** for system management

### 🧠 Advanced Features
- **Redis caching** for improved performance
- **Email notifications** for user interactions
- **Image upload** and management
- **Search functionality** (planned)
- **Analytics dashboard** (planned)

### 🛠️ Developer Experience
- **Spring Boot DevTools** for hot reloading
- **Comprehensive API documentation** with OpenAPI/Swagger
- **Docker containerization** for easy deployment
- **Environment-based configuration** (dev/prod)
- **Comprehensive logging** and error handling

---

## 🏗️ Tech Stack

### 🔹 Backend
- **Java 17** - Modern Java with latest features
- **Spring Boot 3.5.7** - Production-ready framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database access and ORM
- **Spring Data Redis** - Caching layer
- **Spring Mail** - Email functionality
- **JWT (JJWT)** - Token-based authentication
- **MySQL 8.0** - Primary database
- **Redis 7.0** - Caching and session storage

### 🔹 Additional Libraries
- **Lombok** - Code generation for boilerplate
- **Jackson** - JSON serialization/deserialization
- **Cloudinary** - Image hosting and management
- **SpringDoc OpenAPI** - API documentation
- **Java Dotenv** - Environment variable management
- **Validation API** - Request validation

### 🔹 DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Maven** - Build and dependency management
- **Git** - Version control

---

## 📂 Project Structure

```
backend/
├── src/main/java/com/felix/bms/
│   ├── config/           # Configuration classes
│   │   ├── CacheConfig.java      # Redis caching configuration
│   │   ├── RedisConfig.java      # Redis connection setup
│   │   ├── SecurityConfig.java   # Spring Security setup
│   │   ├── WebConfig.java        # Web MVC configuration
│   │   └── CloudinaryConfig.java # Image upload config
│   ├── controller/       # REST API endpoints
│   │   ├── AuthController.java       # Authentication APIs
│   │   ├── BlogPostController.java   # Blog post management
│   │   ├── UserController.java       # User profile APIs
│   │   ├── CommentController.java    # Comment management
│   │   ├── LikeController.java       # Like functionality
│   │   ├── FollowController.java     # User following
│   │   ├── SavedPostController.java  # Saved posts feature
│   │   ├── ImageController.java      # Image upload APIs
│   │   └── NotificationController.java # Notifications
│   ├── dto/             # Data Transfer Objects
│   │   ├── auth/        # Authentication DTOs
│   │   ├── user/        # User-related DTOs
│   │   ├── post/        # Blog post DTOs
│   │   ├── comment/     # Comment DTOs
│   │   └── ...
│   ├── entity/          # JPA Entities
│   │   ├── User.java            # User entity
│   │   ├── BlogPost.java        # Blog post entity
│   │   ├── Comment.java         # Comment entity
│   │   ├── Like.java            # Like entity
│   │   ├── FollowRelationship.java # User following
│   │   ├── SavedPost.java       # Saved posts
│   │   ├── Notification.java    # Notifications
│   │   └── RefreshToken.java    # JWT refresh tokens
│   ├── enums/           # Enumeration classes
│   ├── exception/       # Global exception handling
│   ├── mapper/          # Entity-DTO mapping
│   ├── repository/      # JPA repositories
│   ├── security/        # JWT and security logic
│   ├── service/         # Business logic layer
│   └── util/            # Utility classes
├── src/main/resources/
│   ├── application.yaml         # Main config
│   ├── application-dev.yaml     # Development config
│   ├── application-prod.yaml    # Production config
│   └── static/                  # Static resources
├── .env                         # Environment variables
├── docker-compose.yml           # Docker orchestration
├── Dockerfile                   # Container build
├── pom.xml                      # Maven configuration
└── README.md                    # This file
```

---

## 🗄️ Database Schema

### Core Entities

#### User
```sql
- id: BIGINT (Primary Key)
- name: VARCHAR(255)
- username: VARCHAR(255) UNIQUE
- email: VARCHAR(255) UNIQUE
- password: VARCHAR(255)
- picture: VARCHAR(500)
- bio: TEXT
- role: ENUM('USER', 'ADMIN')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### BlogPost
```sql
- id: BIGINT (Primary Key)
- title: VARCHAR(255)
- subtitle: VARCHAR(255)
- content: TEXT
- excerpt: VARCHAR(500)
- cover_image: VARCHAR(500)
- tags: JSON (List<String>)
- author_id: BIGINT (Foreign Key → User)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### Comment
```sql
- id: BIGINT (Primary Key)
- content: TEXT
- author_id: BIGINT (Foreign Key → User)
- post_id: BIGINT (Foreign Key → BlogPost)
- parent_comment_id: BIGINT (Foreign Key → Comment, nullable)
- created_at: TIMESTAMP
```

#### Relationships
- **User ↔ BlogPost**: One-to-Many (author)
- **BlogPost ↔ Comment**: One-to-Many
- **Comment ↔ Comment**: One-to-Many (replies)
- **User ↔ Comment**: One-to-Many (author)
- **User ↔ User**: Many-to-Many (following via FollowRelationship)
- **User ↔ BlogPost**: Many-to-Many (saved posts via SavedPost)

---

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **MySQL 8.0**
- **Redis 7.0** (optional, for caching)
- **Docker & Docker Compose** (for containerized setup)

### 🔧 Local Development Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd blog-management-system/backend
```

#### 2. Environment Configuration

Copy the `.env` file and update the values:

```bash
cp .env.example .env  # If you have an example file
```

Update the following variables in `.env`:
```env
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/bms
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_base64_encoded_secret_key
JWT_EXPIRATION_MS=900000
JWT_REFRESH_EXPIRATION_MS=604800000

# Email Configuration (Gmail SMTP)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### 3. Database Setup

Create MySQL database:
```sql
CREATE DATABASE bms;
```

The application will automatically create tables using Hibernate DDL auto-update.

#### 4. Build and Run

```bash
# Build the application
mvn clean compile

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

#### 5. Verify Installation

- **API Documentation**: `http://localhost:8080/swagger-ui.html`
- **Health Check**: `http://localhost:8080/actuator/health`

### 🐳 Docker Setup (Recommended)

#### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

This will start:
- **MySQL database** on port 3306
- **Spring Boot application** on port 8080
- **Redis** (if configured) on port 6379

#### Manual Docker Build

```bash
# Build the image
docker build -t bms-backend .

# Run the container
docker run -p 8080:8080 --env-file .env bms-backend
```

---

## 🔧 Configuration

### Application Profiles

The application supports multiple profiles:

- **`dev`** (default): Development configuration with debug logging
- **`prod`**: Production configuration with optimized settings

Set profile using:
```bash
# Command line
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# Environment variable
export SPRING_PROFILES_ACTIVE=prod
mvn spring-boot:run
```

### Key Configuration Properties

#### Database (MySQL)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/bms
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: update  # Creates/updates tables automatically
    show-sql: true     # Logs SQL queries (dev only)
```

#### JWT Authentication
```yaml
jwt:
  secret: ${JWT_SECRET}                    # Base64 encoded secret
  expiration-ms: ${JWT_EXPIRATION_MS}      # Access token expiry (15 min)
  refresh-expiration-ms: ${JWT_REFRESH_EXPIRATION_MS}  # Refresh token expiry (7 days)
```

#### Email Configuration
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}  # Gmail App Password
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true
```

#### Redis Caching
```yaml
spring:
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      timeout: 60000
```

#### Google OAuth2
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: openid,email,profile
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Google OAuth
```http
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google_id_token_here"
}
```

### Blog Post Endpoints

#### Get All Posts (Public)
```http
GET /api/post?page=0&size=10
```

#### Create Post (Authenticated)
```http
POST /api/post
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "My Blog Post",
  "content": "<p>Blog content here...</p>",
  "tags": ["java", "spring-boot"]
}
```

#### Get Post by ID
```http
GET /api/post/{id}
```

### User Endpoints

#### Get Current User Profile
```http
GET /api/user/me
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /api/user/me
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "Updated bio"
}
```

### Comment Endpoints

#### Add Comment
```http
POST /api/comment
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "postId": 1,
  "content": "Great post!"
}
```

#### Get Comments for Post
```http
GET /api/comment/post/{postId}
```

### Social Features

#### Like Post
```http
POST /api/like/post/{postId}
Authorization: Bearer <jwt_token>
```

#### Follow User
```http
POST /api/follow/{username}
Authorization: Bearer <jwt_token>
```

#### Save Post
```http
POST /api/saved-posts/{postId}
Authorization: Bearer <jwt_token>
```

---

## 🔒 Security Features

### JWT Authentication
- **Access Tokens**: Short-lived (15 minutes) for API access
- **Refresh Tokens**: Long-lived (7 days) for token renewal
- **Secure storage**: Tokens stored in HTTP-only cookies (recommended)

### Authorization
- **Role-based access**: USER and ADMIN roles
- **Method-level security**: `@PreAuthorize` annotations
- **API protection**: All sensitive endpoints require authentication

### Data Protection
- **Password hashing**: BCrypt encryption
- **Input validation**: Bean validation with custom constraints
- **SQL injection prevention**: Parameterized queries via JPA
- **XSS protection**: Input sanitization

---

## 🧪 Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify
```

### Test Coverage
```bash
mvn test jacoco:report
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Configure production database
- [ ] Set secure JWT secrets
- [ ] Configure production email settings
- [ ] Set up Redis for caching
- [ ] Configure Cloudinary for image storage
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging

### Environment Variables for Production

```env
SPRING_PROFILES_ACTIVE=prod
DB_URL=jdbc:mysql://prod-db-host:3306/bms
DB_USERNAME=prod_user
DB_PASSWORD=secure_password
JWT_SECRET=strong_production_secret
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=secure_app_password
REDIS_HOST=redis-cluster
CLOUDINARY_CLOUD_NAME=your_prod_cloud
```

### Docker Production Deployment

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    image: bms-backend:latest
    environment:
      - SPRING_PROFILES_ACTIVE=prod
    env_file: .env.prod
    ports:
      - "8080:8080"
    depends_on:
      - db
      - redis

  db:
    image: mysql:8
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
      - MYSQL_DATABASE=bms
    volumes:
      - mysql_prod_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    volumes:
      - redis_prod_data:/data
```

---

## 🔍 Monitoring & Logging

### Health Checks
- **Application Health**: `/actuator/health`
- **Database Health**: `/actuator/health/db`
- **Redis Health**: `/actuator/health/redis`

### Metrics
- **JVM Metrics**: `/actuator/metrics/jvm.memory.used`
- **HTTP Metrics**: `/actuator/metrics/http.server.requests`
- **Database Metrics**: `/actuator/metrics/r2dbc.connections.active`

### Logging Configuration
```yaml
logging:
  level:
    com.felix.bms: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow **Java coding standards**
- Write **comprehensive tests**
- Update **documentation** for new features
- Use **meaningful commit messages**
- Ensure **code coverage** > 80%

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Spring Boot** team for the amazing framework
- **Medium** for inspiration
- **Open source community** for invaluable tools and libraries

---

## 📞 Support

For support, email support@readium.com or join our Discord community.

---

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic blog CRUD operations
- ✅ User authentication and profiles
- ✅ Comments and likes
- ✅ Social features (follow, save posts)

### Phase 2 (Next 3 months)
- 🔄 AI-powered writing assistance
- 🔄 Advanced search and filtering
- 🔄 Real-time notifications
- 🔄 Mobile app development

### Phase 3 (Future)
- 📊 Writer analytics dashboard
- 🤖 Smart content recommendations
- 💬 Advanced feedback system
- 🌐 Multi-language support

---

*Built with ❤️ using Spring Boot and modern Java practices*
```

---

# ⚙️ Setup Instructions

## 🔹 Backend Setup

### Prerequisites:

* Java 17
* Maven
* MySQL

### Steps:

```bash
# Clone the repository
git clone <your-backend-repo-link>
cd backend

# Run the application
mvn spring-boot:run
```

### Configure Database (application.properties):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blog_db
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
```

---

## 🔹 Frontend Setup

```bash
# Clone the repository
git clone <your-frontend-repo-link>
cd frontend

# Install dependencies
npm install

# Run the app
npm run dev
```

---

# 🔐 Environment Variables

### Backend

```
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
REFRESH_TOKEN_SECRET=
```

---

# 📡 API Overview

## 🔑 Auth APIs

* POST /api/auth/register
* POST /api/auth/login
* POST /api/auth/refresh

## 📝 Post APIs

* GET /api/post
* GET /api/post/{id}
* POST /api/post
* PUT /api/post/{id}
* DELETE /api/post/{id}

## 💬 Comment APIs

* GET /api/post/{id}/comment
* POST /api/post/{id}
* POST /api/post/{commentId}/reply

## ❤️ Like APIs

* POST /api/likes/post/{id}
* POST /api/likes/comment/{id}

## 👥 Follow APIs

* POST /api/follow/{userId}
* DELETE /api/follow/{userId}

---

# 🧠 Architecture Highlights

* Clean layered architecture (Controller → Service → Repository)
* DTO-based data transfer
* Centralized exception handling
* JWT-based stateless authentication
* Scalable and maintainable design

---

# 🚀 Future Improvements

* AI-based content suggestions
* Advanced search & filtering
* Notifications system
* Bookmarking posts
* Dark mode UI

---

# 👨‍💻 Author

**Your Name**

* GitHub: [https://github.com/felixxplore](https://github.com/felixxplore)
* LinkedIn: [https://www.linkedin.com/in/satyam-pawar-93a800218/](https://www.linkedin.com/in/satyam-pawar-93a800218/)

---

# ⭐ Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

# 📜 License

This project is open-source and available under the MIT License.
