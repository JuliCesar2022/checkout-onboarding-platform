const SERVICES = [
  { icon: '🏪', title: 'Free in-store pick up', sub: '24/7 Amazing services' },
  { icon: '🚚', title: 'Free Shipping',          sub: '24/7 Amazing services' },
  { icon: '💳', title: 'Flexible Payment',       sub: '24/7 Amazing services' },
  { icon: '🎧', title: 'Convenient help',        sub: '24/7 Amazing services' },
];

const LINKS = {
  'About Us': ['Company info', 'News', 'Investors', 'Careers', 'Diversity & Inclusion', 'Policies'],
  'Order & Purchases': ['Check order Status', 'Shipping & Delivery', 'Returns & Exchanges', 'Price Match Guarantee', 'Product Recalls', 'Gift Cards'],
  'Popular Categories': ['Smartphones', 'Laptops', 'Gaming', 'Wearables', 'Accessories', 'Audio'],
  'Support & Services': ['Seller Center', 'Contact Us', 'Returns', 'Money Back Guarantee'],
};

const PAYMENT_ICONS = ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Amex'];

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      {/* Service highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SERVICES.map((s) => (
            <div key={s.title} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4">
              <span className="text-3xl flex-shrink-0">{s.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-sm font-bold text-gray-900 mb-4">{section}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* App download */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Download Our App</p>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <span>🍎</span> App Store
            </div>
            <div className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <span>▶</span> Google Play
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-500 mb-2">Payment Method</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {PAYMENT_ICONS.map((p) => (
              <span key={p} className="text-xs font-bold bg-gray-100 border border-gray-200 rounded-md px-3 py-1.5 text-gray-700">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-500 mb-2">Stay Connected</p>
          <div className="flex gap-2">
            {['f', 'X', 'in', '▶', '♪'].map((icon) => (
              <button key={icon} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 hover:text-gray-900 text-gray-600 text-xs font-bold flex items-center justify-center transition-colors">
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-400">© TechStore. All Rights Reserved.</p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Use', 'Warranty Policy'].map((l) => (
              <button key={l} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
