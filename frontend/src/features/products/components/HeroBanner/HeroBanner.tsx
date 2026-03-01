export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center gap-6 px-6 py-10 md:px-12 md:py-14">
        <div className="flex-1 text-center md:text-left">
          <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider mb-2">
            Secure online payments
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Shop the Best <br className="hidden md:block" />
            Tech Deals
          </h2>
          <p className="mt-3 text-indigo-100 text-base max-w-md">
            Fast checkout, credit card payments, and instant delivery tracking.
          </p>
        </div>

        <div className="flex-shrink-0 text-8xl md:text-9xl opacity-80">
          🛒
        </div>
      </div>
    </section>
  );
}
