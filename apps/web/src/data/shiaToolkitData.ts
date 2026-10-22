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
    "id": "dua-mashlool",
    "slug": "dua-mashlool",
    "title": "Dua Mashlool",
    "arabicTitle": "دُعَاءُ الْمَشْلُول",
    "source": "Imam Ali ibn Abi Talib (AS) via Mafatih al-Jinan & Muhaj al-Da'awat",
    "occasion": "For deep distress, healing of paralysis & illness, and forgiveness of grave sins",
    "shortDesc": "The Supplication of the Youth Stricken for his Sin, invoking Allah by His Most Majestic Names.",
    "fullDesc": "Transmitted by Amir al-Mu'minin Imam Ali (AS) when he encountered a youth who had been struck with paralysis due to his father's curse. The Imam taught him this monumental prayer calling upon the Almighty through His Divine Names, attributes, and prophetic miracles, whereupon the youth was completely cured.",
    "paragraphs": [
      {
        "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ بِاسْمِكَ بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ، يَا ذَا الْجَلاَلِ وَالإِكْرَامِ، يَا حَيُّ يَا قَيُّومُ، يَا حَيُّ لاَ إِلَهَ إِلاَّ أَنْتَ، يَا هُوَ يَا مَنْ لاَ يَعْلَمُ مَا هُوَ وَلاَ كَيْفَ هُوَ وَلاَ أَيْنَ هُوَ وَلاَ حَيْثُ هُوَ إِلاَّ هُوَ.",
        "transliteration": "Bismillahir-Rahmanir-Rahim. Allahumma inni as'aluka bismika bismillahir-Rahmanir-Rahim, ya Dhal-Jalali wal-Ikram, ya Hayyu ya Qayyum, ya Hayyu la ilaha illa Ant, ya Huwa ya man la ya'lamu ma Huwa wa la kayfa Huwa wa la ayna Huwa wa la haythu Huwa illa Huw.",
        "translation": "In the Name of Allah, the Most Gracious, the Most Merciful. O Allah, I beseech You by Your Name: In the Name of Allah, the Beneficent, the Merciful! O Lord of Majesty and Generosity! O Living! O Self-Subsisting! O Living One, there is no god but You! O He, O One whom none knows what He is, nor how He is, nor where He is, nor in what direction He is, except He!"
      },
      {
        "arabic": "يَا ذَا الْمُلْكِ وَالْمَلَكُوتِ، يَا ذَا الْعِزَّةِ وَالْجَبَرُوتِ، يَا مَلِكُ يَا قُدُّوسُ، يَا سَلاَمُ يَا مُؤْمِنُ، يَا مُهَيْمِنُ يَا عَزِيزُ، يَا جَبَّارُ يَا مُتَكَبِّرُ، يَا خَالِقُ يَا بَارِئُ يَا مُصَوِّرُ، يَا مُفِيدُ يَا مُدَبِّرُ، يَا شَدِيدُ يَا مُبْدِئُ يَا مُعِيدُ، يَا مُبِيدُ يَا وَدُودُ يَا مَحْمُودُ يَا مَعْبُودُ.",
        "transliteration": "Ya Dhal-Mulki wal-Malakut, ya Dhal-'Izzati wal-Jabarut, ya Maliku ya Quddus, ya Salamu ya Mu'min, ya Muhayminu ya 'Aziz, ya Jabbaru ya Mutakabbir, ya Khaliqu ya Bari'u ya Musawwir, ya Mufidu ya Mudabbir, ya Shadidu ya Mubdi'u ya Mu'id, ya Mubidu ya Wadudu ya Mahmudu ya Ma'bud.",
        "translation": "O Possessor of Sovereign Dominion and Kingdom! O Possessor of Might and Invincibility! O Sovereign King! O Holy! O Peace! O Guardian of Faith! O Overseer! O Almighty! O Compeller! O Supremely Great! O Creator! O Originator! O Shaper of forms! O Benefactor! O Planner! O Severe in punishment! O Beginner! O Restorer! O Annihilator! O Loving! O Praised! O Worshiped!"
      },
      {
        "arabic": "يَا بَعِيدُ يَا قَرِيبُ، يَا مُجِيبُ يَا رَقِيبُ، يَا حَسِيبُ يَا بَدِيعُ، يَا رَفِيعُ يَا مَنِيعُ، يَا سَمِيعُ يَا عَلِيمُ، يَا حَلِيمُ يَا كَرِيمُ، يَا حَكِيمُ يَا قَدِيمُ، يَا عَلِيُّ يَا عَظِيمُ، يَا حَنَّانُ يَا مَنَّانُ، يَا دَيَّانُ يَا مُسْتَعَانُ، يَا جَلِيلُ يَا جَمِيلُ، يَا وَكِيلُ يَا كَفِيلُ.",
        "transliteration": "Ya Ba'idu ya Qarib, ya Mujibu ya Raqib, ya Hasibu ya Badi', ya Rafi'u ya Mani', ya Sami'u ya 'Alim, ya Halimu ya Karim, ya Hakimu ya Qadim, ya 'Aliyyu ya 'Azim, ya Hannanu ya Mannan, ya Dayyanu ya Musta'an, ya Jalilu ya Jamil, ya Wakilu ya Kafil.",
        "translation": "O Far Yet Near! O Answerer of prayers! O Watchful Observer! O Reckoner! O Originator! O Exalted! O Inaccessible! O All-Hearing! O All-Knowing! O Forbearing! O Generous! O Wise! O Eternal! O Most High! O Incomparably Tremendous! O Tenderly Merciful! O Bestower of favors! O Rewarder! O One Whose aid is implored! O Majestic! O Beautiful! O Trustee! O Protector!"
      },
      {
        "arabic": "أَسْأَلُكَ اللَّهُمَّ بِأَسْمَائِكَ كُلِّهَا، مَا عَلِمْتُ مِنْهَا وَمَا لَمْ أَعْلَمْ، وَأَسْأَلُكَ بِاسْمِكَ الأَعْظَمِ الأَعْظَمِ الأَجَلِّ الأَكْرَمِ، الَّذِي إِذَا دُعِيتَ بِهِ عَلَى مَغَالِقِ أَبْوَابِ السَّمَاءِ لِلْفَتْحِ انْفَتَحَتْ، وَإِذَا دُعِيتَ بِهِ عَلَى مَضَايِقِ أَبْوَابِ الأَرْضِ لِلْفَرَجِ انْفَرَجَتْ، أَنْ تُفَرِّجَ عَنِّي هَمِّي وَغَمِّي وَتَقْضِيَ حَاجَتِي وَتَغْفِرَ ذُنُوبِي يَا أَرْحَمَ الرَّاحِمِينَ.",
        "transliteration": "As'alukal-lahumma bi-asma'ika kulliha, ma 'alimtu minha wa ma lam a'lam, wa as'aluka bismikal-a'zamil-a'zam al-ajallil-akram, alladhi idha du'ita bihi 'ala maghaliqi abwabis-sama'i lil-fathi infatahat, wa idha du'ita bihi 'ala madayaqi abwabil-ardi lil-faraji infarajat, an tufarrija 'anni hammi wa ghammi wa taqdiya hajati wa taghfira dhunubi ya Arhamar-Rahimin.",
        "translation": "I beseech You, O Allah, by all of Your Names—those that I know and those I do not know—and I implore You by Your Greatest, Most Monumental, Most Exalted and Noble Name, which, when called upon to open the locked gates of heaven, they burst open, and when invoked to relieve the narrow confines of earth, they widen into deliverance! Relieve my distress and sorrow, fulfill my needs, and forgive my sins, O Most Merciful of the merciful!"
      }
    ]
  },
  {
    "id": "dua-sabah",
    "slug": "dua-sabah",
    "title": "Dua Sabah (Dua al-Sabah)",
    "arabicTitle": "دُعَاءُ الصَّبَاح",
    "source": "Amir al-Mu'minin Imam Ali ibn Abi Talib (AS) via Bihar al-Anwar & Mafatih al-Jinan",
    "occasion": "Recited every morning following the dawn (Fajr) prayer",
    "shortDesc": "Imam Ali's peerless morning meditation on cosmic creation, divine illumination, and heartfelt repentance.",
    "fullDesc": "Taught by the Commander of the Faithful Imam Ali (AS), this morning prayer is celebrated across classical Islamic literature as the pinnacle of eloquence, philosophical majesty, and spiritual awakening. It harmonizes the dawn of day with the dawn of inner spiritual enlightenment.",
    "paragraphs": [
      {
        "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. اللَّهُمَّ يَا مَنْ دَلَعَ لِسَانَ الصَّبَاحِ فِي نُطْقِ تَبَلُّجِهِ، وَسَرَّحَ قِطَعَ اللَّيْلِ الْمُظْلِمِ بِغَيَاهِبِ تَلَجْلُجِهِ، وَأَتْقَنَ صُنْعَ الْفَلَكِ الدَّوَّارِ فِي مَقَادِيرِ تَبَرُّجِهِ، وَشَعْشَعَ ضِيَاءَ الشَّمْسِ بِنُورِ تَأَجُّجِهِ.",
        "transliteration": "Bismillahir-Rahmanir-Rahim. Allahumma ya man dala'a lisanas-sabahi fi nutqi taballujih, wa sarraha qita'al-laylil-muzlimi bi-ghayahibi talajlujih, wa atqana sun'al-falakid-dawwari fi maqadiri tabarrujih, wa sha'sha'a diya'ash-shamsi bi-nuri ta'ajjujih.",
        "translation": "In the Name of Allah, the Most Gracious, the Most Merciful. O Allah! O He Who extended the tongue of morning in the speech of its dawning, dispatched the fragments of dark night into the depths of its murmuring gloom, perfected the creation of the rotating celestial sphere in the measures of its constellations, and beamed forth the brilliance of the sun with the blazing intensity of its illumination!"
      },
      {
        "arabic": "يَا مَنْ دَلَّ عَلَى ذَاتِهِ بِذَاتِهِ، وَتَنَزَّهَ عَنْ مُجَانَسَةِ مَخْلُوقَاتِهِ، وَجَلَّ عَنْ مُلاَءَمَةِ كَيْفِيَّاتِهِ. يَا مَنْ قَرُبَ مِنْ خَطَرَاتِ الظُّنُونِ، وَبَعُدَ عَنْ لَحَظَاتِ الْعُيُونِ، وَعَلِمَ بِمَا كَانَ قَبْلَ أَنْ يَكُونَ.",
        "transliteration": "Ya man dalla 'ala dhatihi bi-dhatih, wa tanazzaha 'an mujanasati makhluqatih, wa jalla 'an mula'amati kayfiyyatih. Ya man qaruba min khataratiz-zunun, wa ba'uda 'an lahazatil-'uyun, wa 'alima bima kana qabla an yakun.",
        "translation": "O He Who pointed to His Essence by His Essence, Who is far removed from similitude to His creatures, and transcendent beyond conformity to any conceivable modalities! O He Who is near to the passing thoughts of minds, yet remote from the gazes of physical eyes, and Who knew all that would be before it came into existence!"
      },
      {
        "arabic": "إِلَهِي قَدْ طَرَقْتُ بَابَ رَحْمَتِكَ بِيَدِ رَجَائِي، وَهَرَبْتُ إِلَيْكَ لاَجِئاً مِنْ فَرْطِ أَهْوَائِي، وَعَلَّقْتُ بِأَطْرَافِ حِبَالِكَ أَنَامِلَ وَلاَئِي. فَاغْفِرِ اللَّهُمَّ مَا جَنَيْتُهُ مِنْ زَلَلِي وَعَثَارِي، وَأَقِلْنِي مِنْ صَرْعَةِ رِدَائِي، فَإِنَّكَ سَيِّدِي وَمَوْلاَيَ وَمُعْتَمَدِي وَرَجَائِي.",
        "transliteration": "Ilahi qad taraqtu baba rahmatika bi-yadi raja'i, wa harabtu ilayka laji'an min farti ahwa'i, wa 'allaqtu bi-atrafi hibalika anamila wala'i. Faghfiril-lahumma ma janaytuhu min zalali wa 'athari, wa aqilni min sar'ati rida'i, fa-innaka Sayyidi wa Mawlaya wa Mu'tamadi wa Raja'i.",
        "translation": "My God! I have knocked at the door of Your mercy with the hand of my hope; I have fled to You seeking refuge from the excess of my base desires; and I have fastened the fingertips of my devotion to the extremities of Your ties. So forgive, O Allah, the offenses and slips I have committed, and lift me up from the downfall of my destruction, for You are my Master, my Protector, my Reliance, and my Hope!"
      },
      {
        "arabic": "إِلَهِي إِنْ حَرَمَتْنِي رُؤْيَةَ وَجْهِكَ الْكَرِيمِ بِشُؤْمِ مَعْصِيَتِي، فَلاَ تَحْرِمْنِي النَّظَرَ إِلَى رَحْمَتِكَ بِجَمِيلِ تَوْبَتِي، وَصَلِّ اللَّهُمَّ عَلَى مُحَمَّدٍ وَآلِهِ الطَّيِّبِينَ الطَّاهِرِينَ، وَافْتَحْ لَنَا أَبْوَابَ الْخَيْرِ فِي صَبَاحِنَا هَذَا، يَا خَيْرَ الْفَاتِحِينَ.",
        "transliteration": "Ilahi in haramatni ru'yata wajhikal-karimi bi-shu'mi ma'siyati, fala tahrimnin-nazara ila rahmatika bi-jamili tawbati, wa sallil-lahumma 'ala Muhammadin wa Aalihit-tayyibinat-tahirin, waftah lana abwabal-khayri fi sabahina hadha, ya Khayral-Fatihin.",
        "translation": "My God! If the ill fortune of my disobedience has barred me from beholding Your Generous Grace, then do not deprive me of looking toward Your Mercy through the beauty of my repentance! Send blessings, O Allah, upon Muhammad and his pure and immaculate Family, and open for us the portals of all good in this morning of ours, O Best of Openers!"
      }
    ]
  },
  {
    "id": "dua-kumayl",
    "slug": "dua-kumayl",
    "title": "Dua Kumayl",
    "arabicTitle": "دُعَاءُ كُمَيْل",
    "source": "Imam Ali ibn Abi Talib (AS) taught to Kumayl ibn Ziyad al-Nakha'i via Misbah al-Mutahajjid",
    "occasion": "Thursday nights (Eve of Friday) & the 15th of Sha'ban",
    "shortDesc": "The crown of all supplications for spiritual purification, divine forgiveness, and liberation from sin.",
    "fullDesc": "Imam Ali (AS) conveyed this supplication to his righteous companion Kumayl ibn Ziyad al-Nakha'i. Regarded as one of the most beloved prayers in the Islamic tradition, it articulates profound remorse, complete surrender to Allah, and reliance upon His infinite compassion.",
    "paragraphs": [
      {
        "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ، وَبِقُوَّتِكَ الَّتِي قَهَرْتَ بِهَا كُلَّ شَيْءٍ، وَخَضَعَ لَهَا كُلُّ شَيْءٍ، وَذَلَّ لَهَا كُلُّ شَيْءٍ، وَبِجَبَرُوتِكَ الَّتِي غَلَبْتَ بِهَا كُلَّ شَيْءٍ، وَبِعِزَّتِكَ الَّتِي لاَ يَقُومُ لَهَا شَيْءٌ.",
        "transliteration": "Bismillahir-Rahmanir-Rahim. Allahumma inni as'aluka bi-rahmatikal-lati wasi'at kulla shay', wa bi-quwwatikal-lati qaharta biha kulla shay', wa khada'a laha kullu shay', wa dhalla laha kullu shay', wa bi-jabarutikal-lati ghalabta biha kulla shay', wa bi-'izzatikal-lati la yaqumu laha shay'.",
        "translation": "In the Name of Allah, the Most Gracious, the Most Merciful. O Allah, I ask You by Your mercy which encompasses all things, by Your strength wherewith You overcome all things, and to which all things submit and before which all things are humble, by Your almighty power wherewith You have conquered all things, and by Your majesty against which nothing can stand."
      },
      {
        "arabic": "اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تَهْتِكُ الْعِصَمَ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُنْزِلُ النِّقَمَ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُغَيِّرُ النِّعَمَ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تَحْبِسُ الدُّعَاءَ، اللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُنْزِلُ الْبَلاَءَ.",
        "transliteration": "Allahummagh-fir liyadh-dhunubal-lati tahtikul-'isam. Allahummagh-fir liyadh-dhunubal-lati tunzilun-niqam. Allahummagh-fir liyadh-dhunubal-lati tughayyirun-ni'am. Allahummagh-fir liyadh-dhunubal-lati tahbisud-du'a. Allahummagh-fir liyadh-dhunubal-lati tunzilul-bala'.",
        "translation": "O Allah, forgive me those sins which tear asunder safeguards! O Allah, forgive me those sins which draw down afflictions! O Allah, forgive me those sins which alter blessings! O Allah, forgive me those sins which hold back supplication! O Allah, forgive me those sins which bring down catastrophe!"
      },
      {
        "arabic": "فَهَبْنِي يَا إِلَهِي وَسَيِّدِي وَمَوْلاَيَ وَرَبِّي صَبَرْتُ عَلَى عَذَابِكَ، فَكَيْفَ أَصْبِرُ عَلَى فِرَاقِكَ؟ وَهَبْنِي صَبَرْتُ عَلَى حَرِّ نَارِكَ، فَكَيْفَ أَصْبِرُ عَنِ النَّظَرِ إِلَى كَرَامَتِكَ؟ أَمْ كَيْفَ أَسْكُنُ فِي النَّارِ وَرَجَائِي عَفْوُكَ؟",
        "transliteration": "Fa-habni ya Ilahi wa Sayyidi wa Mawlaya wa Rabbi sabartu 'ala 'adhabik, fa-kayfa asbiru 'ala firaqik? Wa habni sabartu 'ala harri narik, fa-kayfa asbiru 'anin-nazari ila karamatik? Am kayfa askunu fin-nari wa raja'i 'afwuk?",
        "translation": "Suppose, my God, my Master, my Protector and my Lord, that I were able to endure Your chastisement—how could I endure separation from You? And suppose I were able to endure the heat of Your Fire—how could I endure being deprived of looking upon Your Generosity? Or how could I dwell in the Fire when my hope is in Your Pardon?"
      },
      {
        "arabic": "يَا سَرِيعَ الرِّضَا، اغْفِرْ لِمَنْ لاَ يَمْلِكُ إِلاَّ الدُّعَاءَ، فَإِنَّكَ فَعَّالٌ لِمَا تَشَاءُ، يَا مَنِ اسْمُهُ دَوَاءٌ، وَذِكْرُهُ شِفَاءٌ، وَطَاعَتُهُ غِنىً، ارْحَمْ مَنْ رَأْسُ مَالِهِ الرَّجَاءُ، وَسِلاَحُهُ الْبُكَاءُ، يَا سَابِغَ النِّعَمِ، يَا دَافِعَ النِّقَمِ، يَا نُورَ الْمُسْتَوْحِشِينَ فِي الظُّلَمِ.",
        "transliteration": "Ya Sari'ar-rida, ighfir liman la yamliku illa ad-du'a, fa-innaka fa' 'alun lima tasha'. Ya manis-muhu dawa', wa dhikruhu shifa', wa ta'atuhu ghina! Irham man ra'su malihir-raja', wa silahuhul-buka'. Ya Sabighan-ni'am, ya Dafi'an-niqam, ya Nural-mustawhishina fiz-zulam.",
        "translation": "O He Whose pleasure is quickly attained! Forgive him who possesses nothing but supplication, for You do what You will. O He Whose Name is a remedy, Whose remembrance is a cure, and Whose obedience is boundless wealth! Have mercy upon him whose capital is hope and whose weapon is weeping! O Bestower of abundant blessings! O Warder off of tribulations! O Light of those who are desolate in darkness!"
      }
    ]
  },
  {
    "id": "dua-nudba",
    "slug": "dua-nudba",
    "title": "Dua Nudba",
    "arabicTitle": "دُعَاءُ النُّدْبَة",
    "source": "Imam Ja'far al-Sadiq (AS) via Al-Mazar al-Kabir & Mafatih al-Jinan",
    "occasion": "Friday mornings, Eid al-Fitr, Eid al-Adha, and Eid al-Ghadir",
    "shortDesc": "The Great Supplication of Lamentation expressing yearning and longing for the Promised Deliverer, Imam al-Mahdi (AJTF).",
    "fullDesc": "Dua Nudba (The Supplication of Weeping and Lamentation) is an authentic spiritual masterpiece tracing the divine chain of Prophethood from Adam to Prophet Muhammad (SAWW) and the Holy Imams. It articulates the deep, passionate longing of believers for the advent of universal justice under the 12th Imam.",
    "paragraphs": [
      {
        "arabic": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ نَبِيِّهِ وَآلِهِ وَسَلَّمَ تَسْلِيماً. اللَّهُمَّ لَكَ الْحَمْدُ عَلَى مَا جَرَى بِهِ قَضَاؤُكَ فِي أَوْلِيَائِكَ الَّذِينَ اسْتَخْلَصْتَهُمْ لِنَفْسِكَ وَدِينِكَ، إِذِ اخْتَرْتَ لَهُمْ جَزِيلَ مَا عِنْدَكَ مِنَ النَّعِيمِ الْمُقِيمِ الَّذِي لاَ زَوَالَ لَهُ وَلاَ اضْمِحْلاَلَ.",
        "transliteration": "Al-hamdu lillahi Rabbil-'alamin, wa sallallahu 'ala Sayyidina Muhammadin Nabiyyihi wa Aalihi wa sallama taslima. Allahumma lakal-hamdu 'ala ma jara bihi qada'uka fi awliya'ikal-ladhinas-takhlastahum li-nafsika wa dinik, idhikh-tarta lahum jazila ma 'indaka minan-na'imil-muqimil-ladhi la zawala lahu wa lad-mihlal.",
        "translation": "Praise be to Allah, Lord of the worlds, and may Allah bless our Master Muhammad, His Prophet, and his Family with abundant peace! O Allah, to You belongs all praise for that which took place according to Your decree regarding Your saintly guardians—those whom You purified exclusively for Yourself and Your religion, choosing for them the abundant and everlasting bliss in Your presence that never diminishes nor fades!"
      },
      {
        "arabic": "أَيْنَ بَقِيَّةُ اللَّهِ الَّتِي لاَ تَخْلُو مِنَ الْعِتْرَةِ الْهَادِيَةِ؟ أَيْنَ الْمُعَدُّ لِقَطْعِ دَابِرِ الظَّلَمَةِ؟ أَيْنَ الْمُنْتَظَرُ لِإِقَامَةِ الأَمْتِ وَالْعِوَجِ؟ أَيْنَ الْمُرْتَجَى لِإِزَالَةِ الْجَوْرِ وَالْعُدْوَانِ؟ أَيْنَ الْمُدَّخَرُ لِتَجْدِيدِ الْفَرَائِضِ وَالسُّنَنِ؟ أَيْنَ الْمُتَخَيَّرُ لِإِعَادَةِ الْمِلَّةِ وَالشَّرِيعَةِ؟",
        "transliteration": "Ayna Baqiyyatullahil-lati la takhlu minal-'itratil-hadiyah? Aynal-mu'addu li-qat'i dabiriz-zalamah? Aynal-muntazaru li-iqamatil-amti wal-'iwaj? Aynal-murtaja li-izalatil-jawri wal-'udwan? Aynal-muddakharu li-tajdidil-fara'idi was-sunan? Aynal-mutakhayyaru li-i'adatil-millati wash-shari'ah?",
        "translation": "Where is the Remnant of Allah who is never absent from the guided family? Where is the one prepared to sever the root of the oppressors? Where is the awaited one destined to straighten crookedness and distortions? Where is the one hoped-for to eradicate tyranny and transgression? Where is the one preserved to revitalize obligations and sacred traditions? Where is the chosen one to restore the faith and sacred law?"
      },
      {
        "arabic": "عَزِيزٌ عَلَيَّ أَنْ أَرَى الْخَلْقَ وَلاَ تُرَى، وَلاَ أَسْمَعَ لَكَ حَسِيساً وَلاَ نَجْوَى، عَزِيزٌ عَلَيَّ أَنْ تُحِيطَ بِكَ دُونِيَ الْبَلْوَى، وَلاَ يَنَالَكَ مِنِّي ضَجِيجٌ وَلاَ شَكْوَى. بِنَفْسِي أَنْتَ مِنْ مُغَيَّبٍ لَمْ يَخْلُ مِنَّا، بِنَفْسِي أَنْتَ مِنْ نَازِحٍ مَا نَزَحَ عَنَّا، بِنَفْسِي أَنْتَ أُمْنِيَّةُ شَائِقٍ يَتَمَنَّى.",
        "transliteration": "'Azizun 'alayya an aral-khalqa wa la tura, wa la asma'a laka hasisan wa la najwa. 'Azizun 'alayya an tuhita bika duniyal-balwa, wa la yanalaka minni dajijun wa la shakwa. Bi-nafsi anta min mughayyabin lam yakhlu minna, bi-nafsi anta min nazihin ma nazaha 'anna, bi-nafsi anta umniyyatu sha'iqin yatamanna.",
        "translation": "It is painful for me that I behold creation while you cannot be seen, and that I hear not from you a whisper nor intimate discourse! It is painful for me that tribulations encompass you rather than me, while no cry or complaint of mine can reach you! May my soul be ransomed for you—an absent one who has never deserted us! May my soul be ransomed for you—a distant one who has never departed from our midst! May my soul be ransomed for you—the yearning desire of every longing heart!"
      },
      {
        "arabic": "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ، وَعَجِّلْ فَرَجَهُ، وَسَهِّلْ مَخْرَجَهُ، وَأَوْسِعْ مَنْهَجَهُ، وَاسْلُكْ بِنَا مَحَجَّتَهُ، وَانْصُرْنَا بِهِ عَلَى أَعْدَائِكَ وَأَعْدَاءِ دِينِكَ، يَا رَبَّ الْعَالَمِينَ.",
        "transliteration": "Allahumma salli 'ala Muhammadin wa Aali Muhammad, wa 'ajjil farajah, wa sahhil makhrajah, wa awsi' manhajah, wasluk bina mahajjatah, wansurna bihi 'ala a'da'ika wa a'da'i dinik, ya Rabbal-'alamin.",
        "translation": "O Allah, bless Muhammad and the Family of Muhammad! Hasten his relief, make smooth his reappearance, broaden his path, cause us to tread upon his manifest highway, and grant us victory through him over Your enemies and the enemies of Your religion, O Lord of the worlds!"
      }
    ]
  },
  {
    "id": "dua-tawassul",
    "slug": "dua-tawassul",
    "title": "Dua Tawassul",
    "arabicTitle": "دُعَاءُ التَّوَسُّل",
    "source": "The Holy 14 Infallibles (AS) recorded by Allamah al-Majlisi in Bihar al-Anwar",
    "occasion": "Tuesday evenings & in times of urgent spiritual need or illness",
    "shortDesc": "The revered supplication of intercession through the Holy Prophet (SAWW) and the 13 Infallibles of his Ahl al-Bayt.",
    "fullDesc": "Documented by prominent classical scholars, Dua Tawassul invokes the divine station of the 14 Infallibles as the purest spiritual intermediaries between humanity and the Almighty, seeking divine benevolence, health, and fulfillment of legitimate aspirations.",
    "paragraphs": [
      {
        "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ وَأَتَوَجَّهُ إِلَيْكَ بِنَبِيِّكَ نَبِيِّ الرَّحْمَةِ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ، يَا أَبَا الْقَاسِمِ، يَا رَسُولَ اللَّهِ، يَا إِمَامَ الرَّحْمَةِ، يَا سَيِّدَنَا وَمَوْلاَنَا، إِنَّا تَوَجَّهْنَا وَاسْتَشْفَعْنَا وَتَوَسَّلْنَا بِكَ إِلَى اللَّهِ، وَقَدَّمْنَاكَ بَيْنَ يَدَيْ حَاجَاتِنَا، يَا وَجِيهاً عِنْدَ اللَّهِ، اشْفَعْ لَنَا عِنْدَ اللَّهِ.",
        "transliteration": "Bismillahir-Rahmanir-Rahim. Allahumma inni as'aluka wa atawajjahu ilayka bi-Nabiyyika Nabiyyir-Rahmati Muhammadin sallallahu 'alayhi wa Aalih. Ya Abal-Qasim, ya Rasulallah, ya Imamar-Rahmah, ya Sayyidana wa Mawlana, inna tawajjahna wastashfa'na wa tawassalna bika ilallah, wa qaddamanka bayna yaday hajatina, ya wajihan 'indallah, ishfa' lana 'indallah.",
        "translation": "In the Name of Allah, the Most Gracious, the Most Merciful. O Allah, I ask You and turn to You through Your Prophet, the Prophet of Mercy, Muhammad—may Allah bless him and his Family. O Father of Qasim! O Messenger of Allah! O Leader of Mercy! O our Master and Guide! We turn to Allah through you, we seek your intercession, we plead through you before Allah, and we place you before our urgent needs: O esteemed and honored one in the sight of Allah, intercede for us with Allah!"
      },
      {
        "arabic": "يَا أَبَا الْحَسَنِ، يَا أَمِيرَ الْمُؤْمِنِينَ، يَا عَلِيَّ بْنَ أَبِي طَالِبٍ، يَا حُجَّةَ اللَّهِ عَلَى خَلْقِهِ، يَا سَيِّدَنَا وَمَوْلاَنَا، إِنَّا تَوَجَّهْنَا وَاسْتَشْفَعْنَا وَتَوَسَّلْنَا بِكَ إِلَى اللَّهِ، وَقَدَّمْنَاكَ بَيْنَ يَدَيْ حَاجَاتِنَا، يَا وَجِيهاً عِنْدَ اللَّهِ، اشْفَعْ لَنَا عِنْدَ اللَّهِ.",
        "transliteration": "Ya Abal-Hasan, ya Amiral-Mu'minin, ya 'Aliyyabna Abi Talib, ya Hujjatallahi 'ala khalqih, ya Sayyidana wa Mawlana, inna tawajjahna wastashfa'na wa tawassalna bika ilallah, wa qaddamanka bayna yaday hajatina, ya wajihan 'indallah, ishfa' lana 'indallah.",
        "translation": "O Father of Hasan! O Commander of the Faithful! O Ali, son of Abu Talib! O Proof of Allah over His creation! O our Master and Guide! We turn to Allah through you, we seek your intercession, we plead through you before Allah, and we place you before our urgent needs: O honored one in the sight of Allah, intercede for us with Allah!"
      },
      {
        "arabic": "يَا فَاطِمَةُ الزَّهْرَاءُ، يَا بِنْتَ مُحَمَّدٍ، يَا قُرَّةَ عَيْنِ الرَّسُولِ، يَا سَيِّدَتَنَا وَمَوْلاَتَنَا، إِنَّا تَوَجَّهْنَا وَاسْتَشْفَعْنَا وَتَوَسَّلْنَا بِكِ إِلَى اللَّهِ، وَقَدَّمْنَاكِ بَيْنَ يَدَيْ حَاجَاتِنَا، يَا وَجِيهَةً عِنْدَ اللَّهِ، اشْفَعِي لَنَا عِنْدَ اللَّهِ.",
        "transliteration": "Ya Fatimatuz-Zahra', ya binta Muhammad, ya qurrata 'aynir-Rasul, ya Sayyidatana wa Mawlatana, inna tawajjahna wastashfa'na wa tawassalna biki ilallah, wa qaddamnaki bayna yaday hajatina, ya wajihatan 'indallah, ishfa'i lana 'indallah.",
        "translation": "O Fatima al-Zahra! O daughter of Muhammad! O solace of the Messenger's eyes! O our Lady and Master! We turn to Allah through you, we seek your intercession, we plead through you before Allah, and we place you before our urgent needs: O honored one in the sight of Allah, intercede for us with Allah!"
      },
      {
        "arabic": "يَا وَصِيَّ الْحَسَنِ، وَالْخَلَفَ الصَّالِحَ، يَا حُجَّةَ اللَّهِ عَلَى خَلْقِهِ، يَا سَيِّدَنَا وَمَوْلاَنَا، إِنَّا تَوَجَّهْنَا وَاسْتَشْفَعْنَا وَتَوَسَّلْنَا بِكَ إِلَى اللَّهِ، وَقَدَّمْنَاكَ بَيْنَ يَدَيْ حَاجَاتِنَا، يَا وَجِيهاً عِنْدَ اللَّهِ، اشْفَعْ لَنَا عِنْدَ اللَّهِ. يَا سَادَتِي وَمَوَالِيَّ، إِنِّي تَوَجَّهْتُ بِكُمْ أَئِمَّتِي لِيَوْمِ فَقْرِي وَحَاجَتِي إِلَى اللَّهِ.",
        "transliteration": "Ya Wasiyyal-Hasan, wal-Khalafas-Salih, ya Hujjatallahi 'ala khalqih, ya Sayyidana wa Mawlana, inna tawajjahna wastashfa'na wa tawassalna bika ilallah, wa qaddamanka bayna yaday hajatina, ya wajihan 'indallah, ishfa' lana 'indallah. Ya Sadati wa Mawaliyya, inni tawajjahtu bikum a'immati li-yawmi faqri wa hajati ilallah.",
        "translation": "O Successor of al-Hasan! O Righteous Successor! O Proof of Allah over His creation! O our Master and Guide! We turn to Allah through you, we seek your intercession, we plead through you before Allah, and we place you before our urgent needs: O honored one in the sight of Allah, intercede for us with Allah! O my Masters and Guides! Through you, my Imams, I turn toward Allah for the day of my destitution and need!"
      }
    ]
  },
  {
    "id": "dua-faraj-kun-waliyyik",
    "slug": "dua-faraj-kun-waliyyik",
    "title": "Dua Faraj (Allahumma Kun Li-Waliyyik)",
    "arabicTitle": "دُعَاءُ الْفَرَج (اللَّهُمَّ كُنْ لِوَلِيِّكَ)",
    "source": "Imam Ja'far al-Sadiq (AS) & Imam al-Mahdi (AJTF) via Al-Kafi, Misbah al-Mutahajjid & Iqbal al-A'mal",
    "occasion": "Recited in daily Qunut, after obligatory prayers, and on Laylat al-Qadr (23rd Ramadan)",
    "shortDesc": "The quintessential supplication for the protection, safety, and governance of the Imam of our Time (AJTF).",
    "fullDesc": "Also recognized as Dua Salamati Imam Zaman, this canonical supplication was instructed by the Imams of Ahl al-Bayt to be recited continuously throughout the night and day, imploring Allah to surround His Living Proof with comprehensive angelic guardianship until his sovereign establishment on earth.",
    "paragraphs": [
      {
        "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. اللَّهُمَّ كُنْ لِوَلِيِّكَ الْحُجَّةِ بْنِ الْحَسَنِ، صَلَوَاتُكَ عَلَيْهِ وَعَلَى آبَائِهِ، فِي هَذِهِ السَّاعَةِ وَفِي كُلِّ سَاعَةٍ، وَلِيّاً وَحَافِظاً، وَقَائِداً وَنَاصِراً، وَدَلِيلاً وَعَيْناً، حَتَّى تُسْكِنَهُ أَرْضَكَ طَوْعاً، وَتُمَتِّعَهُ فِيهَا طَوِيلاً.",
        "transliteration": "Bismillahir-Rahmanir-Rahim. Allahumma kun li-waliyyikal-Hujjatibnil-Hasan, salawatuka 'alayhi wa 'ala aba'ih, fi hadhihis-sa'ati wa fi kulli sa'ah, waliyyan wa hafiza, wa qa'idan wa nasira, wa dalilan wa 'ayna, hatta tuskinahu ardaka taw'a, wa tumatti'ahu fiha tawila.",
        "translation": "In the Name of Allah, the Most Gracious, the Most Merciful. O Allah! Be, for Your representative, the Hujjah (Proof), son of al-Hasan—Your blessings be upon him and upon his forefathers—in this hour and in every hour, a Guardian and a Protector, a Leader and a Helper, a Proof and a Watchful Eye, until You cause him to dwell on Your earth in willing obedience, and grant him prolonged enjoyment therein!"
      },
      {
        "arabic": "بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ، وَصَلِّ اللَّهُمَّ عَلَى مُحَمَّدٍ وَآلِهِ الطَّيِّبِينَ الطَّاهِرِينَ، وَعَجِّلْ فَرَجَهُمْ، وَأَهْلِكْ عَدُوَّهُمْ، وَثَبِّتْنَا عَلَى وَلاَيَتِهِمْ إِلَى يَوْمِ الدِّينِ.",
        "transliteration": "Bi-rahmatika ya Arhamar-Rahimin, wa sallil-lahumma 'ala Muhammadin wa Aalihit-tayyibinat-tahirin, wa 'ajjil farajahum, wa ahlik 'aduwwahum, wa thabbitna 'ala walayatihim ila yawmid-din.",
        "translation": "By Your mercy, O Most Merciful of the merciful! And send Your blessings, O Allah, upon Muhammad and his pure and immaculate Family; hasten their relief, destroy their adversaries, and keep us steadfast upon their guardianship until the Day of Judgment!"
      }
    ]
  },
  {
    "id": "dua-faraj-ilahi-azuma",
    "slug": "dua-faraj-ilahi-azuma",
    "title": "Dua Faraj (Ilahi Azuma'l Bala)",
    "arabicTitle": "دُعَاءُ الْفَرَج (إِلَهِي عَظُمَ الْبَلاَء)",
    "source": "Imam al-Mahdi (AJTF) taught to Abu al-Hasan Muhammad ibn Ahmad ibn Abi al-Layth in Baghdad",
    "occasion": "Times of calamity, oppression, and after daily prayers for immediate deliverance",
    "shortDesc": "The urgent supplication of deliverance taught directly by the 12th Imam to escape mortal persecution.",
    "fullDesc": "Narrated in classical texts such as Kunuz al-Najah and Mafatih al-Jinan, Imam al-Mahdi (AJTF) appeared in a vision to a wrongfully imprisoned Shia in Baghdad and taught him this prayer of immediate relief. Upon reciting it, the prisoner was granted miraculous release.",
    "paragraphs": [
      {
        "arabic": "إِلَهِي عَظُمَ الْبَلاَءُ، وَبَرِحَ الْخَفَاءُ، وَانْكَشَفَ الْغِطَاءُ، وَانْقَطَعَ الرَّجَاءُ، وَضَاقَتِ الأَرْضُ وَمُنِعَتِ السَّمَاءُ، وَأَنْتَ الْمُسْتَعَانُ وَإِلَيْكَ الْمُشْتَكَى، وَعَلَيْكَ الْمُعَوَّلُ فِي الشِّدَّةِ وَالرَّخَاءِ.",
        "transliteration": "Ilahi 'azumal-bala', wa barihal-khafa', wan-kashafal-ghita', wan-qata'ar-raja', wa daqatil-ardu wa muni'atis-sama', wa Antal-Musta'anu wa Ilaykal-mushtaka, wa 'alaykal-mu'awwalu fish-shiddati war-rakha'.",
        "translation": "My God! Affliction has grown enormous, concealment has departed, the veil has been removed, hope has been cut off, the earth has grown narrow, and heaven has withheld its rain! You alone are the One whose help is besought, to You alone complaints are made, and in You alone is reliance placed in hardship and in ease!"
      },
      {
        "arabic": "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ، أُولِي الأَمْرِ الَّذِينَ فَرَضْتَ عَلَيْنَا طَاعَتَهُمْ، وَعَرَّفْتَنَا بِذَلِكَ مَنْزِلَتَهُمْ، فَفَرِّجْ عَنَّا بِحَقِّهِمْ فَرَجاً عَاجِلاً قَرِيباً كَلَمْحِ الْبَصَرِ أَوْ هُوَ أَقْرَبُ.",
        "transliteration": "Allahumma salli 'ala Muhammadin wa Aali Muhammad, ulil-amril-ladhina faradta 'alayna ta'atahum, wa 'arraftana bi-dhalika manzilatahum, fa-farrij 'anna bi-haqqihim farajan 'ajilan qariban ka-lamhil-basari aw huwa aqrab.",
        "translation": "O Allah, bless Muhammad and the Family of Muhammad—the authorities whose obedience You have ordained upon us, making known to us thereby their exalted station! Relieve us therefore, for their sake, with relief that is swift and near, like the blink of an eye or even quicker!"
      },
      {
        "arabic": "يَا مُحَمَّدُ يَا عَلِيُّ، يَا عَلِيُّ يَا مُحَمَّدُ، اكْفِيَانِي فَإِنَّكُمَا كَافِيَانِ، وَانْصُرَانِي فَإِنَّكُمَا نَاصِرَانِ. يَا مَوْلاَنَا يَا صَاحِبَ الزَّمَانِ، الْغَوْثَ الْغَوْثَ الْغَوْثَ، أَدْرِكْنِي أَدْرِكْنِي أَدْرِكْنِي، السَّاعَةَ السَّاعَةَ السَّاعَةَ، الْعَجَلَ الْعَجَلَ الْعَجَلَ، يَا أَرْحَمَ الرَّاحِمِينَ، بِحَقِّ مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ.",
        "transliteration": "Ya Muhammadu ya 'Ali, ya 'Aliyyu ya Muhammad, ikfiyani fa-innakuma kafiyan, wansurani fa-innakuma nasiran. Ya Mawlana ya Sahibaz-Zaman, al-ghawth al-ghawth al-ghawth, adrikni adrikni adrikni, as-sa'ah as-sa'ah as-sa'ah, al-'ajal al-'ajal al-'ajal, ya Arhamar-Rahimin, bi-haqqi Muhammadin wa Aalihit-tahirin.",
        "translation": "O Muhammad! O Ali! O Ali! O Muhammad! Suffice me both, for you both are sufficient; assist me both, for you both are helpers! O our Master! O Lord of the Age! Rescue! Rescue! Rescue! Reach me! Reach me! Reach me! This very hour! This very hour! This very hour! Hasten! Hasten! Hasten! O Most Merciful of the merciful, for the sake of Muhammad and his immaculate Family!"
      }
    ]
  },
  {
    "id": "dua-allahumma-kunle",
    "slug": "dua-allahumma-kunle",
    "title": "Dua Allahumma Kunle",
    "arabicTitle": "دُعَاءُ اللَّهُمَّ كُنْ لَهُ — مُنَاجَاةُ صَاحِبِ الزَّمَان",
    "source": "Imam Ali al-Rida (AS) via Misbah al-Mutahajjid & Jamal al-Usbu'",
    "occasion": "Friday afternoons, post-Salat supplication, and during times of intense spiritual communion",
    "shortDesc": "The expansive protective shield and salutation upon Imam al-Hujjah (AJTF) transmitted by the 8th Imam.",
    "fullDesc": "Imam Ali al-Rida (AS) enjoined his followers to recite this comprehensive supplication for the 12th Imam. It asks Allah to surround the Imam with divine guardianship, shield him from all earthly and unseen perils, and grant his supporters steadfastness upon his path.",
    "paragraphs": [
      {
        "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. اللَّهُمَّ ادْفَعْ عَنْ وَلِيِّكَ وَخَلِيفَتِكَ وَحُجَّتِكَ عَلَى خَلْقِكَ، وَلِسَانِكَ الْمُعَبِّرِ عَنْكَ، النَّاطِقِ بِحِكْمَتِكَ، وَعَيْنِكَ النَّاظِرَةِ بِإِذْنِكَ، وَشَاهِدِكَ عَلَى عِبَادِكَ، الْجَحْجَاحِ الْمُجَاهِدِ الْعَائِذِ بِكَ الْعَابِدِ عِنْدَكَ.",
        "transliteration": "Bismillahir-Rahmanir-Rahim. Allahummad-fa' 'an waliyyika wa khalifatika wa hujjatika 'ala khalqik, wa lisanikal-mu'abbiri 'ank, an-natiqi bi-hikmatik, wa 'aynikan-nazirati bi-idhnik, wa shahidika 'ala 'ibadik, al-jahjahil-mujahidil-'a'idhi bikal-'abidi 'indak.",
        "translation": "In the Name of Allah, the Most Gracious, the Most Merciful. O Allah! Repel all afflictions from Your representative, Your vicegerent, and Your Proof over Your creation; the tongue expressing on Your behalf, speaking with Your wisdom; Your eye beholding with Your permission; Your witness over Your servants; the courageous striver taking refuge in You, and the devoted worshiper in Your presence!"
      },
      {
        "arabic": "اللَّهُمَّ وَأَعِذْهُ مِنْ شَرِّ جَمِيعِ مَا خَلَقْتَ وَبَرَأْتَ وَأَنْشَأْتَ وَصَوَّرْتَ، وَاحْفَظْهُ مِنْ بَيْنِ يَدَيْهِ وَمِنْ خَلْفِهِ وَعَنْ يَمِينِهِ وَعَنْ شِمَالِهِ وَمِنْ فَوْقِهِ وَمِنْ تَحْتِهِ، بِحِفْظِكَ الَّذِي لاَ يَضِيعُ مَنْ حَفِظْتَهُ بِهِ، وَاحْفَظْ فِيهِ رَسُولَكَ وَآبَاءَهُ أَئِمَّتَكَ وَدَعَائِمَ دِينِكَ.",
        "transliteration": "Allahumma wa a'idh-hu min sharri jami'i ma khalaqta wa bara'ta wa ansha'ta wa sawwart, wahfazhu min bayni yadayhi wa min khalfihi wa 'an yaminihi wa 'an shimalihi wa min fawqihi wa min tahtih, bi-hifzikal-ladhi la yadi'u man hafiztahu bih, wahfaz fihi Rasulaka wa aba'ahu a'immataka wa da'a'ima dinik.",
        "translation": "O Allah! Protect him from the evil of all that You have created, brought into being, originated, and formed! Guard him from before him, from behind him, from his right, from his left, from above him, and from beneath him with Your guardianship—that which preserves whoever is kept safe by it; and preserve through him Your Messenger and his forefathers, Your Imams and the pillars of Your faith!"
      },
      {
        "arabic": "اللَّهُمَّ وَأَحْيِ بِهِ الْعَدْلَ، وَأَيِّدْهُ بِالنَّصْرِ، وَانْصُرْ نَاصِرِيهِ، وَاخْذُلْ خَاذِلِيهِ، وَاقْصِمْ قَاصِمِيهِ، وَاقْصِمْ بِهِ جَبَابِرَةَ الْكُفْرِ، وَاقْتُلْ بِهِ الْكُفَّارَ وَالْمُنَافِقِينَ وَجَمِيعَ الْمُلْحِدِينَ حَيْثُ كَانُوا مِنْ مَشَارِقِ الأَرْضِ وَمَغَارِبِهَا، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ.",
        "transliteration": "Allahumma wa ahyi bihil-'adl, wa ayyid-hu bin-nasr, wansur nasirih, wakhdhul khadhilih, waqsim qasimih, waqsim bihi jababiratal-kufr, waqtul bihil-kuffara wal-munafiqina wa jami'al-mulhidina haythu kanu min mashariqil-ardi wa magharibiha, bi-rahmatika ya Arhamar-Rahimin.",
        "translation": "O Allah! Revive through him absolute justice; reinforce him with divine victory; assist those who assist him; forsake those who abandon him; vanquish those who plot against him; shatter through him the tyrants of falsehood; and eradicate through him disbelief and hypocrisy throughout the easts of the earth and its wests, by Your mercy, O Most Merciful of the merciful!"
      }
    ]
  },
  {
    "id": "dua-marefat-imam",
    "slug": "dua-marefat-imam",
    "title": "Dua Marefat e Imam (atfs)",
    "arabicTitle": "دُعَاءُ مَعْرِفَةِ الإِمَام (عَجَّلَ اللَّهُ تَعَالَى فَرَجَهُ الشَّرِيف)",
    "source": "Imam Ja'far al-Sadiq (AS) transmitted by Shaykh al-Kulayni in Usul al-Kafi & Shaykh al-Saduq in Kamal al-Din",
    "occasion": "Recommended to be recited daily during the Major Occultation to protect one's faith",
    "shortDesc": "The essential supplication for deep spiritual cognition of Allah, His Prophet, and the Divine Proof.",
    "fullDesc": "Shaykh al-Kulayni narrates that Zurarah asked Imam Ja'far al-Sadiq (AS): 'What should I do if I reach the era of occultation?' The Imam instructed: 'Recite this supplication consistently.' It forms the theological bedrock of understanding divine guidance and retaining certitude during trials.",
    "paragraphs": [
      {
        "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. اللَّهُمَّ عَرِّفْنِي نَفْسَكَ، فَإِنَّكَ إِنْ لَمْ تُعَرِّفْنِي نَفْسَكَ لَمْ أَعْرِفْ نَبِيَّكَ؛ اللَّهُمَّ عَرِّفْنِي رَسُولَكَ، فَإِنَّكَ إِنْ لَمْ تُعَرِّفْنِي رَسُولَكَ لَمْ أَعْرِفْ حُجَّتَكَ؛ اللَّهُمَّ عَرِّفْنِي حُجَّتَكَ، فَإِنَّكَ إِنْ لَمْ تُعَرِّفْنِي حُجَّتَكَ ضَلَلْتُ عَنْ دِينِي.",
        "transliteration": "Bismillahir-Rahmanir-Rahim. Allahumma 'arrifni nafsak, fa-innaka in lam tu'arrifni nafsaka lam a'rif Nabiyyak; Allahumma 'arrifni Rasulak, fa-innaka in lam tu'arrifni Rasulaka lam a'rif Hujjatak; Allahumma 'arrifni Hujjatak, fa-innaka in lam tu'arrifni Hujjataka dalaltu 'an dini.",
        "translation": "In the Name of Allah, the Most Gracious, the Most Merciful. O Allah! Make me cognisant of Yourself, for if You do not make me cognisant of Yourself, I will not recognize Your Prophet. O Allah! Make me cognisant of Your Messenger, for if You do not make me cognisant of Your Messenger, I will not recognize Your Proof. O Allah! Make me cognisant of Your Proof, for if You do not make me cognisant of Your Proof, I will surely go astray from my religion!"
      },
      {
        "arabic": "اللَّهُمَّ لاَ تُمِتْنِي مِيتَةً جَاهِلِيَّةً، وَلاَ تُزِغْ قَلْبِي بَعْدَ إِذْ هَدَيْتَنِي، هَبْ لِي مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ. اللَّهُمَّ فَثَبِّتْنِي عَلَى دِينِكَ، وَاسْتَعْمِلْنِي بِطَاعَتِكَ، وَلَيِّنْ قَلْبِي لِوَلِيِّ أَمْرِكَ، وَعَافِنِي مِمَّا امْتَحَنْتَ بِهِ خَلْقَكَ.",
        "transliteration": "Allahumma la tumitni mitatan jahiliyyah, wa la tuzigh qalbi ba'da idh hadaytani, hab li min ladunka rahmatan innaka Antal-Wahhab. Allahumma fa-thabbitni 'ala dinik, was-ta'milni bi-ta'atik, wa layyin qalbi li-waliyyi amrik, wa 'afini mim-mam-tahanta bihi khalqak.",
        "translation": "O Allah! Let me not die a death of pre-Islamic ignorance, and let not my heart deviate after You have guided me; grant me mercy from Your presence, for You are indeed the Supreme Bestower! O Allah, make me steadfast upon Your faith, employ me in Your obedience, soften my heart toward the guardian of Your command, and preserve me from that through which You test Your creation!"
      },
      {
        "arabic": "اللَّهُمَّ كَمَا خَصَصْتَنَا بِوَلاَيَةِ أَهْلِ بَيْتِ نَبِيِّكَ، فَثَبِّتْنَا عَلَى دِينِكَ، وَلاَ تَسْلُبْنَا يَقِينَنَا بِطُولِ أَمَدِ غَيْبَتِهِ، وَلاَ تَجْعَلْنَا مِمَّنْ يَقُولُ: طَالَ الأَمَدُ فَقَسَتْ قُلُوبُهُمْ، وَارْزُقْنَا رُؤْيَتَهُ وَطَاعَتَهُ وَنُصْرَتَهُ، يَا ذَا الْجَلاَلِ وَالإِكْرَامِ.",
        "transliteration": "Allahumma kama khasastana bi-walayati Ahli Bayti Nabiyyik, fa-thabbitna 'ala dinik, wa la taslubna yaqinana bi-tuli amadi ghaybatih, wa la taj'alna mimman yaqulu: tala al-amadu fa-qasat qulubuhum, war-zuqna ru'yatahu wa ta'atahu wa nusratah, ya Dhal-Jalali wal-Ikram.",
        "translation": "O Allah! Just as You have distinguished us through the guardianship of the Household of Your Prophet, keep us firm upon Your faith, do not deprive us of our certitude on account of the prolonged duration of his occultation, and make us not among those who say: 'The period has grown long, so their hearts have hardened.' Grant us the joy of beholding him, obeying him, and assisting him, O Lord of Majesty and Generosity!"
      }
    ]
  },
  {
    "id": "dua-ahad",
    "slug": "dua-ahad",
    "title": "Dua Ahad",
    "arabicTitle": "دُعَاءُ الْعَهْد",
    "source": "Imam Ja'far al-Sadiq (AS) via Bihar al-Anwar & Misbah al-Kaf'ami",
    "occasion": "Recited every morning for 40 consecutive days after dawn prayer",
    "shortDesc": "The sacred pledge of allegiance renewed every dawn to the Living Imam of the Age, Imam al-Mahdi (AJTF).",
    "fullDesc": "Imam Ja'far al-Sadiq (AS) stated that whoever supplicates to Allah with this covenant for forty mornings will be numbered among the helpers of the Qa'im (AJTF). Even if death intervenes prior to the Imam's advent, Allah will raise him from his grave to answer the call.",
    "paragraphs": [
      {
        "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. اللَّهُمَّ رَبَّ النُّورِ الْعَظِيمِ، وَرَبَّ الْكُرْسِيِّ الرَّفِيعِ، وَرَبَّ الْبَحْرِ الْمَسْجُورِ، وَمُنْزِلَ التَّوْرَاةِ وَالإِنْجِيلِ وَالزَّبُورِ، وَرَبَّ الظِّلِّ وَالْحَرُورِ، وَمُنْزِلَ الْقُرْآنِ الْعَظِيمِ، وَرَبَّ الْمَلاَئِكَةِ الْمُقَرَّبِينَ وَالأَنْبِيَاءِ وَالْمُرْسَلِينَ.",
        "transliteration": "Bismillahir-Rahmanir-Rahim. Allahumma Rabban-Nuril-'Azim, wa Rabbal-Kursiyyir-Rafi', wa Rabbal-Bahril-Masjur, wa Munzilat-Tawrati wal-Injili waz-Zabur, wa Rabwaz-Zilli wal-Harur, wa Munzilal-Qur'anil-'Azim, wa Rabbal-Mala'ikatil-Muqarrabina wal-Anbiya'i wal-Mursalin.",
        "translation": "In the Name of Allah, the Most Gracious, the Most Merciful. O Allah, Lord of the Magnificent Light! Lord of the Exalted Throne! Lord of the Surging Ocean! Revealer of the Torah, the Gospel, and the Psalms! Lord of shade and intense heat! Revealer of the Magnificent Quran! And Lord of the near-stationed Angels, the Prophets, and the Messengers!"
      },
      {
        "arabic": "اللَّهُمَّ إِنِّي أُجَدِّدُ لَهُ فِي صَبِيحَةِ يَوْمِي هَذَا وَمَا عِشْتُ مِنْ أَيَّامِي عَهْداً وَعَقْداً وَبَيْعَةً لَهُ فِي عُنُقِي، لاَ أَحُولُ عَنْهَا وَلاَ أَزُولُ أَبَداً. اللَّهُمَّ اجْعَلْنِي مِنْ أَنْصَارِهِ وَأَعْوَانِهِ، وَالذَّابِّينَ عَنْهُ، وَالْمُسَارِعِينَ إِلَيْهِ فِي قَضَاءِ حَوَائِجِهِ، وَالْمُمْتَثِلِينَ لِأَوَامِرِهِ، وَالْمُحَامِينَ عَنْهُ، وَالسَّابِقِينَ إِلَى إِرَادَتِهِ، وَالْمُسْتَشْهَدِينَ بَيْنَ يَدَيْهِ.",
        "transliteration": "Allahumma inni ujaddidu lahu fi sabiyati yawmi hadha wa ma 'ishtu min ayyami 'ahdan wa 'aqdan wa bay'atan lahu fi 'unuqi, la ahulu 'anha wa la azulu abada. Allahummaj-'alni min ansarihi wa a'wanih, wadh-dhabbina 'anh, wal-musari'ina ilayhi fi qada'i hawa'ijih, wal-mumtathilina li-awamirih, wal-muhamina 'anh, was-sabiqina ila iradatih, wal-mustash-hadina bayna yadayh.",
        "translation": "O Allah! I renew for him on this morning of mine, and for as long as I live among my days, a covenant, a pledge, and an allegiance bound upon my neck, which I shall never turn away from nor ever forsake! O Allah! Place me among his helpers, his aides, those who defend him, those who hasten to fulfill his needs, those who comply with his commands, those who protect him, those who race toward his will, and those who achieve martyrdom in his presence!"
      },
      {
        "arabic": "اللَّهُمَّ إِنْ حَالَ بَيْنِي وَبَيْنَهُ الْمَوْتُ الَّذِي جَعَلْتَهُ عَلَى عِبَادِكَ حَتْماً مَقْضِيّاً، فَأَخْرِجْنِي مِنْ قَبْرِي مُؤْتَزِراً كَفَنِي، شَاهِراً سَيْفِي، مُجَرِّداً قَنَاتِي، مُلَبِّياً دَعْوَةَ الدَّاعِي فِي الْحَاضِرِ وَالْبَادِي. اللَّهُمَّ أَرِنِي الطَّلْعَةَ الرَّشِيدَةَ، وَالْغُرَّةَ الْحَمِيدَةَ، وَاكْحُلْ نَاظِرِي بِنَظْرَةٍ مِنِّي إِلَيْهِ، وَعَجِّلْ فَرَجَهُ، وَسَهِّلْ مَخْرَجَهُ، وَأَوْسِعْ مَنْهَجَهُ.",
        "transliteration": "Allahumma in hala bayni wa baynahul-mawtul-ladhi ja'altahu 'ala 'ibadika hatman maqdian, fa-akhrijni min qabri mu'taziran kafani, shahiran sayfi, mujarridan qanati, mulabbiyan da'watad-da'i fil-hadiri wal-badi. Allahumma arinit-tal'atar-rashidah, wal-ghurnatal-hamidah, wak-hul naziri bi-nazratin minni ilayh, wa 'ajjil farajah, wa sahhil makhrajah, wa awsi' manhajah.",
        "translation": "O Allah! If death—which You have made an inevitable decree upon Your servants—should intervene between me and him, then bring me forth from my grave, wrapped in my shroud, with my sword unsheathed and my spear poised, answering the call of the summoner in cities and in deserts! O Allah, show me the rightly-guided countenance and the praised beauty; adorn my eyes with a glance at him; hasten his deliverance, make smooth his reappearance, and broaden his path!"
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
