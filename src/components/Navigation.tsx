"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import SearchEngine from "@/components/SearchEngine";

export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
          Clone<span className="italic font-normal text-accent">Cologne</span>
        </Link>

        {/* Search Engine */}
        <div className="flex-1 max-w-lg mx-12 hidden md:block">
          <SearchEngine />
        </div>

        {/* Links */}
        <nav className="flex items-center gap-8 text-xs font-bold tracking-[0.1em] uppercase">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <Link href="/originals" className="hover:text-accent transition-colors">Originals</Link>
          <Link href="/dupes" className="hover:text-accent transition-colors">Dupes</Link>
          
          <div className="flex items-center gap-4 ml-4">
            <button className="p-2 hover:bg-secondary rounded-full transition-colors relative">
               <User className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors relative">
              <ShoppingBag className="w-5 h-5 text-foreground" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
