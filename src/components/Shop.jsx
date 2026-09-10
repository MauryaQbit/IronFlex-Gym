import { ShoppingCart, Plus } from 'lucide-react'
import { products } from '../data/gymData'

export default function Shop({ cart, onAdd }) {
  return (
    <section id="shop" className="py-20 max-w-7xl mx-auto px-4">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <div className="text-gym-lime text-sm font-bold tracking-widest">🛒 GYM STORE</div>
          <h2 className="font-display text-4xl md:text-5xl mt-2">FUEL YOUR <span className="text-gym-lime">GAINS</span></h2>
        </div>
        <div className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm flex items-center gap-2">
          <ShoppingCart size={16} /> Cart: {cart.length} items
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map(p => (
          <div key={p.id} className="rounded-3xl overflow-hidden bg-gym-card border border-gym-border img-zoom group">
            <div className="relative h-56 overflow-hidden">
              <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-[11px] px-3 py-1 rounded-full bg-gym-lime text-black font-bold">{p.tag}</span>
            </div>
            <div className="p-5">
              <div className="font-bold">{p.name}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-display text-xl text-gym-lime">₹{p.price.toLocaleString('en-IN')}</span>
                <span className="text-xs line-through text-zinc-500">₹{p.oldPrice.toLocaleString('en-IN')}</span>
              </div>
              <button onClick={() => onAdd(p)} className="mt-3 w-full py-2.5 rounded-full bg-white text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-gym-lime transition">
                <Plus size={16} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
