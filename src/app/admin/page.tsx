'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Admin() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);

  async function uploadProduct() {
    if (!file) return;
    const { data: upload } = await supabase.storage.from('products').upload(`public/${file.name}`, file);
    const image_url = supabase.storage.from('products').getPublicUrl(`public/${file.name}`).data.publicUrl;

    await supabase.from('products').insert({
      name,
      description,
      price: Number(price),
      image_url,
      published: true,
    });

    alert('Product published!');
  }

  // Add simple auth check or use Supabase auth for real protection

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Admin: Add New Item for Sale</h1>
      <form onSubmit={(e) => { e.preventDefault(); uploadProduct(); }} className="max-w-lg mx-auto space-y-6">
        <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 border rounded" required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-4 border rounded h-32" required />
        <input type="number" placeholder="Price (USD)" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-4 border rounded" required />
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
        <button type="submit" className="bg-purple-600 text-white px-8 py-4 rounded text-xl">Publish Item</button>
      </form>
    </div>
  );
}