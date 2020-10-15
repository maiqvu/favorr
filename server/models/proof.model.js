import mongoose from 'mongoose';

const ProofSchema = new mongoose.Schema({
  favorId: {
    type: String,
    required: true
  },
  favorFileType: {
    type: String,
    required: true
  },
  fileLink: {
    type: String,
    required: true
  },
  s3Key: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Proof', ProofSchema);
