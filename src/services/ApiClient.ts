import { AudioFile } from '../types';

class ApiClientService {
  private baseUrl = '/api';

  async uploadAudio(blob: Blob): Promise<void> {
    const formData = new FormData();
    formData.append('audio', blob, `feedback_${Date.now()}.webm`);

    const response = await fetch(`${this.baseUrl}/audio/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload audio');
    }

    return response.json();
  }

  async getAudioFiles(): Promise<AudioFile[]> {
    const response = await fetch(`${this.baseUrl}/audio/list`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch audio files');
    }

    const data = await response.json();
    return data.files.map((file: any) => ({
      ...file,
      createdAt: new Date(file.createdAt)
    }));
  }

  async deleteAudioFile(filename: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/audio/${filename}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete audio file');
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const ApiClient = new ApiClientService();