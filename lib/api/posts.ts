import { refreshAccessToken } from '@/lib/api/auth'
import {
  getStoredTokens,
  isTokenExpired,
  updateStoredAccessToken,
} from '@/lib/auth/session'
import type { Article, ArticlePreview, Comment } from '@/types'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api').replace(/\/$/, '')

export interface AuthorSummary {
  id: number
  name: string
  username: string
  avatar: string
  bio: string
}

export interface CommentResponseDto {
  id: number
  content: string
  author: AuthorSummary
  createdAt: string
  replies: CommentResponseDto[]
}

export interface BlogPostResponseDto {
  id: number
  title: string
  subtitle: string
  content: string
  excerpt: string
  coverImage: string
  tags: string[]
  author: AuthorSummary
  createdAt: string
  updatedAt: string
  comments: CommentResponseDto[]
}

export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  totalElements: number
  totalPages: number
}

export interface SavedPostResponseDto {
  id: number
  postId: number
  title: string
  subtitle: string | null
  excerpt: string | null
  coverImage: string | null
  authorName: string
  authorUsername: string
  authorPicture: string | null
  postCreatedAt: string
  savedAt: string
}


function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function estimateReadTime(content: string) {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    const message = (payload as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return fallback
}

async function getAccessToken() {
  const { accessToken, refreshToken } = getStoredTokens()

  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken
  }

  if (refreshToken) {
    try {
      const refreshedTokens = await refreshAccessToken(refreshToken)
      updateStoredAccessToken(refreshedTokens.accessToken)
      return refreshedTokens.accessToken
    } catch {
      return null
    }
  }

  return null
}

async function apiRequest<T>(path: string, init: RequestInit = {}, requiresAuth = false) {
  const headers = new Headers(init.headers)

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (requiresAuth) {
    const token = await getAccessToken()
    if (!token) {
      throw new Error('Please sign in to continue')
    }

    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Request failed'))
  }

  return payload as T
}

function mapCommentDtoToComment(comment: CommentResponseDto, articleId: string): Comment {
  return {
    id: String(comment.id),
    articleId,
    author: {
      id: String(comment.author.id),
      username: comment.author.username,
      name: comment.author.name,
      avatar: comment.author.avatar,
    },
    content: comment.content,
    likes: 0,
    isLiked: false,
    replies: comment.replies.map(reply => mapCommentDtoToComment(reply, articleId)),
    createdAt: comment.createdAt,
  }
}

function mapPostDtoToArticle(post: BlogPostResponseDto): Article {
  return {
    id: String(post.id),
    slug: String(post.id),
    title: post.title,
    subtitle: post.subtitle,
    content: post.content,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    author: {
      id: String(post.author.id),
      username: post.author.username,
      name: post.author.name,
      avatar: post.author.avatar,
    },
    tags: post.tags,
    readTime: estimateReadTime(post.content),
    claps: 0,
    commentsCount: post.comments.length,
    isSaved: false,
    isClapped: false,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }
}

function mapPostDtoToPreview(post: BlogPostResponseDto): ArticlePreview {
  const article = mapPostDtoToArticle(post)

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    author: {
      id: article.author.id,
      username: article.author.username,
      name: article.author.name,
      avatar: article.author.avatar,
    },
    tags: article.tags,
    readTime: article.readTime,
    claps: article.claps,
    commentsCount: article.commentsCount,
    isSaved: article.isSaved,
    createdAt: article.createdAt,
  }
}

function mapSavedPostDtoToPreview(savedPost: SavedPostResponseDto): ArticlePreview {
  return {
    id: String(savedPost.postId),
    slug: String(savedPost.postId),
    title: savedPost.title,
    subtitle: savedPost.subtitle || '',
    excerpt: savedPost.excerpt || '',
    coverImage: savedPost.coverImage || '',
    author: {
      id: String(savedPost.id), // Using saved post id as author id for now
      username: savedPost.authorUsername,
      name: savedPost.authorName,
      avatar: savedPost.authorPicture || '',
    },
    tags: [], // Saved posts don't include tags in the response
    readTime: 1, // Default read time
    claps: 0, // Not provided in saved posts response
    commentsCount: 0, // Not provided in saved posts response
    isSaved: true, // These are saved posts
    createdAt: savedPost.postCreatedAt,
  }
}

export async function getAllPosts(page: number = 0, size: number = 10) {
  const response = await apiRequest<PageResponse<BlogPostResponseDto>>(
    `/post?page=${page}&size=${size}`,
    { method: 'GET' }
  )
  return {
    posts: response.content.map(mapPostDtoToPreview),
    totalPages: response.totalPages,
    totalElements: response.totalElements,
  }
}

export async function getMyPosts(page: number = 0, size: number = 10) {
  const response = await apiRequest<PageResponse<BlogPostResponseDto>>(
    `/post/my?page=${page}&size=${size}`,
    { method: 'GET' },
    true
  )
  return {
    posts: response.content.map(mapPostDtoToPreview),
    totalPages: response.totalPages,
    totalElements: response.totalElements,
  }
}

export interface SavedStatusResponse {
  saved: boolean
}

export async function getSavedPosts(page: number = 0, size: number = 10) {
  const response = await apiRequest<PageResponse<SavedPostResponseDto>>(
    `/saved-posts?page=${page}&size=${size}`,
    { method: 'GET' },
    true
  )
  return {
    posts: response.content.map(mapSavedPostDtoToPreview),
    totalPages: response.totalPages,
    totalElements: response.totalElements,
  }
}

export async function getSavedPostsByUser(username: string, page: number = 0, size: number = 10) {
  if (!username || username.trim() === '') {
    console.error('[API] getSavedPostsByUser: username is empty/undefined', { username })
    throw new Error('Username is required to fetch saved posts')
  }

  const response = await apiRequest<PageResponse<SavedPostResponseDto>>(
    `/saved-posts/user/${encodeURIComponent(username)}?page=${page}&size=${size}`,
    { method: 'GET' },
    true
  )

  return {
    posts: response.content.map(mapSavedPostDtoToPreview),
    totalPages: response.totalPages,
    totalElements: response.totalElements,
  }
}

export async function getSavedStatus(postId: number) {
  return apiRequest<SavedStatusResponse>(
    `/saved-posts/${postId}/is-saved`,
    { method: 'GET' },
    true
  )
}

export async function savePost(postId: number) {
  return apiRequest<void>(
    `/saved-posts/${postId}`,
    { method: 'POST' },
    true
  )
}

export async function getPostsByAuthor(username: string, page: number = 0, size: number = 10) {
  if (!username || username.trim() === '') {
    console.error('[API] getPostsByAuthor: username is empty/undefined', { username })
    throw new Error('Username is required to fetch author articles')
  }
  console.debug('[API] getPostsByAuthor: calling /post/author/' + username, { username, page, size })
  const response = await apiRequest<PageResponse<BlogPostResponseDto>>(
    `/post/author/${username}?page=${page}&size=${size}`,
    { method: 'GET' }
  )
  return {
    posts: response.content.map(mapPostDtoToPreview),
    totalPages: response.totalPages,
    totalElements: response.totalElements,
  }
}

export async function searchPosts(query: string, page: number = 0, size: number = 10) {
  const response = await apiRequest<PageResponse<BlogPostResponseDto>>(
    `/post/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
    { method: 'GET' }
  )
  return {
    posts: response.content.map(mapPostDtoToPreview),
    totalPages: response.totalPages,
    totalElements: response.totalElements,
  }
}

export async function getPostById(id: number) {
  const post = await apiRequest<BlogPostResponseDto>(`/post/${id}`, { method: 'GET' })
  return mapPostDtoToArticle(post)
}

export async function createPost(payload: {
  title: string
  subtitle: string
  excerpt: string
  coverImage: string
  tags: string[]
  content: string
}) {
  const post = await apiRequest<BlogPostResponseDto>(
    '/post',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    true
  )

  return mapPostDtoToArticle(post)
}

export async function updatePost(
  id: number,
  payload: {
    title: string
    subtitle: string
    excerpt: string
    coverImage: string
    tags: string[]
    content: string
  }
) {
  const post = await apiRequest<BlogPostResponseDto>(
    `/post/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    true
  )

  return mapPostDtoToArticle(post)
}

export async function deletePost(id: number) {
  return apiRequest<string>(`/post/${id}`, { method: 'DELETE' }, true)
}

export async function getCommentsOfPost(id: number, page: number = 0, size: number = 20) {
  const response = await apiRequest<PageResponse<CommentResponseDto>>(
    `/post/${id}/comment?page=${page}&size=${size}`,
    { method: 'GET' }
  )
  return {
    comments: response.content.map(comment => mapCommentDtoToComment(comment, String(id))),
    totalPages: response.totalPages,
    totalElements: response.totalElements,
  }
}

export async function addCommentToPost(id: number, content: string) {
  const comment = await apiRequest<CommentResponseDto>(
    `/post/${id}/comment`,
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    },
    true
  )

  return mapCommentDtoToComment(comment, String(id))
}

export async function addReplyToComment(commentId: number, content: string, articleId: string) {
  const reply = await apiRequest<CommentResponseDto>(
    `/post/comment/${commentId}/reply`,
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    },
    true
  )

  return mapCommentDtoToComment(reply, articleId)
}

export async function updateComment(postId: number, commentId: number, content: string) {
  const comment = await apiRequest<CommentResponseDto>(
    `/post/${postId}/comment/${commentId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ content }),
    },
    true
  )

  return mapCommentDtoToComment(comment, String(postId))
}

export async function deleteComment(postId: number, commentId: number) {
  return apiRequest<string>(`/post/${postId}/comment/${commentId}`, { method: 'DELETE' }, true)
}
