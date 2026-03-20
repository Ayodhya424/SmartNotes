const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: String,
  url: String,
  mimeType: String
}, { _id: false });

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  folder: { type: String, default: 'General' },
  images: [attachmentSchema],
  files: [attachmentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);