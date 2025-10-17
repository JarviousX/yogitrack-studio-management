const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    packageId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^P\d{5}$/ // Format: P00123
    },
    name: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true,
        maxlength: [100, 'Package name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    type: {
        type: String,
        required: [true, 'Package type is required'],
        enum: ['Class Package', 'Monthly Unlimited', 'Annual Membership', 'Drop-in', 'Special Offer', 'Workshop', 'Private Session'],
        default: 'Class Package'
    },
    numberOfClasses: {
        type: Number,
        required: [true, 'Number of classes is required'],
        min: [1, 'Number of classes must be at least 1']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    discount: {
        percentage: {
            type: Number,
            min: [0, 'Discount percentage cannot be negative'],
            max: [100, 'Discount percentage cannot exceed 100']
        },
        amount: {
            type: Number,
            min: [0, 'Discount amount cannot be negative']
        }
    },
    validityPeriod: {
        type: Number, // in days
        required: [true, 'Validity period is required'],
        min: [1, 'Validity period must be at least 1 day']
    },
    applicableClasses: [{
        type: String,
        enum: ['All Classes', 'Beginner', 'Intermediate', 'Advanced', 'Restorative', 'With Weights', 'Prenatal', 'Yin', 'Chair', 'Hot Yoga', 'Power Yoga', 'Ashtanga', 'Vinyasa', 'Hatha']
    }],
    restrictions: {
        maxPerDay: {
            type: Number,
            min: [1, 'Max classes per day must be at least 1']
        },
        blackoutDates: [Date],
        timeRestrictions: {
            startTime: String, // e.g., "06:00"
            endTime: String    // e.g., "22:00"
        }
    },
    benefits: [String],
    terms: {
        type: String,
        trim: true,
        maxlength: [1000, 'Terms cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'discontinued'],
        default: 'active'
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    salesData: {
        totalSold: {
            type: Number,
            default: 0,
            min: [0, 'Total sold cannot be negative']
        },
        totalRevenue: {
            type: Number,
            default: 0,
            min: [0, 'Total revenue cannot be negative']
        },
        lastSold: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    notes: String,
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Virtual for savings amount
packageSchema.virtual('savings').get(function() {
    if (this.originalPrice && this.price) {
        return this.originalPrice - this.price;
    }
    return 0;
});

// Virtual for savings percentage
packageSchema.virtual('savingsPercentage').get(function() {
    if (this.originalPrice && this.price && this.originalPrice > 0) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Virtual for price per class
packageSchema.virtual('pricePerClass').get(function() {
    if (this.numberOfClasses && this.numberOfClasses > 0) {
        return Math.round((this.price / this.numberOfClasses) * 100) / 100;
    }
    return 0;
});

// Pre-save hook to calculate discount
packageSchema.pre('save', function(next) {
    if (this.originalPrice && this.price && this.originalPrice > this.price) {
        this.discount.amount = this.originalPrice - this.price;
        this.discount.percentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    next();
});

module.exports = mongoose.model('Package', packageSchema);
