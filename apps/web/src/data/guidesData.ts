export interface GuideResource {
  id: string;
  title: string;
  desc: string;
  format: string;
  tag: string;
  sections: {
    heading: string;
    subheading?: string;
    arabic?: string;
    transliteration?: string;
    translation?: string;
    explanation?: string;
    bullets?: string[];
  }[];
}

export const DAILY_GUIDES_DATA: GuideResource[] = [
  {
    id: "noorani-qaida",
    title: "Noorani Qaida (Color Coded Tajweed)",
    desc: "Complete digital beginner guide for learning Arabic alphabets, vowels, and pronunciation rules.",
    format: "Interactive Reader + PDF",
    tag: "Foundational",
    sections: [
      {
        heading: "Lesson 1: The Arabic Alphabets (Huroof al-Mufradat)",
        subheading: "29 Letters with Correct Makharij Articulation",
        arabic: "ا  ب  ت  ث  ج  ح  خ  د  ذ  ر  ز  س  ش  ص  ض  ط  ظ  ع  غ  ف  ق  ك  ل  م  ن  و  ه  ء  ي",
        transliteration: "Alif, Baa, Taa, Thaa, Jeem, Haa, Khaa, Daal, Dhaal, Raa, Zaa, Seen, Sheen, Saad, Daad, Taa, Dhaa, 'Ayn, Ghayn, Faa, Qaaf, Kaaf, Laam, Meem, Noon, Waw, Haa, Hamzah, Yaa",
        explanation: "Master the exact articulation point (Makhraj) for each letter. Letters in bold (Khaa, Saad, Daad, Taa, Dhaa, Ghayn, Qaaf) are pronounced with a full, elevated mouth (Mufakhkham)."
      },
      {
        heading: "Lesson 2: Compound Letters (Huroof al-Murakkabat)",
        subheading: "Recognizing letters in joined forms (Initial, Medial, Final)",
        arabic: "لا  -  با  -  تا  -  ثا  -  بل  -  تل  -  ثل  -  بح  -  تح  -  ثج  -  نج  -  يح",
        explanation: "In Arabic, letters change shape depending on their position in the word. Practice recognizing each letter by its dots (Nuqta) and primary teeth/loops."
      },
      {
        heading: "Lesson 3: Harakat (Short Vowels)",
        subheading: "Fatha (Zabar), Kasra (Zair), Damma (Paish)",
        arabic: "بَ  -  بِ  -  بُ  |  تَ  -  تِ  -  تُ  |  ثَ  -  ثِ  -  ثُ",
        transliteration: "Ba - Bi - Bu | Ta - Ti - Tu | Tha - Thi - Thu",
        explanation: "Harakat are short vowels that give motion to letters. They are pronounced briskly for 1 count without elongation or jerk (Majhool)."
      },
      {
        heading: "Lesson 4: Tanween (Double Vowels)",
        subheading: "Two Fathas (Zabarn), Two Kasras (Zairn), Two Dammas (Paishn)",
        arabic: "بً  -  بٍ  -  بٌ  |  تً  -  تٍ  -  تٌ",
        transliteration: "Ban - Bin - Bun | Tan - Tin - Tun",
        explanation: "Tanween produces a hidden Noon Sakinah sound at the end of the letter. It triggers the four rules of Tajweed (Izhar, Idgham, Iqlab, Ikhfa)."
      },
      {
        heading: "Lesson 5: Sukun / Jazm & Qalqalah",
        subheading: "Echoing letters upon stoppage",
        arabic: "أَبْ  -  أَتْ  -  أَثْ  -  أَجْ  -  أَدْ  -  أَقْ  -  أَطْ",
        explanation: "When Sukun appears on the five Qalqalah letters (ق ط ب ج د), they produce a distinct bouncing echo when recited."
      }
    ]
  },
  {
    id: "masnoon-duas",
    title: "Daily Masnoon Duas & Supplications",
    desc: "Essential daily morning, evening, and situational prayers with Arabic text and English translation.",
    format: "Interactive Reader + PDF",
    tag: "Essential",
    sections: [
      {
        heading: "1. Upon Waking Up in the Morning",
        arabic: "اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ",
        transliteration: "Alhamdu lillāhil-ladhī ahyānā ba'da mā amātanā wa ilayhin-nushūr.",
        translation: "All praise belongs to Allah, Who brought us back to life after giving us death, and unto Him is the resurrection."
      },
      {
        heading: "2. Before Going to Sleep at Night",
        arabic: "بِاسْمِكَ اللّٰهُمَّ أَمُوْتُ وَأَحْيَا",
        transliteration: "Bismika Allāhumma amūtu wa ahyā.",
        translation: "In Your name, O Allah, I die and I live."
      },
      {
        heading: "3. Before Eating Meal",
        arabic: "بِسْمِ اللّٰهِ وَعَلَىٰ بَرَكَةِ اللّٰهِ",
        transliteration: "Bismillāhi wa 'alā barakatillāh.",
        translation: "In the name of Allah and with the blessings of Allah."
      },
      {
        heading: "4. After Finishing Meal",
        arabic: "اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِيْنَ",
        transliteration: "Alhamdu lillāhil-ladhī at'amanā wa saqānā wa ja'alanā minal-muslimīn.",
        translation: "Praise be to Allah Who has fed us, given us drink, and made us among the Muslims."
      },
      {
        heading: "5. Leaving the Home",
        arabic: "بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ",
        transliteration: "Bismillāhi tawakkaltu 'alallāh, lā hawla wa lā quwwata illā billāh.",
        translation: "In the name of Allah, I trust in Allah; there is no power and no might except through Allah."
      },
      {
        heading: "6. For Parents' Mercy & Forgiveness",
        arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        transliteration: "Rabbir-hamhumā kamā rabbayānī saghīrā.",
        translation: "My Lord! Bestow upon them Your mercy as they raised me when I was a child. (Surah Al-Isra 17:24)"
      }
    ]
  },
  {
    id: "tajweed-chart",
    title: "Tajweed Rules Quick Reference Chart",
    desc: "Single-page visual summary of Makharij, Noon Sakinah, Meem Sakinah, and Madd rules.",
    format: "Reference Guide + PDF",
    tag: "Reference",
    sections: [
      {
        heading: "1. The 5 Major Points of Articulation (Makharij al-Huroof)",
        bullets: [
          "Al-Jawf (Oral Cavity / Throat to Mouth): Letters of prolongation (ا , و , ي).",
          "Al-Halq (Throat): 6 letters divided into Bottom (ء , ه), Middle (ع , ح), and Top (غ , خ).",
          "Al-Lisan (Tongue): 18 letters including back (ق , ك), middle (ج , ش , ي), edges (ض , ل), and tip (ن , ر , ت , د , ط , ث , ذ , ظ , ز , س , ص).",
          "Ash-Shafatan (Lips): 4 letters: (ف) between inner lip and teeth; (ب , م , و) lips pressed or rounded.",
          "Al-Khayshum (Nasal Cavity): The origin of Ghunnah (nasal sound for Noon and Meem)."
        ]
      },
      {
        heading: "2. Rules of Noon Sakinah & Tanween",
        bullets: [
          "Izhar Halqi (Clear Pronunciation): When followed by throat letters (ء ه ع ح غ خ). No nasal elongation.",
          "Idgham (Assimilation / Merging): When followed by letters in يَرْمَلُون (ي ر م ل و ن). Ghunnah on (ي ن م و), without Ghunnah on (ل ر).",
          "Iqlab (Conversion): When followed by (ب), the Noon is changed into an unspoken (م) with Ghunnah for 2 counts.",
          "Ikhfa Haqiqi (Concealment): When followed by the remaining 15 letters. Light nasal hum maintained for 2 counts."
        ]
      },
      {
        heading: "3. Rules of Meem Sakinah",
        bullets: [
          "Ikhfa Shafawi (Lip Concealment): When Meem Sakin is followed by (ب). Pronounced with light lip closure and Ghunnah.",
          "Idgham Shafawi (Lip Merging): When followed by another (م). Merged with complete Ghunnah.",
          "Izhar Shafawi (Lip Clarity): When followed by any of the remaining 26 letters. Pronounced sharply with zero Ghunnah."
        ]
      },
      {
        heading: "4. Rules of Madd (Elongation)",
        bullets: [
          "Madd Asli / Tabee'i (Natural Elongation): 2 counts (Harakat). Standard length for Alif, Waw, and Yaa.",
          "Madd Muttasil (Connected): When Hamzah appears in the SAME word as the Madd letter. Elongated 4 to 5 counts.",
          "Madd Munfasil (Separated): When Hamzah appears at the beginning of the NEXT word. Elongated 4 to 5 counts.",
          "Madd Lazim (Compulsory): When Sukun Asli or Shaddah follows the Madd letter. Obligatory 6 counts."
        ]
      }
    ]
  },
  {
    id: "juz-amma",
    title: "30th Juz (Amma) Practice Reader",
    desc: "Short surahs with large clear Uthmani script and word-by-word markers for young reciters.",
    format: "Interactive Reader + PDF",
    tag: "Practice",
    sections: [
      {
        heading: "Surah Al-Ikhlas (The Sincerity - 112)",
        arabic: "قُلْ هُوَ اللّٰهُ أَحَدٌ ۞ اللّٰهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        transliteration: "Qul huwa Allāhu ahad. Allāhus-samad. Lam yalid wa lam yūlad. Wa lam yakul-lahu kufuwan ahad.",
        translation: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'"
      },
      {
        heading: "Surah Al-Falaq (The Daybreak - 113)",
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        transliteration: "Qul a'ūdhu bi rabbil-falaq. Min sharri mā khalaq. Wa min sharri ghāsiqin idhā waqab. Wa min sharrin-naffāthāti fīl-'uqad. Wa min sharri hāsidin idhā hasad.",
        translation: "Say, 'I seek refuge in the Lord of daybreak, From the evil of that which He created, And from the evil of darkness when it settles, And from the evil of the blowers in knots, And from the evil of an envier when he envies.'"
      },
      {
        heading: "Surah An-Nas (Mankind - 114)",
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",
        transliteration: "Qul a'ūdhu bi rabbin-nās. Malikin-nās. Ilāhin-nās. Min sharril-waswāsil-khannās. Alladhī yuwaswisu fī sudūrin-nās. Minal-jinnati wan-nās.",
        translation: "Say, 'I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer - Who whispers into the breasts of mankind - From among the jinn and mankind.'"
      },
      {
        heading: "Surah Al-Kawthar (Abundance - 108)",
        arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۞ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۞ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
        transliteration: "Innā a'taynākal-kawthar. Fasalli li rabbika wanhar. Inna shāni'aka huwal-abtar.",
        translation: "Indeed, We have granted you [O Muhammad], al-Kawthar. So pray to your Lord and sacrifice. Indeed, your enemy is the one cut off."
      }
    ]
  }
];
