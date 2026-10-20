export interface SeeratChapter {
  id: string;
  chapterNumber: number;
  era: "Makkah" | "Madinah" | "Universal";
  periodYears: string;
  title: string;
  urduTitle: string;
  summary: string;
  keyEvents: string[];
  lessons: string[];
  fullNarrative: string;
}

export const SEERAT_CHAPTERS: SeeratChapter[] = [
  {
    id: "birth-and-lineage",
    chapterNumber: 1,
    era: "Makkah",
    periodYears: "570 CE – 595 CE",
    title: "Blessed Birth, Lineage & Early Youth",
    urduTitle: "ولادت باسعادت، نسب مبارک اور ابتدائی زندگی",
    summary:
      "The noble lineage from Prophet Ibrahim (A.S), birth in the Year of the Elephant (Am al-Fil), upbringing under Halimah Sa'diyyah, and guardianship of Abdul Muttalib and Abu Talib.",
    keyEvents: [
      "Born on 12th Rabi-ul-Awwal in the Year of the Elephant (570 CE) in Makkah.",
      "Father Abdullah ibn Abdul Muttalib passed away before his birth.",
      "Nursing years in the desert of Banu Sa'd with Halimah Sa'diyyah.",
      "Passing of his beloved mother Aminah bint Wahb at Al-Abwa (age 6).",
      "Care under grandfather Abdul Muttalib and subsequently uncle Abu Talib.",
      "Trade journey to Syria and the encounter with monk Bahira at Busra.",
      "Participation in Hilf al-Fudul (The League of the Virtuous) for social justice.",
    ],
    lessons: [
      "Perseverance and humility in the face of orphanhood.",
      "Integrity in business dealings earning the titles 'As-Sadiq' (The Truthful) and 'Al-Amin' (The Trustworthy).",
      "Commitment to communal justice regardless of tribal affiliations.",
    ],
    fullNarrative: `The Messenger of Allah, Muhammad ibn Abdullah ibn Abdul Muttalib (S.A.W), was born in Makkah into the noble Hashimite clan of the Quraysh tribe in the Year of the Elephant (circa 570 CE). His lineage traced back through Adnan to Prophet Ismail and Prophet Ibrahim (peace be upon them).

Having lost his father Abdullah before birth, his mother Aminah entrusted him to the care of Halimah al-Sa'diyyah in the pure desert air of the Banu Sa'd, where he mastered pure Arabic speech and experienced the pristine desert upbringing. At age six, his mother passed away at Al-Abwa upon returning from visiting his father's resting place in Yathrib.

His grandfather Abdul Muttalib took tender care of the young orphan until his own passing two years later, after which his uncle Abu Talib assumed guardianship with deep affection and steadfast loyalty.

As a youth, the Prophet (S.A.W) worked as a shepherd, later reflecting: "Allah did not send any prophet except that he tended sheep." During his twenties, his exemplary honesty, gentle demeanor, and incorruptible character became renowned across Arabia, earning him the universal honorifics of As-Sadiq (The Truthful) and Al-Amin (The Trustworthy). He witnessed and actively championed the pact of Hilf al-Fudul, an alliance formed in Makkah to protect vulnerable travelers, orphans, and oppressed debtors from tribal exploitation.`,
  },
  {
    id: "marriage-and-revelation",
    chapterNumber: 2,
    era: "Makkah",
    periodYears: "595 CE – 610 CE",
    title: "Marriage to Hazrat Khadijah (R.A) & First Revelation",
    urduTitle: "سیدہ خدیجہؓ سے نکاح اور نزول وحی",
    summary:
      "Commercial success in Syria, marriage to Sayyidah Khadijah bint Khuwaylid, rebuilding of the Ka'bah and arbitration of the Black Stone, and spiritual retreat in Cave Hira culminating in the descent of Jibril (A.S).",
    keyEvents: [
      "Successful management of Sayyidah Khadijah's trade caravan to Syria.",
      "Marriage to Sayyidah Khadijah (R.A), a union of deep love and enduring support.",
      "Arbitration of the Black Stone (Hajar al-Aswad) resolving a civil war threat among Quraysh.",
      "Solitary contemplation and worship in Cave Hira on Jabal al-Noor.",
      "Descent of Angel Jibril (A.S) with Surah Al-Alaq: 'Read in the name of your Lord who created.'",
      "Verification by Waraqah ibn Nawfal and unwavering faith of Sayyidah Khadijah.",
    ],
    lessons: [
      "Mutual respect, loyalty, and deep partnership in marriage.",
      "Divine wisdom in resolving volatile tribal conflicts through shared dignity.",
      "The paramount importance of contemplation, reflection, and spiritual seeking.",
    ],
    fullNarrative: `Impression by his absolute integrity and business acumen, the noble merchant woman Sayyidah Khadijah bint Khuwaylid (R.A) proposed marriage through her companion Nafisa. The Prophet (S.A.W) accepted, and their twenty-five-year marriage became an oasis of unconditional peace, profound companionship, and unwavering support.

When the Quraysh rebuilt the holy Ka'bah after torrential flood damage, a bitter conflict arose over which clan held the supreme honor of placing the Black Stone (Hajar al-Aswad) back in its corner, bringing clans to the brink of bloodshed. The Prophet (S.A.W) entered the precinct and provided an inspired solution: placing the Black Stone on his cloak and having a chieftain from every clan hold an edge together, before gently seating the Stone into place with his own hands.

In his late thirties, the Prophet retreated for days at a time to the tranquil solitude of Cave Hira on Mount Noor, meditating upon the Creator and lamenting the idolatry and moral decline of society. In Ramadan 610 CE, at the age of forty, Angel Jibril (Gabriel) appeared in the cave, embracing him and commanding: "Iqra'!" (Read!). The opening verses of Surah Al-Alaq were revealed, marking the dawn of the final prophetic mission for all humanity.`,
  },
  {
    id: "early-dawah-and-persecution",
    chapterNumber: 3,
    era: "Makkah",
    periodYears: "610 CE – 619 CE",
    title: "Open Dawah, Heavy Persecution & The Boycott",
    urduTitle: "دعوت حق، قریش کے مظالم اور شعب ابی طالب کا بائیکاٹ",
    summary:
      "Secret dawah turning public at Mount Safa, brutal torture of vulnerable early Muslims, the migrations to Abyssinia (Habasha), and the painful three-year socio-economic blockade in Shib Abi Talib.",
    keyEvents: [
      "Early converts: Khadijah (R.A), Ali ibn Abi Talib (R.A), Zayd ibn Harithah (R.A), Abu Bakr (R.A).",
      "Public declaration of Tawheed from the summit of Mount Safa.",
      "Torture of Bilal ibn Rabah, Sumayyah bint Khayyat, and Ammar ibn Yasir.",
      "First and Second Migrations of Muslims to Abyssinia under King Najashi's protection.",
      "Conversion of Hamzah ibn Abdul Muttalib and Umar ibn al-Khattab.",
      "Three-year brutal social and economic boycott of Banu Hashim in Shib Abi Talib.",
    ],
    lessons: [
      "Steadfastness on truth in the face of psychological and physical hostility.",
      "Justice and compassion across faiths, demonstrated by the Christian King of Abyssinia.",
      "Sacrifice of worldly comfort and lineage for the preservation of faith and humanity.",
    ],
    fullNarrative: `The dawah began privately with those closest to the Prophet (S.A.W). When commanded by Allah to warn his kin, the Prophet climbed Mount Safa and proclaimed: "If I were to tell you that cavalry were preparing to attack from behind this valley, would you believe me?" They answered in unison: "Yes, we have never found you telling a lie." He then warned them of Allah's impending reckoning and the truth of Monotheism.

The Quraysh elite resisted violently, fearing the loss of their lucrative idol trade and aristocratic hegemony. Vulnerable slaves and laborers who embraced Islam—such as Bilal ibn Rabah and the family of Yasir—endured merciless torture under the scorching sun. Sumayyah became the first martyr of Islam.

To preserve his followers from annihilation, the Prophet instructed a contingent to migrate across the Red Sea to the Christian kingdom of Abyssinia, stating: "Go to Abyssinia, for in it is a king under whom no one is wronged." In 616 CE, the Quraysh signed an ostracizing decree banishing Banu Hashim and Banu Muttalib to the barren ravine of Shib Abi Talib. For three grueling years, Muslims and their non-Muslim kin ate tree leaves and leather scraps rather than renounce their faith, until the document hung in the Ka'bah was consumed by termites, saving only the name of Allah.`,
  },
  {
    id: "year-of-sorrow-and-isra-miraj",
    chapterNumber: 4,
    era: "Makkah",
    periodYears: "619 CE – 621 CE",
    title: "The Year of Sorrow, Journey to Ta'if & Isra' wal-Mi'raj",
    urduTitle: "عام الحزن، سفر طائف اور واقعہ معراج شریف",
    summary:
      "The devastating passing of Abu Talib and Sayyidah Khadijah, the violent rejection at Ta'if, the divine comfort of the miraculous Night Journey from Makkah to Jerusalem, and ascension to the Divine Presence.",
    keyEvents: [
      "The 'Year of Sorrow' (Am al-Huzn): Passing of beloved wife Khadijah and guardian Abu Talib.",
      "Journey to Ta'if on foot; pelted with stones and bleeding until sheltering in an orchard.",
      "The famous prayer of Ta'if: 'O Allah, to You I complain of my weakness and lack of resource...'",
      "Refusal to invoke destruction upon Ta'if by the Angel of Mountains.",
      "Al-Isra' wal-Mi'raj: Night Journey from Masjid al-Haram to Masjid al-Aqsa.",
      "Ascension through the seven celestial spheres and the prescription of the five daily Salah.",
    ],
    lessons: [
      "Responding to cruelty with mercy and long-term hope for future generations.",
      "Daily Salah as the believer's personal ascension (Mi'raj al-Mu'min).",
      "Divine comfort following extreme worldly sorrow and tribulation.",
    ],
    fullNarrative: `The tenth year of Prophethood witnessed two monumental personal losses: the passing of his protective uncle Abu Talib and shortly thereafter his beloved wife Khadijah (R.A), who had been his rock of comfort and affirmation. This year was remembered as 'Am al-Huzn' (The Year of Sorrow).

Seeking shelter and support, the Prophet walked sixty miles to the mountain city of Ta'if. The chieftains treated him with mocking contempt and incited street youths to pelt him with stones until his shoes were filled with blood. Reaching the safety of a vineyard, he turned not in anger against them, but in intimate supplication to Allah. When Angel Jibril offered to crush the city between the two surrounding mountains, the Prophet of Mercy replied: "No, rather I hope that Allah will bring forth from their descendants those who will worship Allah alone."

As supreme divine solace for these trials, Allah granted him Al-Isra' wal-Mi'raj. Carried by the heavenly steed Al-Buraq from Makkah to Jerusalem's Masjid al-Aqsa, he led all the gathered Prophets in prayer. He then ascended through the celestial realms, meeting past Prophets and reaching the Lote Tree of the Utmost Boundary (Sidrat al-Muntaha), where the five daily prayers were ordained as a perpetual spiritual gift for his Ummah.`,
  },
  {
    id: "hijrah-and-madinah",
    chapterNumber: 5,
    era: "Madinah",
    periodYears: "622 CE – 624 CE",
    title: "The Great Hijrah & Building the Madinah State",
    urduTitle: "ہجرت مدینہ اور ریاست مدینہ کی بنیاد",
    summary:
      "Pledges of Aqabah, miraculous escape from assassination, the cave of Thawr, arrival at Quba and Yathrib, fraternal bonding (Muwakhat), and the historic Constitution of Madinah.",
    keyEvents: [
      "The First and Second Pledges of Aqabah with the tribes of Yathrib (Aws and Khazraj).",
      "Assassination plot by Quraysh and Hazrat Ali (R.A) sleeping in the Prophet's bed.",
      "Three-day refuge with Abu Bakr (R.A) in the Cave of Thawr: 'Grieve not; Allah is with us.'",
      "Building of Masjid Quba, the first mosque in Islamic history.",
      "Welcomed into Yathrib (renamed Al-Madinah al-Munawwarah - The Radiant City).",
      "Construction of Al-Masjid an-Nabawi with the Prophet's own hands.",
      "Institutionalization of Muwakhat (brotherhood between Muhajireen and Ansar).",
      "Enactment of Sahifat al-Madinah (Constitution of Madinah), safeguarding equal citizenship.",
    ],
    lessons: [
      "Meticulous strategic planning combined with absolute reliance on Allah (Tawakkul).",
      "The mosque as a civic, educational, and spiritual heartbeat of society.",
      "Pluralism, freedom of religion, and cooperative defense under the rule of law.",
    ],
    fullNarrative: `Following the Pledges of Aqabah, Muslims gradually emigrated north to Yathrib. Alarmed by the prospect of a Muslim stronghold on their northern trade route, the Quraysh plotted to assassinate the Prophet by sending representatives from every tribe to strike him simultaneously. Divinely warned, the Prophet asked his cousin Ali ibn Abi Talib to lie in his cloak upon his bed to return entrusted goods, while he and Abu Bakr departed under the cloak of night.

They sought refuge in the Cave of Thawr for three days. When trackers stood at the mouth of the cave, Abu Bakr feared for the Prophet's life, but the Prophet reassured him: "What do you think of two when Allah is their third?"

Upon reaching the outskirts of Yathrib, he laid the foundations of Masjid Quba. Entering the city amidst rejoicing and songs of 'Tala'a al-Badru 'Alayna', the city was renamed Madinat al-Nabi (City of the Prophet). In Madinah, the Prophet established a revolutionary social contract: the Muwakhat, pairing displaced Makkan refugees with local Ansar hosts who shared their homes, land, and wealth with unprecedented generosity. He drafted the historic Constitution of Madinah (Mithaq al-Madinah), uniting Muslim, Jewish, and non-Muslim clans as one political community (Ummah Wahidah) with full freedom of conscience and mutual defense duties.`,
  },
  {
    id: "defensive-struggles",
    chapterNumber: 6,
    era: "Madinah",
    periodYears: "624 CE – 627 CE",
    title: "Major Battles: Badr, Uhud & The Trench (Khandaq)",
    urduTitle: "غزوات دفاعیہ: بدر، احد اور خندق",
    summary:
      "The decisive turning point at Badr, the strategic lessons of Mount Uhud, and the siege of Madinah broken through the innovative Persian strategy of Salman al-Farsi.",
    keyEvents: [
      "The Battle of Badr (17th Ramadan 2 AH): 313 ill-equipped believers defeat a 1,000-strong army.",
      "Humane treatment of Badr prisoners: ransomed by teaching ten Muslim children to read and write.",
      "The Battle of Uhud (3 AH): Initial victory compromised by archers abandoning their post.",
      "The Battle of the Trench (Al-Khandaq / Ahzab, 5 AH): Digging a defensive trench around Madinah.",
      "Breaking of the confederate siege of 10,000 troops through perseverance and divine wind.",
    ],
    lessons: [
      "True victory depends on moral uprightness, discipline, and divine help, not sheer numbers.",
      "The dire consequences of disobedience and material distraction during collective duty.",
      "Openness to innovative knowledge and cross-cultural consultation (Shura).",
    ],
    fullNarrative: `Threatened by constant raids from Makkah, the Muslims confronted the Quraysh army at the wells of Badr in Ramadan 624 CE. Outnumbered more than three-to-one, the Prophet spent the preceding night weeping in prayer. The battle concluded in a momentous victory for the fledgling commonwealth. Setting a new paradigm for the ethics of warfare, captive soldiers were housed, fed the same bread as their captors, and freed if they taught ten illiterate Muslim children to read.

The following year at Mount Uhud, Quraysh returned with 3,000 warriors seeking revenge. When the Muslim archers stationed on the ridge deserted their posts prematurely to gather war spoils, Khalid ibn al-Walid mounted a flanking cavalry charge. The Prophet was wounded, losing a tooth, and his beloved uncle Hamzah fell martyr. The Prophet refused to curse his enemies, praying: "O Allah, forgive my people, for they do not know."

In 5 AH, the Quraysh assembled a massive confederacy of 10,000 allied warriors to wipe out Madinah in the Battle of the Trench (Al-Ahzab). On the advice of Salman al-Farsi, Muslims excavated a deep protective trench across the open northern approaches of the city. Enduring harsh winter winds, freezing hunger, and a grueling month-long siege, the believers stood firm until a furious tempest broke the enemy camp, compelling them to retreat in disarray.`,
  },
  {
    id: "hudaybiyyah-and-letters",
    chapterNumber: 7,
    era: "Madinah",
    periodYears: "628 CE – 629 CE",
    title: "The Treaty of Hudaybiyyah & Diplomatic Missions",
    urduTitle: "صلح حدیبیہ اور عالمی حکمرانوں کے نام خطوط",
    summary:
      "Journey for Umrah stopped at Hudaybiyyah, the Pledge of the Tree (Bay'at al-Ridwan), acceptance of apparently unfavorable terms yielding divine victory (Fath Mubeen), and diplomatic letters sent to world empires.",
    keyEvents: [
      "1,400 unarmed believers march for pilgrimage and are halted at Hudaybiyyah.",
      "Bay'at al-Ridwan (Pledge of Satisfaction) beneath the acacia tree.",
      "Negotiating the Treaty of Hudaybiyyah: 10-year mutual peace and cessation of hostilities.",
      "Quranic declaration: 'Indeed, We have granted you a clear victory' (Surah Al-Fath).",
      "Exponential growth of Islam during the years of peaceful dialogue.",
      "Sealed diplomatic letters sent to the Emperors of Rome (Heraclius), Persia (Chosroes), and Egypt.",
    ],
    lessons: [
      "Diplomacy and strategic patience surpass military confrontation.",
      "Prioritizing the establishment of peace creates the natural environment for truth to prevail.",
      "The universal reach of the Islamic message beyond Arabian borders.",
    ],
    fullNarrative: `In 6 AH, the Prophet and 1,400 companions traveled towards Makkah in pilgrim garb, unarmed except for travelers' sheathed blades. Barred from entering at Hudaybiyyah, the Prophet dispatched Uthman ibn Affan to negotiate. When rumors spread of Uthman's murder, the companions took the solemn Pledge of the Tree (Bay'at al-Ridwan), swearing loyalty unto death.

When Quraysh emissary Suhayl ibn Amr arrived to negotiate, the Prophet demonstrated sublime flexibility: accepting terms that appeared outwardly unfavorable to his companions, including returning to Madinah without completing Umrah that year and sending back Makkan runaways. Umar ibn al-Khattab was initially perturbed, but Allah revealed: "Indeed, We have granted you a clear victory."

With weapons laid down and free travel enabled, non-Muslims visited Madinah, listened to the Quran, and engaged in reasoned debate. Within the next two years, more people entered Islam through peaceful interaction than in the entirety of the previous twenty years combined, including military geniuses like Khalid ibn al-Walid and Amr ibn al-Aas. The Prophet dispatched official envoys carrying letters stamped with his silver seal to Heraclius of Byzantium, Chosroes of Persia, the Negus of Abyssinia, and Muqawqis of Alexandria, inaugurating Islam's global dialogue.`,
  },
  {
    id: "conquest-of-makkah",
    chapterNumber: 8,
    era: "Madinah",
    periodYears: "630 CE",
    title: "The Bloodless Conquest of Makkah (Fath Makkah)",
    urduTitle: "فتح مکہ — عفو و درگزر کی عظیم الشان مثال",
    summary:
      "Breach of the peace treaty by Quraysh allies, march of 10,000 believers upon Makkah, bloodless entry with head bowed in humility, cleansing the Ka'bah of 360 idols, and general amnesty for past persecutors.",
    keyEvents: [
      "Banu Bakr attacks Banu Khuza'ah, violating the Hudaybiyyah treaty terms.",
      "Secret march of 10,000 Muslims into Makkah without military resistance.",
      "Prophet enters the holy city riding his camel Al-Qaswa with head bowed low in gratitude.",
      "Cleansing the Ka'bah of 360 stone idols while reciting: 'Truth has arrived and falsehood has perished.'",
      "The historic declaration of general pardon: 'Go your way, for you are free (At-Tulaqa).' ",
      "Bilal ibn Rabah ascends the roof of the Ka'bah to deliver the victorious Adhan.",
    ],
    lessons: [
      "Supreme humility in moments of triumph; victory is from Allah alone.",
      "Magnanimity and unconditional forgiveness over vengeance and retribution.",
      "Cleansing of sacred spaces from ideological corruption.",
    ],
    fullNarrative: `When the Quraysh allied clan Banu Bakr attacked the Muslim-allied Banu Khuza'ah within the sacred territory, the Treaty of Hudaybiyyah was broken. In Ramadan 8 AH (630 CE), the Prophet marched toward Makkah at the head of 10,000 companions. Recognizing the futility of resistance, Makkan leader Abu Sufyan embraced Islam.

The Prophet entered his hometown not as a vengeful conqueror, but riding with his head bowed so low in awe and thanksgiving to Allah that his beard brushed the saddle of his camel. He forbade bloodshed, declaring safety for anyone who stayed inside their homes or sought sanctuary in the house of Abu Sufyan.

Approaching the Ka'bah, he pointed his staff at the 360 idols positioned around it, reciting: "Say: Truth has come, and falsehood has perished. Indeed, falsehood is bound to perish." Standing before the gathered Quraysh who had spent two decades mocking, torturing, and killing his family and companions, he asked: "O people of Quraysh, what do you think I am about to do with you?" They replied: "Good. You are a noble brother, the son of a noble brother." The Prophet uttered the immortal words of Prophet Yusuf: "No blame will there be upon you today. Go, for you are free (Antum at-Tulaqa)." Bilal ibn Rabah, the former Abyssinian slave who had once been crushed under stones, ascended to the roof of the Ka'bah and proclaimed the call to prayer across the valley.`,
  },
  {
    id: "farewell-pilgrimage-and-passing",
    chapterNumber: 9,
    era: "Universal",
    periodYears: "632 CE",
    title: "The Farewell Pilgrimage (Hajjat-ul-Wida) & Departure",
    urduTitle: "حجۃ الوداع، آخری خطبہ اور وصال مبارک",
    summary:
      "The massive Farewell Pilgrimage with over 100,000 companions, the universal charter of human rights at Mount Arafat, completion of the religion (Surah Al-Ma'idah: 3), and the noble passing in Madinah.",
    keyEvents: [
      "Departure from Madinah for the singular complete Hajj of the Prophet.",
      "The Farewell Sermon (Khutbat al-Wida) delivered at the Plain of Arafat.",
      "Abolition of racism: 'An Arab has no superiority over a non-Arab... except by piety.'",
      "Sanctity of human life, property, women's rights, and abolition of usury (Riba).",
      "Revelation of verse: 'This day I have perfected for you your religion...' (5:3).",
      "Brief final illness and passing in the chamber of Sayyidah Aisha (R.A) on 12 Rabi-ul-Awwal 11 AH.",
      "Abu Bakr's steadfast address: 'Whoever worshipped Muhammad, Muhammad has died; but whoever worships Allah, Allah is Ever-Living and does not die.'",
    ],
    lessons: [
      "The universal equality of all human beings regardless of race, color, or ethnicity.",
      "Sanctity of women's rights and economic justice.",
      "The absolute permanence of the divine message beyond the physical lifetime of the Prophet.",
    ],
    fullNarrative: `In the tenth year of the Hijrah (632 CE), the Prophet led over 100,000 companions on his Farewell Pilgrimage (Hajjat al-Wida). Standing on Jabal al-Rahmah upon the plain of Arafat, he delivered his historic Farewell Sermon, establishing the timeless charter of universal human dignity:

"O people! Verily your blood, your property, and your honor are as sacred and inviolable as this day of yours, in this month of yours, in this city of yours... All people descend from Adam, and Adam was created from dust. An Arab has no superiority over a non-Arab, nor does a non-Arab have any superiority over an Arab; nor does a white person have superiority over a black person, nor a black person over a white person, except through Taqwa (piety and God-consciousness). Treat your women with kindness, for they are your partners and committed helpers..."

Lifting his index finger to the sky, he called out: "O Allah, have I conveyed the message?" The multitude echoed in one voice: "Yes, you have!" He responded: "O Allah, bear witness!" On that momentous day, Allah revealed the concluding seal of divine legislation: "This day I have perfected for you your religion, completed My favor upon you, and chosen for you Islam as your religion." (Quran 5:3).

In Safar 11 AH, the Prophet developed a severe fever. Requesting permission to stay in the chamber of Sayyidah Aisha, he spent his final moments whispering advice to his Ummah: "The prayer! Guard the prayer, and treat those whom your right hands possess with justice and mercy." On Monday, 12th Rabi-ul-Awwal 11 AH, at the age of sixty-three, he passed into the company of the Highest Assembly (Ar-Rafiq al-A'la). When panic gripped the community, Abu Bakr stood and addressed the gathering with unshakeable conviction: "Whoever amongst you worshipped Muhammad, then know that Muhammad has passed away. But whoever amongst you worships Allah, then Allah is alive and will never die."`,
  },
];
