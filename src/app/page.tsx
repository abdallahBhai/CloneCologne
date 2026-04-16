import Navigation from "@/components/Navigation";
import PerfumeCard from "@/components/PerfumeCard";
import { getSupabaseClient } from "@/lib/supabase";
import { ArrowRight, Star, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

async function getHomeData() {
  const supabase = getSupabaseClient();
  if (!supabase) return { trending: [], popularDupes: [], newArrivals: [] };

  // 1. Trending: Top 5 Originals by Rating Count
  const { data: trending } = await supabase
    .from("perfumes")
    .select("*")
    .eq("is_clone", false)
    .order("rating_count", { ascending: false })
    .limit(10);

  // 2. Popular Dupes: Clones sorted by Rating Value
  const { data: popularDupes } = await supabase
    .from("perfumes")
    .select("*")
    .eq("is_clone", true)
    .order("rating_value", { ascending: false })
    .limit(8);

  // 3. New Arrivals: 4 most recent
  const { data: newArrivals } = await supabase
    .from("perfumes")
    .select("*")
    .order("year", { ascending: false })
    .limit(4);

  return {
    trending: trending || [],
    popularDupes: popularDupes || [],
    newArrivals: newArrivals || []
  };
}

export default async function Home() {
  const { trending, popularDupes, newArrivals } = await getHomeData();

  return (
    <>
      <Navigation />
      <main className="flex-1 bg-background">
        
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background z-10" />
             <div className="absolute inset-0 bg-primary/20 z-10 mix-blend-multiply" />
             <img 
               src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop" 
               alt="Luxury Perfume"
               className="w-full h-full object-cover scale-105"
             />
          </div>
          
          <div className="container mx-auto px-6 relative z-20 text-center">
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white mb-8 leading-tight tracking-tight">
              Find Your <br/>
              <span className="italic font-normal text-accent">Signature</span> Scent
            </h1>
            <p className="text-cream-50/80 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-sans tracking-wide">
              Luxury profiles, accessible prices. Discover identical DNA matches to the world's most exclusive houses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/originals" className="px-10 py-4 bg-accent text-primary font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-glass">
                Explore Originals
              </Link>
              <Link href="/dupes" className="px-10 py-4 border border-white/30 text-white backdrop-blur-md font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                Browse Dupes
              </Link>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
             <div className="w-[1px] h-20 bg-gradient-to-b from-white/10 to-accent" />
          </div>
        </section>

        {/* Trending Section */}
        <section className="py-24 overflow-hidden border-b border-border/50">
          <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-accent mb-4">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Currently Featured</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">Trending Fragrances</h2>
            </div>
            <Link href="/originals" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors">
              View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-12 px-6 no-scrollbar snap-x touch-pan-x">
            {trending.map((perfume: any) => (
              <div key={perfume.id} className="min-w-[300px] md:min-w-[350px] snap-start">
                <PerfumeCard 
                  perfume={{
                    id: perfume.id,
                    name: perfume.name,
                    brand: perfume.brand,
                    imageUrl: perfume.clean_image_url || perfume.raw_image_url,
                    slug: perfume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    subtitle: `${perfume.rating_count?.toLocaleString()} Ratings`
                  }} 
                />
              </div>
            ))}
          </div>
        </section>

        {/* Most Popular Dupes */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-6 mb-12 text-center">
            <div className="inline-flex items-center gap-2 text-accent mb-4">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Top Rated Clones</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Most Popular Dupes</h2>
            <p className="text-foreground/50 max-w-xl mx-auto font-serif italic text-lg">
              Elite performance, fraction of the price. These are the community's highest-rated matches.
            </p>
          </div>
          
          <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDupes.map((perfume: any) => (
              <PerfumeCard 
                key={perfume.id}
                perfume={{
                  id: perfume.id,
                  name: perfume.name,
                  brand: perfume.brand,
                  imageUrl: perfume.clean_image_url || perfume.raw_image_url,
                  slug: perfume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  subtitle: `Alternative for ${perfume.clone_of || 'Luxury Label'}`
                }} 
              />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-24 border-t border-border/50">
          <div className="container mx-auto px-6 mb-12 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-accent mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Latest Releases</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">New Arrivals</h2>
            </div>
          </div>
          
          <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {newArrivals.map((perfume: any) => (
              <PerfumeCard 
                key={perfume.id}
                perfume={{
                  id: perfume.id,
                  name: perfume.name,
                  brand: perfume.brand,
                  imageUrl: perfume.clean_image_url || perfume.raw_image_url,
                  slug: perfume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  subtitle: `Year: ${perfume.year}`
                }} 
              />
            ))}
          </div>
        </section>

      </main>
      
      <footer className="bg-primary text-white py-24 border-t border-accent/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <p className="font-serif text-4xl font-bold tracking-tight mb-8">
                Clone<span className="italic font-normal text-accent">Cologne</span>
              </p>
              <p className="text-white/60 max-w-sm mb-8 leading-relaxed">
                The world's most comprehensive directory for fragrance clones and luxury olfactory DNA matching.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-accent">Navigation</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li><Link href="/originals" className="hover:text-accent transition-colors">Originals</Link></li>
                <li><Link href="/dupes" className="hover:text-accent transition-colors">Dupes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-accent">Legal</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Affiliate Disclosure</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
            <p>© {new Date().getFullYear()} CloneCologne Directory. All Rights Reserved. Not affiliated with any designer houses.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
