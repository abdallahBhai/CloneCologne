import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseClient } from "@/lib/supabase";
import { Search, ShoppingBag, User, Droplet, Heart, TreePine, Star } from "lucide-react";
import { isUuid, perfumeSlug } from "@/lib/perfumes";

export const revalidate = 0;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const cloneName = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    title: `CloneCologne: Original vs. ${cloneName} Comparison`,
    description: `Side-by-side analysis of the original fragrance against ${cloneName}.`,
  };
}

export default async function PerfumePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getSupabaseClient();

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="font-serif text-2xl mb-4">Configuration Required</h1>
          <p className="text-foreground/70 mb-8">Please add your Supabase credentials to the Vercel project settings to view this page.</p>
          <a href="/" className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition-colors">Return Home</a>
        </div>
      </div>
    );
  }

  const { data: perfumes } = await supabase.from("perfumes").select("*");
  const clonePerfume = perfumes?.find((p) => perfumeSlug(p.name) === slug);
  
  if (!clonePerfume) {
    notFound();
  }

  let benchmarkName = "Original Fragrance";

  if (isUuid(clonePerfume.clone_of)) {
    const { data: originalPerfume } = await supabase
      .from("perfumes")
      .select("id,name,brand")
      .eq("id", clonePerfume.clone_of)
      .maybeSingle();

    benchmarkName = originalPerfume?.name || benchmarkName;
  } else if (clonePerfume.clone_of) {
    benchmarkName = clonePerfume.clone_of;
  }

  const alternativeName = clonePerfume.name;
  const alternativeImage = clonePerfume.clean_image_url || clonePerfume.raw_image_url;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Fake Header matching the design exactly */}
      <header className="px-8 py-4 flex items-center justify-between border-b border-border bg-white sticky top-0 z-50">
         <div className="font-serif text-lg font-bold flex items-center gap-2">
            CloneCologne: <span className="font-sans font-normal text-sm">{benchmarkName} vs. {alternativeName} Comparison</span>
         </div>
         <nav className="hidden md:flex items-center gap-8 text-sm">
            <span className="cursor-pointer hover:text-primary transition-colors">Originals</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Clones</span>
            <span className="border-b-2 border-foreground pb-1 font-medium">Comparison</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Journal</span>
         </nav>
         <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
               <input type="text" placeholder="Search" className="bg-secondary/50 rounded-full py-2 pl-10 pr-4 text-sm w-48 outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <ShoppingBag className="w-5 h-5 cursor-pointer" />
            <User className="w-5 h-5 cursor-pointer" />
         </div>
      </header>

      {/* Hero Split Section */}
      <section className="relative flex flex-col md:flex-row min-h-[85vh]">
        {/* Absolute Center Icon */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-border">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
        </div>

        {/* LEFT: BENCHMARK */}
        <div className="flex-1 bg-[#F5EFE6] flex flex-col items-center justify-center p-12 lg:p-24 relative group">
           <div className="absolute top-8 left-8 text-xs font-bold tracking-widest uppercase text-foreground/60">
             The Benchmark
           </div>
           
           <div className="relative w-full max-w-sm aspect-[3/4] mb-12 mix-blend-multiply transition-transform duration-700 group-hover:scale-105">
             {/* Placeholder for the Original since we don't have it scraped */}
             <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent rounded-2xl flex items-center justify-center border border-border/50">
                <span className="font-serif text-3xl text-foreground/30 text-center tracking-widest px-4">{benchmarkName}</span>
             </div>
           </div>
           
           <h2 className="font-serif text-5xl lg:text-6xl mb-2">{benchmarkName}</h2>
           <p className="font-serif italic text-foreground/70 text-xl mb-6">By Original House</p>
           
           <div className="bg-white/50 px-6 py-2 rounded-full text-sm font-medium mb-8">
              $295 - 50ml
           </div>
           
           <button className="bg-black text-white rounded-full px-12 py-4 text-sm font-bold tracking-widest hover:bg-black/80 transition-colors uppercase">
              Buy Now
           </button>
        </div>

        {/* RIGHT: ALTERNATIVE */}
        <div className="flex-1 bg-white flex flex-col items-center justify-center p-12 lg:p-24 relative group">
           <div className="absolute top-8 right-8 text-xs font-bold tracking-widest uppercase text-foreground/60">
             The Alternative
           </div>
           
           <div className="relative w-full max-w-sm aspect-[3/4] mb-12 mix-blend-multiply transition-transform duration-700 group-hover:scale-105">
             {alternativeImage ? (
               <Image 
                  src={alternativeImage} 
                  alt={alternativeName} 
                  fill
                  className="object-contain"
               />
             ) : (
                <div className="absolute inset-0 flex items-center justify-center text-tertiary">Image Pending</div>
             )}
           </div>
           
           <h2 className="font-serif text-5xl lg:text-6xl mb-2">{alternativeName}</h2>
           <p className="font-serif italic text-foreground/70 text-xl mb-6">By {clonePerfume.brand}</p>
           
           <div className="bg-secondary px-6 py-2 rounded-full text-sm font-medium mb-8">
              $35 - 100ml
           </div>
           
           <button className="bg-black text-white rounded-full px-12 py-4 text-sm font-bold tracking-widest hover:bg-black/80 transition-colors uppercase">
              Buy Now
           </button>
        </div>
      </section>

      {/* The Olfactory Match Section */}
      <section className="py-24 px-4 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">The Olfactory Match</h2>
              <div className="w-16 h-[1px] bg-foreground/30 mx-auto"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Top Notes */}
              <div className="bg-[#EFEDE6] rounded-2xl p-8 border border-white/50 shadow-sm">
                 <h3 className="font-serif text-xl mb-6 flex items-center gap-3">
                   <Droplet className="w-5 h-5 text-foreground/70" /> Top Notes
                 </h3>
                 <ul className="space-y-4 text-sm">
                    <li className="flex justify-between border-b border-border/40 pb-4">
                       <span>Rosewood</span><span className="italic text-foreground/60">Shared</span>
                    </li>
                    <li className="flex justify-between border-b border-border/40 pb-4">
                       <span>Cardamom</span><span className="italic text-foreground/60">Shared</span>
                    </li>
                    <li className="flex justify-between pb-2">
                       <span>Chinese Pepper</span><span className="italic text-foreground/60">Original Only</span>
                    </li>
                 </ul>
              </div>
              
              {/* Heart Notes */}
              <div className="bg-[#EFEDE6] rounded-2xl p-8 border border-white/50 shadow-sm md:-translate-y-4">
                 <h3 className="font-serif text-xl mb-6 flex items-center gap-3">
                   <Heart className="w-5 h-5 text-foreground/70" /> Heart Notes
                 </h3>
                 <ul className="space-y-4 text-sm">
                    <li className="flex justify-between border-b border-border/40 pb-4">
                       <span>Rare Oud</span><span className="italic text-foreground/60">Shared</span>
                    </li>
                    <li className="flex justify-between border-b border-border/40 pb-4">
                       <span>Sandalwood</span><span className="italic text-foreground/60">Shared</span>
                    </li>
                    <li className="flex justify-between pb-2">
                       <span>Vetiver</span><span className="italic text-foreground/60">Shared</span>
                    </li>
                 </ul>
              </div>

              {/* Base Notes */}
              <div className="bg-[#EFEDE6] rounded-2xl p-8 border border-white/50 shadow-sm">
                 <h3 className="font-serif text-xl mb-6 flex items-center gap-3">
                   <TreePine className="w-5 h-5 text-foreground/70" /> Base Notes
                 </h3>
                 <ul className="space-y-4 text-sm">
                    <li className="flex justify-between border-b border-border/40 pb-4">
                       <span>Vanilla</span><span className="italic text-foreground/60">Shared</span>
                    </li>
                    <li className="flex justify-between border-b border-border/40 pb-4">
                       <span>Amber</span><span className="italic text-foreground/60">Shared</span>
                    </li>
                    <li className="flex justify-between pb-2">
                       <span>Tonka Bean</span><span className="italic text-foreground/60">Shared</span>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      </section>

      {/* Side-by-Side Analysis */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="font-serif italic text-4xl text-foreground">Side-by-Side Analysis</h2>
           </div>

           <div className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-soft">
              <table className="w-full text-left text-sm">
                 <thead className="bg-[#EBE7DF]">
                    <tr>
                       <th className="py-5 px-6 font-serif text-lg font-normal w-1/3">Attribute</th>
                       <th className="py-5 px-6 font-serif text-lg font-normal w-1/3">{benchmarkName}</th>
                       <th className="py-5 px-6 font-serif text-lg font-normal w-1/3">{alternativeName}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/40">
                    <tr className="hover:bg-secondary/20 transition-colors">
                       <td className="py-5 px-6 font-bold">Longevity</td>
                       <td className="py-5 px-6">6-8 Hours</td>
                       <td className="py-5 px-6 font-bold">4-6 Hours</td>
                    </tr>
                    <tr className="hover:bg-secondary/20 transition-colors">
                       <td className="py-5 px-6 font-bold">Sillage</td>
                       <td className="py-5 px-6">Moderate</td>
                       <td className="py-5 px-6 text-primary font-bold">Strong (Initial)</td>
                    </tr>
                    <tr className="hover:bg-secondary/20 transition-colors">
                       <td className="py-5 px-6 font-bold">Concentration</td>
                       <td className="py-5 px-6">Eau de Parfum</td>
                       <td className="py-5 px-6">Eau de Parfum</td>
                    </tr>
                    <tr className="hover:bg-secondary/20 transition-colors">
                       <td className="py-5 px-6 font-bold">Complexity</td>
                       <td className="py-5 px-6">High</td>
                       <td className="py-5 px-6">Moderate-High</td>
                    </tr>
                    <tr className="hover:bg-secondary/20 transition-colors">
                       <td className="py-5 px-6 font-bold">Similarity Score</td>
                       <td className="py-5 px-6 text-foreground/30">—</td>
                       <td className="py-5 px-6 font-bold text-lg">97%</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </section>

      {/* The Verdict */}
      <section className="py-24 px-4 bg-white border-t border-border/30">
        <div className="max-w-5xl mx-auto">
           <h2 className="font-serif text-3xl text-foreground mb-16">The Verdict</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Review 1 */}
              <div>
                 <div className="flex gap-1 mb-4 text-foreground">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                 </div>
                 <p className="font-serif italic text-xl mb-6 leading-relaxed">
                   &ldquo;Identical in the air. The only difference is the opening which is a bit harsher on the alternative, but within 10 minutes, no one could tell the difference.&rdquo;
                 </p>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground/50">J</div>
                    <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Julian P. — Verified Collector</p>
                 </div>
              </div>

              {/* Review 2 */}
              <div className="md:border-l border-border/40 md:pl-16">
                 <div className="flex gap-1 mb-4 text-foreground">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                 </div>
                 <p className="font-serif italic text-xl mb-6 leading-relaxed">
                   &ldquo;A fantastic budget alternative. It lacks that ultra refined creaminess of the original in the dry-down, but for the price, it&apos;s an absolute steal.&rdquo;
                 </p>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground/50">E</div>
                    <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Elena M. — Fragrance Enthusiast</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-black text-white py-24 px-4 text-center">
         <h2 className="font-serif text-4xl md:text-5xl mb-12">Ready to Choose Your Path?</h2>
         <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button className="bg-white text-black font-bold tracking-widest text-xs uppercase px-10 py-5 rounded-full hover:bg-white/90 transition-colors w-full sm:w-auto">
               Shop The Original
            </button>
            <button className="bg-transparent text-white border border-white/30 font-bold tracking-widest text-xs uppercase px-10 py-5 rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto">
               Shop The Clone
            </button>
         </div>
      </section>

      {/* Final Footer Marks */}
      <footer className="bg-black text-white/50 text-xs py-8 px-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="font-serif font-bold text-sm text-white">CloneCologne</div>
         <div className="flex gap-6 tracking-widest uppercase text-[10px]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Shipping</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
         </div>
         <div className="text-[10px]">&copy; 2026 SAHARA FRAGRANCES. SUN-BAKED SIMPLICITY</div>
      </footer>
    </div>
  );
}
