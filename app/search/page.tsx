"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, User, Hash } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/shared/page-transition";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/articles/article-card";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ArticleCardSkeleton } from "@/components/shared/loading-skeleton";
import { useSearch, type SearchResultType } from "@/lib/hooks/use-search";
import Link from "next/link";

const filters: { value: SearchResultType | "all"; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All", icon: <Search className="h-4 w-4" /> },
  { value: "article", label: "Articles", icon: <FileText className="h-4 w-4" /> },
  { value: "user", label: "People", icon: <User className="h-4 w-4" /> },
  { value: "tag", label: "Tags", icon: <Hash className="h-4 w-4" /> },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const {
    query,
    setQuery,
    articleResults,
    userResults,
    tagResults,
    isSearching,
    activeFilter,
    setActiveFilter,
    allTags,
  } = useSearch();

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery, setQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const hasResults =
    articleResults.length > 0 || userResults.length > 0 || tagResults.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <PageTransition>
        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Search Header */}
            <div className="mb-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles, people, and tags..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
                />
              </form>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={activeFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.value)}
                  className="rounded-full flex items-center gap-2"
                >
                  {filter.icon}
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {isSearching ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {[1, 2, 3].map((i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </motion.div>
              ) : query && !hasResults ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16"
                >
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-serif font-bold mb-2">No results found</h2>
                  <p className="text-muted-foreground">
                    Try searching for something else or check your spelling.
                  </p>
                </motion.div>
              ) : query ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {/* Article Results */}
                  {(activeFilter === "all" || activeFilter === "article") &&
                    articleResults.length > 0 && (
                      <section>
                        {activeFilter === "all" && (
                          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Articles ({articleResults.length})
                          </h2>
                        )}
                        <div className="space-y-6">
                          {articleResults.map((result, index) => (
                            <motion.div
                              key={result.article?.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              {result.article && <ArticleCard article={result.article} />}
                            </motion.div>
                          ))}
                        </div>
                      </section>
                    )}

                  {/* User Results */}
                  {(activeFilter === "all" || activeFilter === "user") &&
                    userResults.length > 0 && (
                      <section>
                        {activeFilter === "all" && (
                          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            People ({userResults.length})
                          </h2>
                        )}
                        <div className="grid gap-4">
                          {userResults.map((result, index) => (
                            <motion.div
                              key={result.user?.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              {result.user && (
                                <Link href={`/profile/${result.user.username}`}>
                                  <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <UserAvatar user={result.user} size="lg" />
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold truncate">
                                        {result.user.name}
                                      </h3>
                                      <p className="text-sm text-muted-foreground truncate">
                                        @{result.user.username}
                                      </p>
                                      {result.user.bio && (
                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                          {result.user.bio}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {result.user.followersCount.toLocaleString()} followers
                                    </div>
                                  </div>
                                </Link>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </section>
                    )}

                  {/* Tag Results */}
                  {(activeFilter === "all" || activeFilter === "tag") &&
                    tagResults.length > 0 && (
                      <section>
                        {activeFilter === "all" && (
                          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Hash className="h-5 w-5" />
                            Tags ({tagResults.length})
                          </h2>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {tagResults.map((result, index) => (
                            <motion.div
                              key={result.tag}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link href={`/search?q=${encodeURIComponent(result.tag || "")}`}>
                                <Button variant="outline" className="rounded-full">
                                  <Hash className="h-4 w-4 mr-1" />
                                  {result.tag}
                                </Button>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </section>
                    )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {/* Trending Tags */}
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Explore Topics
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 20).map((tag) => (
                        <Link
                          key={tag}
                          href={`/search?q=${encodeURIComponent(tag)}`}
                          onClick={() => setQuery(tag)}
                        >
                          <Button variant="outline" className="rounded-full">
                            {tag}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1">
            <div className="max-w-3xl mx-auto px-4 py-8">
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
