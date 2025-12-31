'use client';  // ← This line fixes the error!

export default function Success() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background video continues for immersion */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/body-background.mp4" type="video/mp4" />
      </video>

      <div className="fixed inset-0 bg-black/60 z-10"></div>

      <div className="relative z-20 container mx-auto py-32 px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-12 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
          Payment Successful! 🎉
        </h1>
        <p className="text-3xl md:text-4xl text-cyan-300 mb-8">
          Thank you for your order!
        </p>
        <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto">
          Sebastian will begin 3D printing your items very soon.<br />
          You’ll receive an email confirmation and updates shortly.
        </p>
        <a
          href="/"
          className="inline-block px-12 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl text-3xl font-bold hover:from-purple-600 hover:to-cyan-500 shadow-2xl shadow-cyan-500/50 hover:shadow-purple-500/70 transition-all duration-500"
        >
          Back to SebPrints Galaxy
        </a>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
}