# Blog Management System - Readium

A modern, full-stack **Blog Management Platform** inspired by Medium, built with a focus on **clean architecture, scalability, and real-world backend/frontend practices**.

This platform allows users to **write, publish, and interact with blogs**, while also focusing on **improving the writing experience and user engagement**.

---

# 🌟 Unique Value Proposition

Unlike traditional blogging platforms, this system is designed not just for publishing content, but for **helping users become better writers**.

### 💡 Key Differentiators:

* ✍️ AI-Powered Writing Assistance *(planned)*
* 💬 Meaningful feedback system beyond simple likes *(planned)*
* 📊 Writer-focused analytics *(planned)*

> 🎯 Goal: Build a platform where users don’t just post content — they **grow as creators**.

---

# 🚀 Features

## 🔐 Authentication

* User Registration & Login
* JWT-based Authentication (Access + Refresh Token)
* Secure API access

## ✍️ Blog Management

* Create Blog Posts
* Update Blog Posts
* Delete Blog Posts (Admin-controlled)
* View all posts (public feed)
* View personal posts

## 💬 Comments System

* Add comments on posts
* Update/Delete comments
* Nested replies (threaded discussions)

## ❤️ Engagement

* Like/Unlike Posts
* Like/Unlike Comments

## 👤 User Features

* User Profile
* Follow / Unfollow Users

## 📄 Pagination

* Efficient data loading for posts

## 🧠 Upcoming Features (Planned)

* AI Writing Assistant
* Smart Feedback System (Insightful, Helpful, etc.)
* Writer Analytics Dashboard

---

# 🏗️ Tech Stack

## 🔹 Frontend

* React + TypeScript
* Tailwind CSS
* Redux Toolkit (State Management)
* React Query (Server State Management)
* Axios (API Handling)

## 🔹 Backend

* Java 17
* Spring Boot
* Spring Security
* JWT Authentication
* MySQL

---

# 📂 Backend Project Structure

```
config/        → Configuration classes
controller/    → REST APIs
dto/           → Data Transfer Objects
entity/        → Database Entities
enum/          → Enums (Roles, etc.)
exception/     → Global exception handling
mapper/        → Entity ↔ DTO mapping
repository/    → JPA repositories
service/       → Business logic
security/      → JWT & authentication logic
utils/         → Utility classes
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
