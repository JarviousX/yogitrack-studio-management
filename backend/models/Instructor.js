const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  instructorId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    match: /^I\d{5}$/ // Format: I00123
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\(\d{3}\) \d{3}-\d{4}$/, 'Please enter phone in format (555) 123-4567']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: 2
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code']
    }
  },
  preferredCommunication: {
    type: String,
    enum: ['email', 'phone'],
    default: 'email'
  },
  specialties: [{
    type: String,
    enum: [
      'Hatha', 'Vinyasa', 'Ashtanga', 'Bikram', 'Hot Yoga', 'Power Yoga',
      'Restorative', 'Yin', 'Prenatal', 'Yoga Therapy', 'Meditation',
      'Beginner', 'Advanced', 'Senior', 'Kids Yoga'
    ]
  }],
  certifications: [{
    name: String,
    organization: String,
    dateEarned: Date,
    expirationDate: Date
  }],
  experience: {
    years: {
      type: Number,
      min: 0,
      default: 0
    },
    description: String
  },
  payRate: {
    type: Number,
    required: [true, 'Pay rate is required'],
    min: [0, 'Pay rate cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  profileImage: {
    type: String,
    default: null
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  notes: String
}, {
  timestamps: true
});

// Generate instructor ID before saving
instructorSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const count = await this.constructor.countDocuments();
      const instructorNumber = String(count + 1).padStart(5, '0');
      this.instructorId = `I${instructorNumber}`;
    } catch (error) {
      next(error);
    }
  }
  next();
});

// Virtual for full name
instructorSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for full address
instructorSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Ensure virtual fields are serialized
instructorSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Instructor', instructorSchema);
