'use client';

import MasonryGrid from '../components/MasonryGrid';

// Demo items with varying heights
const demoItems = [
  { id: 1, height: 200, title: 'Short Item', color: 'bg-blue-200' },
  { id: 2, height: 350, title: 'Tall Item', color: 'bg-green-200' },
  { id: 3, height: 250, title: 'Medium Item', color: 'bg-purple-200' },
  { id: 4, height: 180, title: 'Short Item 2', color: 'bg-yellow-200' },
  { id: 5, height: 400, title: 'Very Tall Item', color: 'bg-red-200' },
  { id: 6, height: 220, title: 'Medium Item 2', color: 'bg-indigo-200' },
  { id: 7, height: 300, title: 'Tall Item 2', color: 'bg-pink-200' },
  { id: 8, height: 160, title: 'Short Item 3', color: 'bg-teal-200' },
  { id: 9, height: 280, title: 'Medium Item 3', color: 'bg-orange-200' },
  { id: 10, height: 320, title: 'Tall Item 3', color: 'bg-cyan-200' },
];

export default function MasonryGridDemo() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Masonry Grid Demo
        </h1>
        <p className="text-gray-600">
          This demo shows the responsive masonry grid layout with lazy loading and smooth animations.
        </p>
      </div>

      <MasonryGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        gap={24}
        enableLazyLoading={true}
        animationDelay={100}
        className="mb-8"
      >
        {demoItems.map((item) => (
          <DemoCard
            key={item.id}
            title={item.title}
            height={item.height}
            color={item.color}
          />
        ))}
      </MasonryGrid>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Features Demonstrated:</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ Responsive column configuration (1 → 2 → 3 → 4 columns)</li>
          <li>✅ CSS Grid-based masonry layout with proper gap handling</li>
          <li>✅ Lazy loading with Intersection Observer</li>
          <li>✅ Smooth animations for grid item appearance</li>
          <li>✅ Optimized performance with ResizeObserver</li>
          <li>✅ Proper handling of varying item heights</li>
        </ul>
      </div>
    </div>
  );
}

interface DemoCardProps {
  title: string;
  height: number;
  color: string;
}

function DemoCard({ title, height, color }: DemoCardProps) {
  return (
    <div
      className={`${color} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
      style={{ height: `${height}px` }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">
        Height: {height}px
      </p>
      <div className="mt-4 space-y-2">
        <div className="h-2 bg-white/50 rounded"></div>
        <div className="h-2 bg-white/30 rounded w-3/4"></div>
        <div className="h-2 bg-white/20 rounded w-1/2"></div>
      </div>
    </div>
  );
}