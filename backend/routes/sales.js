const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Package = require('../models/Package');

// @route   GET api/sales
// @desc    Get all sales
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('customer', 'customerId firstName lastName email phone')
            .populate('package', 'packageId name type numberOfClasses price validityPeriod')
            .sort({ dateCreated: -1 });
        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/sales/:id
// @desc    Get single sale by ID
// @access  Public (for now)
router.get('/:id', async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('customer', 'customerId firstName lastName email phone address')
            .populate('package', 'packageId name type numberOfClasses price validityPeriod benefits');
        
        if (!sale) {
            return res.status(404).json({ msg: 'Sale not found' });
        }
        res.json(sale);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Sale not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/sales
// @desc    Record a new sale
// @access  Public (for now)
router.post('/', async (req, res) => {
    const { 
        customerId, 
        packageId, 
        amountPaid, 
        paymentMethod, 
        paymentDate, 
        validityStartDate, 
        notes 
    } = req.body;

    try {
        // Validate customer exists
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(400).json({ msg: 'Customer not found' });
        }

        // Validate package exists
        const package = await Package.findById(packageId);
        if (!package) {
            return res.status(400).json({ msg: 'Package not found' });
        }

        // Generate sale ID
        const lastSale = await Sale.findOne().sort({ createdAt: -1 });
        let nextIdNum = 1;
        if (lastSale && lastSale.saleId) {
            const lastNum = parseInt(lastSale.saleId.substring(1));
            nextIdNum = lastNum + 1;
        }
        const saleId = `S${String(nextIdNum).padStart(5, '0')}`; // e.g., S00001

        // Create new sale
        const newSale = new Sale({
            saleId,
            customer: customerId,
            package: packageId,
            packageDetails: {
                name: package.name,
                type: package.type,
                numberOfClasses: package.numberOfClasses,
                price: package.price,
                validityPeriod: package.validityPeriod
            },
            paymentInfo: {
                amountPaid: amountPaid || package.price,
                paymentMethod: paymentMethod || 'Cash',
                paymentDate: paymentDate || new Date()
            },
            validityPeriod: {
                startDate: validityStartDate || new Date()
            },
            notes: notes || ''
        });

        await newSale.save();

        // Update customer's class balance
        const currentBalance = customer.paymentInfo.balance || 0;
        customer.paymentInfo.balance = currentBalance + newSale.classBalance.remainingClasses;
        await customer.save();

        // Update package sales data
        package.salesData.totalSold += 1;
        package.salesData.totalRevenue += newSale.paymentInfo.amountPaid;
        package.salesData.lastSold = new Date();
        await package.save();

        // Populate the response
        const populatedSale = await Sale.findById(newSale._id)
            .populate('customer', 'customerId firstName lastName email phone')
            .populate('package', 'packageId name type numberOfClasses price validityPeriod');

        res.status(201).json(populatedSale);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/sales/:id
// @desc    Update sale
// @access  Public (for now)
router.put('/:id', async (req, res) => {
    const { 
        amountPaid, 
        paymentMethod, 
        paymentDate, 
        validityStartDate, 
        validityEndDate, 
        notes, 
        status 
    } = req.body;

    // Build sale object
    const saleFields = {};
    if (amountPaid !== undefined) saleFields['paymentInfo.amountPaid'] = amountPaid;
    if (paymentMethod) saleFields['paymentInfo.paymentMethod'] = paymentMethod;
    if (paymentDate) saleFields['paymentInfo.paymentDate'] = paymentDate;
    if (validityStartDate) saleFields['validityPeriod.startDate'] = validityStartDate;
    if (validityEndDate) saleFields['validityPeriod.endDate'] = validityEndDate;
    if (notes) saleFields.notes = notes;
    if (status) saleFields.status = status;

    try {
        let sale = await Sale.findById(req.params.id);

        if (!sale) return res.status(404).json({ msg: 'Sale not found' });

        sale = await Sale.findByIdAndUpdate(
            req.params.id,
            { $set: saleFields },
            { new: true }
        ).populate('customer', 'customerId firstName lastName email phone')
         .populate('package', 'packageId name type numberOfClasses price validityPeriod');

        res.json(sale);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/sales/:id
// @desc    Delete sale
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);

        if (!sale) return res.status(404).json({ msg: 'Sale not found' });

        // Update customer's class balance (subtract the classes)
        const customer = await Customer.findById(sale.customer);
        if (customer) {
            const currentBalance = customer.paymentInfo.balance || 0;
            customer.paymentInfo.balance = Math.max(0, currentBalance - sale.classBalance.remainingClasses);
            await customer.save();
        }

        // Update package sales data (subtract the sale)
        const package = await Package.findById(sale.package);
        if (package) {
            package.salesData.totalSold = Math.max(0, package.salesData.totalSold - 1);
            package.salesData.totalRevenue = Math.max(0, package.salesData.totalRevenue - sale.paymentInfo.amountPaid);
            await package.save();
        }

        await Sale.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Sale removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/sales/:id/status
// @desc    Update sale status
// @access  Public (for now)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['active', 'expired', 'cancelled', 'refunded'].includes(status)) {
            return res.status(400).json({ msg: 'Status must be "active", "expired", "cancelled", or "refunded"' });
        }

        const sale = await Sale.findById(req.params.id);
        if (!sale) {
            return res.status(404).json({ msg: 'Sale not found' });
        }

        sale.status = status;
        await sale.save();

        res.json(sale);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Sale not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/sales/:id/classes
// @desc    Update class usage (when customer attends a class)
// @access  Public (for now)
router.patch('/:id/classes', async (req, res) => {
    try {
        const { classesUsed } = req.body;
        
        if (classesUsed === undefined || classesUsed < 0) {
            return res.status(400).json({ msg: 'Classes used must be a positive number' });
        }

        const sale = await Sale.findById(req.params.id);
        if (!sale) {
            return res.status(404).json({ msg: 'Sale not found' });
        }

        // Update class balance
        sale.classBalance.usedClasses += classesUsed;
        sale.classBalance.remainingClasses = Math.max(0, sale.classBalance.totalClasses - sale.classBalance.usedClasses);
        
        // Update customer's balance
        const customer = await Customer.findById(sale.customer);
        if (customer) {
            customer.paymentInfo.balance = Math.max(0, (customer.paymentInfo.balance || 0) - classesUsed);
            await customer.save();
        }

        await sale.save();

        res.json(sale);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Sale not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/sales/customer/:customerId
// @desc    Get all sales for a specific customer
// @access  Public (for now)
router.get('/customer/:customerId', async (req, res) => {
    try {
        const sales = await Sale.find({ customer: req.params.customerId })
            .populate('package', 'packageId name type numberOfClasses price validityPeriod')
            .sort({ dateCreated: -1 });
        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/sales/package/:packageId
// @desc    Get all sales for a specific package
// @access  Public (for now)
router.get('/package/:packageId', async (req, res) => {
    try {
        const sales = await Sale.find({ package: req.params.packageId })
            .populate('customer', 'customerId firstName lastName email phone')
            .sort({ dateCreated: -1 });
        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
