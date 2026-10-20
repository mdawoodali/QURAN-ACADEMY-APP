export interface ShiaDua {
  id: string;
  slug: string;
  title: string;
  arabicTitle: string;
  source: string;
  occasion: string;
  shortDesc: string;
  fullDesc: string;
  paragraphs: {
    arabic: string;
    transliteration: string;
    translation: string;
  }[];
}

export interface AhkamGuide {
  id: string;
  title: string;
  arabicTitle: string;
  category: "Wudhu" | "Salat" | "Turbah" | "Fast & Purification";
  rulingSummary: string;
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    fiqhNote?: string;
  }[];
  sources: string[];
}

export interface MasoomeenDate {
  number: number;
  name: string;
  title: string;
  kuniyya: string;
  father: string;
  mother: string;
  birthHijri: string;
  birthLocation: string;
  martyrdomHijri: string;
  shrineLocation: string;
  keyCommemoration: string;
}

export const SHIA_DUAS_ZIYARAT: ShiaDua[] = [
  {
    id: "ziyarat-ashura",
    slug: "ziyarat-ashura",
    title: "Ziyarat Ashura",
    arabicTitle: "زِيَارَةُ عَاشُورَاء",
    source: "Imam Muhammad al-Baqir (AS) via Misbah al-Mutahajjid",
    occasion: "Daily recitation, particularly on Ashura & Arbaeen",
    shortDesc: "The monumental salutation and covenant of allegiance to Sayyid al-Shuhada Imam Husayn (AS).",
    fullDesc: "Ziyarat Ashura is considered one of the highest spiritual treasures taught by Imam al-Baqir (AS). It renews the spiritual stance of tawalla (love for Ahl al-Bayt) and tabarra (dissociation from oppression), imparting profound tranquility and divine proximity.",
    paragraphs: [
      {
        arabic: "السَّلاَمُ عَلَيْكَ يَا أَبَا عَبْدِ اللَّهِ، السَّلاَمُ عَلَيْكَ يَا ابْنَ رَسُولِ اللَّهِ، السَّلاَمُ عَلَيْكَ يَا ابْنَ أَمِيرِ الْمُؤْمِنِينَ وَابْنَ سَيِّدِ الْوَصِيِّينَ، السَّلاَمُ عَلَيْكَ يَا ابْنَ فَاطِمَةَ سَيِّدَةِ نِسَاءِ الْعَالَمِينَ.",
        transliteration: "Assalamu 'alayka ya Aba 'Abdillah, Assalamu 'alayka yabna Rasulillah, Assalamu 'alayka yabna Amiril Mu'minin wabna Sayyidil Wasiyyin, Assalamu 'alayka yabna Fatimata Sayyidati Nisa'il 'Alamin.",
        translation: "Peace be upon you, O Aba Abdillah! Peace be upon you, O son of the Messenger of Allah! Peace be upon you, O son of the Commander of the Faithful and son of the Chief of Successors! Peace be upon you, O son of Fatima, the Leader of the women of the worlds!"
      },
      {
        arabic: "السَّلاَمُ عَلَيْكَ يَا ثَارَ اللَّهِ وَابْنَ ثَارِهِ وَالْوِتْرَ الْمَوْتُورَ، السَّلاَمُ عَلَيْكَ وَعَلَى الأَرْوَاحِ الَّتِي حَلَّتْ بِفِنَائِكَ، عَلَيْكُمْ مِنِّي جَمِيعاً سَلاَمُ اللَّهِ أَبَداً مَا بَقِيتُ وَبَقِيَ اللَّيْلُ وَالنَّهَارُ.",
        transliteration: "Assalamu 'alayka ya tharallahi wabna tharihi wal-witral mawtoor. Assalamu 'alayka wa 'alal-arwahil-lati hallat bi-fina'ik, 'alaykum minni jami'an salamullahi abadan ma baqeetu wa baqiyal-laylu wan-nahar.",
        translation: "Peace be upon you, O unavenged blood of Allah, and son of His unavenged blood, and the isolated one! Peace be upon you and upon the souls that gathered in your threshold! From me, upon all of you, is the peace of Allah forever, as long as I live and as long as night and day remain."
      },
      {
        arabic: "يَا أَبَا عَبْدِ اللَّهِ، لَقَدْ عَظُمَتِ الرَّزِيَّةُ وَجَلَّتْ وَعَظُمَتِ الْمُصِيبَةُ بِكَ عَلَيْنَا وَعَلَى جَمِيعِ أَهْلِ الإِسْلاَمِ، وَجَلَّتْ وَعَظُمَتْ مُصِيبَتُكَ فِي السَّمَاوَاتِ عَلَى جَمِيعِ أَهْلِ السَّمَاوَاتِ.",
        transliteration: "Ya Aba 'Abdillah, laqad 'azumatir-raziyyatu wa jallat wa 'azumatil-museebatu bika 'alayna wa 'ala jami'i ahlil-Islam, wa jallat wa 'azumat museebatuka fis-samawati 'ala jami'i ahlis-samawat.",
        translation: "O Aba Abdillah! Tremendous has been the tragedy, and monumental and colossal has been your affliction upon us and upon all the people of Islam, and monumental and colossal has been your affliction in the heavens upon all the inhabitants of the heavens!"
      },
      {
        arabic: "إِنِّي سِلْمٌ لِمَنْ سَالَمَكُمْ، وَحَرْبٌ لِمَنْ حَارَبَكُمْ، وَوَلِيٌّ لِمَنْ وَالاَكُمْ، وَعَدُوٌّ لِمَنْ عَادَاكُمْ.",
        transliteration: "Inni silmun liman salamakum, wa harbun liman harabakum, wa waliyyun liman walakum, wa 'aduwwun liman 'adakum.",
        translation: "Indeed, I am at peace with whoever is at peace with you, at war with whoever is at war with you, a loving ally to whoever allies with you, and an adversary to whoever opposes you."
      },
      {
        arabic: "اللَّهُمَّ اجْعَلْنِي فِي مَقَامِي هَذَا مِمَّنْ تَنَالُهُ مِنْكَ صَلَوَاتٌ وَرَحْمَةٌ وَمَغْفِرَةٌ، اللَّهُمَّ اجْعَلْ مَحْيَايَ مَحْيَا مُحَمَّدٍ وَآلِ مُحَمَّدٍ، وَمَمَاتِي مَمَاتَ مُحَمَّدٍ وَآلِ مُحَمَّدٍ.",
        transliteration: "Allahummaj-'alni fi maqami hadha mimman tanaluhu minka salawatun wa rahmatun wa maghfirah. Allahummaj-'al mahyaya mahya Muhammadin wa Aali Muhammad, wa mamati mamata Muhammadin wa Aali Muhammad.",
        translation: "O Allah! Make me in this stance of mine among those who attain from You blessings, mercy, and forgiveness. O Allah! Make my living the living of Muhammad and the Household of Muhammad, and my dying the dying of Muhammad and the Household of Muhammad!"
      }
    ]
  },
  {
    id: "dua-kumayl",
    slug: "dua-kumayl",
    title: "Dua Kumayl",
    arabicTitle: "دُعَاءُ كُمَيْل",
    source: "Imam Ali ibn Abi Talib (AS) taught to Kumayl ibn Ziyad",
    occasion: "Thursday nights (Eve of Friday) & Mid-Sha'ban",
    shortDesc: "The pinnacle of divine supplication for total forgiveness, spiritual redemption, and mercy.",
    fullDesc: "Imam Ali (AS) conveyed this supplication to his loyal companion Kumayl ibn Ziyad al-Nakha'i. It begins with Khidr's prayer and expands into the most eloquent meditation on divine mercy, human frailty, and repentance ever transcribed in the Arabic language.",
    paragraphs: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ، وَبِقُوَّتِكَ الَّتِي قَهَرْتَ بِهَا كُلَّ شَيْءٍ، وَخَضَعَ لَهَا كُلُّ شَيْءٍ، وَذَلَّ لَهَا كُلُّ شَيْءٍ.",
        transliteration: "Allahumma inni as'aluka bi-rahmatikal-lati wasi'at kulla shay', wa bi-quwwatikal-lati qaharta biha kulla shay', wa khada'a laha kullu shay', wa dhalla laha kullu shay'.",
        translation: "O Allah! I beseech You by Your mercy which encompasses all things; and by Your strength by which You have overcome all things, and to which all things submit, and before which all things are humble."
      },
      {
        arabic: "اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تَهْتِكُ الْعِصَمَ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُنْزِلُ النِّقَمَ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُغَيِّرُ النِّعَمَ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تَحْبِسُ الدُّعَاءَ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُنْزِلُ الْبَلاَءَ.",
        transliteration: "Allahummagh-fir liyadh-dhunubal-lati tahtikul 'isam. Allahummagh-fir liyadh-dhunubal-lati tunzilun-niqam. Allahummagh-fir liyadh-dhunubal-lati tughayyirun-ni'am. Allahummagh-fir liyadh-dhunubal-lati tahbisud-du'a. Allahummagh-fir liyadh-dhunubal-lati tunzilul-bala'.",
        translation: "O Allah! Forgive me those sins which tear asunder safeguards! O Allah! Forgive me those sins which draw down afflictions! O Allah! Forgive me those sins which alter blessings! O Allah! Forgive me those sins which hold back supplication! O Allah! Forgive me those sins which bring down catastrophe!"
      },
      {
        arabic: "يَا سَرِيعَ الرِّضَا، اغْفِرْ لِمَنْ لاَ يَمْلِكُ إِلاَّ الدُّعَاءَ، فَإِنَّكَ فَعَّالٌ لِمَا تَشَاءُ، يَا مَنِ اسْمُهُ دَوَاءٌ، وَذِكْرُهُ شِفَاءٌ، وَطَاعَتُهُ غِنىً، ارْحَمْ مَنْ رَأْسُ مَالِهِ الرَّجَاءُ، وَسِلاَحُهُ الْبُكَاءُ.",
        transliteration: "Ya Sari'ar-rida, ighfir liman la yamliku illa ad-du'a, fa-innaka fa' 'alun lima tasha'. Ya manis-muhu dawa', wa dhikruhu shifa', wa ta'atuhu ghina! Irham man ra'su malihir-raja', wa silahuhul-buka'.",
        translation: "O He whose pleasure is quickly attained! Forgive him who possesses nothing but supplication, for You do what You will. O He whose Name is a remedy, whose remembrance is a cure, and whose obedience is wealth! Have mercy on him whose capital is hope and whose weapon is weeping!"
      }
    ]
  },
  {
    id: "hadith-al-kisa",
    slug: "hadith-al-kisa",
    title: "Hadith al-Kisa (Tradition of the Cloak)",
    arabicTitle: "حَدِيثُ الْكِسَاء",
    source: "Narrated by Sayyida Fatima al-Zahra (AS)",
    occasion: "Family gatherings, seeking barakah, resolving hardships",
    shortDesc: "The celestial gathering of the Panjatan Pak (Prophet, Ali, Fatima, Hasan, Husayn AS) under the Yemeni Cloak.",
    fullDesc: "Narrated by Fatima al-Zahra (AS), this renowned tradition describes the arrival of the Prophet (SAWW), Imam Hasan, Imam Husayn, and Imam Ali under the Yemeni Cloak. Archangel Jibra'il descends with the divine decree of Ayat al-Tathir (Quran 33:33): 'Verily Allah intends to keep all impurity away from you, O People of the Household, and to purify you with a thorough purification.'",
    paragraphs: [
      {
        arabic: "عَنْ فَاطِمَةَ الزَّهْرَاءِ عَلَيْهَا السَّلاَمُ بِنْتِ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ، قَالَتْ: دَخَلَ عَلَيَّ أَبِي رَسُولُ اللَّهِ فِي بَعْضِ الأَيَّامِ فَقَالَ: السَّلاَمُ عَلَيْكِ يَا فَاطِمَةُ، فَقُلْتُ: عَلَيْكَ السَّلاَمُ يَا أَبَتَاهْ. فَقَالَ: إِنِّي أَجِدُ فِي بَدَنِي ضَعْفاً، فَقُلْتُ لَهُ: أُعِيذُكَ بِاللَّهِ يَا أَبَتَاهْ مِنَ الضَّعْفِ. فَقَالَ: يَا فَاطِمَةُ ائْتِينِي بِالْكِسَاءِ الْيَمَانِيِّ فَغَطِّينِي بِهِ.",
        transliteration: "An Fatimataz-Zahra'i 'alayhas-salam binti Rasulillahi (SAWW) qalat: Dakhala 'alayya abi Rasulullahi fi ba'dil ayyam fa-qala: Assalamu 'alayki ya Fatimah. Fa-qultu: 'Alaykas-salamu ya abatah. Fa-qala: Inni ajidu fi badani da'fa. Fa-qultu lahu: U'eedhuka billahi ya abatah minad-da'f. Fa-qala: Ya Fatimatu i'teeni bil-kisa'il-yamani fa-ghattini bih.",
        translation: "On the authority of Fatima al-Zahra (peace be upon her), the daughter of the Messenger of Allah (peace be upon him and his family), who said: One day my father, the Messenger of Allah, entered my house and said: 'Peace be upon you, O Fatima.' I replied: 'Upon you be peace, O father.' He said: 'I feel weakness in my body.' I said: 'I seek refuge for you with Allah, O father, from weakness!' He said: 'O Fatima, bring me the Yemeni Cloak and cover me with it.'"
      },
      {
        arabic: "فَقَالَ اللَّهُ عَزَّ وَجَلَّ: يَا مَلاَئِكَتِي وَيَا سُكَّانَ سَمَاوَاتِي، إِنِّي مَا خَلَقْتُ سَمَاءً مَبْنِيَّةً، وَلاَ أَرْضاً مَدْحِيَّةً، وَلاَ قَمَراً مُنِيراً، وَلاَ شَمْساً مُضِيئَةً، وَلاَ فَلَكاً يَدُورُ، وَلاَ بَحْراً يَجْرِي، وَلاَ فُلْكاً يَسْرِي، إِلاَّ فِي مَحَبَّةِ هَؤُلاَءِ الْخَمْسَةِ الَّذِينَ هُمْ تَحْتَ الْكِسَاءِ.",
        transliteration: "Fa-qalallahu 'azza wa jall: Ya mala'ikati wa ya sukkaana samawati, inni ma khalaqtu sama'an mabniyyatan, wa la ardan madhiyyatan, wa la qamaran muneera, wa la shamsan mudee'atan, wa la falakan yadoor, wa la bahran yajri, wa la fulkan yasri, illa fi mahabbati ha'ula'il-khamsatil-ladheena hum tahtal-kisa'.",
        translation: "Then Allah, the Mighty and Majestic, said: 'O My angels and inhabitants of My heavens! Verily I did not create an elevated sky, nor an outspread earth, nor an illuminating moon, nor a shining sun, nor a revolving galaxy, nor a flowing ocean, nor a sailing ship, except for the love of these Five who are under the Cloak!'"
      }
    ]
  },
  {
    id: "dua-tawassul",
    slug: "dua-tawassul",
    title: "Dua Tawassul",
    arabicTitle: "دُعَاءُ التَّوَسُّل",
    source: "Taught by the Ahl al-Bayt (AS) in Bihar al-Anwar",
    occasion: "Tuesday nights or whenever facing major difficulties",
    shortDesc: "Seeking Divine fulfillment of wishes through the intercession of the Holy Prophet and 12 Imams (AS).",
    fullDesc: "Dua Tawassul is recited to invoke the intercession (shafa'ah) of the 14 Infallibles. In accordance with Surah al-Ma'ida (5:35): 'O you who believe! Fear Allah and seek the means of approach (al-Waseelah) unto Him', this supplication addresses each Infallible by name as our noble intercessors before the Almighty.",
    paragraphs: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ وَأَتَوَجَّهُ إِلَيْكَ بِنَبِيِّكَ نَبِيِّ الرَّحْمَةِ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ، يَا أَبَا الْقَاسِمِ، يَا رَسُولَ اللَّهِ، يَا إِمَامَ الرَّحْمَةِ، يَا سَيِّدَنَا وَمَوْلاَنَا، إِنَّا تَوَجَّهْنَا وَاسْتَشْفَعْنَا وَتَوَسَّلْنَا بِكَ إِلَى اللَّهِ، وَقَدَّمْنَاكَ بَيْنَ يَدَيْ حَاجَاتِنَا، يَا وَجِيهاً عِنْدَ اللَّهِ، اشْفَعْ لَنَا عِنْدَ اللَّهِ.",
        transliteration: "Allahumma inni as'aluka wa atawajjahu ilayka bi-nabiyyika Nabiyyir-rahmah Muhammadin sallallahu 'alayhi wa alih. Ya Abal-Qasim, ya Rasulallah, ya Imamir-rahmah, ya sayyidana wa mawlana, inna tawajjahna wastashfa'na wa tawassalna bika ilallah, wa qaddamnaaka bayna yaday hajatina, ya wajeehan 'indallah, ishfa' lana 'indallah.",
        translation: "O Allah! I beseech You and turn towards You through Your Prophet, the Prophet of Mercy, Muhammad (blessings of Allah be upon him and his family). O Abul-Qasim! O Messenger of Allah! O Leader of Mercy! O our master and patron! Indeed we turn, seek intercession, and approach Allah through you, and we present you before our needs! O eminent one with Allah, intercede for us with Allah!"
      },
      {
        arabic: "يَا سَادَتِي وَمَوَالِيَّ، إِنِّي تَوَجَّهْتُ بِكُمْ أَئِمَّتِي وَعُدَّتِي لِيَوْمِ فَقْرِي وَحَاجَتِي إِلَى اللَّهِ، وَتَوَسَّلْتُ بِكُمْ إِلَى اللَّهِ، وَاسْتَشْفَعْتُ بِكُمْ إِلَى اللَّهِ، فَاشْفَعُوا لِي عِنْدَ اللَّهِ، وَاسْتَنْقِذُونِي مِنْ ذُنُوبِي عِنْدَ اللَّهِ.",
        transliteration: "Ya saadati wa mawaliyya, inni tawajjahtu bikum a'immati wa 'uddati li-yawmi faqri wa hajati ilallah, wa tawassaltu bikum ilallah, wastashfa'tu bikum ilallah, fash-fa'u li 'indallah, wastan-qidhuni min dhunubi 'indallah.",
        translation: "O my masters and leaders! Indeed I have turned through you, my Imams and my provisions for the day of my poverty and need before Allah; and I have approached Allah through you, and sought intercession through you with Allah. So intercede for me with Allah, and rescue me from my sins before Allah!"
      }
    ]
  },
  {
    id: "dua-ahad",
    slug: "dua-ahad",
    title: "Dua Ahad",
    arabicTitle: "دُعَاءُ الْعَهْد",
    source: "Imam Ja'far al-Sadiq (AS) in Zad al-Ma'ad",
    occasion: "Daily after Morning (Fajr) prayer",
    shortDesc: "The morning renewal of oath and allegiance to Imam al-Mahdi (AJTF).",
    fullDesc: "Imam Ja'far al-Sadiq (AS) stated that whoever recites Dua Ahad for forty consecutive mornings will be numbered among the companions and supporters of Imam al-Zaman (AJTF), and if they pass away before his reappearance, Allah will raise them from their grave to serve him.",
    paragraphs: [
      {
        arabic: "اللَّهُمَّ رَبَّ النُّورِ الْعَظِيمِ، وَرَبَّ الْكُرْسِيِّ الرَّفِيعِ، وَرَبَّ الْبَحْرِ الْمَسْجُورِ، وَمُنْزِلَ التَّوْرَاةِ وَالإِنْجِيلِ وَالزَّبُورِ، وَرَبَّ الظِّلِّ وَالْحَرُورِ، وَمُنْزِلَ الْقُرْآنِ الْعَظِيمِ، وَرَبَّ الْمَلاَئِكَةِ الْمُقَرَّبِينَ وَالأَنْبِيَاءِ وَالْمُرْسَلِينَ.",
        transliteration: "Allahumma Rabbal-nooril 'azeem, wa Rabbal-kursiyyir-rafee', wa Rabbal-bahril-masjoor, wa munzilat-Tawrati wal-Injeeli waz-Zaboor, wa Rabwaz-zilli wal-haroor, wa munzilal-Qur'anil 'azeem, wa Rabbal-mala'ikatil-muqarrabeen wal-anbiya'i wal-mursaleen.",
        translation: "O Allah, Lord of the Supreme Light, Lord of the Elevated Throne, Lord of the Swelling Sea, Revealer of the Torah, the Gospel, and the Psalms, Lord of shade and heat, Revealer of the Magnificent Quran, and Lord of the Archangels, the Prophets, and the Messengers!"
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أُجَدِّدُ لَهُ فِي صَبِيحَةِ يَوْمِي هَذَا، وَمَا عِشْتُ مِنْ أَيَّامِي، عَهْداً وَعَقْداً وَبَيْعَةً لَهُ فِي عُنُقِي، لاَ أَحُولُ عَنْهَا وَلاَ أَزُولُ أَبَداً.",
        transliteration: "Allahumma inni ujaddidu lahu fi sabeehati yawmi hadha, wa ma 'ishtu min ayyami, 'ahdan wa 'aqdan wa bay'atan lahu fi 'unuqi, la ahoolu 'anha wa la azoolu abada.",
        translation: "O Allah! I renew unto him in the morning of this day of mine, and for as long as I live of my days, a pledge, a covenant, and an oath of allegiance upon my neck, from which I shall never turn away nor waver!"
      }
    ]
  },
  {
    id: "dua-al-faraj",
    slug: "dua-al-faraj",
    title: "Dua al-Faraj (Ilahi 'Azuma al-Bala')",
    arabicTitle: "دُعَاءُ الْفَرَج",
    source: "Taught by Imam al-Mahdi (AJTF) to Muhammad ibn Ahmad al-Baghdadi",
    occasion: "After every prayer and in moments of distress",
    shortDesc: "The prayer for relief, safety, and the triumph of the living Imam al-Mahdi (AJTF).",
    fullDesc: "Taught to a prisoner who was subsequently freed, Dua al-Faraj is recited universally in Shia mosques and homes after every congregational and individual prayer for divine relief and the protection of the Twelfth Imam.",
    paragraphs: [
      {
        arabic: "إِلَهِي عَظُمَ الْبَلاَءُ، وَبَرِحَ الْخَفَاءُ، وَانْكَشَفَ الْغِطَاءُ، وَانْقَطَعَ الرَّجَاءُ، وَضَاقَتِ الأَرْضُ وَمُنِعَتِ السَّمَاءُ، وَأَنْتَ الْمُسْتَعَانُ وَإِلَيْكَ الْمُشْتَكَى، وَعَلَيْكَ الْمُعَوَّلُ فِي الشِّدَّةِ وَالرَّخَاءِ.",
        transliteration: "Ilahi 'azumal-bala', wa barihal-khafa', wankashafal-ghita', wanqata'ar-raja', wa daqatil-ardu wa muni'atis-sama', wa Antal-musta'anu wa Ilaykal-mushtaka, wa 'Alaykal-mu'awwalu fish-shiddati war-rakha'.",
        translation: "O my God! Terrible was the calamity, and its secrecy became manifest, the veil was lifted, hope was severed, the earth grew narrow and the heaven withheld its bounty! You alone are the One whose help is sought, unto You is all complaint, and in You is all trust in hardship and in ease!"
      },
      {
        arabic: "يَا مُحَمَّدُ يَا عَلِيُّ، يَا عَلِيُّ يَا مُحَمَّدُ، اكْفِيَانِي فَإِنَّكُمَا كَافِيَانِ، وَانْصُرَانِي فَإِنَّكُمَا نَاصِرَانِ، يَا مَوْلاَنَا يَا صَاحِبَ الزَّمَانِ، الْغَوْثَ الْغَوْثَ الْغَوْثَ، أَدْرِكْنِي أَدْرِكْنِي أَدْرِكْنِي، السَّاعَةَ السَّاعَةَ السَّاعَةَ، الْعَجَلَ الْعَجَلَ الْعَجَلَ، يَا أَرْحَمَ الرَّاحِمِينَ، بِحَقِّ مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ.",
        transliteration: "Ya Muhammadu ya Ali, ya Aliyyu ya Muhammad, ikfiyaani fa-innakuma kafiyaan, wansurani fa-innakuma nasiraan. Ya mawlana ya Sahibal-Zaman, al-ghawth al-ghawth al-ghawth, adrikni adrikni adrikni, as-sa'ah as-sa'ah as-sa'ah, al-'ajal al-'ajal al-'ajal, ya Arhamar-rahimeen, bi-haqqi Muhammadin wa Aalihit-tahireen.",
        translation: "O Muhammad! O Ali! O Ali! O Muhammad! Suffice me both, for you both are sufficient; and assist me both, for you both are helpers! O our Patron, O Master of the Age! Help! Help! Help! Reach me! Reach me! Reach me! At this hour! At this hour! At this hour! Hasten! Hasten! Hasten! O Most Merciful of the merciful, by the right of Muhammad and his pure progeny!"
      }
    ]
  }
];

export const SHIA_AHKAM_GUIDES: AhkamGuide[] = [
  {
    id: "wudhu-jafari",
    title: "Step-by-Step Ja'fari Wudhu (Purification)",
    arabicTitle: "الْوُضُوءُ عَلَى مَذْهَبِ أَهْلِ الْبَيْت",
    category: "Wudhu",
    rulingSummary: "According to the Quran (5:6) and Ja'fari Fiqh, Wudhu consists of two washings (Face & Arms from elbows down) and two wipings (Head & Feet with residual moisture).",
    steps: [
      {
        stepNumber: 1,
        title: "Niyyah (Intention)",
        instruction: "Intend in your heart to perform Wudhu for the pleasure of Allah Almighty (Qurbatan ila Allah)."
      },
      {
        stepNumber: 2,
        title: "Washing the Face",
        instruction: "Pour water from the top of the forehead (hairline) and wipe downward to the chin using the right hand. Width covered is between thumb and middle finger. Washing must flow from top to bottom.",
        fiqhNote: "Washing upwards is invalid in Ja'fari jurisprudence."
      },
      {
        stepNumber: 3,
        title: "Washing the Right Arm",
        instruction: "Pour water just above the elbow and wipe downward toward the tips of the fingers. Ensure complete coverage of the skin, nails, and wrists.",
        fiqhNote: "Must flow from elbow downwards to fingertips."
      },
      {
        stepNumber: 4,
        title: "Washing the Left Arm",
        instruction: "Using the wet right hand, pour water above the left elbow and wipe downward toward the left fingertips.",
        fiqhNote: "Do not take fresh water from the tap after completing the left arm; wipe using the remaining moisture."
      },
      {
        stepNumber: 5,
        title: "Masah of the Head (Wiping)",
        instruction: "Using the wet right hand, wipe the front quadrant of the head from the top towards the hairline. Do not use fresh water.",
        fiqhNote: "The hair must be dry or only slightly damp so the wiping moisture comes from the hand."
      },
      {
        stepNumber: 6,
        title: "Masah of the Right Foot",
        instruction: "Using the moisture remaining on the right hand, wipe the top of the right foot from the tips of the toes to the raised bone/ankle joint.",
        fiqhNote: "Wiping is mandated by Quran 5:6 ('wam-sahu bi-ru'usikum wa arjulakum'). Washing feet in the sink is invalid in Ja'fari Fiqh."
      },
      {
        stepNumber: 7,
        title: "Masah of the Left Foot",
        instruction: "Using the moisture remaining on the left hand, wipe the top of the left foot from the tips of the toes to the ankle joint."
      }
    ],
    sources: ["Ayatollah Sistani: Islamic Laws, Section on Wudhu", "Ayatollah Khamenei: Practical Ahkam", "Al-Kafi, Kitab al-Taharah"]
  },
  {
    id: "turbah-sajdah",
    title: "Prostration upon Turbah (Earth & Natural Matter)",
    arabicTitle: "السُّجُودُ عَلَى التُّرْبَةِ الْحُسَيْنِيَّة",
    category: "Turbah",
    rulingSummary: "Sajdah must be performed on pure earth, stone, or things that grow from the earth which are neither eaten nor worn as clothing.",
    steps: [
      {
        stepNumber: 1,
        title: "Permissible Sajdah Surfaces",
        instruction: "Prostration is valid on clean earth, clay, dust, sand, stone, pebble, marble, wood, leaves of non-fruit trees, and unrefined natural paper.",
        fiqhNote: "Prostration on synthetic carpets, polyester rugs, wool, nylon, silk, or edible items is not permissible in normal circumstances."
      },
      {
        stepNumber: 2,
        title: "The Excellence of Turbah Karbala (Khaak-e-Shifa)",
        instruction: "Imam Ja'far al-Sadiq (AS) affirmed: 'Prostration upon the soil of Imam Husayn (AS) pierces through the seven veils of the heavens.' It commemorates the ultimate sacrifice for Tawheed.",
        fiqhNote: "The Turbah is not worshipped; rather, we prostrate TO Allah ALONE, UPON the pure dust of the earth, emulating the Prophet's sunnah on a clay mat (Khumra)."
      },
      {
        stepNumber: 3,
        title: "Sunnah of the Prophet (SAWW)",
        instruction: "Documented in Sahih Bukhari (Hadith 335): The Holy Prophet declared: 'The earth has been made for me a mosque and a pure means of purification.' The Prophet never prostrated on synthetic rugs or woven clothing."
      }
    ],
    sources: ["Wasa'il al-Shia, Kitab al-Salat", "Sahih Bukhari, Hadith 335 & 379", "Ayatollah Sistani: Conditions for Place of Prostration"]
  },
  {
    id: "prayer-structure",
    title: "Distinctive Sunnahs of Ja'fari Daily Salat",
    arabicTitle: "سُنَنُ الصَّلَاةِ عِنْدَ أَهْلِ الْبَيْت",
    category: "Salat",
    rulingSummary: "The authentic prayer format preserved by the 12 Imams directly from the Prophet Muhammad (SAWW).",
    steps: [
      {
        stepNumber: 1,
        title: "Arms at Sides (Irsal)",
        instruction: "Standing in prayer with hands lowered beside the thighs, facing the Qiblah with tranquil reverence.",
        fiqhNote: "Folding hands across the chest (Takfeer) was introduced later and is considered invalidating in Ja'fari and Maliki jurisprudence."
      },
      {
        stepNumber: 2,
        title: "Qunoot in 2nd Rakah",
        instruction: "In the second Rakah of every obligatory prayer, after reciting Surah al-Hamd and a second Surah, raise both hands to chest height and supplicate for yourself, parents, and believers before going into Ruku'.",
        fiqhNote: "Recommended Dua: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar'."
      },
      {
        stepNumber: 3,
        title: "Tasbihat al-Arba'ah in 3rd & 4th Rakahs",
        instruction: "In the third and fourth units of Dhuhr, Asr, Maghrib, and Isha, recite: 'SubhanAllahi wal-Hamdu Lillahi wa La Ilaha Illallahu Wallahu Akbar' once or three times in place of Surah al-Fatiha."
      },
      {
        stepNumber: 4,
        title: "Joining Dhuhr/Asr & Maghrib/Isha (Jam')",
        instruction: "Praying Dhuhr followed immediately by Asr, and Maghrib followed by Isha, within their shared time windows, as practiced by the Prophet without fear or rain.",
        fiqhNote: "Documented in Sahih Muslim (Book 4, Hadith 1515): Ibn Abbas reported that the Prophet combined noon and afternoon, and sunset and night prayers in Medina without fear and without rain."
      }
    ],
    sources: ["Sahih Muslim, Book 4, Hadith 1515", "Bihar al-Anwar, Salat of the Prophet", "Man La Yahduruhu al-Faqih"]
  }
];

export const MASOOMEEN_CALENDAR: MasoomeenDate[] = [
  {
    number: 1,
    name: "Prophet Muhammad al-Mustafa (SAWW)",
    title: "Khatam al-Anbiya • Habibullah • Rahmatan lil-'Alamin",
    kuniyya: "Abul-Qasim",
    father: "Abdullah ibn Abd al-Muttalib",
    mother: "Aminah bint Wahb",
    birthHijri: "17th Rabi al-Awwal (Year of the Elephant)",
    birthLocation: "Makkah al-Mukarramah",
    martyrdomHijri: "28th Safar 11 AH",
    shrineLocation: "Al-Masjid al-Nabawi, Madinah al-Munawwarah",
    keyCommemoration: "Mawlid al-Nabi (17 Rabi I) • Maba'ath (27 Rajab) • Wafat (28 Safar)"
  },
  {
    number: 2,
    name: "Imam Ali ibn Abi Talib (AS)",
    title: "Amir al-Mu'minin • Asadullah • Ya'soob al-Deen",
    kuniyya: "Abul-Hasan • Abu Turab",
    father: "Abu Talib (Imran) ibn Abd al-Muttalib",
    mother: "Fatimah bint Asad",
    birthHijri: "13th Rajab (Inside the Holy Kaaba)",
    birthLocation: "Holy Kaaba, Makkah",
    martyrdomHijri: "21st Ramadan 40 AH (Struck on 19th in Kufa Mosque)",
    shrineLocation: "Holy Shrine of Imam Ali, Najaf al-Ashraf, Iraq",
    keyCommemoration: "Wiladat in Kaaba (13 Rajab) • Eid al-Ghadeer (18 Dhu al-Hijjah) • Shahadat (21 Ramadan)"
  },
  {
    number: 3,
    name: "Sayyida Fatimah al-Zahra (SA)",
    title: "Sayyidatu Nisa'il 'Alamin • Umm Abiha • Al-Siddiqah",
    kuniyya: "Umm al-A'immah",
    father: "Prophet Muhammad (SAWW)",
    mother: "Sayyida Khadijah bint Khuwaylid",
    birthHijri: "20th Jumada al-Thani",
    birthLocation: "Makkah al-Mukarramah",
    martyrdomHijri: "3rd Jumada al-Thani 11 AH (Ayyam al-Fatimiyya)",
    shrineLocation: "Jannat al-Baqi, Madinah (Concealed grave)",
    keyCommemoration: "Wiladat (20 Jumada II) • Ayyam-e-Fatimiyya (13 Jumada I & 3 Jumada II)"
  },
  {
    number: 4,
    name: "Imam al-Hasan ibn Ali al-Mujtaba (AS)",
    title: "Al-Mujtaba • Sayyid Shababi Ahl al-Jannah • Kareem Ahl al-Bayt",
    kuniyya: "Abu Muhammad",
    father: "Imam Ali ibn Abi Talib (AS)",
    mother: "Sayyida Fatimah al-Zahra (SA)",
    birthHijri: "15th Ramadan 3 AH",
    birthLocation: "Madinah al-Munawwarah",
    martyrdomHijri: "7th / 28th Safar 50 AH (Poisoned)",
    shrineLocation: "Jannat al-Baqi, Madinah al-Munawwarah",
    keyCommemoration: "Wiladat (15 Ramadan) • Shahadat (7 / 28 Safar)"
  },
  {
    number: 5,
    name: "Imam al-Husayn ibn Ali (AS)",
    title: "Sayyid al-Shuhada • Aba Abdillah • Tharallah",
    kuniyya: "Abu Abdillah",
    father: "Imam Ali ibn Abi Talib (AS)",
    mother: "Sayyida Fatimah al-Zahra (SA)",
    birthHijri: "3rd Sha'ban 4 AH",
    birthLocation: "Madinah al-Munawwarah",
    martyrdomHijri: "10th Muharram 61 AH (Day of Ashura)",
    shrineLocation: "Holy Shrine of Imam Husayn, Karbala al-Muqaddasa, Iraq",
    keyCommemoration: "Wiladat (3 Sha'ban) • Ashura (10 Muharram) • Arbaeen (20 Safar)"
  },
  {
    number: 6,
    name: "Imam Ali ibn al-Husayn Zayn al-Abidin (AS)",
    title: "Zayn al-Abidin • Sayyid al-Sajjad • Al-Buka'un",
    kuniyya: "Abu Muhammad",
    father: "Imam al-Husayn (AS)",
    mother: "Shahrbanu",
    birthHijri: "5th Sha'ban 38 AH",
    birthLocation: "Madinah al-Munawwarah",
    martyrdomHijri: "25th Muharram 95 AH",
    shrineLocation: "Jannat al-Baqi, Madinah al-Munawwarah",
    keyCommemoration: "Wiladat (5 Sha'ban) • Shahadat (25 Muharram) • Author of Sahifa Sajjadiyya"
  },
  {
    number: 7,
    name: "Imam Muhammad ibn Ali al-Baqir (AS)",
    title: "Baqir al-Uloom (Splitter of Knowledge)",
    kuniyya: "Abu Ja'far",
    father: "Imam Zayn al-Abidin (AS)",
    mother: "Fatimah bint al-Hasan",
    birthHijri: "1st Rajab 57 AH",
    birthLocation: "Madinah al-Munawwarah",
    martyrdomHijri: "7th Dhu al-Hijjah 114 AH",
    shrineLocation: "Jannat al-Baqi, Madinah al-Munawwarah",
    keyCommemoration: "Wiladat (1 Rajab) • Shahadat (7 Dhu al-Hijjah)"
  },
  {
    number: 8,
    name: "Imam Ja'far ibn Muhammad al-Sadiq (AS)",
    title: "Al-Sadiq (The Truthful) • Head of Ja'fari Jurisprudence",
    kuniyya: "Abu Abdillah",
    father: "Imam Muhammad al-Baqir (AS)",
    mother: "Umm Farwah",
    birthHijri: "17th Rabi al-Awwal 83 AH",
    birthLocation: "Madinah al-Munawwarah",
    martyrdomHijri: "25th Shawwal 148 AH (Poisoned)",
    shrineLocation: "Jannat al-Baqi, Madinah al-Munawwarah",
    keyCommemoration: "Wiladat (17 Rabi I) • Shahadat (25 Shawwal)"
  },
  {
    number: 9,
    name: "Imam Musa ibn Ja'far al-Kadhim (AS)",
    title: "Al-Kadhim (Restrainer of Anger) • Bab al-Hawa'ij",
    kuniyya: "Abul-Hasan al-Awwal",
    father: "Imam Ja'far al-Sadiq (AS)",
    mother: "Hamidah al-Barbariyyah",
    birthHijri: "7th Safar 128 AH",
    birthLocation: "Abwa, between Makkah and Madinah",
    martyrdomHijri: "25th Rajab 183 AH (In Baghdad Prison)",
    shrineLocation: "Holy Kadhimiya Shrine, Baghdad, Iraq",
    keyCommemoration: "Wiladat (7 Safar) • Shahadat (25 Rajab)"
  },
  {
    number: 10,
    name: "Imam Ali ibn Musa al-Rida (AS)",
    title: "Al-Rida • Sultan al-Khurasan • Al-Dhamin",
    kuniyya: "Abul-Hasan al-Thani",
    father: "Imam Musa al-Kadhim (AS)",
    mother: "Najma (Tuktam)",
    birthHijri: "11th Dhu al-Qa'dah 148 AH",
    birthLocation: "Madinah al-Munawwarah",
    martyrdomHijri: "Last day of Safar 203 AH",
    shrineLocation: "Holy Shrine of Imam al-Rida, Mashhad, Iran",
    keyCommemoration: "Wiladat (11 Dhu al-Qa'dah) • Shahadat (End of Safar)"
  },
  {
    number: 11,
    name: "Imam Muhammad ibn Ali al-Jawad (AS)",
    title: "Al-Jawad (The Generous) • Al-Taqi • Bab al-Murad",
    kuniyya: "Abu Ja'far al-Thani",
    father: "Imam Ali al-Rida (AS)",
    mother: "Sabikah (Khayzuran)",
    birthHijri: "10th Rajab 195 AH",
    birthLocation: "Madinah al-Munawwarah",
    martyrdomHijri: "End of Dhu al-Qa'dah 220 AH",
    shrineLocation: "Holy Kadhimiya Shrine, Baghdad, Iraq",
    keyCommemoration: "Wiladat (10 Rajab) • Shahadat (29 Dhu al-Qa'dah)"
  },
  {
    number: 12,
    name: "Imam Ali ibn Muhammad al-Hadi (AS)",
    title: "Al-Hadi (The Guide) • Al-Naqi",
    kuniyya: "Abul-Hasan al-Thalith",
    father: "Imam Muhammad al-Jawad (AS)",
    mother: "Samanah al-Maghribiyyah",
    birthHijri: "15th Dhu al-Hijjah 212 AH",
    birthLocation: "Surba, near Madinah",
    martyrdomHijri: "3rd Rajab 254 AH",
    shrineLocation: "Holy Askariyya Shrine, Samarra, Iraq",
    keyCommemoration: "Wiladat (15 Dhu al-Hijjah) • Shahadat (3 Rajab)"
  },
  {
    number: 13,
    name: "Imam al-Hasan ibn Ali al-Askari (AS)",
    title: "Al-Askari • Al-Zaki",
    kuniyya: "Abu Muhammad",
    father: "Imam Ali al-Hadi (AS)",
    mother: "Hudayth (Saleel)",
    birthHijri: "8th Rabi al-Thani 232 AH",
    birthLocation: "Madinah al-Munawwarah",
    martyrdomHijri: "8th Rabi al-Awwal 260 AH",
    shrineLocation: "Holy Askariyya Shrine, Samarra, Iraq",
    keyCommemoration: "Wiladat (8 Rabi II) • Shahadat (8 Rabi I)"
  },
  {
    number: 14,
    name: "Imam Muhammad ibn al-Hasan al-Mahdi (AJTF)",
    title: "Al-Hujjah • Al-Qa'im • Sahib al-Zaman • Baqiyyatullah",
    kuniyya: "Abul-Qasim",
    father: "Imam al-Hasan al-Askari (AS)",
    mother: "Sayyida Narjis (Khatoon)",
    birthHijri: "15th Sha'ban 255 AH (Nisf Sha'ban)",
    birthLocation: "Samarra, Iraq",
    martyrdomHijri: "Alive in Major Occultation (Al-Ghaybah al-Kubra) awaiting Divine order to reappear",
    shrineLocation: "Reappearance at Holy Kaaba, Makkah",
    keyCommemoration: "Wiladat / Shab-e-Barat (15 Sha'ban) • Eid al-Zahra (9 Rabi I)"
  }
];

export const SHIA_PRAYER_METHOD_INFO = {
  methodName: "Leval Institute / University of Tehran (Ithna Ashari / Ja'fari Standard)",
  description: "Ja'fari calculations differ in two vital astronomical respects: Fajr angle is calibrated at 17.7° or 16°, Maghrib is calculated at the disappearance of the sunset's eastern redness (Humrah Mashriqiyyah ~4° below horizon) rather than theoretical horizon dip, and Midnight (Nisf al-Layl) is calculated halfway between sunset and true dawn.",
  combiningNotice: "In Ja'fari jurisprudence, it is a valid and beloved Sunnah of the Prophet (SAWW) to combine Dhuhr & Asr in the afternoon and Maghrib & Isha in the evening without traveling or distress, freeing Muslim students and professionals from missing prayers during demanding modern schedules."
};
