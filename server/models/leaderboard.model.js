import mongoose from 'mongoose';

const LeaderBoardSchema = new mongoose.Schema({
  // Array of users. References the ObjectId in the 'User' collection.
    user: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }],
    item: [{
      type: String,
      required: true
    }]
  
});
  

export default mongoose.model('LeaderBoard', LeaderBoardSchema);