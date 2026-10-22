export type ScriptType = "uthmani" | "indopak";

export type TajweedRuleType = "none" | "madd" | "ikhfa" | "qalqalah" | "ghunnah" | "throat";

export interface TajweedWord {
  word: string;
  tajweed: string;
  type: string;
  rule?: TajweedRuleType;
  phonetics?: string[];
  makhrajHint?: string;
}

export interface LiveKitStatus {
  mode: "live" | "sandbox";
  token?: string;
  serverUrl?: string;
  room?: string;
  username?: string;
  role?: string;
}

export interface LaserPointerState {
  x: number;
  y: number;
  active: boolean;
}

export interface ClassroomLesson {
  id: string;
  title: string;
  subtitle: string;
  category: "quran" | "qaida";
  surahNumber?: number;
  ayahNumber?: number;
  translation: string;
  wordsUthmani: TajweedWord[];
  wordsIndoPak: TajweedWord[];
}

export interface ClassroomToolState {
  fontSize: number;
  fontColor: string;
  underlines: Record<number, boolean>;
  circles: Record<number, boolean>;
  colorHighlights: Record<number, TajweedRuleType>;
  script: ScriptType;
  tajweedMode: boolean;
  activeLessonId?: string;
  highlightedIndex?: number | null;
  splitIndex?: number | null;
  laserPointer?: LaserPointerState;
  activePenRule?: TajweedRuleType;
  bandwidthMode?: "auto" | "audio_only";
}

export interface DeviceSettings {
  audioInputId: string;
  videoInputId: string;
  audioOutputId: string;
  isMicOn: boolean;
  isCameraOn: boolean;
}
