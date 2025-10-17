# YogiTrack - Yoga Studio Management System

A comprehensive yoga studio management system built with the MERN stack (MongoDB, Express.js, Node.js, and vanilla JavaScript).

## Features

- **Instructor Management**: Add, edit, and manage yoga instructors
- **Class Scheduling**: Create and manage yoga classes with instructor assignment
- **Customer Management**: Track customer information and memberships
- **Package Management**: Create and manage class packages
- **Sales Tracking**: Record sales and track revenue
- **Attendance Management**: Record class attendance and update customer balances
- **Comprehensive Reports**: Generate detailed reports for business analytics
- **Beautiful Dashboard**: Modern, responsive interface with real-time updates

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Custom CSS with animations and responsive design
- **Icons**: Font Awesome
- **Deployment**: Heroku

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd yogitrack-studio-management
```

2. Install dependencies:
```bash
npm install
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
yogitrack-studio-management/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── Instructor.js
│   │   ├── Class.js
│   │   ├── Customer.js
│   │   ├── Package.js
│   │   ├── Sale.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── instructors.js
│   │   ├── classes.js
│   │   ├── customers.js
│   │   ├── packages.js
│   │   ├── sales.js
│   │   ├── attendance.js
│   │   └── reports.js
│   ├── server.js
│   └── package.json
├── index.html
├── styles.css
├── script.js
├── package.json
├── Procfile
└── README.md
```

## API Endpoints

### Instructors
- `GET /api/instructors` - Get all instructors
- `POST /api/instructors` - Create new instructor
- `PUT /api/instructors/:id` - Update instructor
- `DELETE /api/instructors/:id` - Delete instructor

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Packages
- `GET /api/packages` - Get all packages
- `POST /api/packages` - Create new package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Attendance
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Record attendance
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance

### Reports
- `GET /api/reports/summary` - Get studio overview
- `GET /api/reports/package-sales` - Get sales report
- `GET /api/reports/instructor-classes` - Get instructor report
- `GET /api/reports/customer-packages` - Get customer report
- `GET /api/reports/teacher-payments` - Get payment report

## Deployment

### Heroku Deployment

1. Create a Heroku app:
```bash
heroku create your-app-name
```

2. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
```

3. Deploy to Heroku:
```bash
git add .
git commit -m "Initial commit"
git push heroku main
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/JarviousX/yogitrack-studio-management](https://github.com/JarviousX/yogitrack-studio-management)
