import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SessionManagerClass {
  constructor() {
    this.currentSession = null;
    this.sessions = new Map();
  }

  async initialize() {
    this.currentSession = uuidv4();
    this.sessions.set(this.currentSession, {
      id: this.currentSession,
      startTime: new Date(),
      audioFiles: []
    });

    await this.ensureUploadsDirectory();
    console.log(`Session initialized: ${this.currentSession}`);
  }

  async ensureUploadsDirectory() {
    const uploadsPath = path.join(__dirname, '../../uploads');
    try {
      await fs.access(uploadsPath);
    } catch {
      await fs.mkdir(uploadsPath, { recursive: true });
    }
  }

  getCurrentSession() {
    return this.currentSession;
  }

  getSessionData(sessionId = null) {
    const id = sessionId || this.currentSession;
    return this.sessions.get(id);
  }

  addAudioFile(filename) {
    const session = this.sessions.get(this.currentSession);
    if (session) {
      session.audioFiles.push({
        filename,
        timestamp: new Date(),
        size: 0
      });
    }
  }

  async clearSession() {
    const uploadsPath = path.join(__dirname, '../../uploads');
    const files = await fs.readdir(uploadsPath);
    
    for (const file of files) {
      if (file.startsWith(this.currentSession)) {
        await fs.unlink(path.join(uploadsPath, file));
      }
    }

    this.sessions.delete(this.currentSession);
    await this.initialize();
  }
}

export const SessionManager = new SessionManagerClass();