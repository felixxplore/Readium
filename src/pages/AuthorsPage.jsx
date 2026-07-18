"use client";

import React, { useState } from "react";
import { Search, X, Menu } from "lucide-react";
import { AUTHORS_DATA } from "../lib/authors-data.js";

export default function AuthorsPage({
  onNavigate,
  onSignInClick,
  isAuthenticated,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = [
    "ALL",
    ...new Set(AUTHORS_DATA.map((author) => author.category)),
  ];

  const filteredAuthors = AUTHORS_DATA.filter((author) => {
    const matchesCategory =
      selectedCategory === "ALL" || author.category === selectedCategory;
    const matchesSearch =
      author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      TECHNOLOGY: "#C5A059",
      CULTURE: "#444748",
      DESIGN: "#1a1c1c",
      ESSAYS: "#666666",
      ARCHITECTURE: "#888888",
    };
    return colors[category] || "#C5A059";
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-[20px] border-b border-black/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="text-lg font-serif font-normal italic tracking-wide hover:opacity-70 transition-opacity cursor-pointer"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            LUMEN EDITORIAL
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate("home")}
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
            >
              Feed
            </button>
            <button
              onClick={() => onNavigate("authors")}
              className="text-xs uppercase tracking-widest font-medium border-b-2 border-black"
            >
              Authors
            </button>
            <a
              href="#"
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
            >
              Series
            </a>
            <button
              onClick={() => onNavigate("about")}
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
            >
              About
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={onSignInClick}
                className="text-xs font-medium text-gray-700 hover:text-black"
              >
                SIGN IN
              </button>
              <button className="px-6 py-2 bg-black text-white text-xs font-medium rounded-sm hover:bg-gray-900 transition-colors">
                WRITE
              </button>
            </div>

            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/10 mt-4 pt-4 space-y-3">
            <button
              onClick={() => {
                onNavigate("home");
                setMobileMenuOpen(false);
              }}
              className="block text-xs uppercase tracking-widest font-medium w-full text-left"
            >
              Feed
            </button>
            <button
              onClick={() => {
                onNavigate("authors");
                setMobileMenuOpen(false);
              }}
              className="block text-xs uppercase tracking-widest font-medium w-full text-left"
            >
              Authors
            </button>
            <a
              href="#"
              className="block text-xs uppercase tracking-widest font-medium text-gray-700"
            >
              Series
            </a>
            <button
              onClick={() => {
                onNavigate("about");
                setMobileMenuOpen(false);
              }}
              className="block text-xs uppercase tracking-widest font-medium text-gray-700 w-full text-left"
            >
              About
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1
            className="font-serif text-4xl md:text-5xl mb-4 text-black"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Our Contributors
          </h1>
          <p className="text-lg text-[#666] max-w-2xl">
            Meet the writers, thinkers, and creators behind Lumen Editorial.
            Each brings a unique perspective to contemporary culture, design,
            and ideas.
          </p>
        </div>

        <div className="mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-white border border-black/10 text-gray-700 hover:border-black/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            Showing {filteredAuthors.length} author
            {filteredAuthors.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredAuthors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAuthors.map((author) => (
              <div
                key={author.id}
                className="bg-white rounded-sm p-6 shadow-[0px_20px_40px_rgba(0,0,0,0.05)] hover:shadow-[0px_20px_40px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer group"
              >
                <div className="mb-4 rounded-sm overflow-hidden bg-gray-200 aspect-square">
                  {author.image ? (
                    <img
                      src={author.image}
                      alt={author.name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f3f3f3] to-[#e8e8e8] flex items-center justify-center">
                      <span className="text-4xl font-serif text-gray-400">
                        {author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h3
                    className="font-serif text-xl text-black mb-1"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {author.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    @{author.username}
                  </p>

                  <div className="mb-3">
                    <span
                      className="inline-block px-3 py-1 text-xs uppercase tracking-widest font-medium rounded-sm text-white"
                      style={{
                        backgroundColor: getCategoryColor(author.category),
                      }}
                    >
                      {author.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                    {author.bio}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/10">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                      Posts
                    </p>
                    <p className="text-lg font-semibold text-black">
                      {author.postCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                      Followers
                    </p>
                    <p className="text-lg font-semibold text-black">
                      {author.followCount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <button className="mt-4 w-full py-2 border border-black/20 text-black text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-black hover:text-white transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No authors found matching your search.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-black/10 mt-20 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p
                className="font-serif italic text-sm mb-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                LUMEN EDITORIAL
              </p>
              <p className="text-xs text-gray-500">
                Dedicated to the preservation of high-end digital craftsmanship.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-medium text-gray-900 mb-3">
                Navigation
              </p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>
                  <button
                    onClick={() => onNavigate("home")}
                    className="hover:text-black"
                  >
                    Feed
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("authors")}
                    className="hover:text-black"
                  >
                    Authors
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Series
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-medium text-gray-900 mb-3">
                Legal
              </p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>
                  <a href="#" className="hover:text-black">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-medium text-gray-900 mb-3">
                Connect
              </p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>
                  <a href="#" className="hover:text-black">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-black/10 pt-8">
            <p className="text-xs text-gray-500 text-center">
              © 2024 Lumen Editorial. All rights reserved. A publication
              dedicated to the preservation of high-end digital craftsmanship.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
