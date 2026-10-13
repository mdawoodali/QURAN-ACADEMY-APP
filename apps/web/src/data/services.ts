export interface CourseService {
  id: string;
  title: string;
  highlightWord: string;
  subtitle: string;
  badge: string;
  description: string;
  features: string[];
  targetAudience: string;
  duration: string;
  iconName: string;
}

export const ACADEMY_SERVICES: CourseService[] = [
  {
    id: "elementary-quran-reading",
    title: "Elementary Quran Reading Course",
    highlightWord: "Reading",
    subtitle: "Foundational Noorani Qaida & Arabic Phonetics",
    badge: "Foundation Level",
    description: "The basic Quran reading course has been designed specifically for children and beginners who do not have prior knowledge about recitation of the Holy Quran. Our experienced Online Quran Tutors take learners step by step through the Noorani Qaida, teaching them the correct pronunciation of Arabic alphabets and letter connections.",
    features: [
      "Noorani Qaida foundation with color-coded Tajweed guidance",
      "Arabic alphabet recognition and articulation points (Makharij)",
      "Connecting letters, short vowels (Harakat), and Tanween",
      "Gentle, patient teaching method tailored to novice reciters",
      "Interactive digital whiteboard practice with audio feedback"
    ],
    targetAudience: "Children (Ages 4+) & Adult Beginners",
    duration: "3 – 6 Months (Flexible, self-paced)",
    iconName: "BookOpen"
  },
  {
    id: "memorizing-quran-course",
    title: "Memorizing Quran Course (Hifz)",
    highlightWord: "Memorizing",
    subtitle: "Structured Hifz with Sabaq, Sabaqi & Manzil",
    badge: "Hifz Program",
    description: "Our Quran memorization course is designed for those who have a deep desire for Hifz but have been unable to do so due to unavailability of competent tutors or lack of disciplined routine. Memorize the Holy Quran word by word under the supervision of skilled, certified Huffaz through structured daily online classes.",
    features: [
      "Daily Sabaq (new memorization), Sabaqi (recent lessons), and Manzil (cumulative retention)",
      "Certified Hafiz-e-Quran instructors with continuous Tajweed monitoring",
      "Paced memorization tracks tailored to student memory capacity",
      "Techniques for long-term retention and eliminating common mistakes",
      "Comprehensive Juz completion certificates and milestones"
    ],
    targetAudience: "Motivated Children & Adults (Full or Selected Surahs)",
    duration: "Selected Surahs (6 Mos) / Full Hifz (2–3 Years)",
    iconName: "Sparkles"
  },
  {
    id: "learn-basic-islamic-concepts",
    title: "Learn Basic Islamic Concepts & Salah",
    highlightWord: "Islamic",
    subtitle: "Aqeedah, Namaz / Salah, 6 Kalmas & Masnoon Duas",
    badge: "Essential Knowledge",
    description: "For the purpose of making our Muslim brothers and sisters better Muslims, we have designed courses to help you understand the core teachings of Islam and the commandments of Allah (SWT). Learn how to perform Salah with correct postures and recitations, memorize essential daily Duas, and apply Islamic principles in everyday life.",
    features: [
      "Step-by-step Namaz / Salah instruction (prerequisites, Wudu, and postures)",
      "Memorization and translation of the 6 Kalmas of Islam",
      "Essential daily Masnoon Duas (eating, sleeping, leaving home, protection)",
      "Fundamental Islamic Aqeedah: Tawheed, Prophets, Angels, and the Hereafter",
      "Character building, Sunnah manners (Akhlaaq), and social etiquettes"
    ],
    targetAudience: "All Ages (Children, Youths, Adult Reverts & Refreshers)",
    duration: "3 – 6 Months (Modular syllabus)",
    iconName: "HeartHandshake"
  },
  {
    id: "quranic-courses-for-children",
    title: "Quranic Courses for Children",
    highlightWord: "Children",
    subtitle: "Interactive 1-on-1 Classes Tailored to Young Reciters",
    badge: "Kids Special",
    description: "Being a Muslim, we are expected to recite the Holy Quran properly and this is why Quran Learn Academy offers specialized Quranic courses for kids. We offer interactive, engaging one-on-one sessions ensuring your child recites the Holy Quran without hesitation and develops a lifelong love for Islamic learning.",
    features: [
      "Patient, encouraging certified teachers trained in child pedagogy",
      "Short 30-minute interactive classes preventing screen fatigue",
      "Child-friendly digital Mushaf with synchronous word highlighting",
      "Gamified stars, milestones, and completion certificates",
      "Monthly parent updates and transparent progress tracking"
    ],
    targetAudience: "Young Learners (Ages 4 to 15)",
    duration: "Ongoing Term-Based (Tailored to student pace)",
    iconName: "Users"
  }
];
