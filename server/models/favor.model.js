import mongoose from 'mongoose';

const FavorSchema = new mongoose.Schema({
  // Types of favor (e.g. Coffee, Pizza, Brownie,...)
  description: {
    type: String,
    required: true
  },
  // Stored as a userId string here. References the ObjectId in the 'User' collection.
  owedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String
  },
  // Status of a favor
  repaid: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Favor', FavorSchema);
