import mongoose from 'mongoose';

const FavorSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
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
  repaid: {
    type: Boolean
  }
});

export default mongoose.model('Favor', FavorSchema);
