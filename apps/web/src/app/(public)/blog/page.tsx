"use client";

import { useState } from "react";
import { BookOpen, Calendar, User, ArrowRight, Search, Tag, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

interface BlogPost {
  id: number;
  title: string;
  image: string;
  date: string;
  author: string;
  tag: string;
  excerpt: string;
  content: string;
}

const ALL_BLOGS: BlogPost[] = [
  {
    id: 1,
    title: "How to Stay Consistent With Quran Learning: Proven Tips",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/how-to-stay-consistent-while-reading-quran-2-ruqv26vgng5r6gv0gcj1miczhs82kq6l3it9n2w48g.png",
    date: "12 Oct, 2026",
    author: "M Orhan",
    tag: "Quran Learning",
    excerpt: "Most people who start learning the Quran begin with great enthusiasm, but staying consistent over time can be a challenge. Discover proven tips for building a lasting Quran reading and learning habit.",
    content: "Learning the Holy Quran is a blessed lifelong journey. Setting a fixed daily time slot, beginning with small manageable targets (such as 15 minutes a day), learning alongside a dedicated certified teacher, and keeping a track of daily revision (Muraja'ah) ensures consistent spiritual growth."
  },
  {
    id: 2,
    title: "Nikkah in Islam: Pillars, Conditions and Common Mistakes Explained",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/nikah-in-islam-rui3umzs747sddtb6t0rriws9cv4pc6qmcqi1u0r5c.png",
    date: "07 Oct, 2026",
    author: "M Orhan",
    tag: "Islamic Teachings",
    excerpt: "Nikkah is the sacred Islamic marriage contract that unites two souls in a blessed bond. Understand the essential pillars, conditions (Ijab, Qabul, Mahr, witnesses), and common mistakes to avoid.",
    content: "In Islam, the marriage contract (Nikkah) is built upon mutual consent, clear offer and acceptance (Ijab & Qabul), the presence of upright witnesses, and the specification of the bridal gift (Mahr). Understanding these Islamic fundamentals protects families and fosters harmony."
  },
  {
    id: 3,
    title: "5 Times Namaz Name: A Simple Guide to the Five Daily Prayers",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/namaz-names-ru9pistrcf296x725pgnziuz43x06f3rwcv5mtlgfk.png",
    date: "02 Oct, 2026",
    author: "M Orhan",
    tag: "Salah Guide",
    excerpt: "What are the 5 names of Namaz in Islam? Fajr, Dhuhr, Asr, Maghrib, and Isha. A simple, comprehensive guide to prayer timings, Rak'ahs, and their spiritual significance.",
    content: "The five daily prayers (Salah) are the second pillar of Islam and a direct spiritual connection between the believer and Allah. Fajr brings light at dawn, Dhuhr centers the soul midday, Asr reminds us of passing time, Maghrib honors the sunset, and Isha provides peaceful reflection before night rest."
  },
  {
    id: 4,
    title: "Spiritual Lessons Muslims Can Learn From Umrah Rituals",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/umrah-rituals-rtx7bb4oyg886zhcixh5sfem30kvd2hiwpzy94lshc.png",
    date: "25 Sep, 2026",
    author: "M Orhan",
    tag: "Spiritual Lessons",
    excerpt: "Umrah is a deeply meaningful act of worship that purifies the soul. Learn about the transformative spiritual lessons embedded within Ihram, Tawaf, and Sa'i.",
    content: "Entering the state of Ihram strips away worldly status, wealth, and ego. Performing Tawaf around the Holy Kaaba demonstrates unity around Allah, while Sa'i between Safa and Marwah honors the unwavering faith and maternal perseverance of Sayyidah Hajar."
  },
  {
    id: 5,
    title: "What Should You Do After Arriving in Saudi Arabia for Umrah?",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/umrah-saudi-arabia-rsva6098e00jfdrwklp4b2nk07inht1le27mfcu1kg.png",
    date: "03 Sep, 2026",
    author: "M Orhan",
    tag: "Umrah Guide",
    excerpt: "Performing Umrah is a blessing of a lifetime. Here is a clear practical checklist of what to do right after landing at Jeddah or Madinah airport up to entering the Haram.",
    content: "Upon landing in Saudi Arabia, maintain the Talbiyah in your heart, complete biometric and immigration checks, arrange authorized transport, check into your hotel, perform fresh ablution (Wudu), and proceed calmly towards the Grand Mosque of Makkah with humility and reverence."
  },
  {
    id: 6,
    title: "Noorani Qaida for Beginners: First Step to Reading the Quran Correctly",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/noorani-qaida-rs6dobxn1fsat53864n0r81gvccv10seu750xhc29c.png",
    date: "20 Aug, 2026",
    author: "M Orhan",
    tag: "Quran Learning",
    excerpt: "The process of learning to read the Holy Quran begins with Noorani Qaida. Explore how this structured curriculum teaches letter shapes, phonetics, and Tajweed foundations.",
    content: "Noorani Qaida is recognized worldwide as the most effective curriculum for non-Arabic speakers. It systematically progresses from individual letters to connected script, short vowels (Harakat), Tanween, Sukoon, and Tashdeed, preparing students for smooth Quranic recitation."
  },
  {
    id: 7,
    title: "Umrah 2026: The Complete Guide for First-Time Pilgrims",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/umrah-2026-guide-rrp5vkyu6nbbwnloybj5arn5h122dupzscdxj0o50w.png",
    date: "10 Aug, 2026",
    author: "M Orhan",
    tag: "Umrah Guide",
    excerpt: "For many Muslims, Umrah is a dream close to the heart. This complete guide walks you through visa requirements, essential packing, Tawaf steps, and recommended supplications.",
    content: "First-time pilgrims benefit tremendously from spiritual and practical preparation. Learn the 4 fundamental pillars of Umrah: Ihram at the Miqat, 7 circuits of Tawaf, 7 laps of Sa'i, and Tahallul (cutting or shaving hair) to complete the pilgrimage."
  },
  {
    id: 8,
    title: "How to Prepare for Umrah 2027: A Complete Guide for Pilgrims",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/how-to-prepare-for-umrah-rrizadwld3upud7te2lkedbj2r2xhhvzqpe85rwzn4.png",
    date: "07 Aug, 2026",
    author: "M Orhan",
    tag: "Travel & Worship",
    excerpt: "Umrah is a special spiritual milestone. Preparing early in terms of physical stamina, Islamic knowledge, and spiritual intention ensures an accepted and smooth pilgrimage.",
    content: "Early preparation includes studying the Fiqh of Umrah, learning key supplications from the Sunnah, improving walking endurance, and resolving debts and seeking forgiveness from relatives before embarking on the blessed journey."
  },
  {
    id: 9,
    title: "Umrah 2027 Packing Guide for Muslim Travellers",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/umrah-packing-guide-rrgmritd4qehi959krzuo84y28yvjdxipxfvmvlmcw.png",
    date: "05 Aug, 2026",
    author: "M Orhan",
    tag: "Travel & Worship",
    excerpt: "Packing for Umrah is an important part of your travel preparation. Here is a comprehensive checklist of clothing, essentials, footwear, and travel documents needed.",
    content: "Key packing essentials include two sets of unstitched white towels for men (Ihram), comfortable prayer garments for women, unscented soaps and toiletries, comfortable non-slip walking sandals, digital Dua books, and certified passport documentation."
  },
  {
    id: 10,
    title: "The 8 Most Trusted Umrah Travel Agencies in the UK",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/umrah-travel-agencies-in-the-uk-rrgkxmcpyw6rigveeahhuutippsfvcb0bqucchbals.png",
    date: "05 Aug, 2026",
    author: "M Orhan",
    tag: "UK Travel",
    excerpt: "Planning an Umrah is one of the most meaningful spiritual journeys. Choosing a licensed, trustworthy ATOL-certified agency in the UK makes all the difference.",
    content: "When booking from the United Kingdom, verifying Ministry of Hajj & Umrah authorized partnerships, ATOL financial bonding, close proximity of hotels to the Haramain, and transparent airline inclusions ensures peace of mind."
  },
  {
    id: 11,
    title: "Best Online Quran Learning Platforms in the UK for Children and Adults",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/online-quran-learing-platforms-rr1fj8m75a76towne7zh8iuzkx5obn66ukv9y5enhs.png",
    date: "28 Jul, 2026",
    author: "M Orhan",
    tag: "Quran Learning",
    excerpt: "Learning the Quran has become easier than ever with interactive digital academies. Compare the top features, curriculum options, and teacher qualifications.",
    content: "A premier online Quran academy provides 1-on-1 certified native tutors, interactive digital Mushafs with real-time word highlighting, flexible class timing that matches British school hours, and bilingual instruction in English and Urdu."
  },
  {
    id: 12,
    title: "How to Choose an Online Quran Teacher for Your Child: A Parent's Checklist",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/how-to-choose-online-quran-teacher1-rqvkzr91sqgju2j08y5qc6h4q3gm3j5hfmi3c7kx2o.webp",
    date: "24 Jul, 2026",
    author: "M Orhan",
    tag: "Parent Guide",
    excerpt: "Choosing the right Quran teacher is one of the most impactful choices for your child's spiritual education. Check qualifications, Tajweed mastery, patience, and communication.",
    content: "Parents should look for teachers with verified Ijazah, proven patience with young children, strong command of English for clear explanations, structured lesson plans, and an academy that offers monthly progress reports."
  },
  {
    id: 13,
    title: "Do You Need a Mahram for Umrah? Rules for Women Travelling from the UK?",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/mahram-for-umrah-rqfvmrwe4srf9adbd9dii6mgiopvy3835ptmwh5euo.png",
    date: "15 Jul, 2026",
    author: "Academic Faculty",
    tag: "Islamic Teachings",
    excerpt: "Updated rules and Fiqh guidelines regarding women travelling for Umrah with or without a Mahram under recent regulations and classical scholarship.",
    content: "Recent official regulations permit women aged 45 and above (and increasingly in organized safe groups of any age) to travel for Umrah without a male Mahram. We explain both legal travel regulations and the differing classical scholarly rulings."
  },
  {
    id: 14,
    title: "What Is Umrah? A Complete Step-by-Step Guide for First-Time Pilgrims",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/what-is-umrah-rpfsseeoks2kxxinfp1lrhw42isokrpuh8zlca9bao.png",
    date: "24 Jun, 2026",
    author: "Academic Faculty",
    tag: "Umrah Guide",
    excerpt: "A beginner-friendly step-by-step breakdown of what Umrah is, the four core pillars, differences between Hajj and Umrah, and essential Dua etiquette.",
    content: "Unlike Hajj, which occurs during specific Islamic dates of Dhu al-Hijjah, Umrah is a non-mandatory spiritual pilgrimage that can be undertaken at any time of the year, carrying immense rewards for soul purification and forgiveness of sins."
  },
  {
    id: 15,
    title: "Step-by-Step Guide to a Smooth and Comfortable Umrah Experience",
    image: "https://www.quranlearnacademy.com/wp-content/uploads/bfi_thumb/step-by-step-umrah-guide-rpbs9aohjley43bdwmipmhcquo8cgvr9sa0j44ya28.png",
    date: "22 Jun, 2026",
    author: "M Orhan",
    tag: "Travel & Worship",
    excerpt: "Performing a comfortable and smooth Umrah requires practical planning. Learn how to navigate crowded times, arrange transport between Makkah and Madinah, and stay healthy.",
    content: "Practical tips include performing Tawaf during off-peak hours (such as late night or between 8 AM and 11 AM), staying hydrated with Zamzam water, keeping a compact prayer mat, and utilizing high-speed Haramain rail connections between the two holy cities."
  }
];

export default function BlogPage() {
  const { t } = useLanguage();
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const tags = ["All", "Quran Learning", "Islamic Teachings", "Salah Guide", "Umrah Guide", "Parent Guide", "Travel & Worship"];

  const filteredBlogs = ALL_BLOGS.filter((blog) => {
    const matchesTag = selectedTag === "All" || blog.tag === selectedTag;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4">
          <BookOpen size={16} />
          <span>Quran Learn Academy Knowledge Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
          {t("blog")} & Educational Articles
        </h1>
        <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed">
          Comprehensive guides, learning tips, and spiritual insights directly from our experienced faculty.
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="glass-container rounded-2xl p-4 sm:p-6 border border-white/15 shadow-xl mb-12 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-200/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title or keyword..."
              className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Tags Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedTag === tag
                    ? "bg-amber-400 text-emerald-950 font-bold shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-emerald-100/80 border border-white/15"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredBlogs.map((post) => (
          <article
            key={post.id}
            className="glass-container rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col justify-between pop-hover group"
          >
            <div>
              {/* Featured Image */}
              <div className="relative w-full h-52 overflow-hidden bg-emerald-950/80">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    // Fallback to high quality geometric emerald background if external image fails
                    (e.target as HTMLImageElement).src =
                      "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/banner_1.2.jpg";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/40 text-amber-300 flex items-center gap-1 shadow-md">
                    <Tag size={11} />
                    <span>{post.tag}</span>
                  </span>
                </div>
              </div>

              {/* Content Info */}
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-emerald-100/60 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-amber-400" />
                    <span>{post.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-100/80">
                    <User size={13} className="text-amber-400" />
                    <span>{post.author}</span>
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-serif font-bold text-white mb-3 leading-snug group-hover:text-amber-300 transition">
                  {post.title}
                </h2>

                <p className="text-emerald-100/75 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Read Article Button */}
            <div className="px-6 pb-6 pt-2 border-t border-white/10 mt-auto">
              <button
                onClick={() => setActiveArticle(post)}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-amber-400 hover:text-emerald-950 text-amber-300 border border-white/20 py-2.5 rounded-xl font-bold text-xs transition duration-200 cursor-pointer shadow-sm"
              >
                <span>Read Full Article</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-16 glass-container rounded-3xl border border-white/15">
          <BookOpen size={40} className="mx-auto text-amber-300 mb-3 opacity-60" />
          <h3 className="text-xl font-bold font-serif text-white mb-1">No articles found</h3>
          <p className="text-emerald-100/70 text-sm">Try adjusting your search query or selected category.</p>
        </div>
      )}

      {/* Article Detail Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-container max-w-2xl w-full rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative text-white">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="w-full h-64 rounded-2xl overflow-hidden mb-6 bg-emerald-950">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/banner_1.2.jpg";
                }}
              />
            </div>

            <div className="flex items-center gap-4 text-xs text-emerald-100/70 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                {activeArticle.tag}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-amber-400" />
                {activeArticle.date}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <User size={13} className="text-amber-400" />
                {activeArticle.author}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-4 leading-tight">
              {activeArticle.title}
            </h2>

            <div className="space-y-4 text-emerald-100/85 text-sm sm:text-base leading-relaxed border-t border-white/10 pt-4">
              <p className="font-medium text-white/95">{activeArticle.excerpt}</p>
              <p>{activeArticle.content}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-6 py-2.5 rounded-xl transition text-sm cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
