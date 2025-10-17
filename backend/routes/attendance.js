const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const Customer = require('../models/Customer');
const Instructor = require('../models/Instructor');
const Sale = require('../models/Sale');

// @route   GET api/attendance
// @desc    Get all attendance records
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate('class', 'name date startTime endTime instructor')
            .populate('instructor', 'firstName lastName email')
            .populate('attendees.customer', 'customerId firstName lastName email phone')
            .populate('attendees.package', 'packageId name type numberOfClasses')
            .sort({ attendanceDate: -1 });
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/attendance/:id
// @desc    Get single attendance record by ID
// @access  Public (for now)
router.get('/:id', async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id)
            .populate('class', 'name date startTime endTime instructor capacity')
            .populate('instructor', 'firstName lastName email phone')
            .populate('attendees.customer', 'customerId firstName lastName email phone address')
            .populate('attendees.package', 'packageId name type numberOfClasses price');
        
        if (!attendance) {
            return res.status(404).json({ msg: 'Attendance record not found' });
        }
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Attendance record not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/attendance/instructor/:instructorId
// @desc    Get attendance records for a specific instructor
// @access  Public (for now)
router.get('/instructor/:instructorId', async (req, res) => {
    try {
        const attendance = await Attendance.find({ instructor: req.params.instructorId })
            .populate('class', 'name date startTime endTime instructor')
            .populate('attendees.customer', 'customerId firstName lastName email phone')
            .sort({ attendanceDate: -1 });
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/attendance/class/:classId
// @desc    Get attendance records for a specific class
// @access  Public (for now)
router.get('/class/:classId', async (req, res) => {
    try {
        const attendance = await Attendance.find({ class: req.params.classId })
            .populate('instructor', 'firstName lastName email')
            .populate('attendees.customer', 'customerId firstName lastName email phone')
            .sort({ attendanceDate: -1 });
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/attendance
// @desc    Create new attendance record
// @access  Public (for now)
router.post('/', async (req, res) => {
    const { 
        classId, 
        instructorId, 
        actualDate, 
        actualTime, 
        attendees, 
        notes 
    } = req.body;

    try {
        // Validate class exists
        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(400).json({ msg: 'Class not found' });
        }

        // Validate instructor exists
        const instructor = await Instructor.findById(instructorId);
        if (!instructor) {
            return res.status(400).json({ msg: 'Instructor not found' });
        }

        // Check for schedule warnings
        const scheduleWarning = checkScheduleWarning(classData, actualDate, actualTime);

        // Process attendees and update balances
        const processedAttendees = [];
        for (const attendee of attendees) {
            const customer = await Customer.findById(attendee.customerId);
            if (!customer) continue;

            // Find customer's active package/sale
            const activeSale = await Sale.findOne({
                customer: attendee.customerId,
                status: 'active',
                'validityPeriod.endDate': { $gte: new Date() },
                'classBalance.remainingClasses': { $gt: 0 }
            }).populate('package');

            let packageDetails = null;
            let classBalanceBefore = customer.paymentInfo?.balance || 0;
            let classBalanceAfter = classBalanceBefore;

            if (activeSale) {
                packageDetails = {
                    packageId: activeSale.package.packageId,
                    name: activeSale.package.name,
                    type: activeSale.package.type,
                    numberOfClasses: activeSale.package.numberOfClasses
                };

                // Update class balance
                classBalanceAfter = Math.max(0, classBalanceBefore - 1);
                
                // Update customer balance
                customer.paymentInfo.balance = classBalanceAfter;
                await customer.save();

                // Update sale balance
                activeSale.classBalance.usedClasses += 1;
                activeSale.classBalance.remainingClasses = Math.max(0, activeSale.classBalance.remainingClasses - 1);
                await activeSale.save();
            } else {
                // Customer doesn't have valid package - allow with negative balance
                classBalanceAfter = classBalanceBefore - 1;
                customer.paymentInfo.balance = classBalanceAfter;
                await customer.save();
            }

            processedAttendees.push({
                customer: attendee.customerId,
                customerDetails: {
                    customerId: customer.customerId,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    email: customer.email,
                    phone: customer.phone
                },
                package: activeSale?.package?._id,
                packageDetails,
                status: attendee.status || 'present',
                classBalanceBefore,
                classBalanceAfter,
                balanceUpdated: true,
                notes: attendee.notes || ''
            });
        }

        // Create new attendance record
        const newAttendance = new Attendance({
            class: classId,
            instructor: instructorId,
            attendanceDate: new Date(),
            actualDate: new Date(actualDate),
            actualTime,
            attendees: processedAttendees,
            scheduleWarning,
            notes: notes || ''
        });

        await newAttendance.save();

        // Populate the response
        const populatedAttendance = await Attendance.findById(newAttendance._id)
            .populate('class', 'name date startTime endTime instructor')
            .populate('instructor', 'firstName lastName email')
            .populate('attendees.customer', 'customerId firstName lastName email phone');

        res.status(201).json(populatedAttendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/attendance/:id
// @desc    Update attendance record
// @access  Public (for now)
router.put('/:id', async (req, res) => {
    const { 
        actualDate, 
        actualTime, 
        attendees, 
        notes, 
        status 
    } = req.body;

    // Build attendance object
    const attendanceFields = {};
    if (actualDate) attendanceFields.actualDate = actualDate;
    if (actualTime) attendanceFields.actualTime = actualTime;
    if (attendees) attendanceFields.attendees = attendees;
    if (notes) attendanceFields.notes = notes;
    if (status) attendanceFields.status = status;

    try {
        let attendance = await Attendance.findById(req.params.id);

        if (!attendance) return res.status(404).json({ msg: 'Attendance record not found' });

        attendance = await Attendance.findByIdAndUpdate(
            req.params.id,
            { $set: attendanceFields },
            { new: true }
        ).populate('class', 'name date startTime endTime instructor')
         .populate('instructor', 'firstName lastName email')
         .populate('attendees.customer', 'customerId firstName lastName email phone');

        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/attendance/:id
// @desc    Delete attendance record
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) return res.status(404).json({ msg: 'Attendance record not found' });

        // Restore customer balances
        for (const attendee of attendance.attendees) {
            if (attendee.balanceUpdated) {
                const customer = await Customer.findById(attendee.customer);
                if (customer) {
                    customer.paymentInfo.balance = attendee.classBalanceBefore;
                    await customer.save();
                }

                // Restore sale balance if applicable
                if (attendee.package) {
                    const sale = await Sale.findOne({
                        customer: attendee.customer,
                        package: attendee.package
                    });
                    if (sale) {
                        sale.classBalance.usedClasses = Math.max(0, sale.classBalance.usedClasses - 1);
                        sale.classBalance.remainingClasses = Math.min(
                            sale.classBalance.totalClasses, 
                            sale.classBalance.remainingClasses + 1
                        );
                        await sale.save();
                    }
                }
            }
        }

        await Attendance.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Attendance record removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/attendance/:id/status
// @desc    Update attendance status
// @access  Public (for now)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['draft', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ msg: 'Status must be "draft", "confirmed", "completed", or "cancelled"' });
        }

        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return res.status(404).json({ msg: 'Attendance record not found' });
        }

        attendance.status = status;
        await attendance.save();

        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Attendance record not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/attendance/instructor/:instructorId/classes
// @desc    Get classes assigned to an instructor
// @access  Public (for now)
router.get('/instructor/:instructorId/classes', async (req, res) => {
    try {
        const classes = await Class.find({ instructor: req.params.instructorId })
            .populate('instructor', 'firstName lastName')
            .sort({ date: 1, startTime: 1 });
        res.json(classes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Helper function to check schedule warnings
function checkScheduleWarning(classData, actualDate, actualTime) {
    const classDate = new Date(classData.date);
    const actualDateObj = new Date(actualDate);
    
    const hasWarning = classDate.toDateString() !== actualDateObj.toDateString() || 
                      classData.startTime !== actualTime;
    
    if (hasWarning) {
        return {
            hasWarning: true,
            message: `Schedule mismatch: Expected ${classDate.toDateString()} at ${classData.startTime}, but recorded ${actualDateObj.toDateString()} at ${actualTime}`,
            expectedDate: classDate,
            expectedTime: classData.startTime,
            actualDate: actualDateObj,
            actualTime: actualTime
        };
    }
    
    return {
        hasWarning: false,
        message: 'Attendance matches scheduled class time',
        expectedDate: classDate,
        expectedTime: classData.startTime,
        actualDate: actualDateObj,
        actualTime: actualTime
    };
}

module.exports = router;
