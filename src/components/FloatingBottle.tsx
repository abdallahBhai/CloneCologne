"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FloatingBottle() {
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center">
      {/* Background glowing radial gradient */}
      <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-75 opacity-70" />
      
      {/* Floating Image */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 4, 
          ease: "easeInOut" 
        }}
        className="relative z-10 w-full h-full"
      >
        <Image
          src="/images/hero-bottle.png"
          alt="Luxury Perfume Bottle"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>
    </div>
  );
}
