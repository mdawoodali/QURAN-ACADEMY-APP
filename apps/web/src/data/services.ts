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
  }
];
