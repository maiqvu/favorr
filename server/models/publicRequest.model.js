import mongoose from 'mongoose';

const PublicRequestSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimedByTime: {
    type: Date
  },
  task: {
    type: String,
    required: true
  },
  rewards: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    item: {
      type: String,
      required: true
    }
  }]
},
  { timestamps: true });

export default mongoose.model('PublicRequest', PublicRequestSchema);