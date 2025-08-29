import { RecordingState } from '../types';

class AudioRecorderService {
  private recordingState: RecordingState = {
    isRecording: false,
    mediaRecorder: null,
    audioChunks: []
  };

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeType = this.getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      this.recordingState = {
        isRecording: true,
        mediaRecorder,
        audioChunks: []
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordingState.audioChunks.push(event.data);
        }
      };

      mediaRecorder.start(1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to start recording. Please ensure microphone access is granted.');
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.recordingState.mediaRecorder || !this.recordingState.isRecording) {
        reject(new Error('No active recording'));
        return;
      }

      const { mediaRecorder } = this.recordingState;

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.recordingState.audioChunks, {
          type: mediaRecorder.mimeType || 'audio/webm'
        });

        mediaRecorder.stream.getTracks().forEach(track => track.stop());

        this.recordingState = {
          isRecording: false,
          mediaRecorder: null,
          audioChunks: []
        };

        resolve(audioBlob);
      };

      mediaRecorder.stop();
    });
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return '';
  }

  isRecording(): boolean {
    return this.recordingState.isRecording;
  }

  async checkMicrophonePermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return result.state === 'granted';
    } catch {
      return false;
    }
  }
}

export const AudioRecorder = new AudioRecorderService();