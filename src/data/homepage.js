import {
  BadgeHelp,
  Brain,
  Building2,
  Droplets,
  FlaskConical,
  HeartPulse,
  Hospital,
  Microscope,
  Navigation,
  PhoneCall,
  Pill,
  Scan,
  Smile,
  Stethoscope,
  Syringe,
  Users,
} from 'lucide-react'

export const navLinks = [
  { label: 'Find Doctors', href: '/find-doctors' },
  { label: 'Hospitals', href: '/hospitals' },
  { label: 'Medicines', href: '/medicines' },
  { label: 'Surgeries', href: '/surgeries' },
  { label: 'Software for Provider', href: '/software' },
  { label: 'Facilities', href: '/facilities' },
]

export const quickLinks = [
  { label: 'Doctors', icon: Stethoscope, isActive: false },
  { label: 'Labs', icon: FlaskConical, isActive: false },
  { label: 'Hospitals', icon: Hospital, isActive: false },
  { label: 'Medical Store', icon: Pill, isActive: false },
  { label: 'Ambulance', icon: Navigation, isActive: false },
]

export const promotions = [
  {
    title: 'Get Rs 100 OFF',
    description: 'On Doctor Consultation',
    action: 'Grab Now',
    image:
      'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop',
  },
  {
    title: 'Flat 30% OFF',
    description: 'On video consultation. Use code: FIRST30',
    action: 'zoutons!',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
  },
  {
    title: 'Get Rs 100 OFF',
    description: 'On Doctor Consultation',
    action: 'Grab Now',
    image:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop',
  },
]

export const specializations = [
  { name: 'Dentistry', icon: Smile },
  { name: 'Primary Care', icon: Stethoscope },
  { name: 'Cardiology', icon: HeartPulse },
  { name: 'MRI Resonance', icon: Microscope },
  { name: 'Blood Test', icon: Droplets },
  { name: 'Psychologist', icon: Brain },
  { name: 'Laboratory', icon: FlaskConical },
  { name: 'X-Ray', icon: Scan },
]

export const specialists = [
  {
    name: 'Dr. Henry Hull',
    department: 'Medicine',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=420&h=420&fit=crop',
  },
  {
    name: 'Dr. Ahmad Khan',
    department: 'Neurologist',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=420&h=420&fit=crop',
  },
  {
    name: 'Dr. Heena Sachdeva',
    department: 'Orthopaedics',
    image:
      'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=420&h=420&fit=crop',
  },
  {
    name: 'Dr. Ankur Sharma',
    department: 'Medicine',
    image:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=420&h=420&fit=crop',
  },
]

export const patientBenefits = [
  'Stay Updated About Your Health',
  'Check Your Results Online',
  'Manage Your Appointments',
]

export const newsArticles = [
  {
    title: '6 Tips To Protect Your Mental Health When You\'re Sick',
    category: 'Medical',
    date: 'March 31, 2022',
    author: 'Rebecca Lee',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=420&h=280&fit=crop',
  },
  {
    title: 'Understanding Chronic Disease Management',
    category: 'Health',
    date: 'April 15, 2022',
    author: 'Dr. Sarah Johnson',
    image:
      'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=420&h=280&fit=crop',
  },
  {
    title: 'The Importance of Regular Health Checkups',
    category: 'Wellness',
    date: 'May 2, 2022',
    author: 'Dr. Michael Chen',
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=420&h=280&fit=crop',
  },
]

export const stats = [
  {
    label: 'Happy Patients',
    value: '5000+',
    icon: Users,
  },
  {
    label: 'Hospitals',
    value: '200+',
    icon: Building2,
  },
  {
    label: 'Laboratories',
    value: '1000+',
    icon: Microscope,
  },
  {
    label: 'Expert Doctors',
    value: '700+',
    icon: Syringe,
  },
]

export const faqs = [
  {
    question: 'Why choose our medical for your family?',
    answer:
      'We offer comprehensive, patient-centric care with experienced specialists, modern facilities, and personalized treatment plans.',
  },
  {
    question: 'Why we are different from others?',
    answer:
      'Our hybrid platform blends virtual and in-person care, ensuring continuity across consultations, diagnostics, and follow-ups.',
  },
  {
    question: 'Trusted & experienced senior care & love',
    answer:
      'Our geriatric team provides compassionate support, preventive screenings, and long-term management tailored to seniors.',
  },
  {
    question: 'How to get appointment for emergency cases?',
    answer:
      'Use the emergency hotline within the app or call our 24/7 support team for immediate triage and priority scheduling.',
  },
]

export const contactDetails = {
  phone: '+91-88787878787',
  email: 'info@surynursinghome.com',
  address: 'Sahibabad, Ghaziabad, Uttar Pradesh 201005',
  socials: [
    { label: 'facebook', href: 'https://facebook.com' },
    { label: 'twitter', href: 'https://twitter.com' },
    { label: 'linkedin', href: 'https://linkedin.com' },
    { label: 'instagram', href: 'https://instagram.com' },
  ],
}

export const footerLinks = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Pricing', href: '#pricing' },
      { label: 'Our Gallery', href: '#gallery' },
      { label: 'Appointment', href: '#appointment' },
      { label: 'Privacy Policy', href: '#privacy' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Orthology', href: '#orthology' },
      { label: 'Neurology', href: '#neurology' },
      { label: 'Dental Care', href: '#dental' },
      { label: 'Ophthalmology', href: '#ophthalmology' },
      { label: 'Cardiology', href: '#cardiology' },
    ],
  },
]

export const hotline = {
  label: 'Happy Patients',
  value: '84k+',
  icon: BadgeHelp,
}

export const appScreens = [
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=320&h=640&fit=crop',
  'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=320&h=640&fit=crop',
]

export const supportChannels = [
  {
    title: 'Free Consultation',
    description: 'Consultation with the best',
    icon: PhoneCall,
  },
]

