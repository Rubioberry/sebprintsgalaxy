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
    <>
      {/* Futuristic Header with Neon Glow */}
      <header className="relative overflow-hidden bg-black text-white py-8 border-b-4 border-cyan-400 shadow-2xl shadow-cyan-500/50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-cyan-900 opacity-70"></div>
        <div className="relative container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-5xl font-bold flex items-center gap-4 tracking-wider">
            <Printer className="w-12 h-12 text-cyan-400 animate-pulse" />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SebPrints Galaxy
            </span>
          </h1>
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

      {/* Hero Section - Holographic Tech Feel */}
      <section className="relative bg-black py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black to-cyan-900/30"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative container mx-auto px-4">
          <h2 className="text-6xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            Bring Your Ideas to Life in 3D!
            <Sparkles className="inline ml-4 w-16 h-16 text-yellow-400 animate-spin-slow" />
          </h2>
          <p className="text-2xl text-cyan-300 mb-12 tracking-wide">
            Custom 3D printing services & unique creations by Sebastian
          </p>
        </div>
      </section>

      {/* Featured Creations - Glassmorphism Cards with Neon Glow */}
      <section className="py-24 container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Featured Creations
        </h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-400 text-xl">
            No products yet — add some via <a href="/admin" className="text-cyan-400 underline hover:text-purple-400">/admin</a>!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/50 hover:border-purple-500/50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition"></div>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="relative p-8">
                  <h3 className="text-3xl font-bold text-cyan-300 mb-4 group-hover:text-purple-300 transition">
                    {product.name}
                  </h3>
                  <p className="text-gray-300 mb-6">{product.description}</p>
                  <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-8">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => setCart([...cart, product])}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-xl hover:from-purple-600 hover:to-cyan-500 shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Cart - High-Tech Panel */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 bg-black/80 backdrop-blur-2xl border border-cyan-400/50 rounded-2xl p-8 shadow-2xl shadow-cyan-500/60 z-50 max-w-md w-full animate-float">
          <h3 className="text-3xl font-bold text-cyan-300 mb-4">Cart ({cart.length})</h3>
          <p className="text-2xl text-purple-300 mb-6">
            Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </p>
          <button
            onClick={checkout}
            className="w-full py-5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-bold text-2xl hover:from-cyan-500 hover:to-green-500 shadow-lg hover:shadow-green-500/70 transition-all"
          >
            Checkout with Stripe
          </button>
        </div>
      )}

      {/* Footer - Minimal Neon */}
      <footer className="bg-black border-t-2 border-cyan-500/50 py-12 text-center">
        <p className="text-cyan-400 text-lg">Secure payments powered by Stripe</p>
        <p className="text-gray-500 mt-4">© 2025 SebPrints Galaxy - All rights reserved</p>
      </footer>

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
        .bg-grid-pattern {
          background-image: linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </>
  );
}