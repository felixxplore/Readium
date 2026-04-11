import type { Article, ArticlePreview } from '@/types'
import { fakeUsers } from './fake-users'

const articleContents = {
  aiRevolution: `
<h2>The Dawn of a New Era</h2>
<p>Artificial Intelligence has moved from science fiction to everyday reality faster than anyone predicted. In 2024 alone, we witnessed breakthroughs that would have seemed impossible just five years ago.</p>
<p>From large language models that can write code and compose poetry to image generators that create photorealistic art from text descriptions, AI is transforming every industry it touches.</p>
<blockquote><p>"The question is no longer whether AI will change the world, but how we'll adapt to the changes it brings."</p></blockquote>
<h2>The Technical Revolution</h2>
<p>At the heart of this revolution is the <strong>transformer architecture</strong>, introduced in the seminal "Attention is All You Need" paper. This elegant solution to sequence-to-sequence learning has proven remarkably versatile.</p>
<p>Key developments include:</p>
<ul>
<li>Multi-modal models that understand text, images, and audio</li>
<li>Retrieval-augmented generation for more accurate responses</li>
<li>Fine-tuning techniques that make AI accessible to smaller organizations</li>
<li>Chain-of-thought prompting for complex reasoning tasks</li>
</ul>
<h2>Implications for Society</h2>
<p>As AI capabilities grow, so do questions about its impact on employment, creativity, and human agency. We must navigate these challenges thoughtfully, ensuring that AI augments rather than replaces human potential.</p>
<p>The companies and individuals who thrive in this new landscape will be those who learn to collaborate effectively with AI, using it as a tool to amplify their unique human capabilities.</p>
`,
  designSystems: `
<h2>Why Design Systems Matter</h2>
<p>In today's fast-paced product development environment, <strong>design systems</strong> have become essential for maintaining consistency and efficiency across large applications.</p>
<p>A well-crafted design system serves as a single source of truth, enabling designers and developers to work in harmony while delivering cohesive user experiences.</p>
<h2>Core Components</h2>
<p>Every robust design system includes:</p>
<ol>
<li><strong>Design Tokens</strong> - The atomic values that define your visual language</li>
<li><strong>Component Library</strong> - Reusable UI elements with documented APIs</li>
<li><strong>Pattern Library</strong> - Common solutions to recurring design problems</li>
<li><strong>Documentation</strong> - Clear guidelines for implementation and usage</li>
</ol>
<blockquote><p>"A design system isn't a project. It's a product serving products."</p></blockquote>
<h2>Building for Scale</h2>
<p>The key to a successful design system is treating it as a living product. This means:</p>
<ul>
<li>Regular maintenance and updates</li>
<li>Clear versioning and changelog</li>
<li>Feedback loops with consumers</li>
<li>Governance and contribution guidelines</li>
</ul>
<p>When done right, design systems dramatically reduce development time while improving product quality and user satisfaction.</p>
`,
  remoteWork: `
<h2>The Remote Revolution</h2>
<p>The global shift to remote work has fundamentally changed how we think about employment, productivity, and work-life balance. What started as a necessity has become a preference for millions of workers worldwide.</p>
<h2>Productivity Myths Debunked</h2>
<p>Contrary to initial fears, remote work has proven to <em>increase</em> productivity for many knowledge workers. Studies consistently show:</p>
<ul>
<li>Fewer interruptions and distractions</li>
<li>Eliminated commute time repurposed for work</li>
<li>Greater autonomy and job satisfaction</li>
<li>Access to global talent pools</li>
</ul>
<h2>Building Remote Culture</h2>
<p>The challenge lies not in productivity, but in maintaining <strong>culture and connection</strong>. Successful remote organizations invest heavily in:</p>
<ol>
<li>Asynchronous communication tools and practices</li>
<li>Regular virtual social events</li>
<li>Clear documentation and knowledge sharing</li>
<li>Periodic in-person gatherings</li>
</ol>
<blockquote><p>"Remote work doesn't mean working alone. It means working differently."</p></blockquote>
<p>As we move forward, the most successful companies will be those that embrace hybrid models, giving employees the flexibility to work where they're most effective.</p>
`,
  webPerformance: `
<h2>Performance is User Experience</h2>
<p>In an era of instant gratification, web performance has become a critical differentiator. Users expect pages to load in under 2 seconds, and every additional second of delay increases bounce rates dramatically.</p>
<h2>Core Web Vitals</h2>
<p>Google's Core Web Vitals provide a framework for measuring user experience:</p>
<ul>
<li><strong>LCP (Largest Contentful Paint)</strong> - Loading performance</li>
<li><strong>FID (First Input Delay)</strong> - Interactivity</li>
<li><strong>CLS (Cumulative Layout Shift)</strong> - Visual stability</li>
</ul>
<h2>Optimization Strategies</h2>
<p>Modern performance optimization involves multiple layers:</p>
<pre><code>// Example: Dynamic imports for code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => &lt;Skeleton /&gt;,
  ssr: false
});</code></pre>
<p>Key techniques include:</p>
<ol>
<li>Code splitting and lazy loading</li>
<li>Image optimization and modern formats (WebP, AVIF)</li>
<li>Edge caching and CDN distribution</li>
<li>Server-side rendering and static generation</li>
</ol>
<p>Remember: <em>the fastest code is the code that never runs</em>. Always question whether you need that additional library or feature.</p>
`,
  dataVisualization: `
<h2>The Art of Showing Data</h2>
<p>Data visualization is the bridge between raw information and human understanding. A well-designed chart can reveal patterns and insights that would be invisible in a spreadsheet.</p>
<blockquote><p>"The greatest value of a picture is when it forces us to notice what we never expected to see." — John Tukey</p></blockquote>
<h2>Choosing the Right Chart</h2>
<p>The first step in any visualization is selecting the appropriate chart type:</p>
<ul>
<li><strong>Bar charts</strong> - Comparing discrete categories</li>
<li><strong>Line charts</strong> - Showing trends over time</li>
<li><strong>Scatter plots</strong> - Revealing correlations</li>
<li><strong>Heat maps</strong> - Displaying density or intensity</li>
</ul>
<h2>Design Principles</h2>
<p>Effective data visualization follows key principles:</p>
<ol>
<li><strong>Clarity over decoration</strong> - Remove chartjunk</li>
<li><strong>Appropriate scale</strong> - Don't mislead with axes</li>
<li><strong>Color with purpose</strong> - Use color to encode meaning</li>
<li><strong>Accessibility</strong> - Consider colorblind users</li>
</ol>
<p>Tools like D3.js, Chart.js, and Recharts make it easier than ever to create beautiful, interactive visualizations. But remember: <em>the tool is secondary to the story you're trying to tell</em>.</p>
`,
}

export const fakeArticles: Article[] = [
  {
    id: 'article-1',
    slug: 'the-ai-revolution-transforming-software-development',
    title: 'The AI Revolution: Transforming Software Development',
    subtitle: 'How artificial intelligence is reshaping the way we build software in 2024 and beyond',
    content: articleContents.aiRevolution,
    excerpt: 'Artificial Intelligence has moved from science fiction to everyday reality faster than anyone predicted. From large language models to image generators, AI is transforming every industry.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    author: fakeUsers[0],
    tags: ['AI', 'Machine Learning', 'Technology', 'Software Development'],
    readTime: 8,
    claps: 2450,
    commentsCount: 89,
    isSaved: false,
    isClapped: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'article-2',
    slug: 'building-scalable-design-systems',
    title: 'Building Scalable Design Systems',
    subtitle: 'A comprehensive guide to creating design systems that grow with your product',
    content: articleContents.designSystems,
    excerpt: 'A well-crafted design system serves as a single source of truth, enabling designers and developers to work in harmony while delivering cohesive user experiences.',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    author: fakeUsers[1],
    tags: ['Design', 'UI/UX', 'Design Systems', 'Product'],
    readTime: 6,
    claps: 1820,
    commentsCount: 45,
    isSaved: true,
    isClapped: false,
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
  },
  {
    id: 'article-3',
    slug: 'future-of-remote-work',
    title: 'The Future of Remote Work: Beyond the Home Office',
    subtitle: 'Exploring how distributed teams are redefining workplace culture and productivity',
    content: articleContents.remoteWork,
    excerpt: 'The global shift to remote work has fundamentally changed how we think about employment, productivity, and work-life balance.',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
    author: fakeUsers[2],
    tags: ['Remote Work', 'Productivity', 'Culture', 'Future of Work'],
    readTime: 7,
    claps: 3200,
    commentsCount: 112,
    isSaved: false,
    isClapped: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'article-4',
    slug: 'web-performance-optimization-guide',
    title: 'Web Performance Optimization: A Complete Guide',
    subtitle: 'Essential techniques for building lightning-fast web applications',
    content: articleContents.webPerformance,
    excerpt: 'In an era of instant gratification, web performance has become a critical differentiator. Users expect pages to load in under 2 seconds.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    author: fakeUsers[5],
    tags: ['Web Development', 'Performance', 'JavaScript', 'Optimization'],
    readTime: 10,
    claps: 1560,
    commentsCount: 67,
    isSaved: false,
    isClapped: false,
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-08T16:45:00Z',
  },
  {
    id: 'article-5',
    slug: 'mastering-data-visualization',
    title: 'Mastering Data Visualization',
    subtitle: 'How to tell compelling stories with data through effective visual design',
    content: articleContents.dataVisualization,
    excerpt: 'Data visualization is the bridge between raw information and human understanding. A well-designed chart can reveal patterns invisible in spreadsheets.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    author: fakeUsers[3],
    tags: ['Data Science', 'Visualization', 'Design', 'Analytics'],
    readTime: 9,
    claps: 2100,
    commentsCount: 54,
    isSaved: true,
    isClapped: false,
    createdAt: '2024-01-05T11:20:00Z',
    updatedAt: '2024-01-05T11:20:00Z',
  },
  {
    id: 'article-6',
    slug: 'startup-funding-landscape-2024',
    title: 'The Startup Funding Landscape in 2024',
    subtitle: 'What founders need to know about raising capital in the current market',
    content: articleContents.remoteWork,
    excerpt: 'The venture capital landscape has shifted dramatically. Here is what founders need to know about raising capital in 2024.',
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop',
    author: fakeUsers[4],
    tags: ['Startups', 'Venture Capital', 'Entrepreneurship', 'Funding'],
    readTime: 11,
    claps: 4500,
    commentsCount: 156,
    isSaved: false,
    isClapped: false,
    createdAt: '2024-01-03T09:15:00Z',
    updatedAt: '2024-01-03T09:15:00Z',
  },
  {
    id: 'article-7',
    slug: 'accessibility-in-modern-web-design',
    title: 'Accessibility in Modern Web Design',
    subtitle: 'Building inclusive digital experiences for all users',
    content: articleContents.designSystems,
    excerpt: 'Accessibility is not just a legal requirement—it is a moral imperative and a business opportunity. Learn how to build inclusive web experiences.',
    coverImage: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=600&fit=crop',
    author: fakeUsers[6],
    tags: ['Accessibility', 'Web Design', 'Inclusive Design', 'UX'],
    readTime: 8,
    claps: 1890,
    commentsCount: 42,
    isSaved: false,
    isClapped: false,
    createdAt: '2024-01-01T13:00:00Z',
    updatedAt: '2024-01-01T13:00:00Z',
  },
  {
    id: 'article-8',
    slug: 'engineering-leadership-lessons',
    title: 'Lessons Learned in Engineering Leadership',
    subtitle: 'From individual contributor to engineering manager: a personal journey',
    content: articleContents.remoteWork,
    excerpt: 'The transition from IC to manager is one of the most challenging career shifts in tech. Here are the lessons I learned along the way.',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    author: fakeUsers[7],
    tags: ['Leadership', 'Engineering', 'Management', 'Career'],
    readTime: 12,
    claps: 2800,
    commentsCount: 98,
    isSaved: true,
    isClapped: true,
    createdAt: '2023-12-28T15:30:00Z',
    updatedAt: '2023-12-28T15:30:00Z',
  },
  {
    id: 'article-9',
    slug: 'climate-tech-opportunities',
    title: 'Climate Tech: The Biggest Opportunity of Our Generation',
    subtitle: 'Why sustainable technology is the most impactful career path you can choose',
    content: articleContents.aiRevolution,
    excerpt: 'Climate change is the defining challenge of our time. Climate tech offers the opportunity to build solutions that matter.',
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=600&fit=crop',
    author: fakeUsers[8],
    tags: ['Climate Tech', 'Sustainability', 'Environment', 'Technology'],
    readTime: 9,
    claps: 3600,
    commentsCount: 134,
    isSaved: false,
    isClapped: false,
    createdAt: '2023-12-25T10:45:00Z',
    updatedAt: '2023-12-25T10:45:00Z',
  },
  {
    id: 'article-10',
    slug: 'cybersecurity-best-practices',
    title: 'Cybersecurity Best Practices for 2024',
    subtitle: 'Essential security measures every organization should implement',
    content: articleContents.webPerformance,
    excerpt: 'In an increasingly connected world, cybersecurity has never been more important. Here are the essential practices for staying safe.',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
    author: fakeUsers[9],
    tags: ['Cybersecurity', 'Security', 'Technology', 'Best Practices'],
    readTime: 10,
    claps: 2200,
    commentsCount: 76,
    isSaved: false,
    isClapped: false,
    createdAt: '2023-12-22T12:00:00Z',
    updatedAt: '2023-12-22T12:00:00Z',
  },
  {
    id: 'article-11',
    slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns for Large Applications',
    subtitle: 'Type-safe patterns that scale with your codebase',
    content: articleContents.webPerformance,
    excerpt: 'TypeScript has become the standard for large JavaScript applications. Learn the advanced patterns that make codebases maintainable.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
    author: fakeUsers[5],
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Web Development'],
    readTime: 14,
    claps: 1980,
    commentsCount: 63,
    isSaved: false,
    isClapped: false,
    createdAt: '2023-12-20T09:00:00Z',
    updatedAt: '2023-12-20T09:00:00Z',
  },
  {
    id: 'article-12',
    slug: 'product-market-fit-guide',
    title: 'Finding Product-Market Fit: A Practical Guide',
    subtitle: 'The essential framework for validating your startup idea',
    content: articleContents.remoteWork,
    excerpt: 'Product-market fit is the holy grail of startups. Here is a practical framework for finding and measuring it.',
    coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=600&fit=crop',
    author: fakeUsers[2],
    tags: ['Startups', 'Product', 'Strategy', 'Entrepreneurship'],
    readTime: 8,
    claps: 2650,
    commentsCount: 87,
    isSaved: false,
    isClapped: false,
    createdAt: '2023-12-18T14:00:00Z',
    updatedAt: '2023-12-18T14:00:00Z',
  },
]

export const getArticlePreview = (article: Article): ArticlePreview => ({
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
})

export const getArticleBySlug = (slug: string): Article | undefined => {
  return fakeArticles.find(article => article.slug === slug)
}

export const getArticlesByAuthor = (username: string): ArticlePreview[] => {
  return fakeArticles
    .filter(article => article.author.username === username)
    .map(getArticlePreview)
}

export const getArticlesByTag = (tag: string): ArticlePreview[] => {
  return fakeArticles
    .filter(article => article.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
    .map(getArticlePreview)
}

export const searchArticles = (query: string): ArticlePreview[] => {
  const lowercaseQuery = query.toLowerCase()
  return fakeArticles
    .filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.subtitle.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
    .map(getArticlePreview)
}

export const trendingTags = [
  'AI',
  'Machine Learning',
  'Web Development',
  'Design',
  'Startups',
  'Remote Work',
  'TypeScript',
  'React',
]
