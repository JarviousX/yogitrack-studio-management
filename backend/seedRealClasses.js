const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Class = require('./models/Class');
const Instructor = require('./models/Instructor');

require('dotenv').config();

const seedRealClasses = async () => {
    await connectDB();

    try {
        console.log('Seeding real classes...');

        // Clear existing classes
        await Class.deleteMany({});
        console.log('Existing classes cleared.');

        // Fetch instructors to assign to classes
        const instructors = await Instructor.find({});
        if (instructors.length === 0) {
            console.log('No instructors found. Please add some instructors first.');
            return;
        }

        // Map instructor names to their IDs for easy assignment
        const instructorMap = {};
        instructors.forEach(inst => {
            instructorMap[`${inst.firstName} ${inst.lastName}`] = inst._id;
        });

        console.log('Available instructors:', Object.keys(instructorMap));

        const classesData = [
            // Monday Classes
            {
                name: 'Morning Vinyasa Flow',
                description: 'Start your week with an energizing Vinyasa flow that builds heat and strength while connecting breath to movement.',
                instructor: instructorMap['Sarah Chen'] || instructors[0]._id,
                dayOfWeek: 'Monday',
                startTime: '07:00',
                endTime: '08:15',
                level: 'All Levels',
                maxCapacity: 25,
                currentEnrollment: 18,
                price: 22,
                room: 'Main Studio',
                equipment: ['Mats', 'Blocks', 'Straps'],
                isActive: true,
                isRecurring: true
            },
            {
                name: 'Power Yoga Intensive',
                description: 'High-intensity Power Yoga class focusing on strength, balance, and mental focus through challenging sequences.',
                instructor: instructorMap['Marcus Rodriguez'] || instructors[1]._id,
                dayOfWeek: 'Monday',
                startTime: '18:00',
                endTime: '19:15',
                level: 'Advanced',
                maxCapacity: 20,
                currentEnrollment: 16,
                price: 28,
                room: 'Main Studio',
                equipment: ['Mats', 'Blocks', 'Straps'],
                isActive: true,
                isRecurring: true
            },

            // Tuesday Classes
            {
                name: 'Gentle Hatha Yoga',
                description: 'A slower-paced class focusing on proper alignment, breathing techniques, and mindful movement.',
                instructor: instructorMap['Emma Thompson'] || instructors[4]._id,
                dayOfWeek: 'Tuesday',
                startTime: '09:30',
                endTime: '10:45',
                level: 'Beginner',
                maxCapacity: 20,
                currentEnrollment: 12,
                price: 20,
                room: 'Small Studio',
                equipment: ['Mats', 'Blocks', 'Bolsters'],
                isActive: true,
                isRecurring: true
            },
            {
                name: 'Hot Yoga Flow',
                description: 'Practice in a heated room (95-100°F) to enhance flexibility and detoxification through dynamic sequences.',
                instructor: instructorMap['David Kim'] || instructors[3]._id,
                dayOfWeek: 'Tuesday',
                startTime: '19:00',
                endTime: '20:15',
                level: 'Intermediate',
                maxCapacity: 18,
                currentEnrollment: 15,
                price: 25,
                room: 'Hot Yoga Studio',
                equipment: ['Mats', 'Towels'],
                isActive: true,
                isRecurring: true
            },

            // Wednesday Classes
            {
                name: 'Midweek Energy Boost',
                description: 'Recharge your energy midweek with this dynamic Vinyasa flow designed to combat fatigue and boost mood.',
                instructor: instructorMap['Sarah Chen'] || instructors[0]._id,
                dayOfWeek: 'Wednesday',
                startTime: '12:00',
                endTime: '13:00',
                level: 'All Levels',
                maxCapacity: 22,
                currentEnrollment: 19,
                price: 20,
                room: 'Main Studio',
                equipment: ['Mats', 'Blocks'],
                isActive: true,
                isRecurring: true
            },
            {
                name: 'Restorative Evening',
                description: 'Unwind from your day with gentle, supported poses using props to promote deep relaxation and stress relief.',
                instructor: instructorMap['Priya Patel'] || instructors[2]._id,
                dayOfWeek: 'Wednesday',
                startTime: '19:30',
                endTime: '20:45',
                level: 'Restorative',
                maxCapacity: 15,
                currentEnrollment: 11,
                price: 25,
                room: 'Small Studio',
                equipment: ['Mats', 'Bolsters', 'Blankets', 'Eye Pillows'],
                isActive: true,
                isRecurring: true
            },

            // Thursday Classes
            {
                name: 'Ashtanga Primary Series',
                description: 'Traditional Ashtanga practice following the Primary Series with focus on breath, bandhas, and drishti.',
                instructor: instructorMap['Marcus Rodriguez'] || instructors[1]._id,
                dayOfWeek: 'Thursday',
                startTime: '07:30',
                endTime: '09:00',
                level: 'Advanced',
                maxCapacity: 18,
                currentEnrollment: 14,
                price: 30,
                room: 'Main Studio',
                equipment: ['Mats', 'Straps'],
                isActive: true,
                isRecurring: true
            },
            {
                name: 'Prenatal Yoga',
                description: 'Safe and supportive yoga practice designed specifically for expectant mothers in all trimesters.',
                instructor: instructorMap['Priya Patel'] || instructors[2]._id,
                dayOfWeek: 'Thursday',
                startTime: '18:00',
                endTime: '19:15',
                level: 'Prenatal',
                maxCapacity: 12,
                currentEnrollment: 8,
                price: 25,
                room: 'Small Studio',
                equipment: ['Mats', 'Bolsters', 'Blocks'],
                isActive: true,
                isRecurring: true
            },

            // Friday Classes
            {
                name: 'Friday Flow & Release',
                description: 'Celebrate the end of the work week with a flowing sequence followed by deep stretches and relaxation.',
                instructor: instructorMap['Sarah Chen'] || instructors[0]._id,
                dayOfWeek: 'Friday',
                startTime: '17:30',
                endTime: '18:45',
                level: 'All Levels',
                maxCapacity: 25,
                currentEnrollment: 22,
                price: 22,
                room: 'Main Studio',
                equipment: ['Mats', 'Blocks', 'Straps'],
                isActive: true,
                isRecurring: true
            },
            {
                name: 'Yin Yoga & Meditation',
                description: 'Long-held passive poses combined with guided meditation to release deep connective tissue and calm the mind.',
                instructor: instructorMap['Priya Patel'] || instructors[2]._id,
                dayOfWeek: 'Friday',
                startTime: '19:00',
                endTime: '20:30',
                level: 'Yin',
                maxCapacity: 16,
                currentEnrollment: 13,
                price: 28,
                room: 'Small Studio',
                equipment: ['Mats', 'Bolsters', 'Blankets', 'Eye Pillows'],
                isActive: true,
                isRecurring: true
            },

            // Saturday Classes
            {
                name: 'Weekend Warrior',
                description: 'Intensive Saturday morning practice combining strength, flexibility, and balance for dedicated practitioners.',
                instructor: instructorMap['Marcus Rodriguez'] || instructors[1]._id,
                dayOfWeek: 'Saturday',
                startTime: '09:00',
                endTime: '10:30',
                level: 'Advanced',
                maxCapacity: 20,
                currentEnrollment: 17,
                price: 30,
                room: 'Main Studio',
                equipment: ['Mats', 'Blocks', 'Straps'],
                isActive: true,
                isRecurring: true
            },
            {
                name: 'Family Yoga',
                description: 'Fun and interactive yoga class for parents and children to practice together, building connection and mindfulness.',
                instructor: instructorMap['Emma Thompson'] || instructors[4]._id,
                dayOfWeek: 'Saturday',
                startTime: '11:00',
                endTime: '12:00',
                level: 'All Levels',
                maxCapacity: 15,
                currentEnrollment: 9,
                price: 20,
                room: 'Small Studio',
                equipment: ['Mats', 'Blocks'],
                isActive: true,
                isRecurring: true
            },
            {
                name: 'Hot Yoga Deep Stretch',
                description: 'Heated environment combined with deep stretching and longer holds to improve flexibility and release tension.',
                instructor: instructorMap['David Kim'] || instructors[3]._id,
                dayOfWeek: 'Saturday',
                startTime: '16:00',
                endTime: '17:15',
                level: 'Intermediate',
                maxCapacity: 18,
                currentEnrollment: 14,
                price: 25,
                room: 'Hot Yoga Studio',
                equipment: ['Mats', 'Towels', 'Blocks'],
                isActive: true,
                isRecurring: true
            },

            // Sunday Classes
            {
                name: 'Sunday Morning Meditation',
                description: 'Begin your Sunday with guided meditation and gentle movement to set intentions for the week ahead.',
                instructor: instructorMap['Sarah Chen'] || instructors[0]._id,
                dayOfWeek: 'Sunday',
                startTime: '09:00',
                endTime: '10:00',
                level: 'All Levels',
                maxCapacity: 20,
                currentEnrollment: 16,
                price: 20,
                room: 'Small Studio',
                equipment: ['Mats', 'Bolsters', 'Eye Pillows'],
                isActive: true,
                isRecurring: true
            },
            {
                name: 'Chair Yoga for Seniors',
                description: 'Gentle yoga practice using chairs for support, perfect for seniors or those with mobility limitations.',
                instructor: instructorMap['Emma Thompson'] || instructors[4]._id,
                dayOfWeek: 'Sunday',
                startTime: '14:00',
                endTime: '15:00',
                level: 'Chair',
                maxCapacity: 12,
                currentEnrollment: 10,
                price: 18,
                room: 'Small Studio',
                equipment: ['Chairs', 'Blocks', 'Straps'],
                isActive: true,
                isRecurring: true
            }
        ];

        // Assign classId and save
        for (let i = 0; i < classesData.length; i++) {
            const lastClass = await Class.findOne().sort({ createdAt: -1 });
            let nextIdNum = 1;
            if (lastClass && lastClass.classId) {
                const lastNum = parseInt(lastClass.classId.substring(1));
                nextIdNum = lastNum + 1;
            }
            classesData[i].classId = `C${String(nextIdNum).padStart(5, '0')}`;
            
            // Calculate duration
            const start = new Date(`2000-01-01T${classesData[i].startTime}:00`);
            const end = new Date(`2000-01-01T${classesData[i].endTime}:00`);
            let duration = Math.round((end - start) / (1000 * 60));
            
            if (end < start) {
                end.setDate(end.getDate() + 1);
                duration = Math.round((end - start) / (1000 * 60));
            }
            classesData[i].duration = duration;
            
            const newClass = new Class(classesData[i]);
            await newClass.save();
        }

        console.log(`${classesData.length} classes seeded successfully!`);
        
        // Display summary by day
        const classes = await Class.find({}).populate('instructor', 'firstName lastName');
        const classesByDay = {};
        classes.forEach(cls => {
            if (!classesByDay[cls.dayOfWeek]) {
                classesByDay[cls.dayOfWeek] = [];
            }
            classesByDay[cls.dayOfWeek].push(cls);
        });

        console.log('\nClasses by Day:');
        Object.keys(classesByDay).sort().forEach(day => {
            console.log(`\n${day}:`);
            classesByDay[day].forEach(cls => {
                console.log(`  - ${cls.startTime}-${cls.endTime}: ${cls.name} (${cls.level}) - ${cls.instructor.firstName} ${cls.instructor.lastName}`);
            });
        });

    } catch (error) {
        console.error('Error seeding classes:', error);
        process.exit(1);
    } finally {
        mongoose.connection.close();
    }
};

seedRealClasses();
