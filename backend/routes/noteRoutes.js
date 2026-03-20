const express = require('express');
const multer = require('multer');
const Note = require('../models/Note');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

const multerIfNeeded = (req, res, next) => {
  const contentType = (req.headers['content-type'] || '').toLowerCase();
  if (contentType.startsWith('multipart/form-data')) {
    upload.fields([
      { name: 'images', maxCount: 3 },
      { name: 'files', maxCount: 3 }
    ])(req, res, next);
  } else {
    next();
  }
};

const buildNotePayload = (req) => {
  const payload = {
    title: req.body.title,
    content: req.body.content,
    folder: req.body.folder || 'General'
  };

  const baseUrl = `${req.protocol}://${req.get('host')}`;

  if (req.files) {
    if (req.files.images) {
      payload.images = (req.files.images || []).map(file => ({
        filename: file.originalname,
        url: `${baseUrl}/uploads/${file.filename}`,
        mimeType: file.mimetype
      }));
    }

    if (req.files.files) {
      payload.files = (req.files.files || []).map(file => ({
        filename: file.originalname,
        url: `${baseUrl}/uploads/${file.filename}`,
        mimeType: file.mimetype
      }));
    }
  }

  return payload;
};

// Get all notes
router.get('/', async (req, res) => {
  const { folder } = req.query;
  const query = folder ? { folder } : {};
  const notes = await Note.find(query).sort({ updatedAt: -1 });
  res.json(notes);
});

// Add new note
router.post('/', multerIfNeeded, async (req, res) => {
  const newNote = new Note(buildNotePayload(req));
  await newNote.save();
  res.json(newNote);
});

// Update note
router.put('/:id', multerIfNeeded, async (req, res) => {
  const payload = buildNotePayload(req);
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, payload, { new: true });
  res.json(updatedNote);
});

// Delete note
router.delete('/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Note deleted' });
});

module.exports = router;