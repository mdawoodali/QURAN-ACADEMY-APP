export type ScriptType = "uthmani" | "indopak";

export type TajweedRuleType = "none" | "madd" | "ikhfa" | "qalqalah" | "ghunnah" | "throat";

export interface TajweedWord {
  word: string;
  tajweed: string;
  type: string;
  rule?: TajweedRuleType;
  phonetics?: string[];
  makhrajHint?: string;
  isAyahEnd?: boolean;
  ayahNumber?: number;
  waqfSign?: string;
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

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: "teacher" | "student" | "observer";
  text: string;
  timestamp: number;
}

export interface FloatingReaction {
  id: string;
  emoji: string;
  senderName: string;
  senderRole: "teacher" | "student" | "observer";
  x: number; // Percentage horizontal offset 10-90%
}

export interface HandRaise {
  participantId: string;
  participantName: string;
  role: "teacher" | "student" | "observer";
  timestamp: number;
}

export interface HostPermissions {
  chatEnabled: boolean;
  whiteboardAllowed: boolean;
  micAllowed: boolean;
  videoAllowed: boolean;
}

export interface ClassroomParticipant {
  id: string;
  name: string;
  role: "teacher" | "student" | "observer";
  isMicOn: boolean;
  isCameraOn: boolean;
  isHandRaised: boolean;
  isSpeaking?: boolean;
  joinedAt: number;
}

export type ClassroomViewMode = "whiteboard" | "grid" | "dual";
