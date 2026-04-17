"use client";

import Link from "next/link";
import SearchEngine from "@/components/SearchEngine";

export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 bg-background/40 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-20 grid grid-cols-2 md:grid-cols-3 items-center">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight justify-self-start">
          Clone<span className="italic font-normal text-accent">Cologne</span>
        </Link>

        {/* Links (Center) */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-xs font-bold tracking-[0.1em] uppercase">
          <Link href="/" className="hover:text-accent opacity-80 hover:opacity-100 transition-all">Home</Link>
          <Link href="/originals" className="hover:text-accent opacity-80 hover:opacity-100 transition-all">Originals</Link>
          <Link href="/dupes" className="hover:text-accent opacity-80 hover:opacity-100 transition-all">Dupes</Link>
          <Link href="/collections" className="hover:text-accent opacity-80 hover:opacity-100 transition-all">Collections</Link>
        </nav>

        {/* Search Engine and Sign In */}
        <div className="flex items-center justify-end gap-4 justify-self-end">
          <div className="hidden lg:block w-48 xl:w-64">
            <SearchEngine />
          </div>
          <button className="text-xs font-bold tracking-[0.1em] uppercase px-5 py-2.5 border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md text-foreground">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
