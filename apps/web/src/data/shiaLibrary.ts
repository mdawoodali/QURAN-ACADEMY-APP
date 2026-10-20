export interface ShiaBookSection {
  id: string;
  number: number;
  title: string;
  arabicTitle: string;
  arabicText: string;
  englishTranslation: string;
  theme: string;
  sourceReference: string;
}

export interface ShiaBook {
  id: string;
  slug: string;
  title: string;
  arabicTitle: string;
  author: string;
  compiler: string;
  era: string;
  description: string;
  totalSections: string;
  category: "Hadith" | "Sermons & Letters" | "Supplications" | "Rites & Ziyarat";
  licensing: "Public Domain" | "Open Translation" | "Educational License";
  downloadFileName: string;
  sections: ShiaBookSection[];
}

export const SHIA_LIBRARY_BOOKS: ShiaBook[] = [
  {
    id: "nahjul-balagha",
    slug: "nahjul-balagha",
    title: "Nahjul Balagha (Peak of Eloquence)",
    arabicTitle: "نَهْجُ الْبَلَاغَة",
    author: "Imam Ali ibn Abi Talib (AS)",
    compiler: "Al-Sharif al-Radi (400 AH / 1009 CE)",
    era: "1st Century Hijri / 7th Century CE",
    category: "Sermons & Letters",
    licensing: "Public Domain",
    totalSections: "241 Sermons • 79 Letters • 489 Short Sayings",
    downloadFileName: "Nahjul-Balagha-Selected-Sermons.txt",
    description: "The seminal anthology of sermons, letters, and wisdom of Amir al-Mu'minin Ali ibn Abi Talib (AS), celebrated across Islamic intellectual history for sublime Arabic rhetoric, theology, governance, and spiritual ethics.",
    sections: [
      {
        id: "nb-sermon-1",
        number: 1,
        title: "Sermon 1: The Oneness of Allah and Creation of the Universe",
        arabicTitle: "خُطْبَةٌ فِي تَوْحِيدِ اللَّهِ وَخَلْقِ الْعَالَم",
        arabicText: "الْحَمْدُ لِلَّهِ الَّذِي لَا يَبْلُغُ مِدْحَتَهُ الْقَائِلُونَ، وَلَا يُحْصِي نَعْمَاءَهُ الْعَادُّونَ، وَلَا يُؤَدِّي حَقَّهُ الْمُجْتَهِدُونَ، الَّذِي لَا يُدْرِكُهُ بُعْدُ الْهِمَمِ، وَلَا يَنَالُهُ غَوْصُ الْفِطَنِ، الَّذِي لَيْسَ لِصِفَتِهِ حَدٌّ مَحْدُودٌ، وَلَا نَعْتٌ مَوْجُودٌ.",
        englishTranslation: "Praise is due to Allah whose worth cannot be described by speakers, whose bounties cannot be counted by calculators, and whose claim cannot be discharged by those who strive. Whom the height of intellectual resolve cannot perceive and the deep dive of insight cannot reach. He for whose description there is no limit and no praise existing.",
        theme: "Tawheed & Divine Transcendence",
        sourceReference: "Nahjul Balagha, Sermon 1 (Sharif Razi compilation)"
      },
      {
        id: "nb-letter-53",
        number: 53,
        title: "Letter 53: Renowned Charter of Governance to Malik al-Ashtar",
        arabicTitle: "عَهْدُ أَمِيرِ الْمُؤْمِنِينَ إِلَى مَالِكِ الْأَشْتَرِ",
        arabicText: "وَأَشْعِرْ قَلْبَكَ الرَّحْمَةَ لِلرَّعِيَّةِ، وَالْـمَحَبَّةَ لَهُمْ، وَاللُّطْفَ بِهِمْ، وَلَا تَكُونَنَّ عَلَيْهِمْ سَبُعاً ضَارِياً تَغْتَنِمُ أَكْلَهُمْ، فَإِنَّهُمْ صِنْفَانِ: إِمَّا أَخٌ لَكَ فِي الدِّينِ، أَوْ نَظِيرٌ لَكَ فِي الْخَلْقِ.",
        englishTranslation: "Infuse your heart with mercy, love and kindness for your subjects. Be not in face of them a ravenous beast looking upon them as easy prey, for they are of two sorts: either your brother in religion, or your equal in creation.",
        theme: "Universal Human Rights & Justice in Governance",
        sourceReference: "Nahjul Balagha, Letter 53 (Recognized by the UN as a model of equitable governance)"
      },
      {
        id: "nb-saying-147",
        number: 147,
        title: "Saying 147: Discourse to Kumayl ibn Ziyad on Knowledge and People",
        arabicTitle: "حِكْمَةُ كُمَيْلِ بْنِ زِيَادٍ فِي أَقْسَامِ النَّاسِ",
        arabicText: "يَا كُمَيْلَ بْنَ زِيَادٍ، إِنَّ هَذِهِ الْقُلُوبَ أَوْعِيَةٌ، فَخَيْرُهَا أَوْعَاهَا، فَاحْفَظْ عَنِّي مَا أَقُولُ لَكَ: النَّاسُ ثَلَاثَةٌ: فَعَالِمٌ رَبَّانِيٌّ، وَمُتَعَلِّمٌ عَلَى سَبِيلِ نَجَاةٍ، وَهَمَجٌ رَعَاعٌ أَتْبَاعُ كُلِّ نَاعِقٍ.",
        englishTranslation: "O Kumayl ibn Ziyad! These hearts are vessels; the best of them is that which holds the most. People are of three kinds: the godly scholar, the seeker of knowledge upon the path of salvation, and the common riffraff following every caller.",
        theme: "Spiritual Epistemology & Seeking Truth",
        sourceReference: "Nahjul Balagha, Saying 147"
      }
    ]
  },
  {
    id: "sahifa-sajjadia",
    slug: "sahifa-sajjadia",
    title: "Al-Sahifa al-Sajjadiyya (Psalms of Islam)",
    arabicTitle: "الصَّحِيفَةُ السَّجَّادِيَّة",
    author: "Imam Ali ibn al-Husayn Zayn al-Abidin (AS)",
    compiler: "Transmission through Imam Muhammad al-Baqir (AS) & Zayd ibn Ali",
    era: "Late 1st Century Hijri (Post-Karbala)",
    category: "Supplications",
    licensing: "Public Domain",
    totalSections: "54 Primary Supplications • 15 Whispered Prayers (Munajat)",
    downloadFileName: "Sahifa-Sajjadiyya-Key-Duas.txt",
    description: "The oldest manual of Islamic supplication known as 'Injeel of Ahl al-Bayt', presenting profound theological, psychological, and moral communion between servant and Creator.",
    sections: [
      {
        id: "ss-dua-1",
        number: 1,
        title: "Dua 1: Praise of Allah and Thanksgiving for His Favours",
        arabicTitle: "فِي التَّحْمِيدِ لِلَّهِ عَزَّ وَجَلَّ",
        arabicText: "الْحَمْدُ لِلَّهِ الْأَوَّلِ بِلَا أَوَّلٍ كَانَ قَبْلَهُ، وَالْآخِرِ بِلَا آخِرٍ يَكُونُ بَعْدَهُ، الَّذِي قَصُرَتْ عَنْ رُؤْيَتِهِ أَبْصَارُ النَّاظِرِينَ، وَعَجَزَتْ عَنْ نَعْتِهِ أَوْهَامُ الْوَاصِفِينَ.",
        englishTranslation: "Praise belongs to Allah, the First without a first before Him, the Last without a last after Him. Whom the eyes of beholders fail to see, and the descriptions of qualifiers fail to encompass.",
        theme: "Gratitude & Cosmic Praise",
        sourceReference: "Al-Sahifa al-Sajjadiyya, Supplication 1"
      },
      {
        id: "ss-dua-20",
        number: 20,
        title: "Dua 20: The Supplication on Noble Moral Traits (Makarim al-Akhlaq)",
        arabicTitle: "دُعَاءُ مَكَارِمِ الْأَخْلَاقِ وَمَرْضِيِّ الْأَفْعَالِ",
        arabicText: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِهِ، وَبَلِّغْ بِإِيمَانِي أَكْمَلَ الْإِيمَانِ، وَاجْعَلْ يَقِينِي أَفْضَلَ الْيَقِينِ، وَانْتَهِ بِنِيَّتِي إِلَى أَحْسَنِ النِّيَّاتِ، وَبِعَمَلِي إِلَى أَحْسَنِ الْأَعْمَالِ.",
        englishTranslation: "O Allah, bless Muhammad and his Household, cause my faith to reach the most perfect faith, make my certainty the most excellent certainty, and take my intention to the best of intentions and my deed to the best of deeds.",
        theme: "Ethical Perfection & Purity of Motive",
        sourceReference: "Al-Sahifa al-Sajjadiyya, Supplication 20 (Makarim al-Akhlaq)"
      },
      {
        id: "ss-dua-54",
        number: 54,
        title: "Dua 54: In Removal of Worries and Relief from Distress",
        arabicTitle: "فِي اسْتِكْشَافِ الْهُمُومِ وَتَفْرِيجِ الْكُرُوبِ",
        arabicText: "يَا فَارِجَ الْهَمِّ، وَكَاشِفَ الْغَمِّ، يَا رَحْمَانَ الدُّنْيَا وَالْآخِرَةِ وَرَحِيمَهُمَا، صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ، وَافْرُجْ هَمِّي، وَاكْشِفْ غَمِّي.",
        englishTranslation: "O Reliever of worry! O Remover of grief! O Merciful of this world and the hereafter and Compassionate of both! Bless Muhammad and his Household, relieve my worry, and remove my sorrow.",
        theme: "Spiritual Tranquility & Inner Healing",
        sourceReference: "Al-Sahifa al-Sajjadiyya, Supplication 54"
      }
    ]
  },
  {
    id: "usool-e-kafi",
    slug: "usool-e-kafi",
    title: "Al-Kafi (Usool-e-Kafi)",
    arabicTitle: "أُصُولُ الْكَافِي",
    author: "Thiqat al-Islam Muhammad ibn Ya'qub al-Kulayni",
    compiler: "Compiled over 20 years in Baghdad (died 329 AH / 941 CE)",
    era: "Minor Occultation Era (Ghaybah al-Sughra)",
    category: "Hadith",
    licensing: "Public Domain",
    totalSections: "8 Core Books of Usool • 16,000+ Traditions across 34 Volumes",
    downloadFileName: "Usool-e-Kafi-Core-Hadiths.txt",
    description: "The primary and most authoritative foundational Hadith compendium in Shia scholarship, collecting traditions of the Prophet (PBUH) and the Twelve Imams (AS) on intellect, theology, divine proof, and spiritual conduct.",
    sections: [
      {
        id: "kafi-intellect-1",
        number: 1,
        title: "Kitab al-Aql wal-Jahl: Hadith on the Creation and Precedence of Intellect",
        arabicTitle: "كِتَابُ الْعَقْلِ وَالْجَهْلِ - حَدِيثُ خَلْقِ الْعَقْلِ",
        arabicText: "عَنْ أَبِي جَعْفَرٍ (ع) قَالَ: لَمَّا خَلَقَ اللَّهُ الْعَقْلَ اسْتَنْطَقَهُ، ثُمَّ قَالَ لَهُ: أَقْبِلْ فَأَقْبَلَ، ثُمَّ قَالَ لَهُ: أَدْبِرْ فَأَدْبَرَ، ثُمَّ قَالَ: وَعِزَّتِي وَجَلَالِي مَا خَلَقْتُ خَلْقاً هُوَ أَحَبُّ إِلَيَّ مِنْكَ، وَلَا أُكْمِلُكَ إِلَّا فِيمَنْ أُحِبُّ.",
        englishTranslation: "Imam Muhammad al-Baqir (AS) said: When Allah created the Intellect ('Aql), He commanded it to speak. Then He said to it: 'Come forward,' and it came forward. Then He said: 'Turn back,' and it turned back. Then Allah said: 'By My Honor and Majesty! I have not created any creation more beloved to Me than you, and I shall not perfect you except in those whom I love.'",
        theme: "The Primacy of Reason and Moral Intellect",
        sourceReference: "Al-Kafi, Vol. 1, Kitab al-Aql wal-Jahl, Hadith 1"
      },
      {
        id: "kafi-tawheed-2",
        number: 2,
        title: "Kitab al-Tawheed: Hadith on Knowing Allah without Anthropomorphism",
        arabicTitle: "كِتَابُ التَّوْحِيدِ - بَابُ نَفْيِ الرُّؤْيَةِ وَالتَّشْبِيهِ",
        arabicText: "قَالَ أَمِيرُ الْمُؤْمِنِينَ (ع): أَوَّلُ الدِّينِ مَعْرِفَتُهُ، وَكَمَالُ مَعْرِفَتِهِ التَّصْدِيقُ بِهِ، وَكَمَالُ التَّصْدِيقِ بِهِ تَوْحِيدُهُ، وَكَمَالُ تَوْحِيدِهِ الْإِخْلَاصُ لَهُ، وَكَمَالُ الْإِخْلَاصِ لَهُ نَفْيُ الصِّفَاتِ عَنْهُ.",
        englishTranslation: "Amir al-Mu'minin Ali (AS) stated: The foremost basis of religion is the gnosis of Him, the completion of His gnosis is affirmation of Him, the completion of affirmation is His Oneness, and the completion of His Oneness is absolute sincerity to Him without attributing mortal qualities.",
        theme: "Pure Monotheism (Tawheed)",
        sourceReference: "Al-Kafi, Vol. 1, Kitab al-Tawheed"
      },
      {
        id: "kafi-hujjah-3",
        number: 3,
        title: "Kitab al-Hujjah: Necessity of Divine Guides in Every Era",
        arabicTitle: "كِتَابُ الْحُجَّةِ - بَابُ أَنَّ الْأَرْضَ لَا تَخْلُو مِنْ حُجَّةٍ",
        arabicText: "عَنْ أَبِي عَبْدِ اللَّهِ الصَّادِقِ (ع) قَالَ: لَوْ لَمْ يَبْقَ فِي الْأَرْضِ إِلَّا اثْنَانِ لَكَانَ أَحَدُهُمَا الْحُجَّةَ عَلَى صَاحِبِهِ.",
        englishTranslation: "Imam Ja'far al-Sadiq (AS) said: If there remained on earth no more than two persons, one of them would inevitably be the divine proof (Hujjah) over the other.",
        theme: "Prophethood & Divine Guidance (Imamah)",
        sourceReference: "Al-Kafi, Vol. 1, Kitab al-Hujjah, Hadith 3"
      }
    ]
  },
  {
    id: "mafatih-ul-jinan",
    slug: "mafatih-ul-jinan",
    title: "Mafatih al-Jinan (Keys to the Heavens)",
    arabicTitle: "مَفَاتِيحُ الْجِنَان",
    author: "Shaykh Abbas Qummi (1359 AH / 1940 CE)",
    compiler: "Shaykh Abbas al-Qummi",
    era: "14th Century Hijri",
    category: "Rites & Ziyarat",
    licensing: "Public Domain",
    totalSections: "Comprehensive Compendium of Prayers, Supplications, and Ziyarat",
    downloadFileName: "Mafatih-al-Jinan-Selected-Supplications.txt",
    description: "The universally revered compilation of daily prayers, weekly Munajat, Duas of the Holy Imams (AS) (Kumayl, Tawassul, Nudba, Abu Hamza Thumali), and authentic Ziyarat of the Holy Prophet and Ahl al-Bayt.",
    sections: [
      {
        id: "mafatih-dua-kumayl",
        number: 1,
        title: "Dua Kumayl: Taught by Imam Ali (AS) to Kumayl ibn Ziyad",
        arabicTitle: "دُعَاءُ كُمَيْلِ بْنِ زِيَادٍ",
        arabicText: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ، وَبِقُوَّتِكَ الَّتِي قَهَرْتَ بِهَا كُلَّ شَيْءٍ، وَخَضَعَ لَهَا كُلُّ شَيْءٍ، وَذَلَّ لَهَا كُلُّ شَيْءٍ، وَبِجَبَرُوتِكَ الَّتِي غَلَبْتَ بِهَا كُلَّ شَيْءٍ.",
        englishTranslation: "O Allah, I ask You by Your mercy which embraces all things, and by Your strength through which You have dominated all things, and toward which all things have been humbled, and before which all things are subdued.",
        theme: "Repentance, Divine Mercy, and Spiritual Ascent",
        sourceReference: "Mafatih al-Jinan, Chapter on Thursday Night Duas"
      },
      {
        id: "mafatih-ziyarat-ashura",
        number: 2,
        title: "Ziyarat Ashura: Sacred Salutation to Imam al-Husayn (AS)",
        arabicTitle: "زِيَارَةُ عَاشُورَاءَ الْمَشْهُورَة",
        arabicText: "السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا ابْنَ رَسُولِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا خِيَرَةَ اللَّهِ وَابْنَ خِيَرَتِهِ، السَّلَامُ عَلَيْكَ يَا ابْنَ أَمِيرِ الْمُؤْمِنِينَ وَابْنَ سَيِّدِ الْوَصِيِّينَ.",
        englishTranslation: "Peace be upon you, O Aba Abdillah! Peace be upon you, O son of the Messenger of Allah! Peace be upon you, O chosen one of Allah and son of His chosen one! Peace be upon you, O son of the Commander of the Faithful and son of the master of successors!",
        theme: "Devotion, Moral Solidarity, and Standing against Oppression",
        sourceReference: "Mafatih al-Jinan, Chapter on Ziyarat of Imam al-Husayn (AS)"
      },
      {
        id: "mafatih-dua-tawassul",
        number: 3,
        title: "Dua al-Tawassul: Seeking Intercession through the Pure Ahl al-Bayt",
        arabicTitle: "دُعَاءُ التَّوَسُّلِ بِالْأَئِمَّةِ الْأَطْهَارِ",
        arabicText: "اللَّهُمَّ إِنِّي أَسْأَلُكَ وَأَتَوَجَّهُ إِلَيْكَ بِنَبِيِّكَ نَبِيِّ الرَّحْمَةِ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ، يَا أَبَا الْقَاسِمِ، يَا رَسُولَ اللَّهِ، يَا إِمَامَ الرَّحْمَةِ، يَا سَيِّدَنَا وَمَوْلَانَا، إِنَّا تَوَجَّهْنَا وَاسْتَشْفَعْنَا وَتَوَسَّلْنَا بِكَ إِلَى اللَّهِ.",
        englishTranslation: "O Allah, I plead to You and turn to You through Your Prophet, the Prophet of Mercy, Muhammad (peace and blessings be upon him and his progeny). O Father of al-Qasim, O Messenger of Allah, O guide of mercy! We turn to you, seek your intercession, and approach Allah through you.",
        theme: "Intercession (Shafa'ah) & Reverence for the Prophetic Household",
        sourceReference: "Mafatih al-Jinan, Chapter on General Supplications"
      }
    ]
  }
];
