"use client";

import Link from "next/link";
import { ShoppingBag, User, Heart } from "lucide-react";
import SearchEngine from "@/components/SearchEngine";

export default function Navigation() {
  return (
    <header className="w-full bg-white py-6 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Links (Left balance) */}
      <div className="w-1/3 hidden md:flex items-center gap-8">
         <Link href="/" className="text-xs font-medium tracking-wider uppercase text-[#555555] hover:text-black transition-colors">Home</Link>
         <Link href="/originals" className="text-xs font-medium tracking-wider uppercase text-[#555555] hover:text-black transition-colors">Originals</Link>
         <Link href="/dupes" className="text-xs font-medium tracking-wider uppercase text-[#555555] hover:text-black transition-colors">Dupes</Link>
      </div>

      {/* Center Logo */}
      <div className="w-full md:w-1/3 flex justify-center">
        <Link href="/" className="text-3xl md:text-4xl font-light tracking-widest text-[#222222] text-center uppercase">
          CloneCologne
        </Link>
      </div>

      {/* Right Icons */}
      <div className="w-auto md:w-1/3 flex justify-end items-center space-x-6 text-[#555555]">
        <div className="w-48 hidden md:block">
           <SearchEngine />
        </div>
        
        <button aria-label="Favorites" className="hover:text-black transition-colors hidden sm:block">
          <Heart className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <button aria-label="Account" className="hover:text-black transition-colors hidden sm:block">
          <User className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <button aria-label="Cart" className="hover:text-black transition-colors relative">
          <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
