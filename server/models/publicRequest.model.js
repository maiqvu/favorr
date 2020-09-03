import mongoose, { Schema } from 'mongoose';

const PublicRequestSchema = new Schema({
  creator: {
    type: String,
    required: true,
  },
  taker: {
    type: String,
  },
  requestDetail: {
    type: String,
    required: true
  },
  reward: [{
    name: {
      type: String,
      required: true
    },
    item: {
      type: String,
      required: true
    }
  }
  ]
},
  { timestamps: true });

export const PublicRequest = mongoose.model('publicRequest', PublicRequestSchema);