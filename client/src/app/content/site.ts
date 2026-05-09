import {
  Baby,
  BookOpen,
  Brush,
  CalendarDays,
  ClipboardCheck,
  Compass,
  Drama,
  FlaskConical,
  Globe,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Medal,
  Microscope,
  Music4,
  ShieldCheck,
  Sparkles,
  Sprout,
  Trophy,
  Users,
} from "lucide-react";

export const schoolName = "Success Academy";
export const schoolTagline = "Nursery, Primary and Secondary School";

export const contactDetails = {
  phone: "+234 906 313 5544",
  phoneHref: "tel:+2349063135544",
  email: "info@successacademy.edu.ng",
  emailHref: "mailto:info@successacademy.edu.ng",
  whatsappHref: "https://wa.me/2349063135544",
  mapHref: "https://maps.google.com/?q=26+Excellence+Road+Victoria+Island+Lagos+Nigeria",
  address: "26 Excellence Road, Victoria Island, Lagos, Nigeria",
  hours: "Mon - Fri, 8:00 AM - 4:00 PM",
};

export const campusImages = {
  hero:
    "https://images.pexels.com/photos/12448839/pexels-photo-12448839.jpeg?auto=compress&cs=tinysrgb&w=1600",
  learners:
    "https://images.pexels.com/photos/34162709/pexels-photo-34162709.jpeg?auto=compress&cs=tinysrgb&w=1400",
  library:
    "https://images.pexels.com/photos/6346833/pexels-photo-6346833.jpeg?auto=compress&cs=tinysrgb&w=1400",
  classroom:
    "https://images.pexels.com/photos/34379888/pexels-photo-34379888.jpeg?auto=compress&cs=tinysrgb&w=1400",
  stem:
    "https://images.pexels.com/photos/34211750/pexels-photo-34211750.jpeg?auto=compress&cs=tinysrgb&w=1400",
  arts:
    "https://images.pexels.com/photos/34526413/pexels-photo-34526413.jpeg?auto=compress&cs=tinysrgb&w=1400",
  outdoors:
    "https://images.pexels.com/photos/33837417/pexels-photo-33837417.jpeg?auto=compress&cs=tinysrgb&w=1400",
  portrait:
    "https://images.pexels.com/photos/32443803/pexels-photo-32443803.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export const navItems = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/nursery", label: "Nursery" },
  { path: "/primary", label: "Primary" },
  { path: "/secondary", label: "Secondary" },
  { path: "/admissions", label: "Admissions" },
  { path: "/academics", label: "Academics" },
  { path: "/gallery", label: "Gallery" },
  { path: "/news", label: "News/Events" },
  { path: "/contact", label: "Contact" },
];

export const bottomNavItems = [
  { path: "/", label: "Home", shortLabel: "Home" },
  { path: "/academics", label: "Academics", shortLabel: "Study" },
  { path: "/admissions", label: "Admissions", shortLabel: "Apply" },
  { path: "/news", label: "News", shortLabel: "News" },
  { path: "/contact", label: "Contact", shortLabel: "Contact" },
];

export const homepageStats = [
  { value: "98%", label: "Parent satisfaction rate" },
  { value: "1:12", label: "Average early years staff ratio" },
  { value: "24+", label: "Clubs, labs and enrichment options" },
  { value: "100%", label: "Safeguarding trained staff" },
];

export const trustHighlights = [
  {
    title: "Safeguarding first",
    description: "Clear child protection systems, secure arrivals, and a pastoral team that knows every learner by name.",
    icon: ShieldCheck,
  },
  {
    title: "Strong academics",
    description: "A balanced curriculum with literacy, numeracy, science, creativity, and leadership development from nursery to secondary.",
    icon: GraduationCap,
  },
  {
    title: "Family partnership",
    description: "Open communication, progress updates, visit days, and practical support for parents during admissions and transition.",
    icon: HeartHandshake,
  },
];

export const facilities = [
  {
    title: "Early Years Discovery Rooms",
    description: "Purposeful play zones, reading corners, and sensory spaces designed for confident first learners.",
    icon: Sprout,
  },
  {
    title: "Science and STEM Labs",
    description: "Hands-on experiments, robotics clubs, and practical learning that builds curiosity and problem solving.",
    icon: Microscope,
  },
  {
    title: "Library and Media Suite",
    description: "Quiet reading areas, digital research access, and guided literacy support across key stages.",
    icon: BookOpen,
  },
  {
    title: "Arts and Performance Studios",
    description: "Music, drama, visual arts, and cultural showcases that give every learner room to express themselves.",
    icon: Drama,
  },
];

export const testimonials = [
  {
    quote: "The school feels structured, warm, and truly responsive. Our daughter settled quickly because communication with staff was excellent.",
    author: "Mrs. Adeyemi",
    role: "Primary parent",
  },
  {
    quote: "We wanted strong academics without losing care and character. Success Academy gives us both.",
    author: "Mr. Bello",
    role: "Secondary parent",
  },
  {
    quote: "Our son became more confident, especially with reading and presentations. The progress has been obvious within one term.",
    author: "Mrs. Okon",
    role: "Nursery parent",
  },
];

export const admissionsSteps = [
  {
    title: "Book a visit or enquiry call",
    description: "Speak with our admissions team, ask questions, and choose the right entry point for your child.",
    icon: CalendarDays,
  },
  {
    title: "Submit the application form",
    description: "Complete the online application with your child’s details, preferred programme, and parent contact information.",
    icon: ClipboardCheck,
  },
  {
    title: "Assessment and placement",
    description: "We review age, stage, and readiness to recommend the best class placement and onboarding support.",
    icon: Compass,
  },
  {
    title: "Receive offer and enrol",
    description: "Once accepted, families receive next steps for fees, documents, uniforms, and term start guidance.",
    icon: Medal,
  },
];

export const achievementCards = [
  {
    title: "Excellent transition support",
    description: "Structured onboarding helps children move smoothly into nursery, primary, or secondary learning.",
    icon: Sparkles,
  },
  {
    title: "Balanced child development",
    description: "Academic growth is paired with confidence, kindness, leadership, and creativity.",
    icon: Users,
  },
  {
    title: "Reliable school-home communication",
    description: "Parents receive timely updates for events, wellbeing, academics, and admissions.",
    icon: Landmark,
  },
  {
    title: "Co-curricular excellence",
    description: "Music, sport, art, debate, coding, and clubs expand learning beyond the classroom.",
    icon: Trophy,
  },
];

export type ProgramKey = "nursery" | "primary" | "secondary";

export const programmes: Record<
  ProgramKey,
  {
    path: string;
    title: string;
    ageRange: string;
    description: string;
    image: string;
    focusPoints: string[];
    curriculum: { title: string; description: string; icon: typeof Baby }[];
    ctaLabel: string;
  }
> = {
  nursery: {
    path: "/nursery",
    title: "Nursery",
    ageRange: "Ages 2 - 5",
    description:
      "A warm, structured early years environment where children learn through guided play, language development, routine, and discovery.",
    image: campusImages.classroom,
    focusPoints: [
      "Phonics and early literacy foundations",
      "Fine motor, social, and emotional development",
      "Music, stories, movement, and sensory exploration",
    ],
    curriculum: [
      { title: "Early language", description: "Listening, speaking, story time, and phonemic awareness.", icon: Baby },
      { title: "Creative discovery", description: "Art, music, role play, and hands-on exploration.", icon: Brush },
      { title: "Healthy routines", description: "Confidence, independence, and positive classroom habits.", icon: HeartHandshake },
    ],
    ctaLabel: "Apply for Nursery",
  },
  primary: {
    path: "/primary",
    title: "Primary",
    ageRange: "Ages 6 - 11",
    description:
      "A rich primary curriculum that strengthens literacy, numeracy, curiosity, and character while building confident independent learners.",
    image: campusImages.learners,
    focusPoints: [
      "English, mathematics, science, and humanities",
      "Project-based learning and practical discovery",
      "Clubs, reading culture, and communication skills",
    ],
    curriculum: [
      { title: "Core academics", description: "Strong daily foundations in reading, writing, mathematics, and science.", icon: BookOpen },
      { title: "Global awareness", description: "Humanities, citizenship, and collaborative learning experiences.", icon: Globe },
      { title: "Creative confidence", description: "Art, music, speaking, and performance woven into weekly learning.", icon: Music4 },
    ],
    ctaLabel: "Apply for Primary",
  },
  secondary: {
    path: "/secondary",
    title: "Secondary",
    ageRange: "Ages 12 - 18",
    description:
      "A disciplined, aspirational secondary pathway that prepares learners for examinations, leadership, and purposeful next-step choices.",
    image: campusImages.stem,
    focusPoints: [
      "Strong examination preparation and study skills",
      "Career guidance, leadership, and mentoring",
      "Laboratory science, humanities, technology, and enrichment",
    ],
    curriculum: [
      { title: "STEM and sciences", description: "Practical science, mathematics, and critical thinking for future pathways.", icon: FlaskConical },
      { title: "Humanities and language", description: "Communication, research, literature, and social understanding.", icon: Landmark },
      { title: "Leadership readiness", description: "Mentoring, service, and personal development for life beyond school.", icon: Medal },
    ],
    ctaLabel: "Apply for Secondary",
  },
};

export const galleryImages = [
  {
    category: "Campus life",
    alt: "Learners walking through a bright school corridor at Success Academy",
    url: campusImages.hero,
  },
  {
    category: "Early years",
    alt: "Nursery pupils learning in a bright classroom at Success Academy",
    url: campusImages.classroom,
  },
  {
    category: "Library",
    alt: "Students reading together in the library at Success Academy",
    url: campusImages.library,
  },
  {
    category: "STEM",
    alt: "Secondary learners in a science and technology lesson at Success Academy",
    url: campusImages.stem,
  },
  {
    category: "Creative arts",
    alt: "Pupils taking part in an arts session at Success Academy",
    url: campusImages.arts,
  },
  {
    category: "Outdoor learning",
    alt: "Students enjoying structured outdoor learning activities at Success Academy",
    url: campusImages.outdoors,
  },
];

export type NewsItem = {
  slug: string;
  title: string;
  image: string;
  excerpt: string;
  date: string;
  category: string;
  content: string[];
};

export const newsItems: NewsItem[] = [
  {
    slug: "open-day-family-campus-tour",
    title: "Families invited to our 2026 Open Day and guided campus tours",
    image: campusImages.hero,
    excerpt:
      "Prospective families can now reserve guided tours, classroom visits, and admissions conversations during our open day programme.",
    date: "April 20, 2026",
    category: "Admissions",
    content: [
      "Success Academy has opened bookings for its 2026 open day programme, giving families the opportunity to tour classrooms, meet school leaders, and explore learning spaces across nursery, primary, and secondary sections.",
      "The event is designed to help parents understand the school’s academic structure, safeguarding systems, pastoral support, and admissions process before making enrolment decisions.",
      "Families who attend can also speak directly with the admissions team about placement, fees, application requirements, and transition support.",
    ],
  },
  {
    slug: "science-fair-student-projects",
    title: "Student science fair showcases practical thinking and confident presentation",
    image: campusImages.stem,
    excerpt:
      "Learners presented creative science projects that highlighted experimentation, teamwork, and strong communication skills.",
    date: "March 18, 2026",
    category: "Events",
    content: [
      "This term’s science fair brought together projects from across year groups, with students exploring renewable energy, healthy ecosystems, and everyday engineering ideas.",
      "Teachers praised the standard of presentation and the way students explained their findings with growing confidence and curiosity.",
      "The event reflects Success Academy’s emphasis on learning that moves beyond memorisation into practical problem solving.",
    ],
  },
  {
    slug: "reading-week-community-storytelling",
    title: "Reading Week strengthens literacy through storytelling and family participation",
    image: campusImages.library,
    excerpt:
      "A full week of reading activities encouraged learners and parents to celebrate books, vocabulary, and confident expression.",
    date: "February 14, 2026",
    category: "Academics",
    content: [
      "Reading Week at Success Academy featured guest readers, class read-aloud sessions, phonics activities, and storytelling moments for different age groups.",
      "Parents were invited to join selected sessions, helping build a stronger bridge between school literacy work and reading habits at home.",
      "The programme supported the school’s long-term goal of raising fluent, thoughtful readers across every stage of learning.",
    ],
  },
];

export function getNewsItem(slug: string) {
  return newsItems.find((item) => item.slug === slug);
}
