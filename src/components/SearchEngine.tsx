"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Search, X, Loader2, Star, Award, Command as CommandIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SearchEngine() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [debouncedSearch] = useDebounce(searchTerm, 300);

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Search Fetch — hybrid FTS + ILIKE fallback
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearch.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const supabase = getSupabaseClient();
      
      if (!supabase) {
        setIsSearching(false);
        return;
      }

      const selectCols = "id, name, brand, slug, is_clone, clone_of, clean_image_url, raw_image_url, rating_value";

      // Strategy 1: Postgres Full Text Search (best for multi-word relevance)
      const { data: ftsData } = await supabase
        .from("perfumes")
        .select(selectCols)
        .textSearch("search_vector", debouncedSearch, {
          config: "english",
          type: "websearch"
        })
        .limit(8);

      if (ftsData && ftsData.length > 0) {
        setResults(ftsData);
        setIsOpen(true);
        setIsSearching(false);
        return;
      }

      // Strategy 2: ILIKE fuzzy fallback for partial names, brands, notes
      const wildcard = `%${debouncedSearch.trim()}%`;
      const { data: fuzzyData } = await supabase
        .from("perfumes")
        .select(selectCols)
        .or(`name.ilike.${wildcard},brand.ilike.${wildcard},clone_of.ilike.${wildcard},top_notes.ilike.${wildcard},middle_notes.ilike.${wildcard},base_notes.ilike.${wildcard}`)
        .order("rating_count", { ascending: false })
        .limit(8);

      setResults(fuzzyData || []);
      setIsOpen(true);
      setIsSearching(false);
    };

    fetchResults();
  }, [debouncedSearch]);

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(`/compare/${results[selectedIndex].slug}`);
        setIsOpen(false);
      } else if (searchTerm.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        setIsOpen(false);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto z-50 group">
      {/* Search Input Container */}
      <div 
        className={`relative flex items-center w-full h-10 md:h-12 rounded-full border transition-all duration-300 ${
          isOpen ? "border-accent bg-secondary shadow-glass ring-1 ring-accent/20" : "border-border bg-white/5 backdrop-blur-sm hover:bg-white/10"
        }`}
      >
        <div className="flex items-center justify-center w-12 text-foreground/40 group-focus-within:text-accent">
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Search any perfume, brand, or note..."
          className="peer h-full w-full outline-none text-xs md:text-sm text-foreground bg-transparent placeholder:text-foreground/30 font-sans"
        />

        <div className="flex items-center gap-2 pr-4">
          {searchTerm && (
            <button 
              onClick={clearSearch} 
              className="p-1 hover:bg-secondary rounded-full text-foreground/40 hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-md text-[10px] font-bold text-foreground/30 uppercase tracking-tighter">
            <CommandIcon className="w-2.5 h-2.5" /> K
          </div>
        </div>
      </div>

      {/* Results Dropdown Overlay */}
      <AnimatePresence>
        {isOpen && (searchTerm.length >= 2) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute lg:top-14 top-12 right-0 w-full md:w-[400px] lg:w-[500px] bg-secondary/95 backdrop-blur-md rounded-2xl shadow-glass border border-white/10 overflow-hidden"
            ref={dropdownRef}
          >
            {results.length > 0 ? (
              <div className="p-2">
                <div className="px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-accent font-bold border-b border-border/20">
                  Quick Results
                </div>
                <ul>
                  {results.map((item, index) => (
                    <li key={item.id}>
                      <Link 
                        href={`/compare/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                          selectedIndex === index ? "bg-accent/10 border-accent/20" : "hover:bg-secondary/50"
                        }`}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className="w-12 h-12 relative rounded-lg bg-secondary/30 flex-shrink-0 overflow-hidden">
                          {(item.clean_image_url || item.raw_image_url) && (
                            <Image 
                              src={item.clean_image_url || item.raw_image_url} 
                              alt={item.name} 
                              fill 
                              className="object-contain p-1"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground truncate">{item.name}</span>
                            {item.is_clone && (
                              <span className="text-[8px] px-2 py-0.5 bg-accent/20 text-accent font-black uppercase tracking-widest rounded-full">
                                Dupe
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-foreground/40 uppercase tracking-wider block">{item.brand}</span>
                        </div>

                        {item.rating_value && (
                          <div className="flex items-center gap-1 text-accent pr-2">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-bold">{item.rating_value}</span>
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="p-3 bg-secondary/20 border-t border-border/20">
                  <button 
                    onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
                        setIsOpen(false);
                    }}
                    className="w-full py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-accent hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    View all matching scents
                    <Award className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : !isSearching && (
              <div className="p-12 text-center">
                <p className="font-serif italic text-lg text-foreground/40 mb-2">No scents found in the vault</p>
                <p className="text-[10px] uppercase tracking-widest text-accent font-bold">Try searching for notes or brands</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
