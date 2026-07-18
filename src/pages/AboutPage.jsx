"use client";

import React, { useState } from "react";
import { X, Menu } from "lucide-react";

export default function AboutPage({
  onNavigate,
  onSignInClick,
  isAuthenticated,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-black"
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
              className="text-xs uppercase tracking-widest font-medium border-b-2 border-black"
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

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1
            className="font-serif text-5xl md:text-6xl mb-6 text-black leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            About Lumen Editorial
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            A digital publication dedicated to the preservation and celebration
            of high-end craftsmanship in writing, design, and ideas.
          </p>
        </div>

        <section className="mb-16 pb-16 border-b border-black/10">
          <h2
            className="font-serif text-3xl mb-6 text-black"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Our Mission
          </h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Lumen Editorial exists to combat the noise of the digital age with
              thoughtful, intentionally-crafted journalism. In an era of
              infinite scroll and algorithmic feeds, we believe in the power of
              deep work, meaningful storytelling, and editorial excellence.
            </p>
            <p>
              We publish work by writers, designers, and thinkers who refuse to
              compromise on quality. Each piece is crafted with attention to
              detail, from the ideas themselves to the typography and spacing on
              the page.
            </p>
            <p>
              Our name—Lumen, Latin for light—reflects our belief that
              thoughtful ideas illuminate understanding. We&apos;re here to shed
              light on the topics that matter: technology, culture, design,
              philosophy, and the human condition.
            </p>
          </div>
        </section>

        <section className="mb-16 pb-16 border-b border-black/10">
          <h2
            className="font-serif text-3xl mb-10 text-black"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "Craftsmanship",
                description:
                  "Every word, every pixel, every interaction is intentional. We believe great work takes time and attention.",
              },
              {
                title: "Depth Over Speed",
                description:
                  "We reject the pressure to publish constantly. Instead, we focus on research, thought, and narrative excellence.",
              },
              {
                title: "Independence",
                description:
                  "Editorial independence is paramount. We publish ideas that matter, not ideas that sell.",
              },
              {
                title: "Design as Content",
                description:
                  "How something is presented matters as much as what is presented. Design informs meaning.",
              },
            ].map((value, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold text-black mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 pb-16 border-b border-black/10">
          <h2
            className="font-serif text-3xl mb-6 text-black"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Our Contributors
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Lumen Editorial is built by a diverse collective of writers,
            designers, and thinkers. Each contributor brings their own
            perspective and expertise to the publication.
          </p>
          <button
            onClick={() => onNavigate("authors")}
            className="px-6 py-3 bg-black text-white text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-gray-900 transition-colors"
          >
            Meet Our Contributors
          </button>
        </section>

        <section className="mb-16">
          <h2
            className="font-serif text-3xl mb-6 text-black"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Publishing Philosophy
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              We believe that great writing deserves great design. Every article
              on Lumen Editorial is typeset with care, with attention to line
              length, leading, and spacing. We use only high-quality fonts and
              maintain consistent visual hierarchy throughout.
            </p>
            <p>
              Our editorial process is rigorous. Every piece goes through
              multiple rounds of editing, fact-checking, and refinement. We work
              with writers to ensure their ideas are expressed with clarity and
              precision.
            </p>
            <p>
              We&apos;re committed to accessibility. All our content is
              optimized for readability on any device, with high contrast
              ratios, semantic HTML, and consideration for users with different
              abilities.
            </p>
            <p>
              We refuse to distract our readers. No auto-playing videos, no
              banner ads, no dark patterns. Just thoughtful content,
              well-designed and well-presented.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-sm p-10 shadow-[0px_20px_40px_rgba(0,0,0,0.05)]">
          <h2
            className="font-serif text-3xl mb-6 text-black"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Get In Touch
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Are you a writer, designer, or thinker with ideas worth sharing?
            We&apos;d love to hear from you.
          </p>
          <div className="space-y-4">
            <p className="text-gray-600">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:submissions@lumeneditorial.com"
                className="text-[#C5A059] hover:underline"
              >
                submissions@lumeneditorial.com
              </a>
            </p>
            <p className="text-gray-600">
              <strong>Twitter:</strong>{" "}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5A059] hover:underline"
              >
                @LumenEditorial
              </a>
            </p>
          </div>
        </section>
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
