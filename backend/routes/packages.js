const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// @route   GET api/packages
// @desc    Get all packages
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const packages = await Package.find().sort({ dateCreated: -1 });
        res.json(packages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/packages/:id
// @desc    Get single package by ID
// @access  Public (for now)
router.get('/:id', async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ msg: 'Package not found' });
        }
        res.json(package);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Package not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/packages
// @desc    Add new package
// @access  Public (for now)
router.post('/', async (req, res) => {
    const { 
        name, 
        description, 
        type, 
        numberOfClasses, 
        price, 
        originalPrice, 
        validityPeriod, 
        applicableClasses, 
        restrictions, 
        benefits, 
        terms, 
        isPopular, 
        isFeatured, 
        notes 
    } = req.body;

    try {
        // Generate package ID
        const lastPackage = await Package.findOne().sort({ createdAt: -1 });
        let nextIdNum = 1;
        if (lastPackage && lastPackage.packageId) {
            const lastNum = parseInt(lastPackage.packageId.substring(1));
            nextIdNum = lastNum + 1;
        }
        const packageId = `P${String(nextIdNum).padStart(5, '0')}`; // e.g., P00001

        // Create new package with defaults
        const newPackage = new Package({
            packageId,
            name: name || 'New Package',
            description: description || '',
            type: type || 'Class Package',
            numberOfClasses: numberOfClasses || 1,
            price: price || 0,
            originalPrice: originalPrice || price || 0,
            validityPeriod: validityPeriod || 30,
            applicableClasses: applicableClasses || ['All Classes'],
            restrictions: restrictions || {
                maxPerDay: 1,
                blackoutDates: [],
                timeRestrictions: {
                    startTime: '06:00',
                    endTime: '22:00'
                }
            },
            benefits: benefits || [],
            terms: terms || '',
            isPopular: isPopular || false,
            isFeatured: isFeatured || false,
            notes: notes || ''
        });

        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/packages/:id
// @desc    Update package
// @access  Public (for now)
router.put('/:id', async (req, res) => {
    const { 
        name, 
        description, 
        type, 
        numberOfClasses, 
        price, 
        originalPrice, 
        validityPeriod, 
        applicableClasses, 
        restrictions, 
        benefits, 
        terms, 
        isPopular, 
        isFeatured, 
        notes, 
        status 
    } = req.body;

    // Build package object
    const packageFields = {};
    if (name) packageFields.name = name;
    if (description) packageFields.description = description;
    if (type) packageFields.type = type;
    if (numberOfClasses) packageFields.numberOfClasses = numberOfClasses;
    if (price !== undefined) packageFields.price = price;
    if (originalPrice !== undefined) packageFields.originalPrice = originalPrice;
    if (validityPeriod) packageFields.validityPeriod = validityPeriod;
    if (applicableClasses) packageFields.applicableClasses = applicableClasses;
    if (restrictions) packageFields.restrictions = restrictions;
    if (benefits) packageFields.benefits = benefits;
    if (terms) packageFields.terms = terms;
    if (isPopular !== undefined) packageFields.isPopular = isPopular;
    if (isFeatured !== undefined) packageFields.isFeatured = isFeatured;
    if (notes) packageFields.notes = notes;
    if (status) packageFields.status = status;

    try {
        let package = await Package.findById(req.params.id);

        if (!package) return res.status(404).json({ msg: 'Package not found' });

        package = await Package.findByIdAndUpdate(
            req.params.id,
            { $set: packageFields },
            { new: true }
        );

        res.json(package);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/packages/:id
// @desc    Delete package
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);

        if (!package) return res.status(404).json({ msg: 'Package not found' });

        await Package.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Package removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/packages/:id/status
// @desc    Toggle package status
// @access  Public (for now)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['active', 'inactive', 'discontinued'].includes(status)) {
            return res.status(400).json({ msg: 'Status must be "active", "inactive", or "discontinued"' });
        }

        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ msg: 'Package not found' });
        }

        package.status = status;
        await package.save();

        res.json(package);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Package not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/packages/:id/sales
// @desc    Update package sales data
// @access  Public (for now)
router.patch('/:id/sales', async (req, res) => {
    try {
        const { quantity, revenue } = req.body;
        
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ msg: 'Package not found' });
        }

        // Update sales data
        package.salesData.totalSold += quantity || 0;
        package.salesData.totalRevenue += revenue || 0;
        package.salesData.lastSold = new Date();

        await package.save();

        res.json(package);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Package not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
