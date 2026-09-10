import { schedule } from '../data/gymData'
import { Clock, User } from 'lucide-react'

export default function Schedule({ bookings, onBook }) {
  return (
    <section id="schedule" className="py-20 bg-gym-dark border-y border-gym-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-gym-lime text-sm font-bold tracking-widest">📅 WEEKLY TIMETABLE</div>
        <h2 className="font-display text-4xl md:text-5xl mt-2">BOOK YOUR <span className="text-gym-lime">CLASS</span></h2>
        <p className="text-zinc-400 text-sm mt-2">Bookings save in your browser + show in Dashboard. No login needed.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {schedule.map(s => {
            const booked = bookings.includes(s.id)
            return (
              <div key={s.id} className="rounded-2xl bg-gym-card border border-gym-border p-5 hover:border-gym-lime transition">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gym-lime text-black">{s.day}</span>
                  <span className="text-xs text-zinc-400">{s.seats} seats</span>
                </div>
                <div className="font-display text-xl mt-3">{s.class}</div>
                <div className="mt-2 text-xs text-zinc-400 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock size={12} /> {s.time}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {s.trainer}</span>
                </div>
                <button onClick={() => onBook(s.id)} disabled={booked}
                  className={`mt-4 w-full py-2.5 rounded-full text-sm font-bold transition ${booked ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-white text-black hover:bg-gym-lime'}`}>
                  {booked ? '✓ Booked' : 'Book Seat'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
