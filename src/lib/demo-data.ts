/**
 * DEMO DATA — fictional content for the Forge Fitness Mumbai pitch demo.
 * No real people, no real businesses, no verified claims.
 * In production this is replaced by data from the backend.
 */

export const gym = {
  name: "Forge Fitness Mumbai",
  shortName: "Forge Fitness",
  tagline: "Strength is built, not bought.",
  intro:
    "A fictional strength & conditioning studio in Lower Parel, created to demonstrate the Gym Growth Platform.",
  phoneDisplay: "+91 90000 00000",
  phoneHref: "tel:+919000000000",
  whatsapp: "https://wa.me/919000000000",
  email: "hello@forgefitness.demo",
  address: {
    line1: "Unit 4, Mill Works Compound",
    line2: "Senapati Bapat Marg, Lower Parel",
    city: "Mumbai 400013",
  },
} as const;

export const stats = [
  { value: "1,200+", label: "Sessions coached / year" },
  { value: "8", label: "Certified coaches" },
  { value: "6", label: "Training programs" },
  { value: "5,000", label: "Sq. ft. training floor" },
] as const;

export const programs = [
  {
    id: "strength",
    name: "Strength Foundations",
    duration: "60 min",
    level: "Beginner friendly",
    description:
      "Barbell fundamentals — squat, hinge, press and pull — coached with technique-first progressions.",
  },
  {
    id: "hiit",
    name: "Metcon HIIT",
    duration: "45 min",
    level: "All levels",
    description:
      "High-intensity intervals on turf and rig. Conditioning that fits a working week in the city.",
  },
  {
    id: "pt",
    name: "1-on-1 Personal Training",
    duration: "50 min",
    level: "Tailored",
    description:
      "A dedicated coach, a written plan and weekly check-ins built around your schedule and goals.",
  },
  {
    id: "transform",
    name: "12-Week Transformation",
    duration: "12 weeks",
    level: "Committed",
    description:
      "Structured training blocks with nutrition coaching, monthly measurements and progress reviews.",
  },
  {
    id: "mobility",
    name: "Mobility & Recovery",
    duration: "40 min",
    level: "All levels",
    description:
      "Desk-body maintenance: hip and shoulder mobility, breathing and controlled stretch work.",
  },
  {
    id: "smallgroup",
    name: "Small Group Strength",
    duration: "55 min",
    level: "Max 6 people",
    description:
      "Coached lifting in a small group — the accountability of a class with near-personal attention.",
  },
] as const;

export const memberships = [
  {
    id: "monthly",
    name: "Monthly",
    price: "₹3,499",
    period: "per month",
    featured: false,
    features: [
      "Full gym floor access",
      "2 group classes / week",
      "Induction & fitness assessment",
      "Locker & shower access",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: "₹8,999",
    period: "per 3 months",
    featured: true,
    features: [
      "Everything in Monthly",
      "Unlimited group classes",
      "Monthly body composition check",
      "1 personal training session / month",
      "Guest pass every month",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: "₹28,999",
    period: "per year",
    featured: false,
    features: [
      "Everything in Quarterly",
      "4 personal training sessions",
      "Nutrition consultation",
      "Membership freeze up to 30 days",
    ],
  },
] as const;

export const trainers = [
  {
    id: "t1",
    name: "Coach A. Rane",
    role: "Head Coach — Strength",
    focus: "Powerlifting, barbell technique",
    initials: "AR",
  },
  {
    id: "t2",
    name: "Coach M. Iyer",
    role: "Conditioning Lead",
    focus: "HIIT, endurance, fat loss",
    initials: "MI",
  },
  {
    id: "t3",
    name: "Coach S. Kulkarni",
    role: "Personal Trainer",
    focus: "Post-injury return, mobility",
    initials: "SK",
  },
  {
    id: "t4",
    name: "Coach D. Fernandes",
    role: "Nutrition & Transformation",
    focus: "Body recomposition coaching",
    initials: "DF",
  },
] as const;

export const testimonials = [
  {
    id: "r1",
    quote:
      "The coaching is patient and structured. I finally understood how to lift without guessing, and I actually look forward to training days.",
    author: "Member since 2024",
    program: "Strength Foundations",
  },
  {
    id: "r2",
    quote:
      "Early morning classes fit around my commute, and the small group size means someone always corrects my form.",
    author: "Small group member",
    program: "Small Group Strength",
  },
  {
    id: "r3",
    quote:
      "The 12-week block gave me a plan instead of a vague intention. Weekly check-ins kept me honest.",
    author: "Transformation client",
    program: "12-Week Transformation",
  },
] as const;

export const openingHours = [
  { day: "Monday – Friday", hours: "05:30 – 22:30" },
  { day: "Saturday", hours: "06:00 – 21:00" },
  { day: "Sunday", hours: "07:00 – 14:00" },
  { day: "Public holidays", hours: "07:00 – 12:00" },
] as const;

export const faqs = [
  {
    q: "Is the free trial really free?",
    a: "In this demo, yes — the trial request form is a demonstration of how enquiries would be captured for a real gym.",
  },
  {
    q: "Do I need experience to start?",
    a: "Programs are written with beginner progressions, and every new member starts with an induction session.",
  },
  {
    q: "Can I freeze my membership?",
    a: "The annual plan in this demo includes a freeze of up to 30 days. Real policies would be set by the gym.",
  },
] as const;

export const fitnessGoals = [
  "Fat loss",
  "Build muscle",
  "Get stronger",
  "General fitness",
  "Sport performance",
  "Rehab / mobility",
] as const;

export const trainingTypes = [
  "Group classes",
  "Personal training",
  "Small group strength",
  "Gym floor only",
  "Not sure yet",
] as const;

export const preferredTimes = [
  "Early morning (5:30 – 8:00)",
  "Morning (8:00 – 12:00)",
  "Afternoon (12:00 – 16:00)",
  "Evening (16:00 – 20:00)",
  "Late evening (20:00 – 22:30)",
] as const;
