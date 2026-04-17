import Navigation from "@/components/Navigation";
import PerfumeCard from "@/components/PerfumeCard";
import { getSupabaseClient } from "@/lib/supabase";
import { ArrowRight, Star, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import FloatingBottle from "@/components/FloatingBottle";


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
        <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column (Text & CTAs) */}
              <div className="flex flex-col items-start text-left">
                <span className="text-accent text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                  Discover Your Perfect Fragrance
                </span>
                
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.1] tracking-tight">
                  Find Your <br/>
                  <span className="italic font-normal text-accent">Signature</span> Scent
                </h1>
                
                <p className="text-slate-400 text-base md:text-lg max-w-lg mb-8 font-sans leading-relaxed">
                  Explore the world's finest fragrances. From timeless classics to hidden gems, find the perfect scent that tells your story.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
                  <Link href="/originals" className="w-full sm:w-auto px-8 py-4 bg-accent text-black font-bold uppercase tracking-widest text-xs hover:bg-yellow-400 transition-colors text-center">
                    Explore Collection
                  </Link>
                  <Link href="/search" className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors text-center">
                    Search Scents
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 flex items-center flex-wrap gap-4 md:gap-x-8 text-[11px] uppercase tracking-widest text-white/50 font-bold">
                  <span className="flex items-center gap-2 text-accent">
                    24k+ Fragrances
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border"></span>
                  <span className="flex items-center gap-2">
                    10k+ Brands
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border hidden sm:block"></span>
                  <span className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    Trusted Reviews
                  </span>
                </div>
              </div>

              {/* Right Column (Visual) */}
              <div className="w-full mt-12 lg:mt-0">
                <FloatingBottle />
              </div>

            </div>
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
