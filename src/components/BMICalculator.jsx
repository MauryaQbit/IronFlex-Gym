import { useState } from 'react'
import { Calculator } from 'lucide-react'

export default function BMICalculator() {
  const [h, setH] = useState(175)
  const [w, setW] = useState(75)
  const [age, setAge] = useState(25)
  const bmi = (w / Math.pow(h / 100, 2)).toFixed(1)
  const num = parseFloat(bmi)
  let cat = '', color = '', plan = ''
  if (num < 18.5) { cat = 'Underweight'; color = 'text-sky-400'; plan = 'Surplus diet + Strength 4x/week + Creatine. Talk to Arjun.' }
  else if (num < 25) { cat = 'Fit - Maintain'; color = 'text-gym-lime'; plan = 'Maintain + CrossFit 3x + Yoga 2x. Perfect for Pro Beast plan.' }
  else if (num < 30) { cat = 'Overweight'; color = 'text-orange-400'; plan = 'Calorie deficit + HIIT 4x/week with Sofia. High protein.' }
  else { cat = 'Obese'; color = 'text-red-400'; plan = 'Personal coaching recommended. Start with walking + diet + Yoga.' }

  return (
    <section id="bmi" className="py-20 max-w-7xl mx-auto px-4">
      <div className="rounded-3xl overflow-hidden border border-gym-border grid lg:grid-cols-2">
        <div className="relative min-h-[320px]">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop" alt="BMI real" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gym-black/20" />
          <div className="absolute bottom-5 left-5 glass border border-white/15 rounded-2xl p-4">
            <div className="font-display text-3xl">BMI <span className="text-gym-lime">CHECK</span></div>
            <div className="text-xs text-zinc-300">Real coach advice, not just numbers</div>
          </div>
        </div>
        <div className="bg-gym-card p-8">
          <div className="flex items-center gap-2 font-bold"><Calculator size={20} className="text-gym-lime" /> Advanced BMI + Plan Suggestor</div>
          {[
            ['Height (cm)', h, setH, 140, 210],
            ['Weight (kg)', w, setW, 35, 150],
            ['Age', age, setAge, 12, 80],
          ].map(([label, val, set, min, max]) => (
            <div key={label} className="mt-5">
              <div className="flex justify-between text-sm mb-2"><span>{label}</span><span className="font-bold text-gym-lime">{val}</span></div>
              <input type="range" min={min} max={max} value={val} onChange={e => set(Number(e.target.value))} className="w-full accent-[#D4FF3F]" />
            </div>
          ))}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-black/50 rounded-2xl p-5 text-center border border-white/10">
              <div className="text-xs text-zinc-400">YOUR BMI</div>
              <div className="font-display text-4xl mt-1">{bmi}</div>
              <div className={`text-sm font-bold ${color}`}>{cat}</div>
            </div>
            <div className="bg-gym-lime text-black rounded-2xl p-5 text-sm font-medium">💡 {plan}</div>
          </div>
          <a href="#pricing" className="mt-5 block text-center py-3.5 rounded-full bg-white text-black font-bold hover:bg-gym-lime transition min-h-[48px] flex items-center justify-center">Get My Custom Plan</a>
        </div>
      </div>
    </section>
  )
}
