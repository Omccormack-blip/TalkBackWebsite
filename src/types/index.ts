export type AppMode = 'customer' | 'admin';

export type VideoState = 'welcome' | 'questions' | 'thankyou';

export interface AudioFile {
  filename: string;
  size: number;
  createdAt: Date;
  url: string;
}

export interface RecordingState {
  isRecording: boolean;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
}