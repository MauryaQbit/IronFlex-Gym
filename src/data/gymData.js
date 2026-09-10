export const IMGS = {
  hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop",
  hero2: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920&auto=format&fit=crop",
  darkGym: "https://images.unsplash.com/photo-1571902943202-507ec2618e38?q=80&w=1200&auto=format&fit=crop",
};

export const programs = [
  {
    id: 1,
    title: "Strength Training",
    desc: "Barbells, dumbbells & power racks with progressive overload coaching.",
    img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop",
    level: "All Levels",
    calories: "400-600 kcal",
  },
  {
    id: 2,
    title: "HIIT & Cardio Burn",
    desc: "Treadmills, assault bikes & battle ropes to shred fat fast.",
    img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop",
    level: "Intermediate",
    calories: "500-800 kcal",
  },
  {
    id: 3,
    title: "CrossFit WOD",
    desc: "Daily WODs, box jumps, kettlebells & Olympic lifting zone.",
    img: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=800&auto=format&fit=crop",
    level: "Advanced",
    calories: "600-900 kcal",
  },
  {
    id: 4,
    title: "Yoga & Mobility",
    desc: "Flexibility, breathwork & recovery to keep you injury-free.",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    level: "Beginner",
    calories: "200-350 kcal",
  },
  {
    id: 5,
    title: "Boxing & MMA",
    desc: "Heavy bags, speed bags & coached sparring conditioning.",
    img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800&auto=format&fit=crop",
    level: "All Levels",
    calories: "500-750 kcal",
  },
  {
    id: 6,
    title: "Personal Coaching",
    desc: "1-on-1 transformation plan with diet + workout tracking.",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
    level: "Custom",
    calories: "Personalized",
  },
];

export const trainers = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "Strength & Powerlifting",
    exp: "8 yrs",
    img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Sofia Khan",
    role: "HIIT & Fat Loss",
    exp: "6 yrs",
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Rohan Singh",
    role: "CrossFit & Conditioning",
    exp: "7 yrs",
    img: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Yoga & Mobility",
    exp: "5 yrs",
    img: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=600&auto=format&fit=crop",
    rating: 5.0,
  },
];

export const schedule = [
  { id: 1, day: "Mon", time: "6:00 AM", class: "Power Strength", trainer: "Arjun", seats: 12 },
  { id: 2, day: "Mon", time: "7:30 AM", class: "HIIT Burn", trainer: "Sofia", seats: 20 },
  { id: 3, day: "Tue", time: "6:00 AM", class: "CrossFit WOD", trainer: "Rohan", seats: 15 },
  { id: 4, day: "Tue", time: "6:00 PM", class: "Boxing Basics", trainer: "Rohan", seats: 10 },
  { id: 5, day: "Wed", time: "7:00 AM", class: "Yoga Flow", trainer: "Priya", seats: 25 },
  { id: 6, day: "Thu", time: "6:00 AM", class: "Leg Day Blast", trainer: "Arjun", seats: 12 },
  { id: 7, day: "Fri", time: "7:30 AM", class: "Fat Burn Extreme", trainer: "Sofia", seats: 20 },
  { id: 8, day: "Sat", time: "8:00 AM", class: "Full Body + Core", trainer: "All Coaches", seats: 30 },
];

export const products = [
  {
    id: 1,
    name: "Whey Protein 1kg",
    price: 2499,
    oldPrice: 2999,
    img: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Gym Gloves Pro",
    price: 799,
    oldPrice: 1199,
    img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600&auto=format&fit=crop",
    tag: "New",
  },
  {
    id: 3,
    name: "Creatine Monohydrate",
    price: 1299,
    oldPrice: 1599,
    img: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=600&auto=format&fit=crop",
    tag: "Power",
  },
  {
    id: 4,
    name: "Shaker + Belt Combo",
    price: 1499,
    oldPrice: 1999,
    img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=600&auto=format&fit=crop",
    tag: "Combo",
  },
];

export const testimonials = [
  { id: 1, name: "Vikram R.", text: "Lost 18kg in 5 months. The 3D equipment tour + personal plan changed everything.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", goal: "Fat Loss" },
  { id: 2, name: "Ananya S.", text: "Best trainers in town. Sofia's HIIT classes are addictive. Booking from site is super easy.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", goal: "HIIT" },
  { id: 3, name: "Karan J.", text: "Gained 6kg lean muscle. Strength zone + diet chart is world-class.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop", goal: "Muscle Gain" },
];

export const gallery = [
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600&auto=format&fit=crop",
];

export const pricing = [
  { id: 1, name: "Starter", price: 999, period: "/month", features: ["Gym floor access", "1 group class/day", "Locker facility", "BMI + diet chart"], highlight: false },
  { id: 2, name: "Pro Beast", price: 1999, period: "/month", features: ["24x7 access", "Unlimited classes", "1 PT session/week", "Sauna + recovery", "Shop 10% off"], highlight: true },
  { id: 3, name: "Annual King", price: 14999, period: "/year", features: ["Everything in Pro", "12 PT sessions", "Custom meal plan", "Transformation shoot"], highlight: false },
];
