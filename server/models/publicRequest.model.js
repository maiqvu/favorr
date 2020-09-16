import mongoose from 'mongoose';

const PublicRequestSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true,
  },
  claimedBy: {
    type: String,
  },
  claimedByTime: {
    type: Date
  },
  task: {
    type: String,
    required: true
  },
  rewards: [{
    name: {
      type: String,
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