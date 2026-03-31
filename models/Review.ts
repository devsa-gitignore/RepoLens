import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  repoUrl: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0.5,
    max: 5,
    validate: {
      validator: (value: number) => Number.isInteger(value * 2),
      message: 'Rating must be in 0.5 increments.',
    },
  },
  chatLogs: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
