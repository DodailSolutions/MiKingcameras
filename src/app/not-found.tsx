import Link from 'next/link';
import { Camera, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/data/catalog';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-8">
      <div className="inline-flex p-4 bg-[#1b1916] border border-[#2e2a25] rounded-3xl text-[#F5821F]">
        <Camera className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold text-[#F5821F] tracking-widest uppercase">Error 404</span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Out of Focus</h1>
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md mx-auto">
          The page you&apos;re looking for has moved or doesn&apos;t exist. Try one of our popular categories instead.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.slice(0, 6).map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalog?cat=${cat.slug}`}
            className="px-4 py-2 text-xs font-semibold text-stone-300 bg-[#1b1916] border border-[#2e2a25] rounded-xl hover:border-[#F5821F] hover:text-white transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#F5821F] rounded-xl hover:bg-[#E0741A] transition-colors"
        >
          Back to Home <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white border border-[#2e2a25] rounded-xl hover:border-[#F5821F] transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
}
