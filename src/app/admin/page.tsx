'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Safely get env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if env vars exist (otherwise null for demo mode)
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default function Admin() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');

  async function uploadProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!supabase) {
      setStatus('⚠️ Supabase not configured – add env vars to .env.local and restart server to upload real products.');
      return;
    }

    if (!file) {
      setStatus('Please select an image');
      return;
    }

    // Upload image to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(`public/${fileName}`, file);

    if (uploadError) {
      setStatus(`Upload error: ${uploadError.message}`);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(`public/${fileName}`);

    // Insert product row
    const { error: dbError } = await supabase.from('products').insert({
      name,
      description,
      price: Number(price),
      image_url: urlData.publicUrl,
      published: true,
    });

    if (dbError) {
      setStatus(`Database error: ${dbError.message}`);
    } else {
      setStatus('✅ Product published successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setFile(null);
    }
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin: Add New Item for Sale</h1>

      {!supabase && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded mb-8">
          <p className="font-semibold">Demo Mode Active</p>
          <p>No Supabase config detected. Fill in .env.local with your keys and restart <code className="bg-yellow-200 px-2">npm run dev</code> to enable real uploads.</p>
        </div>
      )}

      <form onSubmit={uploadProduct} className="space-y-6 bg-white shadow-lg rounded-lg p-8">
        <input
          type="text"
          placeholder="Product Name (e.g. Cosmic Rocket Model)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />
        <textarea
          placeholder="Description (e.g. Hand-crafted 3D printed rocket with glowing details)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price in USD (e.g. 49.99)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-4 border border-gray-300 rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-4 rounded-lg text-xl font-semibold hover:bg-purple-700 transition"
        >
          Publish Item for Sale
        </button>
      </form>

      {status && (
        <div className={`mt-8 p-6 rounded-lg text-center text-lg font-medium ${status.startsWith('✅') ? 'bg-green-100 text-green-800' : status.startsWith('⚠️') ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
          {status}
        </div>
      )}
    </div>
  );
}