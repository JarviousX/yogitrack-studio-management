const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// @route   GET api/customers
// @desc    Get all customers
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ dateJoined: -1 });
        res.json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/customers/:id
// @desc    Get single customer by ID
// @access  Public (for now)
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }
        res.json(customer);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Customer not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/customers
// @desc    Add new customer
// @access  Public (for now)
router.post('/', async (req, res) => {
    const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        address, 
        dateOfBirth, 
        emergencyContact, 
        medicalInfo, 
        membership, 
        paymentInfo, 
        preferences, 
        notes 
    } = req.body;

    try {
        // Check if customer with same email already exists
        let customer = await Customer.findOne({ email });
        if (customer) {
            return res.status(400).json({ msg: 'Customer with this email already exists' });
        }

        // Generate customer ID
        const lastCustomer = await Customer.findOne().sort({ createdAt: -1 });
        let nextIdNum = 1;
        if (lastCustomer && lastCustomer.customerId) {
            const lastNum = parseInt(lastCustomer.customerId.substring(2));
            nextIdNum = lastNum + 1;
        }
        const customerId = `CU${String(nextIdNum).padStart(5, '0')}`; // e.g., CU00001

        // Create new customer with defaults
        const newCustomer = new Customer({
            customerId,
            firstName: firstName || 'Unknown',
            lastName: lastName || 'Customer',
            email: email || 'noemail@example.com',
            phone: phone || '(555) 000-0000',
            address: address || {
                street: 'No Address',
                city: 'Unknown',
                state: 'XX',
                zipCode: '00000'
            },
            dateOfBirth: dateOfBirth || new Date('1990-01-01'),
            emergencyContact: emergencyContact || {
                name: 'No Emergency Contact',
                relationship: 'Unknown',
                phone: '(555) 000-0000'
            },
            medicalInfo: medicalInfo || {
                hasInjuries: false,
                injuries: [],
                medications: [],
                allergies: [],
                fitnessLevel: 'Beginner'
            },
            membership: membership || {
                type: 'Drop-in',
                startDate: new Date(),
                isActive: true
            },
            paymentInfo: paymentInfo || {
                balance: 0,
                paymentMethod: 'Cash'
            },
            preferences: preferences || {
                preferredClasses: [],
                preferredInstructors: [],
                preferredTimes: [],
                communicationMethod: 'email'
            },
            notes: notes || ''
        });

        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/customers/:id
// @desc    Update customer
// @access  Public (for now)
router.put('/:id', async (req, res) => {
    const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        address, 
        dateOfBirth, 
        emergencyContact, 
        medicalInfo, 
        membership, 
        paymentInfo, 
        preferences, 
        notes, 
        status 
    } = req.body;

    // Build customer object
    const customerFields = {};
    if (firstName) customerFields.firstName = firstName;
    if (lastName) customerFields.lastName = lastName;
    if (email) customerFields.email = email;
    if (phone) customerFields.phone = phone;
    if (address) customerFields.address = address;
    if (dateOfBirth) customerFields.dateOfBirth = dateOfBirth;
    if (emergencyContact) customerFields.emergencyContact = emergencyContact;
    if (medicalInfo) customerFields.medicalInfo = medicalInfo;
    if (membership) customerFields.membership = membership;
    if (paymentInfo) customerFields.paymentInfo = paymentInfo;
    if (preferences) customerFields.preferences = preferences;
    if (notes) customerFields.notes = notes;
    if (status) customerFields.status = status;

    try {
        let customer = await Customer.findById(req.params.id);

        if (!customer) return res.status(404).json({ msg: 'Customer not found' });

        customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: customerFields },
            { new: true }
        );

        res.json(customer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/customers/:id
// @desc    Delete customer
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) return res.status(404).json({ msg: 'Customer not found' });

        await Customer.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Customer removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/customers/:id/status
// @desc    Toggle customer status
// @access  Public (for now)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
            return res.status(400).json({ msg: 'Status must be "active", "inactive", or "suspended"' });
        }

        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }

        customer.status = status;
        await customer.save();

        res.json(customer);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Customer not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
