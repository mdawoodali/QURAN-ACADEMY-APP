export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs?: Ayah[];
}

export async function fetchAllSurahs(): Promise<Surah[]> {
  const res = await fetch('https://api.alquran.cloud/v1/surah');
  if (!res.ok) throw new Error('Failed to fetch surahs');
  const json = await res.json();
  return json.data;
}

export async function fetchSurah(surahNumber: number): Promise<Surah> {
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahNumber}`);
  const json = await res.json();
  return json.data;
}
