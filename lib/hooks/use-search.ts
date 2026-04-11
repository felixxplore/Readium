"use client";

import { useState, useCallback, useEffect } from "react";
import { searchPosts, getAllPosts } from "@/lib/api/posts";
import type { ArticlePreview } from "@/types";

export type SearchResultType = "article" | "user" | "tag";

export interface ArticleSearchResult {
  type: "article";
  article: ArticlePreview;
}

export type SearchResult = ArticleSearchResult;

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SearchResultType | "all">("all");

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    let isMounted = true;

    const performSearch = async () => {
      try {
        setIsSearching(true);
        const normalizedQuery = query.toLowerCase().trim();
        const searchResults: SearchResult[] = [];

        // Search articles using backend
        if (activeFilter === "all" || activeFilter === "article") {
          try {
            const { posts } = await searchPosts(normalizedQuery, 0, 20);
            searchResults.push(
              ...posts.map((article): ArticleSearchResult => ({
                type: "article",
                article,
              }))
            );
          } catch {
            // Fallback to getAllPosts if search endpoint fails
            try {
              const { posts } = await getAllPosts(0, 20);
              searchResults.push(
                ...posts
                  .filter(post => 
                    post.title.toLowerCase().includes(normalizedQuery) ||
                    post.excerpt.toLowerCase().includes(normalizedQuery) ||
                    post.subtitle.toLowerCase().includes(normalizedQuery) ||
                    post.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
                  )
                  .map((article): ArticleSearchResult => ({
                    type: "article",
                    article,
                  }))
              );
            } catch {
              // Silent fail
            }
          }
        }

        if (isMounted) {
          setResults(searchResults);
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };

    void performSearch();

    return () => {
      isMounted = false;
    };
  }, [query, activeFilter]);

  const articleResults = results.filter((r): r is ArticleSearchResult => r.type === "article");

  return {
    query,
    setQuery,
    results,
    articleResults,
    userResults: [],
    tagResults: [],
    isSearching,
    activeFilter,
    setActiveFilter,
    allTags: [],
  };
}
