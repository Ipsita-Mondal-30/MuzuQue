import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
    enum: ['pop', 'lofi', 'chill', 'edm', 'hip-hop', 'jazz'],
  },
  url: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Song = mongoose.models.Song || mongoose.model('Song', songSchema);

export default Song; 