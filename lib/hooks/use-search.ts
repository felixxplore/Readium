"use client";

import { useState, useMemo, useCallback } from "react";
import { fakeArticles, fakeUsers } from "@/lib/data";
import type { Article, User } from "@/types";

export type SearchResultType = "article" | "user" | "tag";

export interface SearchResult {
  type: SearchResultType;
  article?: Article;
  user?: User;
  tag?: string;
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SearchResultType | "all">("all");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    fakeArticles.forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  const search = useCallback(
    (searchQuery: string): SearchResult[] => {
      if (!searchQuery.trim()) return [];

      const normalizedQuery = searchQuery.toLowerCase().trim();
      const results: SearchResult[] = [];

      // Search articles
      if (activeFilter === "all" || activeFilter === "article") {
        fakeArticles.forEach((article) => {
          const titleMatch = article.title.toLowerCase().includes(normalizedQuery);
          const excerptMatch = article.excerpt.toLowerCase().includes(normalizedQuery);
          const tagMatch = article.tags.some((tag) =>
            tag.toLowerCase().includes(normalizedQuery)
          );

          if (titleMatch || excerptMatch || tagMatch) {
            results.push({ type: "article", article });
          }
        });
      }

      // Search users
      if (activeFilter === "all" || activeFilter === "user") {
        fakeUsers.forEach((user) => {
          const nameMatch = user.name.toLowerCase().includes(normalizedQuery);
          const usernameMatch = user.username.toLowerCase().includes(normalizedQuery);
          const bioMatch = user.bio?.toLowerCase().includes(normalizedQuery);

          if (nameMatch || usernameMatch || bioMatch) {
            results.push({ type: "user", user });
          }
        });
      }

      // Search tags
      if (activeFilter === "all" || activeFilter === "tag") {
        allTags.forEach((tag) => {
          if (tag.toLowerCase().includes(normalizedQuery)) {
            results.push({ type: "tag", tag });
          }
        });
      }

      return results;
    },
    [activeFilter, allTags]
  );

  const results = useMemo(() => {
    setIsSearching(true);
    const searchResults = search(query);
    setIsSearching(false);
    return searchResults;
  }, [query, search]);

  const articleResults = results.filter((r) => r.type === "article");
  const userResults = results.filter((r) => r.type === "user");
  const tagResults = results.filter((r) => r.type === "tag");

  return {
    query,
    setQuery,
    results,
    articleResults,
    userResults,
    tagResults,
    isSearching,
    activeFilter,
    setActiveFilter,
    allTags,
  };
}
