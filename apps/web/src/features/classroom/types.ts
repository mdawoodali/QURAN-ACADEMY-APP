export type ScriptType = "uthmani" | "indopak";

export interface TajweedWord {
  word: string;
  tajweed: string;
  type: string;
}

export interface LiveKitStatus {
  mode: "live" | "sandbox";
  token?: string;
  serverUrl?: string;
}

export interface ClassroomToolState {
  fontSize: number;
  fontColor: string;
  underlines: Record<number, boolean>;
  circles: Record<number, boolean>;
  script: ScriptType;
  tajweedMode: boolean;
}
