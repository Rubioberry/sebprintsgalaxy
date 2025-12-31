import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { items } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    })),
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sebasprintsgalaxy.vercel.app'}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sebasprintsgalaxy.vercel.app'}/`,
  });

  return Response.json({ url: session.url });  // Return full URL
}