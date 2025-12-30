'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Printer, Sparkles } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';  // This line fixes the type error permanently

// Safe Supabase client creation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
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
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    if (supabase) {
      fetchProducts();
    }
  }, []);

  async function fetchProducts() {
    if (!supabase) return;
    const { data } = await supabase.from('products').select('*').eq('published', true);
    setProducts(data || []);
  }

  async function checkout() {
    if (!stripePromise) {
      alert('Stripe is not configured yet.');
      return;
    }

    const stripe = (await stripePromise) as Stripe | null;
    if (!stripe) {
      console.error('Stripe failed to load');
      return;
    }

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      console.error('Stripe checkout error:', result.error.message);
    }
  }

  return (
    <>
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Printer className="w-10 h-10" /> SebPrints Galaxy
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative">
              <ShoppingCart className="w-8 h-8" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full px-2 text-sm">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="bg-gray-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-6">
            Bring Your Ideas to Life in 3D! <Sparkles className="inline w-12 h-12 text-yellow-400" />
          </h2>
          <p className="text-xl mb-8">Custom 3D printing services & unique creations by Sebastian</p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Creations</h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No products available yet. Add some via <a href="/admin" className="text-purple-600 underline">/admin</a>!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={() => setSelected(product)}
              >
                <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <p className="text-3xl font-bold mt-4">${product.price}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCart([...cart, product]);
                    }}
                    className="mt-4 bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-2xl p-6 rounded-lg z-50">
          <h3 className="text-2xl font-bold">Cart ({cart.length})</h3>
          <p className="mt-2">Total: ${cart.reduce((sum, item) => sum + item.price, 0)}</p>
          <button
            onClick={checkout}
            className="mt-4 bg-green-600 text-white px-8 py-4 rounded text-xl hover:bg-green-700 w-full"
          >
            Checkout with Stripe
          </button>
        </div>
      )}

      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>Secure payments powered by Stripe</p>
        <p className="mt-4">© 2025 SebPrints Galaxy - All rights reserved</p>
      </footer>
    </>
  );
}