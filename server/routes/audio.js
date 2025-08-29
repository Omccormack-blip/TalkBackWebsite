import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { AudioService } from '../services/audioService.js';
import { SessionManager } from '../services/sessionManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const sessionId = SessionManager.getCurrentSession();
    const timestamp = Date.now();
    cb(null, `${sessionId}_${timestamp}.webm`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const audioFile = await AudioService.saveAudioFile(req.file);
    res.json({ success: true, file: audioFile });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ error: 'Failed to upload audio' });
  }
});

router.get('/list', async (req, res) => {
  try {
    const files = await AudioService.getSessionAudioFiles();
    res.json({ files });
  } catch (error) {
    console.error('List audio files error:', error);
    res.status(500).json({ error: 'Failed to list audio files' });
  }
});

router.delete('/:filename', async (req, res) => {
  try {
    await AudioService.deleteAudioFile(req.params.filename);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete audio file error:', error);
    res.status(500).json({ error: 'Failed to delete audio file' });
  }
});

export default router;