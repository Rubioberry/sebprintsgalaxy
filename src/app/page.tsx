'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Printer, Sparkles } from 'lucide-react';
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
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    if (supabase) fetchProducts();
  }, []);

  async function fetchProducts() {
    if (!supabase) return;
    const { data } = await supabase.from('products').select('*').eq('published', true);
    setProducts(data || []);
  }

  async function checkout() {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });

    if (!response.ok) {
      console.error('Checkout error');
      alert('Something went wrong. Please try again.');
      return;
    }

    const { url } = await response.json();
    if (url) window.location.href = url;
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

      {/* Dark overlay for text readability */}
      <div className="fixed inset-0 bg-black/60 z-10"></div>

      {/* Header with centered banner video */}
      <header className="relative z-20 py-6 md:py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center md:justify-between items-center gap-8">
          {/* Centered header banner video (main focus) */}
          <div className="flex justify-center w-full md:w-auto">
            <div className="w-72 md:w-96 lg:w-[480px]">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto rounded-lg shadow-2xl shadow-purple-500/50"
              >
                <source src="/videos/header-banner.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Cart button (top-right on desktop, below on mobile) */}
          <button className="relative p-4 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400 shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/80 transition">
            <ShoppingCart className="w-10 h-10 text-cyan-300" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full px-3 py-1 text-sm font-bold animate-ping">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
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

      {/* Featured Creations – Fully responsive mobile-first grid */}
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
                <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-3 group-hover:text-purple-300 transition">
                    {product.name}
                  </h3>
                  <p className="text-gray-300 mb-6 text-sm md:text-base">{product.description}</p>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => setCart([...cart, product])}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-lg md:text-xl hover:from-purple-600 hover:to-cyan-500 shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mobile-friendly floating cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:max-w-sm z-50">
          <div className="bg-black/80 backdrop-blur-2xl border border-cyan-400/50 rounded-2xl p-6 shadow-2xl shadow-cyan-500/60 animate-float">
            <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-3">Cart ({cart.length})</h3>
            <p className="text-xl md:text-2xl text-purple-300 mb-6">
              Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </p>
            <button
              onClick={checkout}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-bold text-xl md:text-2xl hover:from-cyan-500 hover:to-green-500 shadow-lg hover:shadow-green-500/70 transition-all"
            >
              Checkout with Stripe
            </button>
          </div>
        </div>
      )}

      {/* Minimal footer */}
      <footer className="relative z-20 bg-black/80 backdrop-blur-md border-t-2 border-cyan-500/30 py-8 text-center mt-20">
        <p className="text-cyan-400 text-lg">Secure payments powered by Stripe</p>
        <p className="text-gray-500 mt-4">© 2025 SebPrints Galaxy - All rights reserved</p>
      </footer>

      {/* Custom animations */}
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}