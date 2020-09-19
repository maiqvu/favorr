import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  }
},
  { timestamps: true });

export default mongoose.model('User', UserSchema);
