const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    attendanceId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^A\d{5}$/ // Format: A00123
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, 'Class is required']
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: [true, 'Instructor is required']
    },
    attendanceDate: {
        type: Date,
        required: [true, 'Attendance date is required'],
        default: Date.now
    },
    actualDate: {
        type: Date,
        required: [true, 'Actual attendance date is required'],
        default: Date.now
    },
    actualTime: {
        type: String,
        required: [true, 'Actual attendance time is required']
    },
    attendees: [{
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        customerDetails: {
            customerId: String,
            firstName: String,
            lastName: String,
            email: String,
            phone: String
        },
        package: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Package'
        },
        packageDetails: {
            packageId: String,
            name: String,
            type: String,
            numberOfClasses: Number
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'cancelled'],
            default: 'present'
        },
        checkInTime: {
            type: Date,
            default: Date.now
        },
        classBalanceBefore: {
            type: Number,
            required: true
        },
        classBalanceAfter: {
            type: Number,
            required: true
        },
        balanceUpdated: {
            type: Boolean,
            default: true
        },
        confirmationSent: {
            type: Boolean,
            default: false
        },
        notes: String
    }],
    totalAttendees: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'confirmed', 'completed', 'cancelled'],
        default: 'draft'
    },
    scheduleWarning: {
        hasWarning: {
            type: Boolean,
            default: false
        },
        message: String,
        expectedDate: Date,
        expectedTime: String,
        actualDate: Date,
        actualTime: String
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

// Pre-save hook to generate attendance ID and update total attendees
attendanceSchema.pre('save', function(next) {
    // Generate attendance ID if not present
    if (!this.attendanceId) {
        const lastAttendance = Attendance.findOne().sort({ createdAt: -1 });
        let nextIdNum = 1;
        if (lastAttendance && lastAttendance.attendanceId) {
            const lastNum = parseInt(lastAttendance.attendanceId.substring(1));
            nextIdNum = lastNum + 1;
        }
        this.attendanceId = `A${String(nextIdNum).padStart(5, '0')}`;
    }
    
    // Update total attendees count
    this.totalAttendees = this.attendees.length;
    
    next();
});

// Virtual for attendance summary
attendanceSchema.virtual('attendanceSummary').get(function() {
    const present = this.attendees.filter(a => a.status === 'present').length;
    const absent = this.attendees.filter(a => a.status === 'absent').length;
    const late = this.attendees.filter(a => a.status === 'late').length;
    const cancelled = this.attendees.filter(a => a.status === 'cancelled').length;
    
    return {
        total: this.totalAttendees,
        present,
        absent,
        late,
        cancelled
    };
});

// Virtual for is on schedule
attendanceSchema.virtual('isOnSchedule').get(function() {
    if (!this.class || !this.actualDate) return true;
    
    const classDate = new Date(this.class.date);
    const attendanceDate = new Date(this.actualDate);
    
    return classDate.toDateString() === attendanceDate.toDateString();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
