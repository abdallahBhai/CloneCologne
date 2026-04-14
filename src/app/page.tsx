import Navigation from "@/components/Navigation";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        
        {/* Hero / Banner Area */}
        <section className="bg-primary text-primary-foreground py-20 px-4 md:px-0 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-multiply" />
           <div className="container mx-auto max-w-5xl relative z-10 text-center">
             <h2 className="text-sm tracking-[0.3em] uppercase mb-6 font-bold text-secondary">The Digital Atelier</h2>
             <p className="font-serif text-5xl md:text-7xl leading-tight mb-8">
               Luxury scents. <br/><span className="text-secondary/80 italic">Uncompromised value.</span>
             </p>
             <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
               Discover identical DNA matches to the world's most exclusive and expensive designer fragrances, curated and tested by the community.
             </p>
           </div>
        </section>

        {/* Main Interface */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            <FilterBar />
            <ProductGrid />
          </div>
        </section>

      </main>
      
      <footer className="border-t border-border bg-secondary py-12 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-foreground/60">
          <p className="font-serif text-2xl text-primary font-bold tracking-tight mb-4">ScentMatch</p>
          <p>© {new Date().getFullYear()} ScentMatch Directory. Not affiliated with any designer brands.</p>
        </div>
      </footer>
    </>
  );
}
