const mongoose = require('mongoose');
const Class = require('./models/Class');
const Instructor = require('./models/Instructor');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://jackson24le_db_user:NKyPanxvAVPYnox9@yogitrack.4cr0alt.mongodb.net/yogitrack?retryWrites=true&w=majority&appName=YogiTrack';
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected for seeding...');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

// Sample classes data based on the schedule image
const sampleClasses = [
    // Sunday
    {
        classId: 'C00001',
        name: 'Morning Flow',
        description: 'A gentle flow to start your Sunday',
        level: 'All Levels',
        dayOfWeek: 'Sunday',
        startTime: '09:00',
        endTime: '10:15',
        maxCapacity: 20,
        currentEnrollment: 12,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks', 'Straps'],
        price: 20,
        notes: 'Perfect for all levels'
    },
    {
        classId: 'C00002',
        name: 'Beginner Basics',
        description: 'Introduction to yoga fundamentals',
        level: 'Beginner',
        dayOfWeek: 'Sunday',
        startTime: '12:00',
        endTime: '13:00',
        maxCapacity: 15,
        currentEnrollment: 8,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks', 'Bolsters'],
        price: 20,
        notes: 'Great for newcomers'
    },
    
    // Monday
    {
        classId: 'C00003',
        name: 'Morning Vinyasa',
        description: 'Dynamic morning practice',
        level: 'All Levels',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:15',
        maxCapacity: 20,
        currentEnrollment: 15,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks'],
        price: 20,
        notes: 'Energizing start to the week'
    },
    {
        classId: 'C00004',
        name: 'Power Yoga',
        description: 'Intense strength-building practice',
        level: 'Advanced',
        dayOfWeek: 'Monday',
        startTime: '16:45',
        endTime: '18:00',
        maxCapacity: 15,
        currentEnrollment: 12,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks', 'Straps'],
        price: 25,
        notes: 'Challenging practice'
    },
    {
        classId: 'C00005',
        name: 'Evening Flow',
        description: 'Gentle evening practice',
        level: 'All Levels',
        dayOfWeek: 'Monday',
        startTime: '18:15',
        endTime: '19:15',
        maxCapacity: 18,
        currentEnrollment: 10,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks', 'Bolsters'],
        price: 20,
        notes: 'Perfect way to unwind'
    },
    
    // Tuesday
    {
        classId: 'C00006',
        name: 'Morning Hatha',
        description: 'Traditional yoga practice',
        level: 'All Levels',
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '10:15',
        maxCapacity: 20,
        currentEnrollment: 14,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks', 'Straps'],
        price: 20,
        notes: 'Classical approach'
    },
    {
        classId: 'C00007',
        name: 'Evening Vinyasa',
        description: 'Flowing evening practice',
        level: 'All Levels',
        dayOfWeek: 'Tuesday',
        startTime: '18:15',
        endTime: '19:15',
        maxCapacity: 18,
        currentEnrollment: 11,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks'],
        price: 20,
        notes: 'Smooth transitions'
    },
    
    // Wednesday
    {
        classId: 'C00008',
        name: 'Morning Power',
        description: 'Strong morning practice',
        level: 'All Levels',
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '10:15',
        maxCapacity: 20,
        currentEnrollment: 16,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks', 'Straps'],
        price: 20,
        notes: 'Mid-week energy boost'
    },
    {
        classId: 'C00009',
        name: 'Yoga with Weights',
        description: 'Strength training with yoga',
        level: 'With Weights',
        dayOfWeek: 'Wednesday',
        startTime: '16:45',
        endTime: '18:00',
        maxCapacity: 12,
        currentEnrollment: 9,
        room: 'Main Studio',
        equipment: ['Mats', 'Weights', 'Blocks'],
        price: 25,
        notes: 'Bring your own weights'
    },
    {
        classId: 'C00010',
        name: 'Evening Flow',
        description: 'Gentle evening practice',
        level: 'All Levels',
        dayOfWeek: 'Wednesday',
        startTime: '18:15',
        endTime: '19:15',
        maxCapacity: 18,
        currentEnrollment: 13,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks', 'Bolsters'],
        price: 20,
        notes: 'Relaxing practice'
    },
    
    // Thursday
    {
        classId: 'C00011',
        name: 'Morning Flow',
        description: 'Gentle morning practice',
        level: 'All Levels',
        dayOfWeek: 'Thursday',
        startTime: '09:00',
        endTime: '10:15',
        maxCapacity: 20,
        currentEnrollment: 12,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks', 'Straps'],
        price: 20,
        notes: 'Peaceful start'
    },
    {
        classId: 'C00012',
        name: 'Evening Vinyasa',
        description: 'Dynamic evening practice',
        level: 'All Levels',
        dayOfWeek: 'Thursday',
        startTime: '18:15',
        endTime: '19:15',
        maxCapacity: 18,
        currentEnrollment: 15,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks'],
        price: 20,
        notes: 'Energetic flow'
    },
    {
        classId: 'C00013',
        name: 'Restorative Yoga',
        description: 'Deep relaxation practice',
        level: 'Restorative',
        dayOfWeek: 'Thursday',
        startTime: '19:30',
        endTime: '20:45',
        maxCapacity: 15,
        currentEnrollment: 8,
        room: 'Main Studio',
        equipment: ['Mats', 'Bolsters', 'Blankets', 'Eye Pillows'],
        price: 25,
        notes: 'Deep rest and recovery'
    },
    
    // Friday
    {
        classId: 'C00014',
        name: 'Friday Flow',
        description: 'End of week celebration',
        level: 'All Levels',
        dayOfWeek: 'Friday',
        startTime: '09:00',
        endTime: '10:15',
        maxCapacity: 20,
        currentEnrollment: 18,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks', 'Straps'],
        price: 20,
        notes: 'Weekend preparation'
    },
    
    // Saturday
    {
        classId: 'C00015',
        name: 'Weekend Warrior',
        description: 'Strong weekend practice',
        level: 'All Levels',
        dayOfWeek: 'Saturday',
        startTime: '09:00',
        endTime: '10:15',
        maxCapacity: 20,
        currentEnrollment: 14,
        room: 'Main Studio',
        equipment: ['Mats', 'Blocks', 'Straps'],
        price: 20,
        notes: 'Weekend energy'
    }
];

// Seed the database
async function seedClasses() {
    try {
        await connectDB();
        
        // Clear existing classes
        await Class.deleteMany({});
        console.log('Cleared existing classes');
        
        // Get instructors to assign to classes
        const instructors = await Instructor.find();
        if (instructors.length === 0) {
            console.log('No instructors found. Please add instructors first.');
            return;
        }
        
        // Assign instructors to classes (cycling through available instructors)
        const classesWithInstructors = sampleClasses.map((cls, index) => ({
            ...cls,
            instructor: instructors[index % instructors.length]._id
        }));
        
        // Insert classes
        await Class.insertMany(classesWithInstructors);
        console.log(`Seeded ${classesWithInstructors.length} classes successfully!`);
        
        // Display summary
        const classCount = await Class.countDocuments();
        console.log(`Total classes in database: ${classCount}`);
        
    } catch (error) {
        console.error('Error seeding classes:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the seeder
seedClasses();
