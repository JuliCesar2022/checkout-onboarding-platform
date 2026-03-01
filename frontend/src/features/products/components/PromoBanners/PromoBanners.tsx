export function PromoBanners() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

      {/* Banner grande izquierda — ocupa 2 filas */}
      <div className="sm:row-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 flex flex-col justify-between min-h-[220px]">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-2">Oferta especial</p>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Hasta <span className="text-yellow-300">70% OFF</span>
          </h2>
          <p className="text-indigo-100 text-sm mt-2">En los mejores productos tech seleccionados</p>
        </div>
        <button className="relative z-10 mt-4 self-start bg-white text-indigo-700 font-semibold text-sm px-5 py-2 rounded-full hover:bg-indigo-50 transition-colors">
          Ver ofertas
        </button>
        <span className="absolute -bottom-4 -right-4 text-[120px] opacity-10 select-none">🖥️</span>
      </div>

      {/* Banner superior derecha */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 flex flex-col justify-between min-h-[104px]">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100 mb-1">Envío gratis</p>
          <h3 className="text-lg font-bold text-white leading-snug">En pedidos desde $100.000 COP</h3>
        </div>
        <span className="absolute -bottom-2 -right-2 text-6xl opacity-20 select-none">🚚</span>
      </div>

      {/* Banner inferior derecha */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 p-5 flex flex-col justify-between min-h-[104px]">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-100 mb-1">Garantía total</p>
          <h3 className="text-lg font-bold text-white leading-snug">Productos 100% originales</h3>
        </div>
        <span className="absolute -bottom-2 -right-2 text-6xl opacity-20 select-none">🏷️</span>
      </div>

      {/* Banner ancho — ocupa las 2 columnas restantes */}
      <div className="sm:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 p-5 flex items-center gap-4 min-h-[80px]">
        <span className="text-4xl flex-shrink-0">🔒</span>
        <div className="relative z-10">
          <h3 className="text-base font-bold text-white">Pagos 100% seguros</h3>
          <p className="text-slate-300 text-sm">Checkout encriptado con la mejor tecnología de pagos de Colombia</p>
        </div>
        <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-[90px] opacity-5 select-none">🛡️</span>
      </div>

    </div>
  );
}
