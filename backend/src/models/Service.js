import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['exterior', 'interior', 'performance', 'audio', 'lighting', 'wheels', 'other']
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number, // in hours
    required: [true, 'Service duration is required'],
    min: [0.5, 'Duration must be at least 0.5 hours']
  },
  image: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    maxlength: [100, 'Feature description cannot exceed 100 characters']
  }],
  requirements: [{
    type: String,
    maxlength: [200, 'Requirement description cannot exceed 200 characters']
  }]
}, {
  timestamps: true
});

// Index for better query performance
serviceSchema.index({ category: 1, isAvailable: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service; 