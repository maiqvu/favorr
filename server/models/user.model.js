import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  hashedPassword: {
    type: String,
    required: true
  }
});

export default mongoose.model('User', UserSchema);