"use client";

import Link from 'next/link';

export function CategorySidebar() {
  const categories = [
    'All Categories',
    'Electronics',
    'Mobile',
    'Audio',
    'Photography',
    'Networking',
    'Home Appliances',
    'Fashion',
  ];

  return (
    <aside className="hidden lg:block w-64">
      <div className="sticky top-20 space-y-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <h3 className="font-bold mb-2">Categories</h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat}>
              <Link href={`/products?category=${encodeURIComponent(cat)}`} className="block px-3 py-2 rounded hover:bg-gray-100/40">
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
