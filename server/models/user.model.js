import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
}, { timestamps: true });

// Check if the user-inputted password matches the hashed password in database
UserSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.hashedPassword, (err, isMatch) => {
    if (err) {
      return cb(err);
    } else {
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    }
  });
};

export default mongoose.model('User', UserSchema);
