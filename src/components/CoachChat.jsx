import { useState } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

const WHATSAPP_NUMBER = '919999999999' // <-- change to your real number
const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`

function WhatsAppIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

const ANSWERS = [
  { k: ['price', 'cost', 'fee', 'plan', 'membership'], a: '💳 Starter ₹999/mo, Pro Beast ₹1999/mo (most popular), Annual ₹14999/yr. Scroll to Pricing to join!' },
  { k: ['time', 'open', 'timing', 'hours'], a: '⏰ Open 5 AM - 11 PM all days. Morning batch 6-9 AM, Evening 5-9 PM.' },
  { k: ['weight loss', 'fat', 'lose'], a: '🔥 For fat loss: HIIT 4x/week with Sofia + calorie deficit + 10k steps. Use our BMI tool above!' },
  { k: ['muscle', 'gain', 'bulk', 'protein'], a: '💪 For muscle: Strength 4x/week with Arjun + 1.8g protein/kg + creatine. Check Shop for whey!' },
  { k: ['yoga'], a: '🧘 Yoga with Priya: Wed & Sun 7 AM. Great for mobility + recovery.' },
  { k: ['trainer', 'coach', 'pt'], a: '🏋️ We have 4 coaches: Arjun (Strength), Sofia (HIIT), Rohan (CrossFit), Priya (Yoga). Book from Trainers section!' },
  { k: ['location', 'address', 'where'], a: '📍 Sector 21, Main Road. Tap the WhatsApp button for live location!' },
  { k: ['trial', 'free', 'demo'], a: '🎁 Yes! 1-day FREE trial. Fill Join form in Pricing and we will WhatsApp you.' },
]

const QUICK_WA = [
  { label: '🎁 Free Trial', msg: 'Hi IronFlex! I want a FREE 1-day trial pass 💪' },
  { label: '💳 Pricing', msg: 'Hi IronFlex! Please share membership pricing' },
  { label: '⏰ Timings', msg: 'Hi IronFlex! What are gym timings?' },
  { label: '📍 Location', msg: 'Hi IronFlex! Please share gym location' },
]

export default function CoachChat() {
  const [open, setOpen] = useState(false)
  const [waOpen, setWaOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Hey champ! 💪 I am Flex AI. Ask me about price, timings, fat-loss, muscle-gain, trainers!' }])
  const [inp, setInp] = useState('')
  const [waInp, setWaInp] = useState('')

  const send = () => {
    if (!inp.trim()) return
    const q = inp.toLowerCase()
    setMsgs(m => [...m, { from: 'user', text: inp }])
    const hit = ANSWERS.find(a => a.k.some(k => q.includes(k)))
    const reply = hit ? hit.a : 'Got it! For best advice, try: "price", "timings", "fat loss", "muscle gain", "trainers", "trial". Or WhatsApp us!'
    setTimeout(() => setMsgs(m => [...m, { from: 'bot', text: reply }]), 600)
    setInp('')
  }

  return (
    <>
      {/* AI Coach button (right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
        <span className="hidden group-hover:block text-xs font-bold px-3 py-2 rounded-full bg-black/80 border border-white/15 backdrop-blur whitespace-nowrap">
          Ask Flex AI 🤖
        </span>
        <button onClick={() => { setOpen(!open); setWaOpen(false) }}
          className="w-14 h-14 rounded-full bg-gym-lime text-black flex items-center justify-center shadow-[0_0_25px_rgba(212,255,63,0.5)] hover:scale-110 transition">
          {open ? <X /> : <MessageCircle />}
        </button>
      </div>

      {/* WhatsApp button (left) - improved */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 group">
        <button onClick={() => { setWaOpen(!waOpen); setOpen(false) }}
          aria-label="Chat on WhatsApp"
          className="relative w-15 h-15 p-0 rounded-full hover:scale-110 active:scale-95 transition-transform duration-200"
          style={{ width: 60, height: 60 }}>
          {/* pulse rings */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 blur-md" />
          {/* main button */}
          <span className="relative flex items-center justify-center w-[60px] h-[60px] rounded-full text-white shadow-[0_8px_30px_rgba(37,211,102,0.5)] border border-white/20"
            style={{ background: 'linear-gradient(135deg,#25D366 0%,#128C7E 100%)' }}>
            {waOpen ? <X size={26} /> : <WhatsAppIcon size={30} />}
          </span>
          {/* notification badge */}
          {!waOpen && (
            <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center border-2 border-gym-black shadow">
              1
            </span>
          )}
          {/* online dot */}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-300 border-2 border-gym-black" />
        </button>
        <span className="hidden group-hover:block text-xs font-bold px-3 py-2 rounded-full bg-[#075E54] text-white border border-white/15 shadow-lg whitespace-nowrap">
          Chat on WhatsApp • Online
        </span>
      </div>

      {/* WhatsApp chat card */}
      {waOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[350px] max-w-[92vw] rounded-3xl overflow-hidden border border-white/10 bg-[#0b141a] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {/* header */}
          <div className="p-4 flex items-center gap-3 text-white" style={{ background: 'linear-gradient(135deg,#075E54,#128C7E)' }}>
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gym-lime flex items-center justify-center text-black font-display text-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=100&auto=format&fit=crop" alt="gym" className="w-full h-full object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-300 border-2 border-[#075E54]" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">IronFlex Gym 💪</div>
              <div className="text-[11px] opacity-90">Online • replies in ~5 mins</div>
            </div>
            <a href={waLink('Hi IronFlex!')} target="_blank" rel="noreferrer" className="text-[11px] px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 font-bold">Open App</a>
          </div>

          {/* body */}
          <div className="p-4 space-y-3 min-h-[180px]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '18px 18px' }}>
            <div className="max-w-[85%] text-[13px] px-4 py-2.5 rounded-2xl rounded-tl-md bg-[#1f2c34] text-zinc-100 shadow">
              Hey! 👋 This is <b>IronFlex</b>. Want a <b>FREE trial</b>, pricing or timings?
              <div className="text-right text-[10px] opacity-60 mt-1">10:30 AM ✓✓</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_WA.map(q => (
                <a key={q.label} href={waLink(q.msg)} target="_blank" rel="noreferrer"
                  className="text-xs px-3 py-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#7dffa8] hover:bg-[#25D366] hover:text-black font-bold transition">
                  {q.label}
                </a>
              ))}
            </div>
          </div>

          {/* input */}
          <form onSubmit={(e) => { e.preventDefault(); if (waInp.trim()) window.open(waLink(waInp), '_blank') }}
            className="p-3 flex gap-2 bg-[#0b141a] border-t border-white/10">
            <input value={waInp} onChange={e => setWaInp(e.target.value)}
              placeholder="Type & send via WhatsApp..."
              className="flex-1 px-4 py-2.5 rounded-full bg-[#1f2c34] text-sm outline-none focus:ring-2 focus:ring-[#25D366] placeholder:text-zinc-500" />
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-105 transition shadow-lg"
              style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
              <WhatsAppIcon size={18} />
            </button>
          </form>
        </div>
      )}

      {/* AI Coach panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[90vw] rounded-3xl overflow-hidden border border-gym-border bg-gym-card shadow-2xl">
          <div className="p-4 bg-gym-lime text-black font-bold flex items-center gap-2"><Bot size={20} /> Flex AI Coach <span className="ml-auto text-[11px] bg-black text-gym-lime px-2 py-1 rounded-full">ONLINE</span></div>
          <div className="h-72 overflow-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`text-sm px-4 py-2.5 rounded-2xl max-w-[85%] ${m.from === 'bot' ? 'bg-white/10' : 'bg-gym-lime text-black ml-auto font-medium'}`}>{m.text}</div>
            ))}
          </div>
          <div className="p-3 flex gap-2 border-t border-white/10">
            <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask: price? fat loss?" className="flex-1 px-4 py-2.5 rounded-full bg-black/50 border border-white/10 text-sm outline-none focus:border-gym-lime" />
            <button onClick={send} className="w-10 h-10 rounded-full bg-gym-lime text-black flex items-center justify-center"><Send size={16} /></button>
          </div>
        </div>
      )}
    </>
  )
}
