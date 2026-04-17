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
    <div className="bg-[#f7f7f7] min-h-screen font-sans">
      <Navigation />
      <main className="text-[#222222] antialiased">
        
        {/* Hero Section */}
        <section className="relative w-full h-[600px] overflow-hidden flex items-center bg-[#ebe5e0]">
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
             <img 
               src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop" 
               alt="Luxury Perfume"
               className="w-full h-full object-cover opacity-[0.15] mix-blend-multiply"
             />
          </div>
          
          <div className="relative z-10 w-full flex px-8 lg:px-[10%]">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-normal leading-tight text-[#222222] mb-2 uppercase tracking-wide">
                Find Your
              </h2>
              <h3 className="text-3xl md:text-4xl font-light text-[#222222] mb-8">
                Signature Scent.
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/originals" className="text-center bg-[#eecdcb] text-[#222222] px-8 py-3 text-sm tracking-wider uppercase hover:bg-opacity-80 transition-opacity border-none">
                  Explore Originals
                </Link>
                <Link href="/dupes" className="text-center bg-transparent border border-[#222222] text-[#222222] px-8 py-3 text-sm tracking-wider uppercase hover:bg-[#222222] hover:text-white transition-colors">
                  Browse Dupes
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4 gap-4">
            <h2 className="text-2xl font-normal text-[#222222] uppercase tracking-wide">Trending Fragrances</h2>
            <Link href="/originals" className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#555555] hover:text-[#222222] transition-colors">
              View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.slice(0, 4).map((perfume: any) => (
              <PerfumeCard 
                key={perfume.id}
                perfume={{
                  id: perfume.id,
                  name: perfume.name,
                  brand: perfume.brand,
                  imageUrl: perfume.clean_image_url || perfume.raw_image_url,
                  slug: perfume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  subtitle: `${perfume.rating_count?.toLocaleString()} Ratings`
                }} 
              />
            ))}
          </div>
        </section>

        {/* Most Popular Dupes */}
        <section className="max-w-7xl mx-auto px-6 py-16 bg-[#f1f1f1] rounded-lg mb-16">
          <div className="mb-8 text-center border-b border-gray-200 pb-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-normal text-[#222222] uppercase tracking-wide mb-2">Most Popular Dupes</h2>
            <p className="text-[#555555] text-sm md:text-base font-light">
              Elite performance, fraction of the price. The community's highest-rated matches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDupes.map((perfume: any) => (
              <PerfumeCard 
                key={perfume.id}
                perfume={{
                  id: perfume.id,
                  name: perfume.name,
                  brand: perfume.brand,
                  imageUrl: perfume.clean_image_url || perfume.raw_image_url,
                  slug: perfume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  subtitle: `Alt for ${perfume.clone_of || 'Luxury Label'}`
                }} 
              />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-200">
          <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-normal text-[#222222] uppercase tracking-wide">New Arrivals</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      
      <footer className="bg-white text-[#222222] py-16 mt-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-gray-200 pb-12">
            <div className="col-span-1 md:col-span-2">
              <p className="text-3xl font-light tracking-widest mb-6 uppercase">
                CloneCologne
              </p>
              <p className="text-[#555555] max-w-sm text-sm font-light leading-relaxed">
                The world's most comprehensive directory for fragrance clones and luxury olfactory DNA matching.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-[#222222]">Navigation</h4>
              <ul className="space-y-4 text-sm text-[#555555] font-light">
                <li><Link href="/" className="hover:text-black transition-colors">Home</Link></li>
                <li><Link href="/originals" className="hover:text-black transition-colors">Originals</Link></li>
                <li><Link href="/dupes" className="hover:text-black transition-colors">Dupes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-[#222222]">Legal</h4>
              <ul className="space-y-4 text-sm text-[#555555] font-light">
                <li><a href="#" className="hover:text-black transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Affiliate</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-[10px] uppercase tracking-[0.2em] text-[#555555]">
            <p>© {new Date().getFullYear()} CloneCologne Directory. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
