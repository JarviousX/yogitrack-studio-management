const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    classId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    level: {
        type: String,
        enum: ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'With Weights', 'Restorative', 'Chair', 'Yin', 'Prenatal'],
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true,
    },
    dayOfWeek: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true,
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Start time must be in HH:MM format'
        }
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'End time must be in HH:MM format'
        }
    },
    duration: {
        type: Number, // in minutes
        required: true,
    },
    maxCapacity: {
        type: Number,
        default: 20,
        min: 1,
        max: 50,
    },
    currentEnrollment: {
        type: Number,
        default: 0,
        min: 0,
    },
    room: {
        type: String,
        default: 'Main Studio',
    },
    equipment: [String], // e.g., ['Mats', 'Blocks', 'Straps', 'Weights']
    price: {
        type: Number,
        default: 20, // Default drop-in price
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isRecurring: {
        type: Boolean,
        default: true,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
    },
    notes: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Calculate duration automatically
ClassSchema.pre('save', function(next) {
    if (this.startTime && this.endTime) {
        const start = new Date(`2000-01-01T${this.startTime}:00`);
        const end = new Date(`2000-01-01T${this.endTime}:00`);
        
        if (end < start) {
            // Handle overnight classes (e.g., 23:00 to 01:00)
            end.setDate(end.getDate() + 1);
        }
        
        this.duration = Math.round((end - start) / (1000 * 60)); // Convert to minutes
    }
    
    this.updatedAt = new Date();
    next();
});

// Virtual for formatted time range
ClassSchema.virtual('timeRange').get(function() {
    return `${this.startTime} - ${this.endTime}`;
});

// Virtual for availability
ClassSchema.virtual('isAvailable').get(function() {
    return this.currentEnrollment < this.maxCapacity;
});

// Virtual for spots remaining
ClassSchema.virtual('spotsRemaining').get(function() {
    return this.maxCapacity - this.currentEnrollment;
});

// Index for efficient queries
ClassSchema.index({ dayOfWeek: 1, startTime: 1 });
ClassSchema.index({ instructor: 1 });
ClassSchema.index({ level: 1 });
ClassSchema.index({ isActive: 1 });

module.exports = mongoose.model('Class', ClassSchema);
