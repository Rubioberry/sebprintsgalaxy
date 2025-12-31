'use client';

import { useState, useEffect } from 'react';  // ← This line was missing!
import { ShoppingCart, Sparkles } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  square_link?: string;  // Optional Square checkout URL
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (supabase) fetchProducts();
  }, []);

  async function fetchProducts() {
    if (!supabase) return;
    const { data } = await supabase.from('products').select('*').eq('published', true);
    setProducts(data || []);
  }

  return (
    <div className="relative min-h-screen">
      {/* Full-page looping background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/body-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/60 z-10"></div>

      {/* Header with centered banner video */}
      <header className="relative z-20 py-6 md:py-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-8">
          <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl flex justify-center">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full max-w-2xl h-auto rounded-lg shadow-2xl shadow-purple-500/50"
            >
              <source src="/videos/header-banner.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Cart icon (optional – can remove if no cart needed) */}
          <div className="absolute top-6 right-4 md:top-8 md:right-8">
            <ShoppingCart className="w-10 h-10 text-cyan-300" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-20 py-20 md:py-32 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            Bring Your Ideas to Life in 3D!
            <Sparkles className="inline ml-4 w-12 h-12 md:w-16 md:h-16 text-yellow-400 animate-spin-slow" />
          </h2>
          <p className="text-xl md:text-2xl text-cyan-300 tracking-wide">
            Custom 3D printing services & unique creations by Sebastian
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-20 py-12 md:py-20 container mx-auto px-6 md:px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Featured Creations
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">
            No products yet — add some via <a href="/admin" className="text-cyan-400 underline hover:text-purple-400">/admin</a>!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative bg-black/50 backdrop-blur-xl border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/70 hover:border-purple-500/60 transition-all duration-500"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-3 group-hover:text-purple-300 transition">
                    {product.name}
                  </h3>
                  <p className="text-gray-300 mb-6 text-sm md:text-base">{product.description}</p>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">
                    ${product.price.toFixed(2)}
                  </p>

                  {product.square_link ? (
                    <a
                      href={product.square_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-lg md:text-xl text-center hover:from-purple-600 hover:to-cyan-500 shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                      Buy Now with Square
                    </a>
                  ) : (
                    <p className="text-center text-yellow-400">Square link not set</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="relative z-20 bg-black/80 backdrop-blur-md border-t-2 border-cyan-500/30 py-8 text-center mt-20">
        <p className="text-cyan-400 text-lg">Secure payments powered by Square</p>
        <p className="text-gray-500 mt-4">© 2025 SebPrints Galaxy - All rights reserved</p>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
}