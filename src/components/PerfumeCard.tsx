import Image from "next/image";
import Link from "next/link";

interface PerfumeProps {
  id: string;
  name: string;
  brand: string;
  cloneOf: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
}

export default function PerfumeCard({ perfume }: { perfume: PerfumeProps }) {
  const savings = perfume.originalPrice - perfume.price;
  
  const slug = perfume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  return (
    <Link href={`/perfume/${slug}`} className="group block">
      <div className="bg-white rounded-[8px] p-6 shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full border border-transparent hover:border-border">
        {/* Abstract placeholder instead of real image if not found */}
        <div className="relative w-full aspect-square mb-6 bg-secondary/50 rounded-md overflow-hidden mix-blend-multiply">
          {perfume.imageUrl ? (
            <Image 
              src={perfume.imageUrl} 
              alt={perfume.name} 
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
             <div className="absolute inset-0 flex items-center justify-center text-tertiary/20">
                <span className="font-serif text-4xl">Image</span>
             </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-tertiary font-bold mb-1">
            Clone of {perfume.cloneOf}
          </div>
          <h3 className="font-serif text-xl leading-tight text-foreground line-clamp-2">
            {perfume.name}
          </h3>
          <p className="text-sm text-foreground/60">by {perfume.brand}</p>
          
          <div className="pt-4 mt-4 border-t border-border flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-serif text-primary">${perfume.price}</span>
            </div>
            <div className="text-right">
              <span className="block text-xs line-through text-foreground/40">Orig. ${perfume.originalPrice}</span>
              <span className="text-xs font-bold text-tertiary">Save ${savings}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
