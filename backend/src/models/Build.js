import mongoose from 'mongoose';

const buildSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  name: {
    type: String,
    required: [true, 'Build name is required'],
    trim: true,
    maxlength: [100, 'Build name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  carModel: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true,
    maxlength: [100, 'Car model cannot exceed 100 characters']
  },
  carYear: {
    type: Number,
    required: [true, 'Car year is required'],
    min: [1900, 'Car year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Car year cannot be in the future']
  },
  carMake: {
    type: String,
    required: [true, 'Car make is required'],
    trim: true,
    maxlength: [50, 'Car make cannot exceed 50 characters']
  },
  selectedServices: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1']
    },
    customNotes: {
      type: String,
      maxlength: [200, 'Custom notes cannot exceed 200 characters']
    }
  }],
  totalPrice: {
    type: Number,
    required: false, // Remove required constraint
    default: 0,
    min: [0, 'Total price cannot be negative']
  },
  estimatedDuration: {
    type: Number, // in hours
    required: false, // Remove required constraint
    default: 0,
    min: [0, 'Duration cannot be negative']
  },
  status: {
    type: String,
    enum: ['draft', 'saved', 'in-progress', 'completed', 'cancelled'],
    default: 'saved'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String,
    maxlength: [500, 'Image URL cannot exceed 500 characters']
  }],
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true
});

// Index for better query performance
buildSchema.index({ user: 1, status: 1 });
buildSchema.index({ isPublic: 1, status: 1 });

// Calculate total price and duration before saving
buildSchema.pre('save', async function(next) {
  try {
    console.log('Pre-save hook triggered for build:', this.name);
    console.log('Selected services:', this.selectedServices);
    
    // Only calculate if totalPrice and estimatedDuration are not already set
    // This prevents overriding values set manually in the route handler
    if (this.totalPrice === undefined || this.estimatedDuration === undefined) {
      console.log('Calculating totals in pre-save hook...');
      
      // Initialize totals
      let totalPrice = 0;
      let totalDuration = 0;
      
      if (this.selectedServices && this.selectedServices.length > 0) {
        const Service = mongoose.model('Service');
        
        for (const selectedService of this.selectedServices) {
          console.log('Processing service ID:', selectedService.service);
          const service = await Service.findById(selectedService.service);
          if (service) {
            console.log('Found service:', service.name, 'Price:', service.price, 'Duration:', service.duration);
            totalPrice += service.price * (selectedService.quantity || 1);
            totalDuration += service.duration * (selectedService.quantity || 1);
          } else {
            console.log('Service not found for ID:', selectedService.service);
          }
        }
      }
      
      console.log('Pre-save calculated - totalPrice:', totalPrice, 'estimatedDuration:', totalDuration);
      
      // Only set if not already provided
      if (this.totalPrice === undefined) {
        this.totalPrice = totalPrice;
      }
      if (this.estimatedDuration === undefined) {
        this.estimatedDuration = totalDuration;
      }
    } else {
      console.log('Using manually set values - totalPrice:', this.totalPrice, 'estimatedDuration:', this.estimatedDuration);
    }
    
    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    // Set defaults on error to prevent validation failure
    if (this.totalPrice === undefined) {
      this.totalPrice = 0;
    }
    if (this.estimatedDuration === undefined) {
      this.estimatedDuration = 0;
    }
    next(); // Don't pass the error, just continue with defaults
  }
});

const Build = mongoose.model('Build', buildSchema);

export default Build;