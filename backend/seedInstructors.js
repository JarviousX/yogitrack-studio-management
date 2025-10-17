const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Instructor = require('./models/Instructor');

require('dotenv').config();

const seedInstructors = async () => {
    await connectDB();

    try {
        console.log('Seeding instructors...');

        // Clear existing instructors
        await Instructor.deleteMany({});
        console.log('Existing instructors cleared.');

        const instructorsData = [
            {
                instructorId: 'I00001',
                firstName: 'Sarah',
                lastName: 'Chen',
                email: 'sarah.chen@yogitrack.com',
                phone: '(555) 123-4567',
                address: {
                    street: '123 Zen Street',
                    city: 'San Francisco',
                    state: 'CA',
                    zipCode: '94102'
                },
                preferredCommunication: 'email',
                specialties: ['Vinyasa', 'Hatha', 'Meditation'],
                bio: 'Sarah has been practicing yoga for over 15 years and teaching for 8 years. She specializes in Vinyasa flow and mindfulness meditation, helping students find balance between strength and flexibility.',
                emergencyContact: {
                    name: 'Michael Chen',
                    relationship: 'Spouse',
                    phone: '(555) 123-4568'
                },
                status: 'active',
                payRate: 45,
                experience: {
                    years: 8
                },
                certifications: [
                    {
                        name: '200-Hour RYT',
                        issueDate: new Date('2016-03-15'),
                        expiryDate: new Date('2026-03-15'),
                        issuingBody: 'Yoga Alliance'
                    },
                    {
                        name: '300-Hour RYT',
                        issueDate: new Date('2018-06-20'),
                        expiryDate: new Date('2028-06-20'),
                        issuingBody: 'Yoga Alliance'
                    }
                ]
            },
            {
                instructorId: 'I00002',
                firstName: 'Marcus',
                lastName: 'Rodriguez',
                email: 'marcus.rodriguez@yogitrack.com',
                phone: '(555) 234-5678',
                address: {
                    street: '456 Mountain View Ave',
                    city: 'San Francisco',
                    state: 'CA',
                    zipCode: '94103'
                },
                preferredCommunication: 'phone',
                specialties: ['Power Yoga', 'Ashtanga', 'Yin Yoga'],
                bio: 'Marcus brings intensity and passion to his Power Yoga classes. With a background in martial arts, he helps students build strength, endurance, and mental focus through challenging sequences.',
                emergencyContact: {
                    name: 'Elena Rodriguez',
                    relationship: 'Sister',
                    phone: '(555) 234-5679'
                },
                status: 'active',
                payRate: 50,
                experience: {
                    years: 6
                },
                certifications: [
                    {
                        name: '200-Hour RYT',
                        issueDate: new Date('2017-09-10'),
                        expiryDate: new Date('2027-09-10'),
                        issuingBody: 'Yoga Alliance'
                    },
                    {
                        name: 'Power Yoga Certification',
                        issueDate: new Date('2018-12-05'),
                        expiryDate: new Date('2028-12-05'),
                        issuingBody: 'Baptiste Power Yoga'
                    }
                ]
            },
            {
                instructorId: 'I00003',
                firstName: 'Priya',
                lastName: 'Patel',
                email: 'priya.patel@yogitrack.com',
                phone: '(555) 345-6789',
                address: {
                    street: '789 Lotus Lane',
                    city: 'San Francisco',
                    state: 'CA',
                    zipCode: '94104'
                },
                preferredCommunication: 'email',
                specialties: ['Restorative', 'Prenatal', 'Yin Yoga'],
                bio: 'Priya specializes in gentle, healing practices. Her Restorative and Prenatal classes provide a safe space for students to relax, restore, and connect with their bodies during all stages of life.',
                emergencyContact: {
                    name: 'Raj Patel',
                    relationship: 'Husband',
                    phone: '(555) 345-6790'
                },
                status: 'active',
                payRate: 42,
                experience: {
                    years: 10
                },
                certifications: [
                    {
                        name: '200-Hour RYT',
                        issueDate: new Date('2014-05-20'),
                        expiryDate: new Date('2024-05-20'),
                        issuingBody: 'Yoga Alliance'
                    },
                    {
                        name: 'Prenatal Yoga Certification',
                        issueDate: new Date('2015-08-15'),
                        expiryDate: new Date('2025-08-15'),
                        issuingBody: 'Prenatal Yoga Center'
                    },
                    {
                        name: 'Restorative Yoga Certification',
                        issueDate: new Date('2016-11-30'),
                        expiryDate: new Date('2026-11-30'),
                        issuingBody: 'Judith Lasater'
                    }
                ]
            },
            {
                instructorId: 'I00004',
                firstName: 'David',
                lastName: 'Kim',
                email: 'david.kim@yogitrack.com',
                phone: '(555) 456-7890',
                address: {
                    street: '321 Harmony Heights',
                    city: 'San Francisco',
                    state: 'CA',
                    zipCode: '94105'
                },
                preferredCommunication: 'email',
                specialties: ['Hot Yoga', 'Bikram', 'Vinyasa'],
                bio: 'David is passionate about Hot Yoga and its transformative benefits. His classes focus on building heat, flexibility, and mental resilience through traditional Bikram sequences and modern Vinyasa flows.',
                emergencyContact: {
                    name: 'Jennifer Kim',
                    relationship: 'Wife',
                    phone: '(555) 456-7891'
                },
                status: 'active',
                payRate: 48,
                experience: {
                    years: 7
                },
                certifications: [
                    {
                        name: '200-Hour RYT',
                        issueDate: new Date('2016-07-12'),
                        expiryDate: new Date('2026-07-12'),
                        issuingBody: 'Yoga Alliance'
                    },
                    {
                        name: 'Bikram Yoga Certification',
                        issueDate: new Date('2017-03-25'),
                        expiryDate: new Date('2027-03-25'),
                        issuingBody: 'Bikram Yoga College'
                    }
                ]
            },
            {
                instructorId: 'I00005',
                firstName: 'Emma',
                lastName: 'Thompson',
                email: 'emma.thompson@yogitrack.com',
                phone: '(555) 567-8901',
                address: {
                    street: '654 Serenity Circle',
                    city: 'San Francisco',
                    state: 'CA',
                    zipCode: '94106'
                },
                preferredCommunication: 'phone',
                specialties: ['Beginner Yoga', 'Chair Yoga', 'Senior Yoga'],
                bio: 'Emma specializes in making yoga accessible to everyone, especially beginners and seniors. Her gentle approach and clear instruction help students build confidence and find joy in their practice.',
                emergencyContact: {
                    name: 'Robert Thompson',
                    relationship: 'Brother',
                    phone: '(555) 567-8902'
                },
                status: 'active',
                payRate: 40,
                experience: {
                    years: 5
                },
                certifications: [
                    {
                        name: '200-Hour RYT',
                        issueDate: new Date('2018-04-18'),
                        expiryDate: new Date('2028-04-18'),
                        issuingBody: 'Yoga Alliance'
                    },
                    {
                        name: 'Chair Yoga Certification',
                        issueDate: new Date('2019-01-10'),
                        expiryDate: new Date('2029-01-10'),
                        issuingBody: 'Lakshmi Voelker Chair Yoga'
                    }
                ]
            }
        ];

        // Save instructors
        for (const instructorData of instructorsData) {
            const instructor = new Instructor(instructorData);
            await instructor.save();
        }

        console.log(`${instructorsData.length} instructors seeded successfully!`);
        
        // Display seeded instructors
        const instructors = await Instructor.find({});
        console.log('\nSeeded Instructors:');
        instructors.forEach(inst => {
            console.log(`- ${inst.instructorId}: ${inst.firstName} ${inst.lastName} (${inst.specialties.join(', ')})`);
        });

    } catch (error) {
        console.error('Error seeding instructors:', error);
        process.exit(1);
    } finally {
        mongoose.connection.close();
    }
};

seedInstructors();
