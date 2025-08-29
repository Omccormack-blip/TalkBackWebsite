import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SessionManager } from './sessionManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AudioServiceClass {
  async saveAudioFile(file) {
    const fileInfo = {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      timestamp: new Date().toISOString(),
      sessionId: SessionManager.getCurrentSession()
    };

    SessionManager.addAudioFile(file.filename);
    return fileInfo;
  }

  async getSessionAudioFiles() {
    const sessionId = SessionManager.getCurrentSession();
    const uploadsPath = path.join(__dirname, '../../uploads');
    
    try {
      const files = await fs.readdir(uploadsPath);
      const sessionFiles = files.filter(f => f.startsWith(sessionId));
      
      const fileDetails = await Promise.all(
        sessionFiles.map(async (filename) => {
          const filePath = path.join(uploadsPath, filename);
          const stats = await fs.stat(filePath);
          return {
            filename,
            size: stats.size,
            createdAt: stats.birthtime,
            url: `/uploads/${filename}`
          };
        })
      );

      return fileDetails.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Error reading audio files:', error);
      return [];
    }
  }

  async deleteAudioFile(filename) {
    const filePath = path.join(__dirname, '../../uploads', filename);
    await fs.unlink(filePath);
    return true;
  }

  async getAudioFileStream(filename) {
    const filePath = path.join(__dirname, '../../uploads', filename);
    return fs.readFile(filePath);
  }
}

export const AudioService = new AudioServiceClass();