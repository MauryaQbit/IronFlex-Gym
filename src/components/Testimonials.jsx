import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import { testimonials } from '../data/gymData'
import { Star } from 'lucide-react'

export default function Testimonials() {
  return (
    <section className="py-20 max-w-5xl mx-auto px-4">
      <div className="text-center">
        <div className="text-gym-lime text-sm font-bold tracking-widest">⭐ 2,000+ REVIEWS</div>
        <h2 className="font-display text-4xl md:text-5xl mt-2">WALL OF <span className="text-gym-lime">RESULTS</span></h2>
      </div>
      <Swiper
        modules={[Pagination, Autoplay, EffectCoverflow]}
        effect="coverflow"
        coverflowEffect={{ rotate: 15, stretch: 0, depth: 200, modifier: 1 }}
        centeredSlides
        slidesPerView={1}
        breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 2 } }}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        className="mt-10 pb-12"
      >
        {testimonials.map(t => (
          <SwiperSlide key={t.id}>
            <div className="rounded-3xl bg-gym-card border border-gym-border p-8">
              <div className="flex text-yellow-400 gap-1">{Array(5).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
              <p className="mt-4 text-zinc-300">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-gym-lime" />
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-gym-lime">{t.goal} • Verified Member</div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
