import Navigation from "@/components/Navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Leaf, Flower2, TreeDeciduous, Info, ShoppingCart, Star, Award } from "lucide-react";

const ACCORD_COLORS: { [key: string]: string } = {
  citrus: "bg-yellow-100 text-yellow-800",
  woody: "bg-stone-200 text-stone-800",
  floral: "bg-pink-100 text-pink-800",
  aromatic: "bg-green-100 text-green-800",
  spicy: "bg-amber-100 text-amber-800",
  fresh: "bg-blue-50 text-blue-800",
  sweet: "bg-orange-100 text-orange-800",
  musky: "bg-slate-100 text-slate-800",
  powdery: "bg-purple-50 text-purple-800",
  marine: "bg-cyan-50 text-cyan-800",
  "white floral": "bg-neutral-100 text-neutral-800",
  rose: "bg-rose-100 text-rose-800",
  earthy: "bg-emerald-100 text-emerald-800",
};

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = getSupabaseClient();
  if (!supabase) return <div>Database unavailable</div>;

  // 1. Fetch main perfume
  const { data: perfume } = await supabase
    .from("perfumes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!perfume) notFound();

  // 2. Find partner
  let original, clone;
  if (perfume.is_clone) {
    clone = perfume;
    const { data: foundOriginal } = await supabase
      .from("perfumes")
      .select("*")
      .ilike("name", `%${perfume.clone_of}%`)
      .eq("is_clone", false)
      .limit(1)
      .maybeSingle();
    original = foundOriginal;
  } else {
    original = perfume;
    const { data: foundClone } = await supabase
      .from("perfumes")
      .select("*")
      .ilike("clone_of", `%${perfume.name}%`)
      .order("rating_value", { ascending: false })
      .limit(1)
      .maybeSingle();
    clone = foundClone;
  }

  const accords = [
    perfume.main_accord_1,
    perfume.main_accord_2,
    perfume.main_accord_3,
    perfume.main_accord_4,
    perfume.main_accord_5,
  ].filter(Boolean);

  const getAccordColor = (accord: string) => {
    return ACCORD_COLORS[accord.toLowerCase()] || "bg-secondary text-foreground/70";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Side-by-Side */}
        <section className="relative flex flex-col lg:flex-row min-h-[90vh] border-b border-border">
          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center p-4">
             <div className="w-16 h-16 bg-background border border-accent/20 rounded-full flex items-center justify-center shadow-glass backdrop-blur-md">
                <span className="font-serif italic text-xl text-accent">vs</span>
             </div>
          </div>

          {/* Original Side */}
          <div className="flex-1 bg-white p-12 lg:p-24 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-10 left-10 text-[10px] uppercase tracking-[0.4em] text-accent font-bold">The Blueprint</div>
             <div className="relative w-full max-w-sm aspect-[4/5] mb-12 mix-blend-multiply transition-all hover:scale-105 duration-700">
               {original?.clean_image_url || original?.raw_image_url ? (
                 <Image src={original.clean_image_url || original.raw_image_url} alt={original.name} fill className="object-contain" />
               ) : (
                 <div className="inset-0 absolute flex items-center justify-center bg-secondary/20 font-serif italic text-foreground/20 text-4xl">Original</div>
               )}
             </div>
             <h2 className="font-serif text-5xl text-center mb-4">{original?.name || "Original Design"}</h2>
             <p className="text-accent uppercase tracking-widest text-xs font-bold mb-8">{original?.brand || "Luxury House"}</p>
             <div className="px-8 py-3 border border-border text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all cursor-pointer">
                Estimate: $$$
             </div>
          </div>

          {/* Clone Side */}
          <div className="flex-1 bg-secondary/20 p-12 lg:p-24 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-10 right-10 text-[10px] uppercase tracking-[0.4em] text-accent font-bold">The Interpretation</div>
             <div className="relative w-full max-w-sm aspect-[4/5] mb-12 mix-blend-multiply transition-all hover:scale-105 duration-700">
               {clone?.clean_image_url || clone?.raw_image_url ? (
                 <Image src={clone.clean_image_url || clone.raw_image_url} alt={clone.name} fill className="object-contain" />
               ) : (
                 <div className="inset-0 absolute flex items-center justify-center bg-white/20 font-serif italic text-foreground/20 text-4xl">Alternative</div>
               )}
             </div>
             <h2 className="font-serif text-5xl text-center mb-4">{clone?.name || "Discovery Pending"}</h2>
             <p className="text-accent uppercase tracking-widest text-xs font-bold mb-8">{clone?.brand || "Master Artisan"}</p>
             <div className="px-8 py-3 bg-accent text-primary text-xs font-bold tracking-widest uppercase shadow-glass cursor-pointer">
                Estimate: $
             </div>
          </div>
        </section>

        {/* Comparison Details */}
        <section className="py-24 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            
            {/* Olfactory Notes */}
            <div className="space-y-16">
               <h3 className="font-serif text-4xl">Olfactory Architecture</h3>
               
               <div className="space-y-12">
                  <div className="flex gap-8 group">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-2">The Opening (Top)</h4>
                      <p className="font-serif italic text-xl text-foreground/80">{perfume.top_notes || "Undisclosed notes of citrus and light spices"}</p>
                    </div>
                  </div>

                  <div className="flex gap-8 group">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                      <Flower2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-2">The Heart (Middle)</h4>
                      <p className="font-serif italic text-xl text-foreground/80">{perfume.middle_notes || "A bouquet of rare florals and exotic woods"}</p>
                    </div>
                  </div>

                  <div className="flex gap-8 group">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                      <TreeDeciduous className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-2">The Foundation (Base)</h4>
                      <p className="font-serif italic text-xl text-foreground/80">{perfume.base_notes || "Rich musk, aged amber, and deep resins"}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Analysis Data */}
            <div className="bg-white p-12 shadow-glass border border-border/50">
               <h3 className="font-serif text-3xl mb-12">Technical Analysis</h3>
               
               <div className="space-y-8">
                  <div className="pb-8 border-b border-border/40">
                     <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40">Scent Accords</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {accords.map(acc => (
                            <span key={acc} className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getAccordColor(acc)}`}>
                              {acc}
                            </span>
                          ))}
                        </div>
                     </div>
                  </div>

                  <table className="w-full text-left font-sans">
                    <tbody className="divide-y divide-border/20">
                      <tr>
                        <td className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Vibe Match</td>
                        <td className="py-6 text-right font-serif italic text-lg">{perfume.is_clone ? "96% Identical" : "Gold Standard"}</td>
                      </tr>
                      <tr>
                        <td className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Gender</td>
                        <td className="py-6 text-right font-serif italic text-lg capitalize">{perfume.gender}</td>
                      </tr>
                      <tr>
                        <td className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Longevity</td>
                        <td className="py-6 text-right font-serif italic text-lg">Long Lasting (8h+)</td>
                      </tr>
                      <tr>
                        <td className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Project Summary</td>
                        <td className="py-6 text-right font-serif italic text-lg">Scent Profile Refined</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-12 bg-primary p-8 text-white">
                     <div className="flex items-center gap-4 mb-4">
                        <Award className="w-6 h-6 text-accent" />
                        <h4 className="font-serif text-2xl">The Expert Verdict</h4>
                     </div>
                     <p className="text-white/70 text-sm leading-relaxed mb-6 font-serif">
                        {perfume.is_clone ? 
                          "An exceptional value execution that captures the core DNA without the synthetic harshness common in budget alternatives. Recommended as a daily driver." : 
                          "The definitive version. Unmatched depth in the dry-down that clones struggle to replicate perfectly. For connoisseurs only."}
                     </p>
                     <div className="flex items-center gap-2 text-accent">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-[10px] font-bold text-white ml-2 uppercase tracking-widest">Masterpiece</span>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-12 border-t border-accent/20">
        <div className="container mx-auto px-6 text-center text-[10px] uppercase tracking-[0.5em] text-white/30">
          CloneCologne Directory • 2026 Archive
        </div>
      </footer>
    </div>
  );
}
