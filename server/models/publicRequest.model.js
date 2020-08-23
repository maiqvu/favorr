import mongoose from 'mongoose';

const PublicRequestSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true,
    unique: true
  },
  taker: {
    type: String,
    unique:true
  },
  requestDetail: {
    type: String
  },
  reward:{
    any: Schema.Types.Mixed
  }
});

export default mongoose.model('Public Request', PublicRequestSchema);