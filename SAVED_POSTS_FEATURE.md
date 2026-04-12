# Saved Posts Feature - API Documentation

## Overview
Users can now save blog posts for later reading. This feature allows users to maintain a personal collection of saved posts with pagination support.

## Entity Structure

### SavedPost Entity
```java
@Entity
@Table(name = "saved_posts", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"}))
public class SavedPost {
    - id: Long (Primary Key)
    - user: User (Foreign Key) - The user who saved the post
    - post: BlogPost (Foreign Key) - The post being saved
    - createdAt: LocalDateTime - Timestamp when the post was saved
}
```

**Database Details:**
- Table: `saved_posts`
- Unique Constraint: `(user_id, post_id)` - Prevents duplicate saves
- Each user can only save each post once

## API Endpoints

### 1. Save a Post
**Endpoint:** `POST /api/saved-posts/{postId}`
**Authentication:** Required (JWT Token)
**Permission:** Any authenticated user

**Request:**
```
POST /api/saved-posts/123
Authorization: Bearer <jwt_token>
```

**Response (201 Created):**
```json
{
  "id": 1,
  "postId": 123,
  "title": "Understanding Spring Boot",
  "subtitle": "A beginner's guide",
  "excerpt": "Learn the basics of Spring Boot...",
  "coverImage": "https://...",
  "authorName": "John Doe",
  "authorUsername": "johndoe",
  "authorPicture": "https://...",
  "postCreatedAt": "2026-04-10T10:30:00",
  "savedAt": "2026-04-12T15:45:00"
}
```

**Error Responses:**
- `404 Not Found` - Post or user not found
- `400 Bad Request` - Post already saved by user

---

### 2. Unsave a Post
**Endpoint:** `DELETE /api/saved-posts/{postId}`
**Authentication:** Required (JWT Token)
**Permission:** Only the user who saved it can unsave

**Request:**
```
DELETE /api/saved-posts/123
Authorization: Bearer <jwt_token>
```

**Response (204 No Content):**
```
(empty body)
```

**Error Responses:**
- `404 Not Found` - Post not found or not in saved list

---

### 3. Get Current User's Saved Posts
**Endpoint:** `GET /api/saved-posts?page=0&size=10`
**Authentication:** Required (JWT Token)
**Permission:** Only current user can view their own

**Request:**
```
GET /api/saved-posts?page=0&size=10
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional, default=0): Page number (0-indexed)
- `size` (optional, default=10): Number of posts per page

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "postId": 123,
      "title": "Understanding Spring Boot",
      "subtitle": "A beginner's guide",
      "excerpt": "Learn the basics of Spring Boot...",
      "coverImage": "https://...",
      "authorName": "John Doe",
      "authorUsername": "johndoe",
      "authorPicture": "https://...",
      "postCreatedAt": "2026-04-10T10:30:00",
      "savedAt": "2026-04-12T15:45:00"
    },
    {
      "id": 2,
      "postId": 124,
      "title": "Advanced Spring Security",
      "subtitle": "JWT Authentication",
      "excerpt": "Deep dive into Spring Security...",
      "coverImage": "https://...",
      "authorName": "Jane Smith",
      "authorUsername": "janesmith",
      "authorPicture": "https://...",
      "postCreatedAt": "2026-04-08T14:20:00",
      "savedAt": "2026-04-11T09:15:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 3,
  "totalElements": 28,
  "last": false,
  "size": 10,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "first": true,
  "numberOfElements": 10,
  "empty": false
}
```

---

### 4. Get Specific User's Saved Posts (Public)
**Endpoint:** `GET /api/saved-posts/user/{username}?page=0&size=10`
**Authentication:** Not required
**Permission:** Anyone can view (public posts)

**Request:**
```
GET /api/saved-posts/user/johndoe?page=0&size=10
```

**Query Parameters:**
- `page` (optional, default=0): Page number (0-indexed)
- `size` (optional, default=10): Number of posts per page

**Response (200 OK):**
Same as endpoint #3 - paginated list of saved posts

---

### 5. Check if Post is Saved
**Endpoint:** `GET /api/saved-posts/{postId}/is-saved`
**Authentication:** Required (JWT Token)
**Permission:** Current user only

**Request:**
```
GET /api/saved-posts/123/is-saved
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
true
```
or
```json
false
```

**Error Responses:**
- `404 Not Found` - Post or user not found

---

### 6. Get User's Saved Posts Count
**Endpoint:** `GET /api/saved-posts/count`
**Authentication:** Required (JWT Token)
**Permission:** Current user only

**Request:**
```
GET /api/saved-posts/count
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
42
```

---

### 7. Get Post's Total Save Count
**Endpoint:** `GET /api/saved-posts/{postId}/save-count`
**Authentication:** Not required
**Permission:** Public - anyone can view

**Request:**
```
GET /api/saved-posts/123/save-count
```

**Response (200 OK):**
```json
156
```

**Error Responses:**
- `404 Not Found` - Post not found

---

## Usage Examples

### JavaScript (Frontend)

```javascript
// 1. Save a post
async function savePost(postId, token) {
  const response = await fetch(`/api/saved-posts/${postId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
}

// 2. Unsave a post
async function unsavePost(postId, token) {
  await fetch(`/api/saved-posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

// 3. Get current user's saved posts
async function getSavedPosts(page = 0, size = 10, token) {
  const response = await fetch(`/api/saved-posts?page=${page}&size=${size}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
}

// 4. Get specific user's saved posts
async function getUserSavedPosts(username, page = 0, size = 10) {
  const response = await fetch(`/api/saved-posts/user/${username}?page=${page}&size=${size}`);
  return await response.json();
}

// 5. Check if post is saved
async function isPostSaved(postId, token) {
  const response = await fetch(`/api/saved-posts/${postId}/is-saved`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
}

// 6. Get user's saved posts count
async function getSavedPostsCount(token) {
  const response = await fetch(`/api/saved-posts/count`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
}

// 7. Get post's save count
async function getPostSaveCount(postId) {
  const response = await fetch(`/api/saved-posts/${postId}/save-count`);
  return await response.json();
}
```

### cURL Examples

```bash
# 1. Save a post
curl -X POST http://localhost:8080/api/saved-posts/123 \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Unsave a post
curl -X DELETE http://localhost:8080/api/saved-posts/123 \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Get current user's saved posts
curl -X GET "http://localhost:8080/api/saved-posts?page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Get specific user's saved posts
curl -X GET "http://localhost:8080/api/saved-posts/user/johndoe?page=0&size=10"

# 5. Check if post is saved
curl -X GET http://localhost:8080/api/saved-posts/123/is-saved \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Get saved posts count
curl -X GET http://localhost:8080/api/saved-posts/count \
  -H "Authorization: Bearer YOUR_TOKEN"

# 7. Get post's save count
curl -X GET http://localhost:8080/api/saved-posts/123/save-count
```

## Database Migration

Run this SQL to create the saved_posts table:

```sql
CREATE TABLE saved_posts (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post (user_id, post_id),
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_post (post_id)
);
```

## Features & Benefits

✅ **Duplicate Prevention** - Users cannot save the same post twice (unique constraint)
✅ **Pagination Support** - Efficient retrieval of saved posts with customizable page size
✅ **Timestamps** - Track when each post was saved
✅ **Public Profiles** - View other users' saved posts
✅ **Quick Checks** - Instantly check if a post is saved
✅ **Statistics** - Get count of saves per post and user

## Security Notes

- All save/unsave operations require authentication
- Users can only unsave their own posts
- Public endpoints don't reveal user identity for saved posts
- JWT token required for personal saved posts retrieval
