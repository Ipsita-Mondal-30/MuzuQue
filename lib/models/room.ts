import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  youtubeUrl: { type: String, required: true },
  quote: { type: String },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [songSchema],
  createdAt: { type: Date, default: Date.now },
});

export const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);