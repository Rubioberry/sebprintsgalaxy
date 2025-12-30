export default function Success() {
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-5xl font-bold text-green-600 mb-8">Payment Successful! 🎉</h1>
      <p className="text-xl mb-8">Thank you for your order. Sebastian will start 3D printing your items soon!</p>
      <a href="/" className="bg-purple-600 text-white px-8 py-4 rounded text-xl hover:bg-purple-700">
        Back to Store
      </a>
    </div>
  );
}