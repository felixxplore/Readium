"use client";

import { use, useMemo } from "react";
import { motion } from "framer-motion";
import { Hash, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/shared/page-transition";
import { ArticleCard } from "@/components/articles/article-card";
import { Button } from "@/components/ui/button";
import { fakeArticles } from "@/lib/data";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default function TagPage({ params }: TagPageProps) {
  const { tag } = use(params);
  const decodedTag = decodeURIComponent(tag);

  const articles = useMemo(() => {
    return fakeArticles.filter((article) =>
      article.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase())
    );
  }, [decodedTag]);

  // Get related tags
  const relatedTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((article) => {
      article.tags.forEach((t) => {
        if (t.toLowerCase() !== decodedTag.toLowerCase()) {
          tags.add(t);
        }
      });
    });
    return Array.from(tags).slice(0, 10);
  }, [articles, decodedTag]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <PageTransition>
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Link */}
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            {/* Tag Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Hash className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-bold capitalize">
                    {decodedTag}
                  </h1>
                  <p className="text-muted-foreground">
                    {articles.length} {articles.length === 1 ? "article" : "articles"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Related Tags */}
            {relatedTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map((relatedTag) => (
                    <Link key={relatedTag} href={`/tag/${encodeURIComponent(relatedTag)}`}>
                      <Button variant="outline" size="sm" className="rounded-full">
                        {relatedTag}
                      </Button>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Articles */}
            {articles.length > 0 ? (
              <div className="space-y-8">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ArticleCard article={article} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Hash className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-serif font-bold mb-2">
                  No articles found
                </h2>
                <p className="text-muted-foreground mb-6">
                  There are no articles with this tag yet.
                </p>
                <Link href="/">
                  <Button>Browse all articles</Button>
                </Link>
              </motion.div>
            )}
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
