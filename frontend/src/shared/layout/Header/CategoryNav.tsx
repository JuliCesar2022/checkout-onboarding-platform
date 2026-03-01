const NAV_CATEGORIES = [
  'Electronics',
  'Fashion',
  "Women's",
  "Kids' Fashion",
  'Healthy & Beauty',
  'Pharmacy',
  'Groceries',
  'Luxury Item',
];

export function CategoryNav() {
  return (
    <div style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
          {/* All Categories button */}
          <button className="flex items-center gap-1.5 flex-shrink-0 text-sm font-semibold text-gray-800 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 mr-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            All Categories
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Category links */}
          {NAV_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="flex-shrink-0 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
