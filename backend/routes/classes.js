const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Instructor = require('../models/Instructor');

// @route   GET api/classes
// @desc    Get all classes
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const { day, level, instructor, active } = req.query;
        
        let query = {};
        
        if (day) query.dayOfWeek = day;
        if (level) query.level = level;
        if (instructor) query.instructor = instructor;
        if (active !== undefined) query.isActive = active === 'true';
        
        const classes = await Class.find(query)
            .populate('instructor', 'firstName lastName email specialties')
            .sort({ dayOfWeek: 1, startTime: 1 });
            
        res.json(classes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/classes/schedule
// @desc    Get weekly schedule
// @access  Public (for now)
router.get('/schedule', async (req, res) => {
    try {
        const classes = await Class.find({ isActive: true })
            .populate('instructor', 'firstName lastName')
            .sort({ dayOfWeek: 1, startTime: 1 });
            
        // Group classes by day
        const schedule = {
            Sunday: [],
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: []
        };
        
        classes.forEach(cls => {
            schedule[cls.dayOfWeek].push(cls);
        });
        
        res.json(schedule);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/classes/:id
// @desc    Get single class
// @access  Public (for now)
router.get('/:id', async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id)
            .populate('instructor', 'firstName lastName email phone specialties');
            
        if (!classItem) {
            return res.status(404).json({ msg: 'Class not found' });
        }
        
        res.json(classItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/classes
// @desc    Add new class
// @access  Public (for now)
router.post('/', async (req, res) => {
    const { 
        name, 
        description, 
        level, 
        instructor, 
        dayOfWeek, 
        startTime, 
        endTime, 
        maxCapacity, 
        room, 
        equipment, 
        price, 
        notes 
    } = req.body;

    try {
        // Verify instructor exists
        const instructorExists = await Instructor.findById(instructor);
        if (!instructorExists) {
            return res.status(400).json({ msg: 'Instructor not found' });
        }

        // Generate class ID
        const lastClass = await Class.findOne().sort({ createdAt: -1 });
        let nextIdNum = 1;
        if (lastClass && lastClass.classId) {
            const lastNum = parseInt(lastClass.classId.substring(1));
            nextIdNum = lastNum + 1;
        }
        const classId = `C${String(nextIdNum).padStart(5, '0')}`; // e.g., C00001

        // Calculate duration
        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);
        let duration = Math.round((end - start) / (1000 * 60));
        
        if (end < start) {
            // Handle overnight classes
            end.setDate(end.getDate() + 1);
            duration = Math.round((end - start) / (1000 * 60));
        }

        const newClass = new Class({
            classId,
            name,
            description,
            level,
            instructor,
            dayOfWeek,
            startTime,
            endTime,
            duration,
            maxCapacity: maxCapacity || 20,
            room: room || 'Main Studio',
            equipment: equipment || [],
            price: price || 20,
            notes
        });

        await newClass.save();
        
        // Populate instructor data in response
        await newClass.populate('instructor', 'firstName lastName email specialties');
        
        res.json(newClass);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/classes/:id
// @desc    Update class
// @access  Public (for now)
router.put('/:id', async (req, res) => {
    const { 
        name, 
        description, 
        level, 
        instructor, 
        dayOfWeek, 
        startTime, 
        endTime, 
        maxCapacity, 
        room, 
        equipment, 
        price, 
        isActive, 
        notes 
    } = req.body;

    // Build class object
    const classFields = {};
    if (name) classFields.name = name;
    if (description) classFields.description = description;
    if (level) classFields.level = level;
    if (instructor) classFields.instructor = instructor;
    if (dayOfWeek) classFields.dayOfWeek = dayOfWeek;
    if (startTime) classFields.startTime = startTime;
    if (endTime) classFields.endTime = endTime;
    if (maxCapacity) classFields.maxCapacity = maxCapacity;
    if (room) classFields.room = room;
    if (equipment) classFields.equipment = equipment;
    if (price) classFields.price = price;
    if (isActive !== undefined) classFields.isActive = isActive;
    if (notes) classFields.notes = notes;

    try {
        let classItem = await Class.findById(req.params.id);

        if (!classItem) return res.status(404).json({ msg: 'Class not found' });

        classItem = await Class.findByIdAndUpdate(
            req.params.id,
            { $set: classFields },
            { new: true }
        ).populate('instructor', 'firstName lastName email specialties');

        res.json(classItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/classes/:id
// @desc    Delete class
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id);

        if (!classItem) return res.status(404).json({ msg: 'Class not found' });

        await Class.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Class removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/classes/:id/enrollment
// @desc    Update class enrollment
// @access  Public (for now)
router.put('/:id/enrollment', async (req, res) => {
    const { action, count = 1 } = req.body; // action: 'add' or 'remove'

    try {
        const classItem = await Class.findById(req.params.id);

        if (!classItem) return res.status(404).json({ msg: 'Class not found' });

        if (action === 'add') {
            if (classItem.currentEnrollment + count > classItem.maxCapacity) {
                return res.status(400).json({ msg: 'Class is at maximum capacity' });
            }
            classItem.currentEnrollment += count;
        } else if (action === 'remove') {
            if (classItem.currentEnrollment - count < 0) {
                return res.status(400).json({ msg: 'Cannot have negative enrollment' });
            }
            classItem.currentEnrollment -= count;
        }

        await classItem.save();
        res.json(classItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
