import mongoose from 'mongoose';

const PublicRequestSchema = new mongoose.Schema({
  // user that created the request
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // user that has claimed the request
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // the time of when a user has claimed the request
  claimedByTime: {
    type: Date
  },
  // description of the request task
  task: {
    type: String,
    required: true
  },
  // array of objects that includes the reward item and the user that added the reward
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
  }],
  // flag to check if request is completed or not
  resolved : {
    type: Boolean
  }
},
  { timestamps: true });

export default mongoose.model('PublicRequest', PublicRequestSchema);