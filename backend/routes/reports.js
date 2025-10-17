const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Instructor = require('../models/Instructor');
const Customer = require('../models/Customer');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Package = require('../models/Package');

// @route   GET api/reports/package-sales
// @desc    Get package sales report
// @access  Public (for now)
router.get('/package-sales', async (req, res) => {
    try {
        const { startDate, endDate, packageType } = req.query;
        
        // Build query
        let query = {};
        if (startDate && endDate) {
            query['paymentInfo.paymentDate'] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        // Get sales data
        const sales = await Sale.find(query)
            .populate('customer', 'customerId firstName lastName email')
            .populate('package', 'packageId name type numberOfClasses price')
            .sort({ 'paymentInfo.paymentDate': -1 });
        
        // Filter by package type if specified
        let filteredSales = sales;
        if (packageType && packageType !== 'all') {
            filteredSales = sales.filter(sale => sale.package.type === packageType);
        }
        
        // Calculate summary statistics
        const totalSales = filteredSales.length;
        const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.paymentInfo.amountPaid, 0);
        const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;
        
        // Group by package type
        const salesByType = {};
        filteredSales.forEach(sale => {
            const type = sale.package.type;
            if (!salesByType[type]) {
                salesByType[type] = {
                    count: 0,
                    revenue: 0,
                    packages: []
                };
            }
            salesByType[type].count++;
            salesByType[type].revenue += sale.paymentInfo.amountPaid;
            salesByType[type].packages.push(sale);
        });
        
        // Group by month
        const salesByMonth = {};
        filteredSales.forEach(sale => {
            const month = new Date(sale.paymentInfo.paymentDate).toISOString().slice(0, 7); // YYYY-MM
            if (!salesByMonth[month]) {
                salesByMonth[month] = {
                    count: 0,
                    revenue: 0
                };
            }
            salesByMonth[month].count++;
            salesByMonth[month].revenue += sale.paymentInfo.amountPaid;
        });
        
        res.json({
            summary: {
                totalSales,
                totalRevenue,
                averageSaleValue,
                dateRange: { startDate, endDate },
                packageType
            },
            salesByType,
            salesByMonth,
            sales: filteredSales
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/instructor-classes
// @desc    Get instructors with their classes and check-ins
// @access  Public (for now)
router.get('/instructor-classes', async (req, res) => {
    try {
        const { instructorId, startDate, endDate } = req.query;
        
        // Build query for classes
        let classQuery = {};
        if (instructorId) {
            classQuery.instructor = instructorId;
        }
        if (startDate && endDate) {
            classQuery.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        // Get instructors
        const instructors = await Instructor.find(instructorId ? { _id: instructorId } : {})
            .sort({ firstName: 1, lastName: 1 });
        
        const instructorReports = [];
        
        for (const instructor of instructors) {
            // Get classes for this instructor
            const classes = await Class.find({ 
                instructor: instructor._id,
                ...(startDate && endDate ? {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                } : {})
            }).sort({ date: 1, startTime: 1 });
            
            // Get attendance records for these classes
            const classIds = classes.map(cls => cls._id);
            const attendanceRecords = await Attendance.find({
                class: { $in: classIds }
            }).populate('class', 'name date startTime endTime');
            
            // Calculate statistics
            const totalClasses = classes.length;
            const totalCheckIns = attendanceRecords.reduce((sum, record) => sum + record.attendees.length, 0);
            const averageAttendance = totalClasses > 0 ? totalCheckIns / totalClasses : 0;
            
            // Group attendance by class
            const classAttendance = {};
            attendanceRecords.forEach(record => {
                const classId = record.class._id.toString();
                if (!classAttendance[classId]) {
                    classAttendance[classId] = {
                        class: record.class,
                        attendanceRecords: [],
                        totalAttendees: 0
                    };
                }
                classAttendance[classId].attendanceRecords.push(record);
                classAttendance[classId].totalAttendees += record.attendees.length;
            });
            
            instructorReports.push({
                instructor: {
                    _id: instructor._id,
                    instructorId: instructor.instructorId,
                    firstName: instructor.firstName,
                    lastName: instructor.lastName,
                    email: instructor.email,
                    phone: instructor.phone,
                    specialties: instructor.specialties,
                    payRate: instructor.payRate
                },
                classes: classes.map(cls => ({
                    ...cls.toObject(),
                    attendance: classAttendance[cls._id.toString()] || {
                        attendanceRecords: [],
                        totalAttendees: 0
                    }
                })),
                statistics: {
                    totalClasses,
                    totalCheckIns,
                    averageAttendance: Math.round(averageAttendance * 100) / 100
                }
            });
        }
        
        res.json({
            summary: {
                totalInstructors: instructorReports.length,
                totalClasses: instructorReports.reduce((sum, inst) => sum + inst.statistics.totalClasses, 0),
                totalCheckIns: instructorReports.reduce((sum, inst) => sum + inst.statistics.totalCheckIns, 0),
                dateRange: { startDate, endDate }
            },
            instructors: instructorReports
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/customer-packages
// @desc    Get customers with their package information
// @access  Public (for now)
router.get('/customer-packages', async (req, res) => {
    try {
        const { customerId, status } = req.query;
        
        // Build query
        let query = {};
        if (customerId) {
            query._id = customerId;
        }
        
        // Get customers
        const customers = await Customer.find(query)
            .sort({ firstName: 1, lastName: 1 });
        
        const customerReports = [];
        
        for (const customer of customers) {
            // Get all sales for this customer
            const sales = await Sale.find({ customer: customer._id })
                .populate('package', 'packageId name type numberOfClasses price validityPeriod')
                .sort({ 'paymentInfo.paymentDate': -1 });
            
            // Categorize packages
            const activePackages = [];
            const expiredPackages = [];
            const futurePackages = [];
            
            sales.forEach(sale => {
                const now = new Date();
                const startDate = new Date(sale.validityPeriod.startDate);
                const endDate = new Date(sale.validityPeriod.endDate);
                const remainingClasses = sale.classBalance.remainingClasses;
                
                const packageInfo = {
                    sale: {
                        _id: sale._id,
                        saleId: sale.saleId,
                        paymentDate: sale.paymentInfo.paymentDate,
                        amountPaid: sale.paymentInfo.amountPaid,
                        paymentMethod: sale.paymentInfo.paymentMethod
                    },
                    package: sale.package,
                    validity: {
                        startDate: sale.validityPeriod.startDate,
                        endDate: sale.validityPeriod.endDate,
                        daysRemaining: Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
                    },
                    balance: {
                        totalClasses: sale.classBalance.totalClasses,
                        usedClasses: sale.classBalance.usedClasses,
                        remainingClasses: sale.classBalance.remainingClasses
                    },
                    status: sale.status
                };
                
                if (sale.status === 'active' && endDate > now && remainingClasses > 0) {
                    activePackages.push(packageInfo);
                } else if (endDate < now || remainingClasses === 0) {
                    expiredPackages.push(packageInfo);
                } else if (startDate > now) {
                    futurePackages.push(packageInfo);
                }
            });
            
            // Calculate statistics
            const totalPackages = sales.length;
            const totalSpent = sales.reduce((sum, sale) => sum + sale.paymentInfo.amountPaid, 0);
            const totalClasses = sales.reduce((sum, sale) => sum + sale.classBalance.totalClasses, 0);
            const usedClasses = sales.reduce((sum, sale) => sum + sale.classBalance.usedClasses, 0);
            const remainingClasses = sales.reduce((sum, sale) => sum + sale.classBalance.remainingClasses, 0);
            
            const customerReport = {
                customer: {
                    _id: customer._id,
                    customerId: customer.customerId,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    email: customer.email,
                    phone: customer.phone,
                    dateJoined: customer.dateJoined
                },
                packages: {
                    active: activePackages,
                    expired: expiredPackages,
                    future: futurePackages
                },
                statistics: {
                    totalPackages,
                    totalSpent,
                    totalClasses,
                    usedClasses,
                    remainingClasses,
                    utilizationRate: totalClasses > 0 ? Math.round((usedClasses / totalClasses) * 100) : 0
                }
            };
            
            // Filter by status if specified
            if (!status || status === 'all' || 
                (status === 'active' && activePackages.length > 0) ||
                (status === 'expired' && expiredPackages.length > 0) ||
                (status === 'future' && futurePackages.length > 0)) {
                customerReports.push(customerReport);
            }
        }
        
        res.json({
            summary: {
                totalCustomers: customerReports.length,
                totalActivePackages: customerReports.reduce((sum, cust) => sum + cust.packages.active.length, 0),
                totalExpiredPackages: customerReports.reduce((sum, cust) => sum + cust.packages.expired.length, 0),
                totalFuturePackages: customerReports.reduce((sum, cust) => sum + cust.packages.future.length, 0),
                totalRevenue: customerReports.reduce((sum, cust) => sum + cust.statistics.totalSpent, 0)
            },
            customers: customerReports
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/teacher-payments
// @desc    Get teacher payment report by month
// @access  Public (for now)
router.get('/teacher-payments', async (req, res) => {
    try {
        const { year, month, instructorId } = req.query;
        
        // Build date range
        const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) - 1, 1);
        const endDate = new Date(year || new Date().getFullYear(), month || new Date().getMonth(), 0, 23, 59, 59);
        
        // Build query
        let instructorQuery = {};
        if (instructorId) {
            instructorQuery._id = instructorId;
        }
        
        // Get instructors
        const instructors = await Instructor.find(instructorQuery)
            .sort({ firstName: 1, lastName: 1 });
        
        const paymentReports = [];
        
        for (const instructor of instructors) {
            // Get classes for this instructor in the specified month
            const classes = await Class.find({
                instructor: instructor._id,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({ date: 1, startTime: 1 });
            
            // Get attendance records for these classes
            const classIds = classes.map(cls => cls._id);
            const attendanceRecords = await Attendance.find({
                class: { $in: classIds }
            }).populate('class', 'name date startTime endTime');
            
            // Calculate payments
            const totalClasses = classes.length;
            const totalCheckIns = attendanceRecords.reduce((sum, record) => sum + record.attendees.length, 0);
            const basePay = instructor.payRate * totalClasses;
            const bonusPay = totalCheckIns > totalClasses * 10 ? (totalCheckIns - totalClasses * 10) * 2 : 0; // $2 bonus per check-in over 10 per class
            const totalPay = basePay + bonusPay;
            
            // Group by week
            const weeklyPayments = {};
            classes.forEach(cls => {
                const weekStart = new Date(cls.date);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week
                const weekKey = weekStart.toISOString().slice(0, 10);
                
                if (!weeklyPayments[weekKey]) {
                    weeklyPayments[weekKey] = {
                        weekStart,
                        classes: [],
                        checkIns: 0,
                        pay: 0
                    };
                }
                
                weeklyPayments[weekKey].classes.push(cls);
                
                // Count check-ins for this class
                const classAttendance = attendanceRecords.filter(record => 
                    record.class._id.toString() === cls._id.toString()
                );
                const classCheckIns = classAttendance.reduce((sum, record) => sum + record.attendees.length, 0);
                weeklyPayments[weekKey].checkIns += classCheckIns;
                weeklyPayments[weekKey].pay += instructor.payRate;
            });
            
            paymentReports.push({
                instructor: {
                    _id: instructor._id,
                    instructorId: instructor.instructorId,
                    firstName: instructor.firstName,
                    lastName: instructor.lastName,
                    email: instructor.email,
                    payRate: instructor.payRate
                },
                period: {
                    year: year || new Date().getFullYear(),
                    month: month || new Date().getMonth(),
                    startDate,
                    endDate
                },
                classes: classes,
                attendance: attendanceRecords,
                weeklyPayments: Object.values(weeklyPayments),
                payment: {
                    basePay,
                    bonusPay,
                    totalPay,
                    totalClasses,
                    totalCheckIns,
                    averageCheckInsPerClass: totalClasses > 0 ? Math.round((totalCheckIns / totalClasses) * 100) / 100 : 0
                }
            });
        }
        
        res.json({
            summary: {
                period: {
                    year: year || new Date().getFullYear(),
                    month: month || new Date().getMonth(),
                    startDate,
                    endDate
                },
                totalInstructors: paymentReports.length,
                totalClasses: paymentReports.reduce((sum, inst) => sum + inst.payment.totalClasses, 0),
                totalCheckIns: paymentReports.reduce((sum, inst) => sum + inst.payment.totalCheckIns, 0),
                totalBasePay: paymentReports.reduce((sum, inst) => sum + inst.payment.basePay, 0),
                totalBonusPay: paymentReports.reduce((sum, inst) => sum + inst.payment.bonusPay, 0),
                totalPay: paymentReports.reduce((sum, inst) => sum + inst.payment.totalPay, 0)
            },
            instructors: paymentReports
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/summary
// @desc    Get overall studio summary
// @access  Public (for now)
router.get('/summary', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        // Build date query
        let dateQuery = {};
        if (startDate && endDate) {
            dateQuery = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        // Get counts
        const totalInstructors = await Instructor.countDocuments();
        const totalCustomers = await Customer.countDocuments();
        const totalClasses = await Class.countDocuments(dateQuery.date ? { date: dateQuery } : {});
        const totalPackages = await Package.countDocuments();
        
        // Get sales data
        const salesQuery = dateQuery.$gte ? { 'paymentInfo.paymentDate': dateQuery } : {};
        const totalSales = await Sale.countDocuments(salesQuery);
        const totalRevenue = await Sale.aggregate([
            { $match: salesQuery },
            { $group: { _id: null, total: { $sum: '$paymentInfo.amountPaid' } } }
        ]);
        
        // Get attendance data
        const attendanceQuery = dateQuery.$gte ? { actualDate: dateQuery } : {};
        const totalAttendance = await Attendance.countDocuments(attendanceQuery);
        const totalCheckIns = await Attendance.aggregate([
            { $match: attendanceQuery },
            { $group: { _id: null, total: { $sum: { $size: '$attendees' } } } }
        ]);
        
        res.json({
            overview: {
                totalInstructors,
                totalCustomers,
                totalClasses,
                totalPackages,
                totalSales,
                totalRevenue: totalRevenue[0]?.total || 0,
                totalAttendance,
                totalCheckIns: totalCheckIns[0]?.total || 0
            },
            dateRange: { startDate, endDate }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
