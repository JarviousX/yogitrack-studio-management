const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    saleId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^S\d{5}$/ // Format: S00123
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'Customer is required']
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: [true, 'Package is required']
    },
    packageDetails: {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        numberOfClasses: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        validityPeriod: {
            type: Number,
            required: true
        }
    },
    paymentInfo: {
        amountPaid: {
            type: Number,
            required: [true, 'Amount paid is required'],
            min: [0, 'Amount paid cannot be negative']
        },
        paymentMethod: {
            type: String,
            required: [true, 'Payment method is required'],
            enum: ['Cash', 'Credit Card', 'Debit Card', 'Check', 'Bank Transfer', 'PayPal', 'Venmo', 'Zelle'],
            default: 'Cash'
        },
        transactionId: String,
        paymentDate: {
            type: Date,
            default: Date.now
        }
    },
    validityPeriod: {
        startDate: {
            type: Date,
            required: [true, 'Validity start date is required'],
            default: Date.now
        },
        endDate: {
            type: Date,
            required: [true, 'Validity end date is required']
        }
    },
    classBalance: {
        totalClasses: {
            type: Number,
            required: true
        },
        remainingClasses: {
            type: Number,
            required: true
        },
        usedClasses: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'refunded'],
        default: 'active'
    },
    notes: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Pre-save hook to calculate end date and class balance
saleSchema.pre('save', function(next) {
    if (this.packageDetails && this.packageDetails.validityPeriod) {
        // Calculate end date based on start date and validity period
        const startDate = this.validityPeriod.startDate || new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + this.packageDetails.validityPeriod);
        this.validityPeriod.endDate = endDate;
        
        // Set class balance
        this.classBalance.totalClasses = this.packageDetails.numberOfClasses;
        this.classBalance.remainingClasses = this.packageDetails.numberOfClasses;
        this.classBalance.usedClasses = 0;
    }
    next();
});

// Virtual for days remaining
saleSchema.virtual('daysRemaining').get(function() {
    if (this.validityPeriod && this.validityPeriod.endDate) {
        const today = new Date();
        const endDate = new Date(this.validityPeriod.endDate);
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }
    return 0;
});

// Virtual for is expired
saleSchema.virtual('isExpired').get(function() {
    if (this.validityPeriod && this.validityPeriod.endDate) {
        const today = new Date();
        const endDate = new Date(this.validityPeriod.endDate);
        return today > endDate;
    }
    return false;
});

// Virtual for is active
saleSchema.virtual('isActive').get(function() {
    return this.status === 'active' && !this.isExpired && this.classBalance.remainingClasses > 0;
});

module.exports = mongoose.model('Sale', saleSchema);
