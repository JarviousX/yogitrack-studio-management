const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^CU\d{5}$/ // Format: CU00123
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
            uppercase: true,
            minlength: [2, 'State must be 2 characters'],
            maxlength: [2, 'State must be 2 characters']
        },
        zipCode: {
            type: String,
            required: [true, 'ZIP code is required'],
            trim: true,
            match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code']
        }
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    emergencyContact: {
        name: {
            type: String,
            required: [true, 'Emergency contact name is required'],
            trim: true
        },
        relationship: {
            type: String,
            required: [true, 'Emergency contact relationship is required'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Emergency contact phone is required'],
            match: [/^\(\d{3}\) \d{3}-\d{4}$/, 'Please enter phone in format (555) 123-4567']
        }
    },
    medicalInfo: {
        hasInjuries: {
            type: Boolean,
            default: false
        },
        injuries: [String],
        medications: [String],
        allergies: [String],
        fitnessLevel: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner'
        }
    },
    membership: {
        type: {
            type: String,
            enum: ['Drop-in', 'Monthly', 'Annual', 'Package'],
            default: 'Drop-in'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: Date,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    packages: [{
        packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Package'
        },
        purchaseDate: {
            type: Date,
            default: Date.now
        },
        classesRemaining: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    classHistory: [{
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        },
        attendanceDate: {
            type: Date,
            default: Date.now
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Instructor'
        },
        status: {
            type: String,
            enum: ['attended', 'no-show', 'cancelled'],
            default: 'attended'
        }
    }],
    paymentInfo: {
        balance: {
            type: Number,
            default: 0,
            min: [0, 'Balance cannot be negative']
        },
        lastPaymentDate: Date,
        paymentMethod: {
            type: String,
            enum: ['Cash', 'Credit Card', 'Debit Card', 'Check', 'Bank Transfer'],
            default: 'Cash'
        }
    },
    preferences: {
        preferredClasses: [String],
        preferredInstructors: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Instructor'
        }],
        preferredTimes: [String],
        communicationMethod: {
            type: String,
            enum: ['email', 'phone', 'text'],
            default: 'email'
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    notes: String,
    dateJoined: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Virtual for full name
customerSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual for full address
customerSchema.virtual('fullAddress').get(function() {
    if (this.address && this.address.street && this.address.city && this.address.state && this.address.zipCode) {
        return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
    }
    return 'Address not provided';
});

// Virtual for age
customerSchema.virtual('age').get(function() {
    if (this.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    return null;
});

module.exports = mongoose.model('Customer', customerSchema);
