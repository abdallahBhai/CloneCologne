import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl text-primary font-bold tracking-tight">
          ScentMatch
        </Link>
        
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 transition-colors group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Search by clone or original..." 
              className="w-full h-10 pl-10 pr-4 rounded-full border border-border bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/clones" className="hover:text-primary transition-colors">All Clones</Link>
          <Link href="/brands" className="hover:text-primary transition-colors">By Brand</Link>
          <button className="relative p-2 hover:bg-secondary rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5 text-foreground" />
          </button>
        </nav>
      </div>
    </header>
  );
}
