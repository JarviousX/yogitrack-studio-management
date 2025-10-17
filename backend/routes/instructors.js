const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');

// @route   GET api/instructors
// @desc    Get all instructors
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const instructors = await Instructor.find();
        res.json(instructors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/instructors/:id
// @desc    Get single instructor by ID
// @access  Public (for now)
router.get('/:id', async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id);
        if (!instructor) {
            return res.status(404).json({ msg: 'Instructor not found' });
        }
        res.json(instructor);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Instructor not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/instructors
// @desc    Add new instructor
// @access  Public (for now)
router.post('/', async (req, res) => {
    const { firstName, lastName, email, phone, address, preferredCommunication, payRate, specialties, bio, emergencyContact } = req.body;

    try {
        // Check if instructor with same email already exists
        let instructor = await Instructor.findOne({ email });
        if (instructor) {
            return res.status(400).json({ msg: 'Instructor with this email already exists' });
        }

        // Generate instructor ID (simple increment for now, can be more robust)
        const lastInstructor = await Instructor.findOne().sort({ dateJoined: -1 });
        let nextIdNum = 1;
        if (lastInstructor && lastInstructor.instructorId) {
            const lastNum = parseInt(lastInstructor.instructorId.substring(1));
            nextIdNum = lastNum + 1;
        }
        const instructorId = `I${String(nextIdNum).padStart(5, '0')}`; // e.g., I00001

        instructor = new Instructor({
            instructorId,
            firstName,
            lastName,
            email,
            phone: phone || '(555) 000-0000',
            address: address || {
                street: 'Not provided',
                city: 'Not provided',
                state: 'NA',
                zipCode: '00000'
            },
            preferredCommunication: preferredCommunication || 'email',
            payRate: payRate || 0,
            specialties: specialties || [],
            bio: bio || '',
            emergencyContact: emergencyContact || {
                name: 'Not provided',
                relationship: 'Not provided',
                phone: '(555) 000-0000'
            },
        });

        await instructor.save();
        res.json(instructor);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/instructors/:id
// @desc    Update instructor
// @access  Public (for now)
router.put('/:id', async (req, res) => {
    const { firstName, lastName, email, phone, address, preferredCommunication, payRate, specialties, bio, emergencyContact, status } = req.body;

    // Build instructor object
    const instructorFields = {};
    if (firstName) instructorFields.firstName = firstName;
    if (lastName) instructorFields.lastName = lastName;
    if (email) instructorFields.email = email;
    if (phone) instructorFields.phone = phone;
    if (address) instructorFields.address = address;
    if (preferredCommunication) instructorFields.preferredCommunication = preferredCommunication;
    if (payRate) instructorFields.payRate = payRate;
    if (specialties) instructorFields.specialties = specialties;
    if (bio) instructorFields.bio = bio;
    if (emergencyContact) instructorFields.emergencyContact = emergencyContact;
    if (status) instructorFields.status = status;

    try {
        let instructor = await Instructor.findById(req.params.id);

        if (!instructor) return res.status(404).json({ msg: 'Instructor not found' });

        instructor = await Instructor.findByIdAndUpdate(
            req.params.id,
            { $set: instructorFields },
            { new: true }
        );

        res.json(instructor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/instructors/:id
// @desc    Delete instructor
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id);

        if (!instructor) return res.status(404).json({ msg: 'Instructor not found' });

        await Instructor.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Instructor removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/instructors/:id/status
// @desc    Toggle instructor status
// @access  Public (for now)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['active', 'inactive'].includes(status)) {
            return res.status(400).json({ msg: 'Status must be either "active" or "inactive"' });
        }

        const instructor = await Instructor.findById(req.params.id);
        if (!instructor) {
            return res.status(404).json({ msg: 'Instructor not found' });
        }

        instructor.status = status;
        await instructor.save();

        res.json(instructor);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Instructor not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;