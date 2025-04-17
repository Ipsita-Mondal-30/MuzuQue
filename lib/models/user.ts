import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['creator', 'listener'], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Initialize the model
let User: mongoose.Model<any>;

try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', userSchema);
}

// Ensure connection
connectDB().catch(console.error);

export default User;