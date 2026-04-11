import type { Comment } from '@/types'
import { fakeUsers } from './fake-users'

export const fakeComments: Comment[] = [
  {
    id: 'comment-1',
    articleId: 'article-1',
    author: {
      id: fakeUsers[1].id,
      username: fakeUsers[1].username,
      name: fakeUsers[1].name,
      avatar: fakeUsers[1].avatar,
    },
    content: 'This is an excellent overview of the AI landscape! I especially appreciated the section on transformer architecture. Would love to see a follow-up article diving deeper into RAG systems.',
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: 'reply-1',
        commentId: 'comment-1',
        author: {
          id: fakeUsers[0].id,
          username: fakeUsers[0].username,
          name: fakeUsers[0].name,
          avatar: fakeUsers[0].avatar,
        },
        content: 'Thanks Alex! A deep dive into RAG is definitely on my list. Stay tuned!',
        likes: 8,
        isLiked: false,
        createdAt: '2024-01-15T14:30:00Z',
      },
    ],
    createdAt: '2024-01-15T12:00:00Z',
  },
  {
    id: 'comment-2',
    articleId: 'article-1',
    author: {
      id: fakeUsers[3].id,
      username: fakeUsers[3].username,
      name: fakeUsers[3].name,
      avatar: fakeUsers[3].avatar,
    },
    content: 'As someone working in ML, I can confirm that the pace of change is unprecedented. The section on implications for society is particularly important - we need more conversations about responsible AI development.',
    likes: 42,
    isLiked: true,
    replies: [],
    createdAt: '2024-01-15T16:00:00Z',
  },
  {
    id: 'comment-3',
    articleId: 'article-1',
    author: {
      id: fakeUsers[5].id,
      username: fakeUsers[5].username,
      name: fakeUsers[5].name,
      avatar: fakeUsers[5].avatar,
    },
    content: 'Great read! I would add that the emergence of AI coding assistants has been a game changer for developer productivity. GitHub Copilot and similar tools are changing how we write code daily.',
    likes: 18,
    isLiked: false,
    replies: [
      {
        id: 'reply-2',
        commentId: 'comment-3',
        author: {
          id: fakeUsers[7].id,
          username: fakeUsers[7].username,
          name: fakeUsers[7].name,
          avatar: fakeUsers[7].avatar,
        },
        content: 'Absolutely agree. Our team has seen a 30% increase in velocity since adopting AI coding tools. The key is knowing when to trust the suggestions and when to verify.',
        likes: 12,
        isLiked: false,
        createdAt: '2024-01-15T20:00:00Z',
      },
    ],
    createdAt: '2024-01-15T18:00:00Z',
  },
  {
    id: 'comment-4',
    articleId: 'article-2',
    author: {
      id: fakeUsers[6].id,
      username: fakeUsers[6].username,
      name: fakeUsers[6].name,
      avatar: fakeUsers[6].avatar,
    },
    content: 'This perfectly captures the challenges we faced when building our design system at Microsoft. The point about treating it as a product, not a project, is crucial. Too many teams underestimate the ongoing maintenance required.',
    likes: 35,
    isLiked: false,
    replies: [],
    createdAt: '2024-01-12T18:00:00Z',
  },
  {
    id: 'comment-5',
    articleId: 'article-2',
    author: {
      id: fakeUsers[0].id,
      username: fakeUsers[0].username,
      name: fakeUsers[0].name,
      avatar: fakeUsers[0].avatar,
    },
    content: 'Love the emphasis on design tokens! We recently migrated to a token-based system and the consistency improvements have been remarkable. Any recommendations for token naming conventions?',
    likes: 21,
    isLiked: false,
    replies: [
      {
        id: 'reply-3',
        commentId: 'comment-5',
        author: {
          id: fakeUsers[1].id,
          username: fakeUsers[1].username,
          name: fakeUsers[1].name,
          avatar: fakeUsers[1].avatar,
        },
        content: 'Great question! I follow a category-property-variant pattern, like color-background-primary. I will write a detailed post about this soon.',
        likes: 15,
        isLiked: false,
        createdAt: '2024-01-13T10:00:00Z',
      },
    ],
    createdAt: '2024-01-12T22:00:00Z',
  },
  {
    id: 'comment-6',
    articleId: 'article-3',
    author: {
      id: fakeUsers[4].id,
      username: fakeUsers[4].username,
      name: fakeUsers[4].name,
      avatar: fakeUsers[4].avatar,
    },
    content: 'As someone who covers the tech industry, I have interviewed dozens of founders about remote work. The companies that thrive remotely all share the same trait: they document everything obsessively.',
    likes: 56,
    isLiked: true,
    replies: [],
    createdAt: '2024-01-10T12:00:00Z',
  },
  {
    id: 'comment-7',
    articleId: 'article-3',
    author: {
      id: fakeUsers[8].id,
      username: fakeUsers[8].username,
      name: fakeUsers[8].name,
      avatar: fakeUsers[8].avatar,
    },
    content: 'Remote work has also had a significant positive impact on carbon emissions. Our calculations show that eliminating commutes can reduce an employee individual footprint by 20-30%.',
    likes: 38,
    isLiked: false,
    replies: [],
    createdAt: '2024-01-10T15:30:00Z',
  },
]

export const getCommentsByArticleId = (articleId: string): Comment[] => {
  return fakeComments.filter(comment => comment.articleId === articleId)
}
