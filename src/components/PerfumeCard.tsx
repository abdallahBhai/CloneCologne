"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface PerfumeProps {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  slug: string;
  subtitle?: string;
  isClone?: boolean;
}

export default function PerfumeCard({ perfume }: { perfume: PerfumeProps }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link href={`/compare/${perfume.slug}`} className="group block h-full">
        <div className="bg-white/50 backdrop-blur-sm rounded-none p-8 shadow-soft border border-border/50 h-full flex flex-col transition-colors group-hover:border-accent/30 group-hover:bg-white/80 relative">
          {perfume.isClone && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-accent/90 backdrop-blur-sm text-primary px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] shadow-glass">
                Interpretation
              </span>
            </div>
          )}
          <div className="relative w-full aspect-[4/5] mb-8 overflow-hidden bg-secondary/30">
            {perfume.imageUrl ? (
              <motion.div 
                className="w-full h-full p-6"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Image 
                  src={perfume.imageUrl} 
                  alt={perfume.name} 
                  fill
                  className="object-contain"
                />
              </motion.div>
            ) : (
               <div className="absolute inset-0 flex items-center justify-center text-accent/20">
                  <span className="font-serif italic text-2xl">Refining...</span>
               </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">
              {perfume.brand}
            </div>
            <h3 className="font-serif text-xl lg:text-2xl leading-tight text-foreground mb-2 group-hover:text-accent transition-colors">
              {perfume.name}
            </h3>
            {perfume.subtitle && (
              <p className="text-sm italic text-foreground/50 border-t border-border/40 pt-4 mt-auto font-serif">
                {perfume.subtitle}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
