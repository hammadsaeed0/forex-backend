import mongoose from 'mongoose';

const lectureApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const LectureApplication = mongoose.model('LectureApplication', lectureApplicationSchema);

export default LectureApplication;
