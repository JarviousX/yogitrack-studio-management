// DOM Elements
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
// Dynamic header elements will be accessed by ID when needed

// Sample data for the dashboard
const sampleData = {
    instructors: [
        { id: 'I00123', name: 'Sarah Johnson', email: 'sarah@yogahom.com', phone: '(555) 123-4567', classes: 8 },
        { id: 'I00124', name: 'Mike Chen', email: 'mike@yogahom.com', phone: '(555) 234-5678', classes: 6 },
        { id: 'I00125', name: 'Lisa Rodriguez', email: 'lisa@yogahom.com', phone: '(555) 345-6789', classes: 10 }
    ],
    customers: [
        { id: 'C00123', name: 'Emma Wilson', email: 'emma@email.com', phone: '(555) 456-7890', balance: 8 },
        { id: 'C00124', name: 'David Brown', email: 'david@email.com', phone: '(555) 567-8901', balance: 4 },
        { id: 'C00125', name: 'Maria Garcia', email: 'maria@email.com', phone: '(555) 678-9012', balance: 12 }
    ],
    classes: [
        { time: '9:00 AM', type: 'General', instructor: 'Sarah Johnson', day: 'Monday', payRate: '$50' },
        { time: '6:00 PM', type: 'Special', instructor: 'Mike Chen', day: 'Tuesday', payRate: '$60' },
        { time: '7:30 PM', type: 'General', instructor: 'Lisa Rodriguez', day: 'Wednesday', payRate: '$55' }
    ],
    packages: [
        { name: 'General 4-Class', type: 'General', classes: 4, price: '$80', validity: '30 days' },
        { name: 'Special 10-Class', type: 'Special', classes: 10, price: '$180', validity: '60 days' },
        { name: 'Unlimited Monthly', type: 'General', classes: 'Unlimited', price: '$120', validity: '30 days' }
    ],
    sales: [
        { date: '2024-01-15', customer: 'Emma Wilson', package: 'General 4-Class', amount: '$80', method: 'Credit Card' },
        { date: '2024-01-14', customer: 'David Brown', package: 'Special 10-Class', amount: '$180', method: 'Cash' },
        { date: '2024-01-13', customer: 'Maria Garcia', package: 'Unlimited Monthly', amount: '$120', method: 'Bank Transfer' }
    ]
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    updateStats();
});

// Initialize dashboard functionality
function initializeDashboard() {
    // Set initial active section
    showSection('dashboard');
    
    // Add click handlers to menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
            setActiveMenuItem(this);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
    
    // Add instructor button
    const addInstructorBtn = document.getElementById('addInstructorBtn');
    if (addInstructorBtn) {
        addInstructorBtn.addEventListener('click', openAddInstructorModal);
    }
    
    // Refresh instructors button
    const refreshInstructorsBtn = document.getElementById('refreshInstructorsBtn');
    if (refreshInstructorsBtn) {
        refreshInstructorsBtn.addEventListener('click', refreshInstructorList);
    }
    
    // Instructor search
    const instructorSearch = document.getElementById('instructorSearch');
    if (instructorSearch) {
        instructorSearch.addEventListener('input', filterInstructors);
    }
    
    // Modal functionality
    setupModalEventListeners();
    
    // Form functionality
    setupFormEventListeners();
    
    // Classes functionality
    setupClassesEventListeners();
    setupClassModalEventListeners();
    setupClassFormEventListeners();
    
    // Customer event listeners
    setupCustomerModalEventListeners();
    setupCustomerFormEventListeners();
    
    // Package event listeners
    setupPackageModalEventListeners();
    setupPackageFormEventListeners();
    
    // Sales event listeners
    setupSalesModalEventListeners();
    setupSalesFormEventListeners();
    
    // Attendance event listeners
    setupAttendanceModalEventListeners();
    setupAttendanceFormEventListeners();
    
    // Reports event listeners
    setupReportsEventListeners();
    
    // Add new buttons
    const addButtons = document.querySelectorAll('.btn-primary');
    addButtons.forEach(btn => {
        if (btn.textContent.includes('Add') && !btn.id) {
            btn.addEventListener('click', function() {
                const section = this.closest('.content-section').id;
                handleAddAction(section);
            });
        }
    });
    
    // Edit and delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-secondary') && e.target.closest('.btn-secondary').title === 'Edit') {
            handleEditInstructor(e.target.closest('.btn-secondary'));
        } else if (e.target.closest('.btn-danger') && e.target.closest('.btn-danger').title === 'Delete') {
            handleDeleteInstructor(e.target.closest('.btn-danger'));
        } else if (e.target.closest('.btn-secondary') && e.target.closest('.btn-secondary').title === 'View Details') {
            handleViewInstructor(e.target.closest('.btn-secondary'));
        }
    });
    
    // Report generation buttons
    const reportButtons = document.querySelectorAll('.report-card .btn-primary');
    reportButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportType = this.closest('.report-card').querySelector('h3').textContent;
            generateReport(reportType);
        });
    });
}

// Update dynamic header based on current section
function updateDynamicHeader(sectionId) {
    const headerTitle = document.getElementById('headerTitle');
    const headerSubtitle = document.getElementById('headerSubtitle');
    const headerActions = document.getElementById('headerActions');
    
    const sectionConfig = {
        'dashboard': {
            title: 'YogiTrack Dashboard',
            subtitle: 'Welcome to your yoga studio management system',
            actions: `
                <button class="btn btn-secondary" onclick="refreshAllData()" title="Refresh All Data">
                    <i class="fas fa-sync-alt"></i> Refresh All
                </button>
            `
        },
        'instructors': {
            title: 'Instructor Management',
            subtitle: 'Manage your yoga instructors and their schedules',
            actions: `
                <button class="btn btn-primary" onclick="openInstructorModal()">
                    <i class="fas fa-user-plus"></i> Add Instructor
                </button>
                <button class="btn btn-secondary" onclick="refreshInstructorList()" title="Refresh List">
                    <i class="fas fa-sync-alt"></i>
                </button>
            `
        },
        'classes': {
            title: 'Class Management',
            subtitle: 'Schedule and manage yoga classes',
            actions: `
                <button class="btn btn-primary" onclick="openClassModal()">
                    <i class="fas fa-calendar-plus"></i> Add Class
                </button>
                <button class="btn btn-secondary" onclick="loadClasses()" title="Refresh List">
                    <i class="fas fa-sync-alt"></i>
                </button>
            `
        },
        'customers': {
            title: 'Customer Management',
            subtitle: 'Manage your yoga studio customers and memberships',
            actions: `
                <button class="btn btn-primary" onclick="openCustomerModal()">
                    <i class="fas fa-user-plus"></i> Add Customer
                </button>
                <button class="btn btn-secondary" onclick="refreshCustomerList()" title="Refresh List">
                    <i class="fas fa-sync-alt"></i>
                </button>
            `
        },
        'packages': {
            title: 'Package Management',
            subtitle: 'Create and manage yoga class packages',
            actions: `
                <button class="btn btn-primary" onclick="openPackageModal()">
                    <i class="fas fa-box"></i> Add Package
                </button>
                <button class="btn btn-secondary" onclick="refreshPackageList()" title="Refresh List">
                    <i class="fas fa-sync-alt"></i>
                </button>
            `
        },
        'sales': {
            title: 'Sales Management',
            subtitle: 'Track package sales and customer transactions',
            actions: `
                <button class="btn btn-primary" onclick="openSalesModal()">
                    <i class="fas fa-shopping-cart"></i> Record Sale
                </button>
                <button class="btn btn-secondary" onclick="refreshSalesList()" title="Refresh List">
                    <i class="fas fa-sync-alt"></i>
                </button>
            `
        },
        'attendance': {
            title: 'Class Attendance',
            subtitle: 'Record and manage class attendance',
            actions: `
                <button class="btn btn-primary" onclick="openRecordAttendanceModal()">
                    <i class="fas fa-clipboard-check"></i> Record Attendance
                </button>
                <button class="btn btn-secondary" onclick="refreshAttendanceList()" title="Refresh List">
                    <i class="fas fa-sync-alt"></i>
                </button>
            `
        },
        'reports': {
            title: 'Studio Reports',
            subtitle: 'Generate comprehensive reports and analytics',
            actions: `
                <button class="btn btn-primary" onclick="refreshReportsSummary()">
                    <i class="fas fa-chart-line"></i> Refresh Reports
                </button>
                <button class="btn btn-secondary" onclick="exportAllReports()" title="Export All Reports">
                    <i class="fas fa-download"></i> Export
                </button>
            `
        }
    };
    
    const config = sectionConfig[sectionId] || sectionConfig['dashboard'];
    
    headerTitle.textContent = config.title;
    headerSubtitle.textContent = config.subtitle;
    headerActions.innerHTML = config.actions;
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load data for specific sections
        if (sectionId === 'instructors') {
            setTimeout(refreshInstructorList, 100);
        } else if (sectionId === 'classes') {
            setTimeout(loadClasses, 100);
        } else if (sectionId === 'customers') {
            setTimeout(refreshCustomerList, 100);
        } else if (sectionId === 'packages') {
            setTimeout(refreshPackageList, 100);
        } else if (sectionId === 'sales') {
            setTimeout(refreshSalesList, 100);
        } else if (sectionId === 'attendance') {
            setTimeout(refreshAttendanceList, 100);
        } else if (sectionId === 'reports') {
            setTimeout(refreshReportsSummary, 100);
        }
    }
    
    // Header is now minimal - no updates needed
}

// Set active menu item
function setActiveMenuItem(activeItem) {
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}


// Update dashboard statistics
function updateStats() {
    // This would typically fetch real data from an API
    // For now, we'll use the sample data to calculate stats
    const stats = {
        instructors: sampleData.instructors.length,
        customers: sampleData.customers.length,
        classes: sampleData.classes.length,
        revenue: calculateMonthlyRevenue()
    };
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('h3').textContent = stats.instructors;
        statCards[1].querySelector('h3').textContent = stats.customers;
        statCards[2].querySelector('h3').textContent = stats.classes;
        statCards[3].querySelector('h3').textContent = stats.revenue;
    }
}

// Calculate monthly revenue (sample calculation)
function calculateMonthlyRevenue() {
    // This is a simplified calculation
    // In a real app, this would come from actual sales data
    return '$4,250';
}

// Handle quick actions
function handleQuickAction(action) {
    const actionMap = {
        'add-instructor': 'instructors',
        'add-customer': 'customers',
        'add-class': 'classes',
        'record-sale': 'sales'
    };
    
    const targetSection = actionMap[action];
    if (targetSection) {
        showSection(targetSection);
        setActiveMenuItem(document.querySelector(`[data-section="${targetSection}"]`));
        
        // Show a notification
        showNotification(`Navigating to ${targetSection} section`);
    }
}

// Handle add actions
function handleAddAction(section) {
    const sectionNames = {
        'instructors': 'instructor',
        'customers': 'customer',
        'classes': 'class',
        'packages': 'package',
        'sales': 'sale',
        'attendance': 'attendance record'
    };
    
    const itemName = sectionNames[section] || 'item';
    showNotification(`Add ${itemName} form would open here`);
    
    // In a real application, this would open a modal or form
    console.log(`Opening add ${itemName} form for section: ${section}`);
}

// Handle edit actions
function handleEditAction(button) {
    const row = button.closest('tr');
    const itemId = row.querySelector('td:first-child').textContent;
    showNotification(`Edit form for ${itemId} would open here`);
    
    // In a real application, this would open an edit modal
    console.log(`Opening edit form for: ${itemId}`);
}

// Handle delete actions
function handleDeleteAction(button) {
    const row = button.closest('tr');
    const itemId = row.querySelector('td:first-child').textContent;
    
    if (confirm(`Are you sure you want to delete ${itemId}?`)) {
        showNotification(`${itemId} has been deleted`);
        
        // In a real application, this would make an API call to delete the item
        console.log(`Deleting: ${itemId}`);
    }
}

// Generate reports
function generateReport(reportType) {
    showNotification(`Generating ${reportType}...`);
    
    // Simulate report generation
    setTimeout(() => {
        showNotification(`${reportType} has been generated and downloaded`);
    }, 2000);
    
    console.log(`Generating report: ${reportType}`);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Add icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle'
    };
    
    const colors = {
        success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        info: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    };
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%) scale(0.8);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 250px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0) scale(1)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%) scale(0.8)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 3000);
}

// Form validation helper
function validateForm(formData) {
    const errors = [];
    
    // Check for required fields
    Object.keys(formData).forEach(key => {
        if (!formData[key] || formData[key].trim() === '') {
            errors.push(`${key} is required`);
        }
    });
    
    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Phone validation
    if (formData.phone && !isValidPhone(formData.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    return errors;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

// Generate unique IDs
function generateId(prefix) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(date));
}

// Local storage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

// Instructor-specific functions
function openAddInstructorModal() {
    const modal = document.getElementById('instructorModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('instructorForm');
    
    modalTitle.textContent = 'Add New Instructor';
    form.reset();
    updateBioCount();
    modal.classList.add('show');
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('firstName').focus();
    }, 100);
}

function filterInstructors() {
    const searchTerm = document.getElementById('instructorSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#instructors tbody tr');
    
    rows.forEach(row => {
        const instructorName = row.querySelector('.instructor-details h4').textContent.toLowerCase();
        const instructorEmail = row.querySelector('.contact-info p').textContent.toLowerCase();
        
        if (instructorName.includes(searchTerm) || instructorEmail.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function handleEditInstructor(button) {
    const row = button.closest('tr');
    const instructorId = row.querySelector('.instructor-id').textContent;
    const instructorName = row.querySelector('.instructor-details h4').textContent;
    
    showNotification(`Edit form for ${instructorName} (${instructorId}) would open here`, 'info');
    console.log(`Opening edit form for instructor: ${instructorId}`);
}

// Edit instructor from table
async function handleEditInstructor(instructorId) {
    try {
        const response = await fetch(`/api/instructors/${instructorId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch instructor details');
        }
        
        const instructor = await response.json();
        openEditInstructorModal(instructor);
    } catch (error) {
        console.error('Error fetching instructor details:', error);
        showNotification('Error loading instructor details for editing', 'error');
    }
}

// Open edit instructor modal with pre-filled data
function openEditInstructorModal(instructor) {
    const modal = document.getElementById('instructorModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('instructorForm');
    
    modalTitle.textContent = 'Edit Instructor';
    form.reset();
    
    // Pre-fill form with instructor data
    document.getElementById('firstName').value = instructor.firstName || '';
    document.getElementById('lastName').value = instructor.lastName || '';
    document.getElementById('email').value = instructor.email || '';
    document.getElementById('phone').value = instructor.phone || '';
    document.getElementById('street').value = instructor.address?.street || '';
    document.getElementById('city').value = instructor.address?.city || '';
    document.getElementById('state').value = instructor.address?.state || '';
    document.getElementById('zipCode').value = instructor.address?.zipCode || '';
    document.getElementById('payRate').value = instructor.payRate || '';
    document.getElementById('preferredCommunication').value = instructor.preferredCommunication || 'email';
    document.getElementById('bio').value = instructor.bio || '';
    document.getElementById('emergencyName').value = instructor.emergencyContact?.name || '';
    document.getElementById('emergencyRelationship').value = instructor.emergencyContact?.relationship || '';
    document.getElementById('emergencyPhone').value = instructor.emergencyContact?.phone || '';
    
    // Pre-select specialties
    const specialtyCheckboxes = document.querySelectorAll('input[name="specialties"]');
    specialtyCheckboxes.forEach(checkbox => {
        checkbox.checked = instructor.specialties && instructor.specialties.includes(checkbox.value);
    });
    
    // Store instructor ID for update
    form.dataset.instructorId = instructor._id;
    form.dataset.isEdit = 'true';
    
    modal.classList.add('show');
    
    setTimeout(() => {
        document.getElementById('firstName').focus();
    }, 100);
}

function handleDeleteInstructor(button) {
    const row = button.closest('tr');
    const instructorId = row.querySelector('.instructor-id').textContent;
    const instructorName = row.querySelector('.instructor-details h4').textContent;
    
    if (confirm(`Are you sure you want to delete ${instructorName} (${instructorId})?`)) {
        showNotification(`${instructorName} has been deleted`, 'success');
        // In a real application, this would make an API call to delete the instructor
        console.log(`Deleting instructor: ${instructorId}`);
    }
}

// Delete instructor from table
async function handleDeleteInstructor(instructorId) {
    if (!confirm('Are you sure you want to delete this instructor? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/instructors/${instructorId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete instructor');
        }
        
        showNotification('Instructor deleted successfully!', 'success');
        
        // Refresh the instructor list
        await refreshInstructorList();
        
    } catch (error) {
        console.error('Error deleting instructor:', error);
        showNotification('Error deleting instructor', 'error');
    }
}

function handleViewInstructor(button) {
    const row = button.closest('tr');
    const instructorId = row.querySelector('.instructor-id').textContent;
    const instructorName = row.querySelector('.instructor-details h4').textContent;
    
    showNotification(`Viewing details for ${instructorName} (${instructorId})`, 'info');
    console.log(`Opening instructor details for: ${instructorId}`);
}

// View instructor details from table
async function handleViewInstructorDetails(instructorId) {
    try {
        const response = await fetch(`/api/instructors/${instructorId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch instructor details');
        }
        
        const instructor = await response.json();
        showInstructorDetailsModal(instructor);
    } catch (error) {
        console.error('Error fetching instructor details:', error);
        showNotification('Error loading instructor details', 'error');
    }
}

// Show instructor details modal
function showInstructorDetailsModal(instructor) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal show" id="instructorDetailsModal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Instructor Details</h2>
                    <button class="modal-close" onclick="closeInstructorDetailsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="instructor-details-content">
                    <div class="instructor-profile">
                        <div class="instructor-avatar-large">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="instructor-basic-info">
                            <h3>${instructor.firstName} ${instructor.lastName}</h3>
                            <p class="instructor-id">ID: ${instructor.instructorId}</p>
                            <span class="status-badge ${instructor.status}">${instructor.status}</span>
                        </div>
                    </div>
                    
                    <div class="details-grid">
                        <div class="detail-section">
                            <h4><i class="fas fa-envelope"></i> Contact Information</h4>
                            <div class="detail-item">
                                <label>Email:</label>
                                <span>${instructor.email}</span>
                            </div>
                            <div class="detail-item">
                                <label>Phone:</label>
                                <span>${instructor.phone}</span>
                            </div>
                            <div class="detail-item">
                                <label>Preferred Communication:</label>
                                <span>${instructor.preferredCommunication}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-map-marker-alt"></i> Address</h4>
                            <div class="detail-item">
                                <label>Street:</label>
                                <span>${instructor.address.street}</span>
                            </div>
                            <div class="detail-item">
                                <label>City:</label>
                                <span>${instructor.address.city}</span>
                            </div>
                            <div class="detail-item">
                                <label>State:</label>
                                <span>${instructor.address.state}</span>
                            </div>
                            <div class="detail-item">
                                <label>ZIP Code:</label>
                                <span>${instructor.address.zipCode}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-briefcase"></i> Professional Information</h4>
                            <div class="detail-item">
                                <label>Pay Rate:</label>
                                <span>$${instructor.payRate}/class</span>
                            </div>
                            <div class="detail-item">
                                <label>Experience:</label>
                                <span>${instructor.experience?.years || 0} years</span>
                            </div>
                            <div class="detail-item">
                                <label>Date Joined:</label>
                                <span>${new Date(instructor.dateJoined).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-star"></i> Specialties</h4>
                            <div class="specialties-display">
                                ${instructor.specialties && instructor.specialties.length > 0 
                                    ? instructor.specialties.map(specialty => 
                                        `<span class="specialty-tag">${specialty}</span>`
                                      ).join('')
                                    : '<span class="text-muted">No specialties listed</span>'
                                }
                            </div>
                        </div>
                        
                        ${instructor.bio ? `
                        <div class="detail-section full-width">
                            <h4><i class="fas fa-info-circle"></i> Bio</h4>
                            <p class="bio-text">${instructor.bio}</p>
                        </div>
                        ` : ''}
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-phone-alt"></i> Emergency Contact</h4>
                            <div class="detail-item">
                                <label>Name:</label>
                                <span>${instructor.emergencyContact?.name || 'Not provided'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Relationship:</label>
                                <span>${instructor.emergencyContact?.relationship || 'Not provided'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Phone:</label>
                                <span>${instructor.emergencyContact?.phone || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="closeInstructorDetailsModal()">Close</button>
                        <button class="btn btn-primary" onclick="handleEditInstructor('${instructor._id}'); closeInstructorDetailsModal();">
                            <i class="fas fa-edit"></i> Edit Instructor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close instructor details modal
function closeInstructorDetailsModal() {
    const modal = document.getElementById('instructorDetailsModal');
    if (modal) {
        modal.remove();
    }
}

// Toggle instructor status
async function toggleInstructorStatus(instructorId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
        const response = await fetch(`/api/instructors/${instructorId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update instructor status');
        }
        
        const result = await response.json();
        showNotification(`Instructor status updated to ${newStatus}`, 'success');
        
        // Refresh the instructor list to show updated status
        await refreshInstructorList();
        
    } catch (error) {
        console.error('Error updating instructor status:', error);
        showNotification('Error updating instructor status', 'error');
    }
}

// Modal functionality
function setupModalEventListeners() {
    const modal = document.getElementById('instructorModal');
    const closeModal = document.getElementById('closeModal');
    const cancelForm = document.getElementById('cancelForm');
    
    // Close modal events
    closeModal.addEventListener('click', closeInstructorModal);
    cancelForm.addEventListener('click', closeInstructorModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeInstructorModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeInstructorModal();
        }
    });
}

function closeInstructorModal() {
    const modal = document.getElementById('instructorModal');
    modal.classList.remove('show');
}

// Form functionality
function setupFormEventListeners() {
    const form = document.getElementById('instructorForm');
    const bioTextarea = document.getElementById('bio');
    
    // Form submission
    form.addEventListener('submit', handleInstructorFormSubmit);
    
    // Bio character count
    bioTextarea.addEventListener('input', updateBioCount);
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhoneNumber);
    });
}

function updateBioCount() {
    const bioTextarea = document.getElementById('bio');
    const bioCount = document.getElementById('bioCount');
    const currentLength = bioTextarea.value.length;
    bioCount.textContent = currentLength;
    
    if (currentLength > 450) {
        bioCount.style.color = '#dc2626';
    } else if (currentLength > 400) {
        bioCount.style.color = '#f59e0b';
    } else {
        bioCount.style.color = '#6b7280';
    }
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    e.target.value = value;
}

async function handleInstructorFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitForm');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        // Convert FormData to object
        const instructorData = {};
        for (let [key, value] of formData.entries()) {
            console.log(`Processing field: ${key} = ${value}`); // Debug log
            if (key === 'specialties') {
                if (!instructorData.specialties) instructorData.specialties = [];
                instructorData.specialties.push(value);
            } else if (key.includes('.')) {
                const [parent, child] = key.split('.');
                if (!instructorData[parent]) instructorData[parent] = {};
                instructorData[parent][child] = value;
            } else {
                instructorData[key] = value;
            }
        }
        
        // Convert payRate to number
        if (instructorData.payRate) {
            instructorData.payRate = parseFloat(instructorData.payRate);
        }
        
        // Debug: Log the data being sent
        console.log('Form data being sent:', instructorData);
        console.log('Address object:', instructorData.address);
        console.log('Emergency contact object:', instructorData.emergencyContact);
        
        // Check if this is an edit or create operation
        const isEdit = form.dataset.isEdit === 'true';
        const instructorId = form.dataset.instructorId;
        
        let result;
        if (isEdit && instructorId) {
            // Update existing instructor
            result = await updateInstructorToAPI(instructorId, instructorData);
            if (result.success) {
                showNotification(`Instructor ${result.data.instructorId} updated successfully!`, 'success');
            }
        } else {
            // Create new instructor
            result = await saveInstructorToAPI(instructorData);
            if (result.success) {
                showNotification(`Instructor ${result.data.instructorId} added successfully!`, 'success');
            }
        }
        
        if (result.success) {
            closeInstructorModal();
            
            // Clear form data attributes
            delete form.dataset.instructorId;
            delete form.dataset.isEdit;
            
            // Refresh the instructor list and stats
            await refreshInstructorList();
            console.log('Instructor saved:', result.data);
        } else {
            throw new Error(result.error || 'Failed to save instructor');
        }
        
    } catch (error) {
        console.error('Error saving instructor:', error);
        showNotification('Error saving instructor. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Instructor';
    }
}

// Real API call to backend
async function saveInstructorToAPI(data) {
    try {
        const response = await fetch('/api/instructors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to save instructor');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Update instructor API call
async function updateInstructorToAPI(instructorId, data) {
    try {
        const response = await fetch(`/api/instructors/${instructorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to update instructor');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Load instructors from API
async function loadInstructorsFromAPI() {
    try {
        const response = await fetch('/api/instructors');
        if (response.ok) {
            const instructors = await response.json();
            console.log('Loaded instructors from API:', instructors);
            return instructors;
        }
    } catch (error) {
        console.error('Error loading instructors:', error);
    }
    return [];
}

// Refresh instructor list in the table
async function refreshInstructorList() {
    const refreshBtn = document.getElementById('refreshInstructorsBtn');
    const originalIcon = refreshBtn.innerHTML;
    
    try {
        // Show loading state
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        refreshBtn.disabled = true;
        
        const instructors = await loadInstructorsFromAPI();
        renderInstructorTable(instructors);
        updateInstructorStats(instructors);
        showNotification('Instructor list refreshed', 'success');
    } catch (error) {
        console.error('Error refreshing instructor list:', error);
        showNotification('Error refreshing instructor list', 'error');
    } finally {
        // Restore button state
        refreshBtn.innerHTML = originalIcon;
        refreshBtn.disabled = false;
    }
}

// Render instructor table with data
function renderInstructorTable(instructors) {
    const tableBody = document.querySelector('#instructors tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (instructors.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #6b7280;">
                    No instructors found. Add your first instructor!
                </td>
            </tr>
        `;
        return;
    }
    
    instructors.forEach(instructor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${instructor.instructorId}</td>
            <td>
                <div class="instructor-info">
                    <div class="instructor-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="instructor-details">
                        <div class="instructor-name">${instructor.firstName} ${instructor.lastName}</div>
                        <div class="instructor-id">ID: ${instructor.instructorId}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="contact-info">
                    <div><i class="fas fa-envelope"></i> ${instructor.email}</div>
                    <div><i class="fas fa-phone"></i> ${instructor.phone}</div>
                </div>
            </td>
            <td>
                <div class="specialties">
                    ${instructor.specialties && instructor.specialties.length > 0 
                        ? instructor.specialties.map(specialty => 
                            `<span class="specialty-tag">${specialty}</span>`
                          ).join('')
                        : '<span class="text-muted">No specialties</span>'
                    }
                </div>
            </td>
            <td>
                <div class="class-info">
                    <div><i class="fas fa-calendar"></i> 0 classes</div>
                    <div><i class="fas fa-dollar-sign"></i> $${instructor.payRate}/hour</div>
                </div>
            </td>
            <td>
                <span class="status-badge ${instructor.status} clickable-status" onclick="toggleInstructorStatus('${instructor._id}', '${instructor.status}')" title="Click to toggle status">
                    ${instructor.status}
                </span>
            </td>
            <td class="action-buttons">
                <button class="btn-icon edit" onclick="handleEditInstructor('${instructor._id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="handleDeleteInstructor('${instructor._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn-icon view" onclick="handleViewInstructorDetails('${instructor._id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update instructor statistics
async function updateInstructorStats(instructors) {
    try {
        // Calculate total instructors
        const totalInstructors = instructors.length;
        document.getElementById('totalInstructors').textContent = totalInstructors;
        
        // Calculate classes this week (get from classes API)
        const classesThisWeek = await getClassesThisWeek();
        document.getElementById('classesThisWeek').textContent = classesThisWeek;
        
        // Calculate average rating (simulate for now - in real app, this would come from reviews)
        const averageRating = calculateAverageRating(instructors);
        document.getElementById('averageRating').textContent = averageRating.toFixed(1);
        
        // Calculate monthly payroll
        const monthlyPayroll = calculateMonthlyPayroll(instructors);
        document.getElementById('monthlyPayroll').textContent = formatCurrency(monthlyPayroll);
        
    } catch (error) {
        console.error('Error updating instructor stats:', error);
    }
}

// Get classes this week from the classes API
async function getClassesThisWeek() {
    try {
        const response = await fetch('/api/classes');
        if (response.ok) {
            const classes = await response.json();
            
            // Calculate classes for current week
            const now = new Date();
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
            
            const classesThisWeek = classes.filter(cls => {
                const classDate = new Date(cls.createdAt);
                return classDate >= startOfWeek && classDate <= endOfWeek;
            }).length;
            
            return classesThisWeek;
        }
    } catch (error) {
        console.error('Error getting classes this week:', error);
    }
    return 0;
}

// Calculate average rating (simulated - in real app, this would come from reviews)
function calculateAverageRating(instructors) {
    if (instructors.length === 0) return 0;
    
    // Simulate ratings based on instructor data
    let totalRating = 0;
    instructors.forEach(instructor => {
        // Simulate rating based on specialties and experience
        let rating = 4.0; // Base rating
        
        // Add points for specialties
        if (instructor.specialties && instructor.specialties.length > 0) {
            rating += Math.min(instructor.specialties.length * 0.2, 0.8);
        }
        
        // Add points for bio (more detailed bio = higher rating)
        if (instructor.bio && instructor.bio.length > 50) {
            rating += 0.3;
        }
        
        // Add some randomness
        rating += (Math.random() - 0.5) * 0.4;
        
        // Keep rating between 3.0 and 5.0
        rating = Math.max(3.0, Math.min(5.0, rating));
        
        totalRating += rating;
    });
    
    return totalRating / instructors.length;
}

// Calculate monthly payroll
function calculateMonthlyPayroll(instructors) {
    if (instructors.length === 0) return 0;
    
    // Assume each instructor teaches 20 classes per month on average
    const classesPerMonth = 20;
    const totalPayroll = instructors.reduce((total, instructor) => {
        const payRate = instructor.payRate || 0;
        return total + (payRate * classesPerMonth);
    }, 0);
    
    return totalPayroll;
}

// ===== CLASSES SECTION FUNCTIONS =====

// Load classes from API
async function loadClassesFromAPI() {
    try {
        const response = await fetch('/api/classes/schedule');
        if (response.ok) {
            const schedule = await response.json();
            console.log('Loaded classes from API:', schedule);
            return schedule;
        }
    } catch (error) {
        console.error('Error loading classes:', error);
    }
    return {};
}

// Render weekly schedule
function renderWeeklySchedule(schedule) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    days.forEach(day => {
        const dayContainer = document.getElementById(`${day.toLowerCase()}Classes`);
        if (dayContainer) {
            dayContainer.innerHTML = '';
            
            if (schedule[day] && schedule[day].length > 0) {
                schedule[day].forEach(cls => {
                    const classElement = createClassElement(cls);
                    dayContainer.appendChild(classElement);
                });
            }
        }
    });
}

// Create class element for schedule view
function createClassElement(cls) {
    const classDiv = document.createElement('div');
    classDiv.className = `class-item ${cls.level.toLowerCase().replace(' ', '-')}`;
    
    const capacityPercentage = (cls.currentEnrollment / cls.maxCapacity) * 100;
    const capacityClass = capacityPercentage >= 90 ? 'danger' : capacityPercentage >= 75 ? 'warning' : '';
    
    classDiv.innerHTML = `
        <div class="class-time">${formatTime(cls.startTime)} - ${formatTime(cls.endTime)}</div>
        <div class="class-name">${cls.name}</div>
        <div class="class-instructor">${cls.instructor.firstName} ${cls.instructor.lastName}</div>
        <div class="class-level ${cls.level.toLowerCase().replace(' ', '-')}">${cls.level}</div>
        <div class="class-capacity">
            <span>${cls.currentEnrollment}/${cls.maxCapacity}</span>
            <div class="capacity-bar">
                <div class="capacity-fill ${capacityClass}" style="width: ${capacityPercentage}%"></div>
            </div>
        </div>
    `;
    
    classDiv.addEventListener('click', () => handleViewClass(cls));
    return classDiv;
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Handle class view
function handleViewClass(cls) {
    showNotification(`Viewing class: ${cls.name}`, 'info');
    console.log('Viewing class:', cls);
}

// Handle class search
function filterClasses() {
    const searchTerm = document.getElementById('classSearch').value.toLowerCase();
    const classItems = document.querySelectorAll('.class-item');
    
    classItems.forEach(item => {
        const className = item.querySelector('.class-name').textContent.toLowerCase();
        const instructor = item.querySelector('.class-instructor').textContent.toLowerCase();
        const level = item.querySelector('.class-level').textContent.toLowerCase();
        
        const matches = className.includes(searchTerm) || 
                       instructor.includes(searchTerm) || 
                       level.includes(searchTerm);
        
        item.style.display = matches ? 'block' : 'none';
    });
}

// Toggle between schedule and list view
async function toggleClassView(view) {
    const scheduleView = document.getElementById('scheduleView');
    const listView = document.getElementById('listView');
    const scheduleBtn = document.getElementById('scheduleViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    
    if (view === 'schedule') {
        scheduleView.style.display = 'block';
        listView.style.display = 'none';
        scheduleBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        scheduleView.style.display = 'none';
        listView.style.display = 'block';
        listBtn.classList.add('active');
        scheduleBtn.classList.remove('active');
        
        // Load and render list view
        await renderClassListView();
    }
}

// Setup classes event listeners
function setupClassesEventListeners() {
    // View toggle buttons
    document.getElementById('scheduleViewBtn').addEventListener('click', () => toggleClassView('schedule'));
    document.getElementById('listViewBtn').addEventListener('click', () => toggleClassView('list'));
    
    // Search functionality
    document.getElementById('classSearch').addEventListener('input', filterClasses);
    
    // Add class button
    document.getElementById('addClassBtn').addEventListener('click', openAddClassModal);
}

// Load and display classes on page load
async function loadClasses() {
    try {
        const schedule = await loadClassesFromAPI();
        renderWeeklySchedule(schedule);
    } catch (error) {
        console.error('Error loading classes:', error);
        showNotification('Error loading classes', 'error');
    }
}

// Render class list view
async function renderClassListView() {
    try {
        const response = await fetch('/api/classes');
        if (!response.ok) {
            throw new Error('Failed to fetch classes');
        }
        
        const classes = await response.json();
        const tableBody = document.getElementById('classesTableBody');
        
        if (classes.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-state">
                        <div class="empty-content">
                            <i class="fas fa-calendar-times"></i>
                            <h3>No Classes Found</h3>
                            <p>Start by adding your first class to the schedule.</p>
                            <button class="btn btn-primary" onclick="openAddClassModal()">
                                <i class="fas fa-plus"></i> Add First Class
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = classes.map(cls => `
            <tr class="class-row" data-class-id="${cls._id}">
                <td>
                    <div class="class-id-badge">${cls.classId}</div>
                </td>
                <td>
                    <div class="class-name-cell">
                        <div class="class-name">${cls.name}</div>
                        <div class="class-description">${cls.description || 'No description'}</div>
                    </div>
                </td>
                <td>
                    <div class="instructor-cell">
                        <div class="instructor-name">${cls.instructor.firstName} ${cls.instructor.lastName}</div>
                    </div>
                </td>
                <td>
                    <div class="day-badge day-${cls.dayOfWeek.toLowerCase()}">${cls.dayOfWeek}</div>
                </td>
                <td>
                    <div class="time-cell">
                        <div class="time-range">${formatTime(cls.startTime)} - ${formatTime(cls.endTime)}</div>
                        <div class="duration">${cls.duration} min</div>
                    </div>
                </td>
                <td>
                    <span class="level-badge level-${cls.level.toLowerCase().replace(' ', '-')}">${cls.level}</span>
                </td>
                <td>
                    <div class="capacity-cell">
                        <div class="capacity-info">
                            <span class="current">${cls.currentEnrollment || 0}</span>
                            <span class="separator">/</span>
                            <span class="max">${cls.maxCapacity}</span>
                        </div>
                        <div class="capacity-bar-small">
                            <div class="capacity-fill-small" style="width: ${((cls.currentEnrollment || 0) / cls.maxCapacity) * 100}%"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${cls.isActive ? 'active' : 'inactive'}">
                        ${cls.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-view" onclick="viewClass('${cls._id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-edit" onclick="editClass('${cls._id}')" title="Edit Class">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteClass('${cls._id}')" title="Delete Class">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error rendering class list:', error);
        showNotification('Error loading class list', 'error');
    }
}

// ===== CLASS FORM FUNCTIONS =====

// Open add class modal
async function openAddClassModal() {
    const modal = document.getElementById('classModal');
    const modalTitle = document.getElementById('classModalTitle');
    const form = document.getElementById('classForm');
    
    modalTitle.textContent = 'Add New Class';
    form.reset();
    
    // Populate instructor dropdown
    await populateInstructorDropdown();
    
    modal.classList.add('show');
    
    setTimeout(() => {
        document.getElementById('className').focus();
    }, 100);
}

// Populate instructor dropdown
async function populateInstructorDropdown() {
    try {
        const instructors = await loadInstructorsFromAPI();
        const instructorSelect = document.getElementById('classInstructor');
        
        // Clear existing options except the first one
        instructorSelect.innerHTML = '<option value="">Select Instructor</option>';
        
        instructors.forEach(instructor => {
            const option = document.createElement('option');
            option.value = instructor._id;
            option.textContent = `${instructor.firstName} ${instructor.lastName} (${instructor.instructorId})`;
            instructorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading instructors for dropdown:', error);
        showNotification('Error loading instructors', 'error');
    }
}

// Setup class modal event listeners
function setupClassModalEventListeners() {
    const modal = document.getElementById('classModal');
    const closeModal = document.getElementById('closeClassModal');
    const cancelForm = document.getElementById('cancelClassForm');
    
    closeModal.addEventListener('click', closeClassModal);
    cancelForm.addEventListener('click', closeClassModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeClassModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeClassModal();
        }
    });
}

// Close class modal
function closeClassModal() {
    const modal = document.getElementById('classModal');
    modal.classList.remove('show');
}

// Setup class form event listeners
function setupClassFormEventListeners() {
    const form = document.getElementById('classForm');
    form.addEventListener('submit', handleClassFormSubmit);
    
    // Auto-calculate duration when times change
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    
    startTimeInput.addEventListener('change', calculateDuration);
    endTimeInput.addEventListener('change', calculateDuration);
}

// Calculate class duration
function calculateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);
        
        if (end < start) {
            end.setDate(end.getDate() + 1); // Handle overnight classes
        }
        
        const duration = Math.round((end - start) / (1000 * 60)); // Convert to minutes
        console.log(`Class duration: ${duration} minutes`);
    }
}

// Handle class form submission
async function handleClassFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitClassForm');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        // Convert FormData to object
        const classData = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'equipment') {
                if (!classData.equipment) classData.equipment = [];
                classData.equipment.push(value);
            } else if (key === 'isActive') {
                classData[key] = value === 'true';
            } else if (key === 'maxCapacity' || key === 'price') {
                classData[key] = parseFloat(value);
            } else {
                classData[key] = value;
            }
        }
        
        // Debug: Log the data being sent
        console.log('Class data being sent:', classData);
        
        // Make real API call to backend
        const result = await saveClassToAPI(classData);
        
        if (result.success) {
            showNotification(`Class ${result.data.classId} added successfully!`, 'success');
            closeClassModal();
            
            // Refresh the class list and schedule
            await loadClasses();
            await renderClassListView();
            console.log('New class saved:', result.data);
        } else {
            throw new Error(result.error || 'Failed to save class');
        }
        
    } catch (error) {
        console.error('Error saving class:', error);
        showNotification('Error saving class. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Class';
    }
}

// Save class to API
async function saveClassToAPI(data) {
    try {
        const response = await fetch('/api/classes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to save class');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// View class details
function viewClass(classId) {
    showNotification('View class details functionality coming soon!', 'info');
    console.log('Viewing class:', classId);
}

// Edit class
function editClass(classId) {
    showNotification('Edit class functionality coming soon!', 'info');
    console.log('Editing class:', classId);
}

// Delete class
async function deleteClass(classId) {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/classes/${classId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete class');
        }
        
        showNotification('Class deleted successfully!', 'success');
        
        // Refresh both views
        await loadClasses();
        await renderClassListView();
        
    } catch (error) {
        console.error('Error deleting class:', error);
        showNotification('Error deleting class', 'error');
    }
}

// Setup customer modal event listeners
function setupCustomerModalEventListeners() {
    // Close modal buttons
    const closeModalBtn = document.getElementById('closeCustomerModal');
    const cancelBtn = document.getElementById('cancelCustomerForm');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCustomerModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeCustomerModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('customerModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCustomerModal();
            }
        });
    }
    
    // Add customer button
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', openAddCustomerModal);
    }
}

// Setup customer form event listeners
function setupCustomerFormEventListeners() {
    const form = document.getElementById('customerForm');
    if (form) {
        form.addEventListener('submit', handleCustomerFormSubmit);
    }
    
    // Show/hide injuries group based on checkbox
    const hasInjuriesCheckbox = document.getElementById('hasInjuries');
    const injuriesGroup = document.getElementById('injuriesGroup');
    
    if (hasInjuriesCheckbox && injuriesGroup) {
        hasInjuriesCheckbox.addEventListener('change', function() {
            injuriesGroup.style.display = this.checked ? 'block' : 'none';
        });
    }
}

// Close customer modal
function closeCustomerModal() {
    const modal = document.getElementById('customerModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// ==================== PACKAGE FUNCTIONS ====================

// Setup package modal event listeners
function setupPackageModalEventListeners() {
    // Close modal buttons
    const closeModalBtn = document.getElementById('closePackageModal');
    const cancelBtn = document.getElementById('cancelPackageForm');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePackageModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closePackageModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('packageModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePackageModal();
            }
        });
    }
    
    // Add package button
    const addPackageBtn = document.getElementById('addPackageBtn');
    if (addPackageBtn) {
        addPackageBtn.addEventListener('click', openAddPackageModal);
    }
}

// Setup package form event listeners
function setupPackageFormEventListeners() {
    const form = document.getElementById('packageForm');
    if (form) {
        form.addEventListener('submit', handlePackageFormSubmit);
    }
}

// Close package modal
function closePackageModal() {
    const modal = document.getElementById('packageModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Load packages from API
async function loadPackagesFromAPI() {
    try {
        const response = await fetch('/api/packages');
        if (!response.ok) {
            throw new Error('Failed to fetch packages');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading packages:', error);
        return [];
    }
}

// Render package cards
function renderPackageCards(packages) {
    const cardsContainer = document.querySelector('#packageCardsView');
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';
    
    if (packages.length === 0) {
        cardsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box"></i>
                <h3>No packages found</h3>
                <p>Add your first package to get started!</p>
                <button class="btn btn-primary" onclick="openAddPackageModal()">
                    <i class="fas fa-plus"></i> Add Package
                </button>
            </div>
        `;
        return;
    }
    
    packages.forEach(pkg => {
        const card = document.createElement('div');
        card.className = 'package-card';
        
        const savings = pkg.originalPrice && pkg.price ? pkg.originalPrice - pkg.price : 0;
        const savingsPercentage = pkg.originalPrice && pkg.price ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100) : 0;
        const pricePerClass = pkg.numberOfClasses > 0 ? Math.round((pkg.price / pkg.numberOfClasses) * 100) / 100 : 0;
        
        card.innerHTML = `
            <div class="package-header">
                <h3>${pkg.name}</h3>
                <div class="package-badges">
                    ${pkg.isPopular ? '<span class="package-badge popular">Popular</span>' : ''}
                    ${pkg.isFeatured ? '<span class="package-badge featured">Featured</span>' : ''}
                    <span class="package-badge status ${pkg.status}">${pkg.status}</span>
                </div>
            </div>
            <div class="package-details">
                <div class="package-price">
                    <span class="current-price">$${pkg.price}</span>
                    ${pkg.originalPrice && pkg.originalPrice > pkg.price ? 
                        `<span class="original-price">$${pkg.originalPrice}</span>
                         <span class="savings">Save $${savings} (${savingsPercentage}%)</span>` : ''
                    }
                </div>
                <div class="package-info">
                    <p><strong>Classes:</strong> ${pkg.numberOfClasses === 999 ? 'Unlimited' : pkg.numberOfClasses}</p>
                    <p><strong>Validity:</strong> ${pkg.validityPeriod} days</p>
                    <p><strong>Price per class:</strong> $${pricePerClass}</p>
                    <p><strong>Type:</strong> ${pkg.type}</p>
                </div>
                ${pkg.benefits && pkg.benefits.length > 0 ? `
                    <div class="package-benefits">
                        <strong>Benefits:</strong>
                        <ul>
                            ${pkg.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
            <div class="package-actions">
                <button class="btn btn-sm btn-primary" onclick="handleViewPackageDetails('${pkg._id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm btn-secondary" onclick="handleEditPackage('${pkg._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="handleDeletePackage('${pkg._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        cardsContainer.appendChild(card);
    });
}

// Render package table
function renderPackageTable(packages) {
    const tableBody = document.querySelector('#packagesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (packages.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #6b7280;">
                    No packages found. Add your first package!
                </td>
            </tr>
        `;
        return;
    }
    
    packages.forEach(pkg => {
        const row = document.createElement('tr');
        const pricePerClass = pkg.numberOfClasses > 0 ? Math.round((pkg.price / pkg.numberOfClasses) * 100) / 100 : 0;
        
        row.innerHTML = `
            <td>${pkg.packageId}</td>
            <td>
                <div class="package-info">
                    <div class="package-name">${pkg.name}</div>
                    <div class="package-description">${pkg.description || 'No description'}</div>
                </div>
            </td>
            <td>
                <span class="package-type-badge ${pkg.type.toLowerCase().replace(' ', '-')}">${pkg.type}</span>
            </td>
            <td>
                <div class="class-info">
                    <div>${pkg.numberOfClasses === 999 ? 'Unlimited' : pkg.numberOfClasses} classes</div>
                    <div class="price-per-class">$${pricePerClass}/class</div>
                </div>
            </td>
            <td>
                <div class="price-info">
                    <div class="current-price">$${pkg.price}</div>
                    ${pkg.originalPrice && pkg.originalPrice > pkg.price ? 
                        `<div class="original-price">$${pkg.originalPrice}</div>` : ''
                    }
                </div>
            </td>
            <td>
                <div class="validity-info">
                    <div>${pkg.validityPeriod} days</div>
                </div>
            </td>
            <td>
                <span class="status-badge ${pkg.status} clickable-status" onclick="togglePackageStatus('${pkg._id}', '${pkg.status}')" title="Click to toggle status">
                    ${pkg.status}
                </span>
            </td>
            <td class="action-buttons">
                <button class="btn-icon view" onclick="handleViewPackageDetails('${pkg._id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit" onclick="handleEditPackage('${pkg._id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="handleDeletePackage('${pkg._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update package statistics
async function updatePackageStats(packages) {
    try {
        // Calculate total packages
        const totalPackages = packages.length;
        document.getElementById('totalPackages').textContent = totalPackages;
        
        // Calculate active packages
        const activePackages = packages.filter(p => p.status === 'active').length;
        document.getElementById('activePackages').textContent = activePackages;
        
        // Calculate total sales
        const totalSales = packages.reduce((total, pkg) => total + (pkg.salesData?.totalSold || 0), 0);
        document.getElementById('totalSales').textContent = totalSales;
        
        // Calculate total revenue
        const totalRevenue = packages.reduce((total, pkg) => total + (pkg.salesData?.totalRevenue || 0), 0);
        document.getElementById('packageRevenue').textContent = `$${totalRevenue}`;
        
    } catch (error) {
        console.error('Error updating package stats:', error);
    }
}

// Refresh package list
async function refreshPackageList() {
    const refreshBtn = document.getElementById('refreshPackagesBtn');
    const originalContent = refreshBtn.innerHTML;
    
    // Show loading state
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    refreshBtn.disabled = true;
    
    try {
        const packages = await loadPackagesFromAPI();
        renderPackageCards(packages);
        renderPackageTable(packages);
        await updatePackageStats(packages);
    } catch (error) {
        console.error('Error refreshing package list:', error);
        showNotification('Error loading packages', 'error');
    } finally {
        // Restore button state
        refreshBtn.innerHTML = originalContent;
        refreshBtn.disabled = false;
    }
}

// Toggle package view
function togglePackageView(view) {
    const cardView = document.getElementById('packageCardsView');
    const listView = document.getElementById('packageListView');
    const cardBtn = document.getElementById('packageCardView');
    const listBtn = document.getElementById('packageListView');
    
    if (view === 'cards') {
        cardView.style.display = 'grid';
        listView.style.display = 'none';
        cardBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        cardView.style.display = 'none';
        listView.style.display = 'block';
        listBtn.classList.add('active');
        cardBtn.classList.remove('active');
    }
}

// Package form functions
function openAddPackageModal() {
    const modal = document.getElementById('packageModal');
    const modalTitle = document.getElementById('packageModalTitle');
    const form = document.getElementById('packageForm');
    
    modalTitle.textContent = 'Add New Package';
    form.reset();
    
    // Clear form data attributes
    delete form.dataset.packageId;
    delete form.dataset.isEdit;
    
    modal.classList.add('show');
    
    setTimeout(() => {
        document.getElementById('packageName').focus();
    }, 100);
}

async function handlePackageFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitPackageForm');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        // Convert FormData to object
        const packageData = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'applicableClasses') {
                if (!packageData.applicableClasses) packageData.applicableClasses = [];
                packageData.applicableClasses.push(value);
            } else if (key === 'benefits') {
                packageData.benefits = value.split('\n').filter(b => b.trim());
            } else {
                packageData[key] = value;
            }
        }
        
        // Handle restrictions
        packageData.restrictions = {
            maxPerDay: packageData.maxPerDay || 1,
            blackoutDates: [],
            timeRestrictions: {
                startTime: packageData.startTime || '06:00',
                endTime: packageData.endTime || '22:00'
            }
        };
        
        // Clean up the data
        delete packageData.maxPerDay;
        delete packageData.startTime;
        delete packageData.endTime;
        
        // Check if this is an edit or create operation
        const isEdit = form.dataset.isEdit === 'true';
        const packageId = form.dataset.packageId;
        
        let result;
        if (isEdit && packageId) {
            // Update existing package
            result = await updatePackageToAPI(packageId, packageData);
            if (result.success) {
                showNotification(`Package ${result.data.packageId} updated successfully!`, 'success');
            }
        } else {
            // Create new package
            result = await savePackageToAPI(packageData);
            if (result.success) {
                showNotification(`Package ${result.data.packageId} added successfully!`, 'success');
            }
        }
        
        if (result.success) {
            closePackageModal();
            
            // Clear form data attributes
            delete form.dataset.packageId;
            delete form.dataset.isEdit;
            
            // Refresh the package list and stats
            await refreshPackageList();
        } else {
            throw new Error(result.error || 'Failed to save package');
        }
        
    } catch (error) {
        console.error('Error saving package:', error);
        showNotification('Error saving package. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Package';
    }
}

async function savePackageToAPI(data) {
    try {
        const response = await fetch('/api/packages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to save package');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function updatePackageToAPI(packageId, data) {
    try {
        const response = await fetch(`/api/packages/${packageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to update package');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// View package details
async function handleViewPackageDetails(packageId) {
    try {
        const response = await fetch(`/api/packages/${packageId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch package details');
        }
        
        const package = await response.json();
        showPackageDetailsModal(package);
    } catch (error) {
        console.error('Error fetching package details:', error);
        showNotification('Error loading package details', 'error');
    }
}

// Show package details modal
function showPackageDetailsModal(pkg) {
    const savings = pkg.originalPrice && pkg.price ? pkg.originalPrice - pkg.price : 0;
    const savingsPercentage = pkg.originalPrice && pkg.price ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100) : 0;
    const pricePerClass = pkg.numberOfClasses > 0 ? Math.round((pkg.price / pkg.numberOfClasses) * 100) / 100 : 0;
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal show" id="packageDetailsModal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Package Details</h2>
                    <button class="modal-close" onclick="closePackageDetailsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="package-details-content">
                    <div class="package-profile">
                        <div class="package-header">
                            <h3>${pkg.name}</h3>
                            <div class="package-badges">
                                ${pkg.isPopular ? '<span class="package-badge popular">Popular</span>' : ''}
                                ${pkg.isFeatured ? '<span class="package-badge featured">Featured</span>' : ''}
                                <span class="package-badge status ${pkg.status}">${pkg.status}</span>
                            </div>
                        </div>
                        <p class="package-id">ID: ${pkg.packageId}</p>
                    </div>
                    
                    <div class="details-grid">
                        <div class="detail-section">
                            <h4><i class="fas fa-info-circle"></i> Package Information</h4>
                            <div class="detail-item">
                                <label>Type:</label>
                                <span>${pkg.type}</span>
                            </div>
                            <div class="detail-item">
                                <label>Description:</label>
                                <span>${pkg.description || 'No description'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Number of Classes:</label>
                                <span>${pkg.numberOfClasses === 999 ? 'Unlimited' : pkg.numberOfClasses}</span>
                            </div>
                            <div class="detail-item">
                                <label>Validity Period:</label>
                                <span>${pkg.validityPeriod} days</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-dollar-sign"></i> Pricing</h4>
                            <div class="detail-item">
                                <label>Current Price:</label>
                                <span>$${pkg.price}</span>
                            </div>
                            ${pkg.originalPrice && pkg.originalPrice > pkg.price ? `
                                <div class="detail-item">
                                    <label>Original Price:</label>
                                    <span>$${pkg.originalPrice}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Savings:</label>
                                    <span>$${savings} (${savingsPercentage}%)</span>
                                </div>
                            ` : ''}
                            <div class="detail-item">
                                <label>Price per Class:</label>
                                <span>$${pricePerClass}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-calendar"></i> Applicable Classes</h4>
                            <div class="detail-item">
                                <label>Classes:</label>
                                <span>${pkg.applicableClasses ? pkg.applicableClasses.join(', ') : 'All Classes'}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-gift"></i> Benefits</h4>
                            <div class="detail-item">
                                <label>Benefits:</label>
                                <ul>
                                    ${pkg.benefits && pkg.benefits.length > 0 ? 
                                        pkg.benefits.map(benefit => `<li>${benefit}</li>`).join('') : 
                                        '<li>No benefits listed</li>'
                                    }
                                </ul>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-chart-bar"></i> Sales Data</h4>
                            <div class="detail-item">
                                <label>Total Sold:</label>
                                <span>${pkg.salesData?.totalSold || 0}</span>
                            </div>
                            <div class="detail-item">
                                <label>Total Revenue:</label>
                                <span>$${pkg.salesData?.totalRevenue || 0}</span>
                            </div>
                            <div class="detail-item">
                                <label>Last Sold:</label>
                                <span>${pkg.salesData?.lastSold ? new Date(pkg.salesData.lastSold).toLocaleDateString() : 'Never'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="closePackageDetailsModal()">Close</button>
                        <button class="btn btn-primary" onclick="handleEditPackage('${pkg._id}'); closePackageDetailsModal();">
                            <i class="fas fa-edit"></i> Edit Package
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close package details modal
function closePackageDetailsModal() {
    const modal = document.getElementById('packageDetailsModal');
    if (modal) {
        modal.remove();
    }
}

// Edit package
async function handleEditPackage(packageId) {
    try {
        const response = await fetch(`/api/packages/${packageId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch package details');
        }
        
        const package = await response.json();
        openEditPackageModal(package);
    } catch (error) {
        console.error('Error fetching package details:', error);
        showNotification('Error loading package details for editing', 'error');
    }
}

// Open edit package modal with pre-filled data
function openEditPackageModal(pkg) {
    const modal = document.getElementById('packageModal');
    const modalTitle = document.getElementById('packageModalTitle');
    const form = document.getElementById('packageForm');
    
    modalTitle.textContent = 'Edit Package';
    form.reset();
    
    // Pre-fill form with package data
    document.getElementById('packageName').value = pkg.name || '';
    document.getElementById('packageType').value = pkg.type || 'Class Package';
    document.getElementById('packageDescription').value = pkg.description || '';
    document.getElementById('numberOfClasses').value = pkg.numberOfClasses || 1;
    document.getElementById('packagePrice').value = pkg.price || 0;
    document.getElementById('originalPrice').value = pkg.originalPrice || '';
    document.getElementById('validityPeriod').value = pkg.validityPeriod || 30;
    document.getElementById('maxPerDay').value = pkg.restrictions?.maxPerDay || 1;
    document.getElementById('startTime').value = pkg.restrictions?.timeRestrictions?.startTime || '06:00';
    document.getElementById('endTime').value = pkg.restrictions?.timeRestrictions?.endTime || '22:00';
    document.getElementById('isPopular').checked = pkg.isPopular || false;
    document.getElementById('isFeatured').checked = pkg.isFeatured || false;
    document.getElementById('packageTerms').value = pkg.terms || '';
    document.getElementById('packageNotes').value = pkg.notes || '';
    document.getElementById('packageBenefits').value = pkg.benefits ? pkg.benefits.join('\n') : '';
    
    // Handle applicable classes
    const applicableClassesSelect = document.getElementById('applicableClasses');
    if (pkg.applicableClasses && pkg.applicableClasses.length > 0) {
        Array.from(applicableClassesSelect.options).forEach(option => {
            option.selected = pkg.applicableClasses.includes(option.value);
        });
    }
    
    // Store package ID for update
    form.dataset.packageId = pkg._id;
    form.dataset.isEdit = 'true';
    
    modal.classList.add('show');
    
    setTimeout(() => {
        document.getElementById('packageName').focus();
    }, 100);
}

// Delete package
async function handleDeletePackage(packageId) {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/packages/${packageId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete package');
        }
        
        showNotification('Package deleted successfully!', 'success');
        
        // Refresh the package list
        await refreshPackageList();
        
    } catch (error) {
        console.error('Error deleting package:', error);
        showNotification('Error deleting package', 'error');
    }
}

// Toggle package status
async function togglePackageStatus(packageId, currentStatus) {
    const statusOptions = ['active', 'inactive', 'discontinued'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const newStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    try {
        const response = await fetch(`/api/packages/${packageId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update package status');
        }
        
        showNotification(`Package status updated to ${newStatus}`, 'success');
        
        // Refresh the package list
        await refreshPackageList();
        
    } catch (error) {
        console.error('Error updating package status:', error);
        showNotification('Error updating package status', 'error');
    }
}

// ==================== SALES FUNCTIONS ====================

// Setup sales modal event listeners
function setupSalesModalEventListeners() {
    // Close modal buttons
    const closeModalBtn = document.getElementById('closeSaleModal');
    const cancelBtn = document.getElementById('cancelSaleForm');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeSaleModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeSaleModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('saleModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSaleModal();
            }
        });
    }
    
    // Record sale button
    const recordSaleBtn = document.getElementById('recordSaleBtn');
    if (recordSaleBtn) {
        recordSaleBtn.addEventListener('click', openRecordSaleModal);
    }
}

// Setup sales form event listeners
function setupSalesFormEventListeners() {
    const form = document.getElementById('saleForm');
    if (form) {
        form.addEventListener('submit', handleSaleFormSubmit);
    }
    
    // Customer selection change
    const customerSelect = document.getElementById('saleCustomer');
    if (customerSelect) {
        customerSelect.addEventListener('change', handleCustomerSelection);
    }
    
    // Package selection change
    const packageSelect = document.getElementById('salePackage');
    if (packageSelect) {
        packageSelect.addEventListener('change', handlePackageSelection);
    }
    
    // Amount paid change
    const amountInput = document.getElementById('amountPaid');
    if (amountInput) {
        amountInput.addEventListener('input', updateSaleSummary);
    }
    
    // Validity start date change
    const startDateInput = document.getElementById('validityStartDate');
    if (startDateInput) {
        startDateInput.addEventListener('change', handleValidityStartDateChange);
    }
}

// Close sales modal
function closeSaleModal() {
    const modal = document.getElementById('saleModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Load sales from API
async function loadSalesFromAPI() {
    try {
        const response = await fetch('/api/sales');
        if (!response.ok) {
            throw new Error('Failed to fetch sales');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading sales:', error);
        return [];
    }
}

// Render sales table
function renderSalesTable(sales) {
    const tableBody = document.querySelector('#salesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (sales.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem; color: #6b7280;">
                    No sales found. Record your first sale!
                </td>
            </tr>
        `;
        return;
    }
    
    sales.forEach(sale => {
        const row = document.createElement('tr');
        const paymentDate = new Date(sale.paymentInfo.paymentDate).toLocaleDateString();
        const startDate = new Date(sale.validityPeriod.startDate).toLocaleDateString();
        const endDate = new Date(sale.validityPeriod.endDate).toLocaleDateString();
        const daysRemaining = Math.ceil((new Date(sale.validityPeriod.endDate) - new Date()) / (1000 * 60 * 60 * 24));
        
        row.innerHTML = `
            <td>${sale.saleId}</td>
            <td>
                <div class="date-info">
                    <div>${paymentDate}</div>
                    <div class="time-info">${new Date(sale.paymentInfo.paymentDate).toLocaleTimeString()}</div>
                </div>
            </td>
            <td>
                <div class="customer-info">
                    <div class="customer-name">${sale.customer.firstName} ${sale.customer.lastName}</div>
                    <div class="customer-contact">${sale.customer.email}</div>
                </div>
            </td>
            <td>
                <div class="package-info">
                    <div class="package-name">${sale.packageDetails.name}</div>
                    <div class="package-type">${sale.packageDetails.type}</div>
                </div>
            </td>
            <td>
                <div class="amount-info">
                    <div class="amount">$${sale.paymentInfo.amountPaid}</div>
                </div>
            </td>
            <td>
                <div class="payment-info">
                    <div class="payment-method">${sale.paymentInfo.paymentMethod}</div>
                </div>
            </td>
            <td>
                <div class="validity-info">
                    <div>${startDate} - ${endDate}</div>
                    <div class="days-remaining ${daysRemaining < 0 ? 'expired' : daysRemaining < 7 ? 'warning' : ''}">
                        ${daysRemaining < 0 ? 'Expired' : `${daysRemaining} days left`}
                    </div>
                </div>
            </td>
            <td>
                <span class="status-badge ${sale.status} clickable-status" onclick="toggleSaleStatus('${sale._id}', '${sale.status}')" title="Click to toggle status">
                    ${sale.status}
                </span>
            </td>
            <td class="action-buttons">
                <button class="btn-icon view" onclick="handleViewSaleDetails('${sale._id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit" onclick="handleEditSale('${sale._id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="handleDeleteSale('${sale._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update sales statistics
async function updateSalesStats(sales) {
    try {
        // Calculate total sales
        const totalSales = sales.length;
        document.getElementById('totalSales').textContent = totalSales;
        
        // Calculate total revenue
        const totalRevenue = sales.reduce((total, sale) => total + sale.paymentInfo.amountPaid, 0);
        document.getElementById('totalRevenue').textContent = `$${totalRevenue}`;
        
        // Calculate today's sales
        const today = new Date().toDateString();
        const todaySales = sales.filter(sale => 
            new Date(sale.paymentInfo.paymentDate).toDateString() === today
        ).length;
        document.getElementById('todaySales').textContent = todaySales;
        
        // Calculate monthly revenue
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = sales
            .filter(sale => {
                const saleDate = new Date(sale.paymentInfo.paymentDate);
                return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
            })
            .reduce((total, sale) => total + sale.paymentInfo.amountPaid, 0);
        document.getElementById('monthlyRevenue').textContent = `$${monthlyRevenue}`;
        
    } catch (error) {
        console.error('Error updating sales stats:', error);
    }
}

// Refresh sales list
async function refreshSalesList() {
    const refreshBtn = document.getElementById('refreshSalesBtn');
    const originalContent = refreshBtn.innerHTML;
    
    // Show loading state
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    refreshBtn.disabled = true;
    
    try {
        const sales = await loadSalesFromAPI();
        renderSalesTable(sales);
        await updateSalesStats(sales);
    } catch (error) {
        console.error('Error refreshing sales list:', error);
        showNotification('Error loading sales', 'error');
    } finally {
        // Restore button state
        refreshBtn.innerHTML = originalContent;
        refreshBtn.disabled = false;
    }
}

// Open record sale modal
async function openRecordSaleModal() {
    const modal = document.getElementById('saleModal');
    const modalTitle = document.getElementById('saleModalTitle');
    const form = document.getElementById('saleForm');
    
    modalTitle.textContent = 'Record New Sale';
    form.reset();
    
    // Clear form data attributes
    delete form.dataset.saleId;
    delete form.dataset.isEdit;
    
    // Set default values
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const nowDateTime = now.toISOString().slice(0, 16);
    
    document.getElementById('paymentDate').value = nowDateTime;
    document.getElementById('validityStartDate').value = today;
    
    // Load customers and packages
    await loadCustomersForSale();
    await loadPackagesForSale();
    
    modal.classList.add('show');
    
    setTimeout(() => {
        document.getElementById('saleCustomer').focus();
    }, 100);
}

// Load customers for sale form
async function loadCustomersForSale() {
    try {
        const response = await fetch('/api/customers');
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        const customers = await response.json();
        
        const customerSelect = document.getElementById('saleCustomer');
        customerSelect.innerHTML = '<option value="">Choose a customer...</option>';
        
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer._id;
            option.textContent = `${customer.firstName} ${customer.lastName} (${customer.customerId})`;
            customerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

// Load packages for sale form
async function loadPackagesForSale() {
    try {
        const response = await fetch('/api/packages');
        if (!response.ok) {
            throw new Error('Failed to fetch packages');
        }
        const packages = await response.json();
        
        const packageSelect = document.getElementById('salePackage');
        packageSelect.innerHTML = '<option value="">Choose a package...</option>';
        
        packages.forEach(pkg => {
            const option = document.createElement('option');
            option.value = pkg._id;
            option.textContent = `${pkg.name} - $${pkg.price} (${pkg.numberOfClasses === 999 ? 'Unlimited' : pkg.numberOfClasses} classes)`;
            option.dataset.packageData = JSON.stringify(pkg);
            packageSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading packages:', error);
    }
}

// Handle customer selection
async function handleCustomerSelection(e) {
    const customerId = e.target.value;
    const customerInfo = document.getElementById('customerInfo');
    const customerDetails = document.getElementById('customerDetails');
    
    if (customerId) {
        try {
            const response = await fetch(`/api/customers/${customerId}`);
            if (response.ok) {
                const customer = await response.json();
                customerDetails.innerHTML = `
                    <div class="detail-item">
                        <strong>Name:</strong> ${customer.firstName} ${customer.lastName}
                    </div>
                    <div class="detail-item">
                        <strong>Email:</strong> ${customer.email}
                    </div>
                    <div class="detail-item">
                        <strong>Phone:</strong> ${customer.phone}
                    </div>
                    <div class="detail-item">
                        <strong>Current Balance:</strong> ${customer.paymentInfo?.balance || 0} classes
                    </div>
                `;
                customerInfo.style.display = 'block';
                updateSaleSummary();
            }
        } catch (error) {
            console.error('Error loading customer details:', error);
        }
    } else {
        customerInfo.style.display = 'none';
        updateSaleSummary();
    }
}

// Handle package selection
function handlePackageSelection(e) {
    const packageId = e.target.value;
    const packageInfo = document.getElementById('packageInfo');
    const packageDetails = document.getElementById('packageDetails');
    const amountInput = document.getElementById('amountPaid');
    
    if (packageId) {
        const selectedOption = e.target.selectedOptions[0];
        const packageData = JSON.parse(selectedOption.dataset.packageData);
        
        packageDetails.innerHTML = `
            <div class="detail-item">
                <strong>Name:</strong> ${packageData.name}
            </div>
            <div class="detail-item">
                <strong>Type:</strong> ${packageData.type}
            </div>
            <div class="detail-item">
                <strong>Classes:</strong> ${packageData.numberOfClasses === 999 ? 'Unlimited' : packageData.numberOfClasses}
            </div>
            <div class="detail-item">
                <strong>Price:</strong> $${packageData.price}
            </div>
            <div class="detail-item">
                <strong>Validity:</strong> ${packageData.validityPeriod} days
            </div>
        `;
        packageInfo.style.display = 'block';
        
        // Auto-fill amount paid
        amountInput.value = packageData.price;
        
        // Calculate end date
        handleValidityStartDateChange();
        
        updateSaleSummary();
    } else {
        packageInfo.style.display = 'none';
        amountInput.value = '';
        updateSaleSummary();
    }
}

// Handle validity start date change
function handleValidityStartDateChange() {
    const startDateInput = document.getElementById('validityStartDate');
    const endDateInput = document.getElementById('validityEndDate');
    const packageSelect = document.getElementById('salePackage');
    
    if (startDateInput.value && packageSelect.value) {
        const selectedOption = packageSelect.selectedOptions[0];
        const packageData = JSON.parse(selectedOption.dataset.packageData);
        
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + packageData.validityPeriod);
        
        endDateInput.value = endDate.toISOString().split('T')[0];
    }
    
    updateSaleSummary();
}

// Update sale summary
function updateSaleSummary() {
    const customerSelect = document.getElementById('saleCustomer');
    const packageSelect = document.getElementById('salePackage');
    const amountInput = document.getElementById('amountPaid');
    const startDateInput = document.getElementById('validityStartDate');
    const endDateInput = document.getElementById('validityEndDate');
    
    // Update customer
    const customerText = customerSelect.selectedOptions[0]?.textContent || '-';
    document.getElementById('summaryCustomer').textContent = customerText;
    
    // Update package
    const packageText = packageSelect.selectedOptions[0]?.textContent || '-';
    document.getElementById('summaryPackage').textContent = packageText;
    
    // Update classes
    if (packageSelect.value) {
        const selectedOption = packageSelect.selectedOptions[0];
        const packageData = JSON.parse(selectedOption.dataset.packageData);
        document.getElementById('summaryClasses').textContent = packageData.numberOfClasses === 999 ? 'Unlimited' : packageData.numberOfClasses;
    } else {
        document.getElementById('summaryClasses').textContent = '-';
    }
    
    // Update validity
    if (startDateInput.value && endDateInput.value) {
        const startDate = new Date(startDateInput.value).toLocaleDateString();
        const endDate = new Date(endDateInput.value).toLocaleDateString();
        document.getElementById('summaryValidity').textContent = `${startDate} - ${endDate}`;
    } else {
        document.getElementById('summaryValidity').textContent = '-';
    }
    
    // Update amount
    const amount = amountInput.value || '0';
    document.getElementById('summaryAmount').textContent = `$${parseFloat(amount).toFixed(2)}`;
}

// Handle sale form submission
async function handleSaleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitSaleForm');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recording...';
    
    try {
        // Convert FormData to object
        const saleData = {};
        for (let [key, value] of formData.entries()) {
            saleData[key] = value;
        }
        
        // Check if this is an edit or create operation
        const isEdit = form.dataset.isEdit === 'true';
        const saleId = form.dataset.saleId;
        
        let result;
        if (isEdit && saleId) {
            // Update existing sale
            result = await updateSaleToAPI(saleId, saleData);
            if (result.success) {
                showNotification(`Sale ${result.data.saleId} updated successfully!`, 'success');
            }
        } else {
            // Create new sale
            result = await saveSaleToAPI(saleData);
            if (result.success) {
                showNotification(`Sale ${result.data.saleId} recorded successfully!`, 'success');
            }
        }
        
        if (result.success) {
            closeSaleModal();
            
            // Clear form data attributes
            delete form.dataset.saleId;
            delete form.dataset.isEdit;
            
            // Refresh the sales list and stats
            await refreshSalesList();
        } else {
            throw new Error(result.error || 'Failed to save sale');
        }
        
    } catch (error) {
        console.error('Error saving sale:', error);
        showNotification('Error saving sale. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Record Sale';
    }
}

async function saveSaleToAPI(data) {
    try {
        const response = await fetch('/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to save sale');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function updateSaleToAPI(saleId, data) {
    try {
        const response = await fetch(`/api/sales/${saleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to update sale');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// View sale details
async function handleViewSaleDetails(saleId) {
    try {
        const response = await fetch(`/api/sales/${saleId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch sale details');
        }
        
        const sale = await response.json();
        showSaleDetailsModal(sale);
    } catch (error) {
        console.error('Error fetching sale details:', error);
        showNotification('Error loading sale details', 'error');
    }
}

// Show sale details modal
function showSaleDetailsModal(sale) {
    const paymentDate = new Date(sale.paymentInfo.paymentDate).toLocaleString();
    const startDate = new Date(sale.validityPeriod.startDate).toLocaleDateString();
    const endDate = new Date(sale.validityPeriod.endDate).toLocaleDateString();
    const daysRemaining = Math.ceil((new Date(sale.validityPeriod.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal show" id="saleDetailsModal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Sale Details</h2>
                    <button class="modal-close" onclick="closeSaleDetailsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="sale-details-content">
                    <div class="sale-profile">
                        <div class="sale-header">
                            <h3>Sale ${sale.saleId}</h3>
                            <span class="status-badge ${sale.status}">${sale.status}</span>
                        </div>
                        <p class="sale-date">Recorded: ${new Date(sale.dateCreated).toLocaleString()}</p>
                    </div>
                    
                    <div class="details-grid">
                        <div class="detail-section">
                            <h4><i class="fas fa-user"></i> Customer Information</h4>
                            <div class="detail-item">
                                <label>Name:</label>
                                <span>${sale.customer.firstName} ${sale.customer.lastName}</span>
                            </div>
                            <div class="detail-item">
                                <label>Email:</label>
                                <span>${sale.customer.email}</span>
                            </div>
                            <div class="detail-item">
                                <label>Phone:</label>
                                <span>${sale.customer.phone}</span>
                            </div>
                            <div class="detail-item">
                                <label>Customer ID:</label>
                                <span>${sale.customer.customerId}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-box"></i> Package Information</h4>
                            <div class="detail-item">
                                <label>Package:</label>
                                <span>${sale.packageDetails.name}</span>
                            </div>
                            <div class="detail-item">
                                <label>Type:</label>
                                <span>${sale.packageDetails.type}</span>
                            </div>
                            <div class="detail-item">
                                <label>Classes:</label>
                                <span>${sale.packageDetails.numberOfClasses === 999 ? 'Unlimited' : sale.packageDetails.numberOfClasses}</span>
                            </div>
                            <div class="detail-item">
                                <label>Package Price:</label>
                                <span>$${sale.packageDetails.price}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-dollar-sign"></i> Payment Information</h4>
                            <div class="detail-item">
                                <label>Amount Paid:</label>
                                <span>$${sale.paymentInfo.amountPaid}</span>
                            </div>
                            <div class="detail-item">
                                <label>Payment Method:</label>
                                <span>${sale.paymentInfo.paymentMethod}</span>
                            </div>
                            <div class="detail-item">
                                <label>Payment Date:</label>
                                <span>${paymentDate}</span>
                            </div>
                            ${sale.paymentInfo.transactionId ? `
                                <div class="detail-item">
                                    <label>Transaction ID:</label>
                                    <span>${sale.paymentInfo.transactionId}</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-calendar"></i> Validity Period</h4>
                            <div class="detail-item">
                                <label>Start Date:</label>
                                <span>${startDate}</span>
                            </div>
                            <div class="detail-item">
                                <label>End Date:</label>
                                <span>${endDate}</span>
                            </div>
                            <div class="detail-item">
                                <label>Days Remaining:</label>
                                <span class="${daysRemaining < 0 ? 'expired' : daysRemaining < 7 ? 'warning' : ''}">
                                    ${daysRemaining < 0 ? 'Expired' : `${daysRemaining} days`}
                                </span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-chart-bar"></i> Class Balance</h4>
                            <div class="detail-item">
                                <label>Total Classes:</label>
                                <span>${sale.classBalance.totalClasses}</span>
                            </div>
                            <div class="detail-item">
                                <label>Used Classes:</label>
                                <span>${sale.classBalance.usedClasses}</span>
                            </div>
                            <div class="detail-item">
                                <label>Remaining Classes:</label>
                                <span>${sale.classBalance.remainingClasses}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="closeSaleDetailsModal()">Close</button>
                        <button class="btn btn-primary" onclick="handleEditSale('${sale._id}'); closeSaleDetailsModal();">
                            <i class="fas fa-edit"></i> Edit Sale
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close sale details modal
function closeSaleDetailsModal() {
    const modal = document.getElementById('saleDetailsModal');
    if (modal) {
        modal.remove();
    }
}

// Edit sale
async function handleEditSale(saleId) {
    try {
        const response = await fetch(`/api/sales/${saleId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch sale details');
        }
        
        const sale = await response.json();
        openEditSaleModal(sale);
    } catch (error) {
        console.error('Error fetching sale details:', error);
        showNotification('Error loading sale details for editing', 'error');
    }
}

// Open edit sale modal with pre-filled data
async function openEditSaleModal(sale) {
    const modal = document.getElementById('saleModal');
    const modalTitle = document.getElementById('saleModalTitle');
    const form = document.getElementById('saleForm');
    
    modalTitle.textContent = 'Edit Sale';
    form.reset();
    
    // Load customers and packages first
    await loadCustomersForSale();
    await loadPackagesForSale();
    
    // Pre-fill form with sale data
    document.getElementById('saleCustomer').value = sale.customer._id;
    document.getElementById('salePackage').value = sale.package._id;
    document.getElementById('amountPaid').value = sale.paymentInfo.amountPaid;
    document.getElementById('paymentMethod').value = sale.paymentInfo.paymentMethod;
    document.getElementById('paymentDate').value = new Date(sale.paymentInfo.paymentDate).toISOString().slice(0, 16);
    document.getElementById('transactionId').value = sale.paymentInfo.transactionId || '';
    document.getElementById('validityStartDate').value = new Date(sale.validityPeriod.startDate).toISOString().split('T')[0];
    document.getElementById('validityEndDate').value = new Date(sale.validityPeriod.endDate).toISOString().split('T')[0];
    document.getElementById('saleNotes').value = sale.notes || '';
    
    // Store sale ID for update
    form.dataset.saleId = sale._id;
    form.dataset.isEdit = 'true';
    
    // Show customer and package info
    handleCustomerSelection({ target: { value: sale.customer._id } });
    handlePackageSelection({ target: { value: sale.package._id } });
    
    modal.classList.add('show');
    
    setTimeout(() => {
        document.getElementById('saleCustomer').focus();
    }, 100);
}

// Delete sale
async function handleDeleteSale(saleId) {
    if (!confirm('Are you sure you want to delete this sale? This action cannot be undone and will affect customer class balance.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/sales/${saleId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete sale');
        }
        
        showNotification('Sale deleted successfully!', 'success');
        
        // Refresh the sales list
        await refreshSalesList();
        
    } catch (error) {
        console.error('Error deleting sale:', error);
        showNotification('Error deleting sale', 'error');
    }
}

// Toggle sale status
async function toggleSaleStatus(saleId, currentStatus) {
    const statusOptions = ['active', 'expired', 'cancelled', 'refunded'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const newStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    try {
        const response = await fetch(`/api/sales/${saleId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update sale status');
        }
        
        showNotification(`Sale status updated to ${newStatus}`, 'success');
        
        // Refresh the sales list
        await refreshSalesList();
        
    } catch (error) {
        console.error('Error updating sale status:', error);
        showNotification('Error updating sale status', 'error');
    }
}

// ==================== ATTENDANCE FUNCTIONS ====================

// Setup attendance modal event listeners
function setupAttendanceModalEventListeners() {
    // Close modal buttons
    const closeModalBtn = document.getElementById('closeAttendanceModal');
    const cancelBtn = document.getElementById('cancelAttendanceForm');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAttendanceModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeAttendanceModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('attendanceModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAttendanceModal();
            }
        });
    }
    
    // Record attendance button
    const recordAttendanceBtn = document.getElementById('recordAttendanceBtn');
    if (recordAttendanceBtn) {
        recordAttendanceBtn.addEventListener('click', openRecordAttendanceModal);
    }
}

// Setup attendance form event listeners
function setupAttendanceFormEventListeners() {
    const form = document.getElementById('attendanceForm');
    if (form) {
        form.addEventListener('submit', handleAttendanceFormSubmit);
    }
    
    // Instructor selection change
    const instructorSelect = document.getElementById('attendanceInstructor');
    if (instructorSelect) {
        instructorSelect.addEventListener('change', handleInstructorSelection);
    }
    
    // Class selection change
    const classSelect = document.getElementById('attendanceClass');
    if (classSelect) {
        classSelect.addEventListener('change', handleClassSelection);
    }
    
    // Date and time change
    const dateInput = document.getElementById('actualDate');
    const timeInput = document.getElementById('actualTime');
    if (dateInput) {
        dateInput.addEventListener('change', checkScheduleWarning);
    }
    if (timeInput) {
        timeInput.addEventListener('change', checkScheduleWarning);
    }
    
    // Customer search
    const customerSearch = document.getElementById('customerSearch');
    if (customerSearch) {
        customerSearch.addEventListener('input', filterCustomers);
    }
}

// Close attendance modal
function closeAttendanceModal() {
    const modal = document.getElementById('attendanceModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Load attendance from API
async function loadAttendanceFromAPI() {
    try {
        const response = await fetch('/api/attendance');
        if (!response.ok) {
            throw new Error('Failed to fetch attendance records');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading attendance:', error);
        return [];
    }
}

// Render attendance table
function renderAttendanceTable(attendance) {
    const tableBody = document.querySelector('#attendanceTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (attendance.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #6b7280;">
                    No attendance records found. Record your first attendance!
                </td>
            </tr>
        `;
        return;
    }
    
    attendance.forEach(record => {
        const row = document.createElement('tr');
        const attendanceDate = new Date(record.actualDate).toLocaleDateString();
        const attendanceTime = record.actualTime;
        const totalAttendees = record.attendees.length;
        const presentCount = record.attendees.filter(a => a.status === 'present').length;
        
        row.innerHTML = `
            <td>${record.attendanceId}</td>
            <td>
                <div class="date-info">
                    <div>${attendanceDate}</div>
                    <div class="time-info">${attendanceTime}</div>
                </div>
            </td>
            <td>
                <div class="class-info">
                    <div class="class-name">${record.class.name}</div>
                    <div class="class-time">${record.class.startTime} - ${record.class.endTime}</div>
                </div>
            </td>
            <td>
                <div class="instructor-info">
                    <div class="instructor-name">${record.instructor.firstName} ${record.instructor.lastName}</div>
                </div>
            </td>
            <td>
                <div class="attendees-info">
                    <div class="attendees-count">${presentCount}/${totalAttendees} present</div>
                </div>
            </td>
            <td>
                <span class="status-badge ${record.status} clickable-status" onclick="toggleAttendanceStatus('${record._id}', '${record.status}')" title="Click to toggle status">
                    ${record.status}
                </span>
            </td>
            <td>
                <div class="schedule-info">
                    ${record.scheduleWarning.hasWarning ? 
                        `<span class="schedule-warning-badge" title="${record.scheduleWarning.message}">
                            <i class="fas fa-exclamation-triangle"></i> Warning
                        </span>` : 
                        `<span class="schedule-ok-badge">
                            <i class="fas fa-check"></i> On Schedule
                        </span>`
                    }
                </div>
            </td>
            <td class="action-buttons">
                <button class="btn-icon view" onclick="handleViewAttendanceDetails('${record._id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit" onclick="handleEditAttendance('${record._id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="handleDeleteAttendance('${record._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update attendance statistics
async function updateAttendanceStats(attendance) {
    try {
        // Calculate total attendance records
        const totalAttendance = attendance.length;
        document.getElementById('totalAttendance').textContent = totalAttendance;
        
        // Calculate total attendees
        const totalAttendees = attendance.reduce((total, record) => total + record.attendees.length, 0);
        document.getElementById('totalAttendees').textContent = totalAttendees;
        
        // Calculate today's attendance
        const today = new Date().toDateString();
        const todayAttendance = attendance.filter(record => 
            new Date(record.actualDate).toDateString() === today
        ).length;
        document.getElementById('todayAttendance').textContent = todayAttendance;
        
        // Calculate schedule warnings
        const scheduleWarnings = attendance.filter(record => record.scheduleWarning.hasWarning).length;
        document.getElementById('scheduleWarnings').textContent = scheduleWarnings;
        
    } catch (error) {
        console.error('Error updating attendance stats:', error);
    }
}

// Refresh attendance list
async function refreshAttendanceList() {
    const refreshBtn = document.getElementById('refreshAttendanceBtn');
    const originalContent = refreshBtn.innerHTML;
    
    // Show loading state
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    refreshBtn.disabled = true;
    
    try {
        const attendance = await loadAttendanceFromAPI();
        renderAttendanceTable(attendance);
        await updateAttendanceStats(attendance);
    } catch (error) {
        console.error('Error refreshing attendance list:', error);
        showNotification('Error loading attendance records', 'error');
    } finally {
        // Restore button state
        refreshBtn.innerHTML = originalContent;
        refreshBtn.disabled = false;
    }
}

// Open record attendance modal
async function openRecordAttendanceModal() {
    const modal = document.getElementById('attendanceModal');
    const modalTitle = document.getElementById('attendanceModalTitle');
    const form = document.getElementById('attendanceForm');
    
    modalTitle.textContent = 'Record Class Attendance';
    form.reset();
    
    // Clear form data attributes
    delete form.dataset.attendanceId;
    delete form.dataset.isEdit;
    
    // Set default values
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    document.getElementById('actualDate').value = today;
    document.getElementById('actualTime').value = currentTime;
    
    // Load instructors and customers
    await loadInstructorsForAttendance();
    await loadCustomersForAttendance();
    
    modal.classList.add('show');
    
    setTimeout(() => {
        document.getElementById('attendanceInstructor').focus();
    }, 100);
}

// Load instructors for attendance form
async function loadInstructorsForAttendance() {
    try {
        const response = await fetch('/api/instructors');
        if (!response.ok) {
            throw new Error('Failed to fetch instructors');
        }
        const instructors = await response.json();
        
        const instructorSelect = document.getElementById('attendanceInstructor');
        instructorSelect.innerHTML = '<option value="">Choose an instructor...</option>';
        
        instructors.forEach(instructor => {
            const option = document.createElement('option');
            option.value = instructor._id;
            option.textContent = `${instructor.firstName} ${instructor.lastName} (${instructor.instructorId})`;
            instructorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading instructors:', error);
    }
}

// Load customers for attendance form
async function loadCustomersForAttendance() {
    try {
        const response = await fetch('/api/customers');
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        const customers = await response.json();
        
        const attendanceList = document.getElementById('attendanceList');
        attendanceList.innerHTML = '';
        
        customers.forEach(customer => {
            const customerItem = document.createElement('div');
            customerItem.className = 'attendance-item';
            customerItem.innerHTML = `
                <input type="checkbox" id="customer_${customer._id}" value="${customer._id}" data-customer='${JSON.stringify(customer)}'>
                <label for="customer_${customer._id}">
                    <div class="customer-attendance-info">
                        <div class="customer-name">${customer.firstName} ${customer.lastName}</div>
                        <div class="customer-balance">Balance: ${customer.paymentInfo?.balance || 0} classes</div>
                    </div>
                </label>
            `;
            attendanceList.appendChild(customerItem);
        });
        
        // Add event listeners to checkboxes
        const checkboxes = attendanceList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateAttendanceSummary);
        });
        
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

// Handle instructor selection
async function handleInstructorSelection(e) {
    const instructorId = e.target.value;
    const classSelect = document.getElementById('attendanceClass');
    
    if (instructorId) {
        try {
            const response = await fetch(`/api/attendance/instructor/${instructorId}/classes`);
            if (response.ok) {
                const classes = await response.json();
                
                classSelect.innerHTML = '<option value="">Choose a class...</option>';
                
                classes.forEach(cls => {
                    const option = document.createElement('option');
                    option.value = cls._id;
                    option.textContent = `${cls.name} - ${new Date(cls.date).toLocaleDateString()} ${cls.startTime}`;
                    option.dataset.classData = JSON.stringify(cls);
                    classSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading instructor classes:', error);
        }
    } else {
        classSelect.innerHTML = '<option value="">Choose a class...</option>';
        document.getElementById('classInfo').style.display = 'none';
    }
}

// Handle class selection
function handleClassSelection(e) {
    const classId = e.target.value;
    const classInfo = document.getElementById('classInfo');
    const classDetails = document.getElementById('classDetails');
    
    if (classId) {
        const selectedOption = e.target.selectedOptions[0];
        const classData = JSON.parse(selectedOption.dataset.classData);
        
        classDetails.innerHTML = `
            <div class="detail-item">
                <strong>Name:</strong> ${classData.name}
            </div>
            <div class="detail-item">
                <strong>Date:</strong> ${new Date(classData.date).toLocaleDateString()}
            </div>
            <div class="detail-item">
                <strong>Time:</strong> ${classData.startTime} - ${classData.endTime}
            </div>
            <div class="detail-item">
                <strong>Capacity:</strong> ${classData.capacity}
            </div>
        `;
        classInfo.style.display = 'block';
        
        // Check for schedule warnings
        checkScheduleWarning();
        updateAttendanceSummary();
    } else {
        classInfo.style.display = 'none';
        updateAttendanceSummary();
    }
}

// Check schedule warning
function checkScheduleWarning() {
    const classSelect = document.getElementById('attendanceClass');
    const dateInput = document.getElementById('actualDate');
    const timeInput = document.getElementById('actualTime');
    const warningDiv = document.getElementById('scheduleWarning');
    const warningMessage = document.getElementById('warningMessage');
    
    if (classSelect.value && dateInput.value && timeInput.value) {
        const selectedOption = classSelect.selectedOptions[0];
        const classData = JSON.parse(selectedOption.dataset.classData);
        
        const classDate = new Date(classData.date).toDateString();
        const actualDate = new Date(dateInput.value).toDateString();
        const classTime = classData.startTime;
        const actualTime = timeInput.value;
        
        if (classDate !== actualDate || classTime !== actualTime) {
            warningMessage.textContent = `Schedule mismatch: Expected ${classDate} at ${classTime}, but recorded ${actualDate} at ${actualTime}`;
            warningDiv.style.display = 'block';
        } else {
            warningDiv.style.display = 'none';
        }
    } else {
        warningDiv.style.display = 'none';
    }
}

// Filter customers
function filterCustomers(e) {
    const searchTerm = e.target.value.toLowerCase();
    const attendanceItems = document.querySelectorAll('.attendance-item');
    
    attendanceItems.forEach(item => {
        const label = item.querySelector('label');
        const customerName = label.textContent.toLowerCase();
        
        if (customerName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Update attendance summary
function updateAttendanceSummary() {
    const classSelect = document.getElementById('attendanceClass');
    const dateInput = document.getElementById('actualDate');
    const timeInput = document.getElementById('actualTime');
    const checkboxes = document.querySelectorAll('#attendanceList input[type="checkbox"]:checked');
    
    // Update class
    const classText = classSelect.selectedOptions[0]?.textContent || '-';
    document.getElementById('summaryClass').textContent = classText;
    
    // Update date and time
    if (dateInput.value && timeInput.value) {
        const date = new Date(dateInput.value).toLocaleDateString();
        document.getElementById('summaryDateTime').textContent = `${date} at ${timeInput.value}`;
    } else {
        document.getElementById('summaryDateTime').textContent = '-';
    }
    
    // Update attendees count
    document.getElementById('summaryAttendees').textContent = checkboxes.length;
    
    // Count balance warnings
    let warnings = 0;
    checkboxes.forEach(checkbox => {
        const customerData = JSON.parse(checkbox.dataset.customer);
        if ((customerData.paymentInfo?.balance || 0) <= 0) {
            warnings++;
        }
    });
    document.getElementById('summaryWarnings').textContent = warnings;
}

// Handle attendance form submission
async function handleAttendanceFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitAttendanceForm');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recording...';
    
    try {
        // Get selected customers
        const checkboxes = document.querySelectorAll('#attendanceList input[type="checkbox"]:checked');
        const attendees = [];
        
        checkboxes.forEach(checkbox => {
            const customerData = JSON.parse(checkbox.dataset.customer);
            attendees.push({
                customerId: customerData._id,
                status: 'present'
            });
        });
        
        // Convert FormData to object
        const attendanceData = {
            classId: formData.get('classId'),
            instructorId: formData.get('instructorId'),
            actualDate: formData.get('actualDate'),
            actualTime: formData.get('actualTime'),
            attendees: attendees
        };
        
        // Check if this is an edit or create operation
        const isEdit = form.dataset.isEdit === 'true';
        const attendanceId = form.dataset.attendanceId;
        
        let result;
        if (isEdit && attendanceId) {
            // Update existing attendance
            result = await updateAttendanceToAPI(attendanceId, attendanceData);
            if (result.success) {
                showNotification(`Attendance ${result.data.attendanceId} updated successfully!`, 'success');
            }
        } else {
            // Create new attendance
            result = await saveAttendanceToAPI(attendanceData);
            if (result.success) {
                showNotification(`Attendance ${result.data.attendanceId} recorded successfully!`, 'success');
            }
        }
        
        if (result.success) {
            closeAttendanceModal();
            
            // Clear form data attributes
            delete form.dataset.attendanceId;
            delete form.dataset.isEdit;
            
            // Refresh the attendance list and stats
            await refreshAttendanceList();
        } else {
            throw new Error(result.error || 'Failed to save attendance');
        }
        
    } catch (error) {
        console.error('Error saving attendance:', error);
        showNotification('Error saving attendance. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Attendance';
    }
}

async function saveAttendanceToAPI(data) {
    try {
        const response = await fetch('/api/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to save attendance');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function updateAttendanceToAPI(attendanceId, data) {
    try {
        const response = await fetch(`/api/attendance/${attendanceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to update attendance');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// View attendance details
async function handleViewAttendanceDetails(attendanceId) {
    try {
        const response = await fetch(`/api/attendance/${attendanceId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch attendance details');
        }
        
        const attendance = await response.json();
        showAttendanceDetailsModal(attendance);
    } catch (error) {
        console.error('Error fetching attendance details:', error);
        showNotification('Error loading attendance details', 'error');
    }
}

// Show attendance details modal
function showAttendanceDetailsModal(attendance) {
    const attendanceDate = new Date(attendance.actualDate).toLocaleDateString();
    const attendanceTime = attendance.actualTime;
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal show" id="attendanceDetailsModal">
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h2>Attendance Details</h2>
                    <button class="modal-close" onclick="closeAttendanceDetailsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="attendance-details-content">
                    <div class="attendance-profile">
                        <div class="attendance-header">
                            <h3>Attendance ${attendance.attendanceId}</h3>
                            <span class="status-badge ${attendance.status}">${attendance.status}</span>
                        </div>
                        <p class="attendance-date">Recorded: ${new Date(attendance.dateCreated).toLocaleString()}</p>
                    </div>
                    
                    <div class="details-grid">
                        <div class="detail-section">
                            <h4><i class="fas fa-calendar"></i> Class Information</h4>
                            <div class="detail-item">
                                <label>Class:</label>
                                <span>${attendance.class.name}</span>
                            </div>
                            <div class="detail-item">
                                <label>Date:</label>
                                <span>${new Date(attendance.class.date).toLocaleDateString()}</span>
                            </div>
                            <div class="detail-item">
                                <label>Time:</label>
                                <span>${attendance.class.startTime} - ${attendance.class.endTime}</span>
                            </div>
                            <div class="detail-item">
                                <label>Capacity:</label>
                                <span>${attendance.class.capacity}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-user"></i> Instructor Information</h4>
                            <div class="detail-item">
                                <label>Name:</label>
                                <span>${attendance.instructor.firstName} ${attendance.instructor.lastName}</span>
                            </div>
                            <div class="detail-item">
                                <label>Email:</label>
                                <span>${attendance.instructor.email}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-clock"></i> Attendance Details</h4>
                            <div class="detail-item">
                                <label>Actual Date:</label>
                                <span>${attendanceDate}</span>
                            </div>
                            <div class="detail-item">
                                <label>Actual Time:</label>
                                <span>${attendanceTime}</span>
                            </div>
                            <div class="detail-item">
                                <label>Total Attendees:</label>
                                <span>${attendance.totalAttendees}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-exclamation-triangle"></i> Schedule Status</h4>
                            <div class="detail-item">
                                <label>Status:</label>
                                <span class="${attendance.scheduleWarning.hasWarning ? 'schedule-warning' : 'schedule-ok'}">
                                    ${attendance.scheduleWarning.hasWarning ? 'Warning' : 'On Schedule'}
                                </span>
                            </div>
                            ${attendance.scheduleWarning.hasWarning ? `
                                <div class="detail-item">
                                    <label>Warning:</label>
                                    <span>${attendance.scheduleWarning.message}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="attendees-section">
                        <h4><i class="fas fa-users"></i> Attendees (${attendance.attendees.length})</h4>
                        <div class="attendees-list">
                            ${attendance.attendees.map(attendee => `
                                <div class="attendee-item">
                                    <div class="attendee-info">
                                        <div class="attendee-name">${attendee.customerDetails.firstName} ${attendee.customerDetails.lastName}</div>
                                        <div class="attendee-details">
                                            <span>${attendee.customerDetails.email}</span>
                                            <span class="status-badge ${attendee.status}">${attendee.status}</span>
                                        </div>
                                    </div>
                                    <div class="attendee-balance">
                                        <div class="balance-before">Before: ${attendee.classBalanceBefore}</div>
                                        <div class="balance-after">After: ${attendee.classBalanceAfter}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="closeAttendanceDetailsModal()">Close</button>
                        <button class="btn btn-primary" onclick="handleEditAttendance('${attendance._id}'); closeAttendanceDetailsModal();">
                            <i class="fas fa-edit"></i> Edit Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close attendance details modal
function closeAttendanceDetailsModal() {
    const modal = document.getElementById('attendanceDetailsModal');
    if (modal) {
        modal.remove();
    }
}

// Edit attendance
async function handleEditAttendance(attendanceId) {
    try {
        const response = await fetch(`/api/attendance/${attendanceId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch attendance details');
        }
        
        const attendance = await response.json();
        openEditAttendanceModal(attendance);
    } catch (error) {
        console.error('Error fetching attendance details:', error);
        showNotification('Error loading attendance details for editing', 'error');
    }
}

// Open edit attendance modal with pre-filled data
async function openEditAttendanceModal(attendance) {
    const modal = document.getElementById('attendanceModal');
    const modalTitle = document.getElementById('attendanceModalTitle');
    const form = document.getElementById('attendanceForm');
    
    modalTitle.textContent = 'Edit Attendance Record';
    form.reset();
    
    // Load instructors and customers first
    await loadInstructorsForAttendance();
    await loadCustomersForAttendance();
    
    // Pre-fill form with attendance data
    document.getElementById('attendanceInstructor').value = attendance.instructor._id;
    document.getElementById('attendanceClass').value = attendance.class._id;
    document.getElementById('actualDate').value = new Date(attendance.actualDate).toISOString().split('T')[0];
    document.getElementById('actualTime').value = attendance.actualTime;
    
    // Store attendance ID for update
    form.dataset.attendanceId = attendance._id;
    form.dataset.isEdit = 'true';
    
    // Show class info
    handleClassSelection({ target: { value: attendance.class._id } });
    
    // Check selected customers
    setTimeout(() => {
        attendance.attendees.forEach(attendee => {
            const checkbox = document.getElementById(`customer_${attendee.customer._id}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        updateAttendanceSummary();
    }, 500);
    
    modal.classList.add('show');
    
    setTimeout(() => {
        document.getElementById('attendanceInstructor').focus();
    }, 100);
}

// Delete attendance
async function handleDeleteAttendance(attendanceId) {
    if (!confirm('Are you sure you want to delete this attendance record? This action cannot be undone and will restore customer class balances.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/attendance/${attendanceId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete attendance record');
        }
        
        showNotification('Attendance record deleted successfully!', 'success');
        
        // Refresh the attendance list
        await refreshAttendanceList();
        
    } catch (error) {
        console.error('Error deleting attendance:', error);
        showNotification('Error deleting attendance record', 'error');
    }
}

// Toggle attendance status
async function toggleAttendanceStatus(attendanceId, currentStatus) {
    const statusOptions = ['draft', 'confirmed', 'completed', 'cancelled'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const newStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    try {
        const response = await fetch(`/api/attendance/${attendanceId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update attendance status');
        }
        
        showNotification(`Attendance status updated to ${newStatus}`, 'success');
        
        // Refresh the attendance list
        await refreshAttendanceList();
        
    } catch (error) {
        console.error('Error updating attendance status:', error);
        showNotification('Error updating attendance status', 'error');
    }
}

// ==================== REPORTS FUNCTIONS ====================

// Setup reports event listeners
function setupReportsEventListeners() {
    // Refresh reports button
    const refreshBtn = document.getElementById('refreshReportsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshReportsSummary);
    }
    
    // Date range inputs
    const startDateInput = document.getElementById('reportStartDate');
    const endDateInput = document.getElementById('reportEndDate');
    
    if (startDateInput) {
        startDateInput.addEventListener('change', refreshReportsSummary);
    }
    if (endDateInput) {
        endDateInput.addEventListener('change', refreshReportsSummary);
    }
    
    // Set default date range (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    if (startDateInput) {
        startDateInput.value = firstDay.toISOString().split('T')[0];
    }
    if (endDateInput) {
        endDateInput.value = lastDay.toISOString().split('T')[0];
    }
    
    // Set default payment month/year
    const paymentMonth = document.getElementById('paymentMonth');
    const paymentYear = document.getElementById('paymentYear');
    
    if (paymentMonth) {
        paymentMonth.value = now.getMonth() + 1;
    }
    if (paymentYear) {
        paymentYear.value = now.getFullYear();
    }
}

// Load reports summary
async function loadReportsSummary() {
    try {
        const startDate = document.getElementById('reportStartDate')?.value;
        const endDate = document.getElementById('reportEndDate')?.value;
        
        let url = '/api/reports/summary';
        const params = new URLSearchParams();
        
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch reports summary');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error loading reports summary:', error);
        return null;
    }
}

// Update reports summary stats
async function updateReportsSummaryStats() {
    try {
        const summary = await loadReportsSummary();
        if (!summary) return;
        
        const { overview } = summary;
        
        document.getElementById('totalRevenue').textContent = `$${overview.totalRevenue}`;
        document.getElementById('totalSales').textContent = overview.totalSales;
        document.getElementById('totalCheckIns').textContent = overview.totalCheckIns;
        document.getElementById('totalClasses').textContent = overview.totalClasses;
        
    } catch (error) {
        console.error('Error updating reports summary stats:', error);
    }
}

// Refresh reports summary
async function refreshReportsSummary() {
    const refreshBtn = document.getElementById('refreshReportsBtn');
    const originalContent = refreshBtn.innerHTML;
    
    // Show loading state
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    refreshBtn.disabled = true;
    
    try {
        await updateReportsSummaryStats();
    } catch (error) {
        console.error('Error refreshing reports summary:', error);
        showNotification('Error loading reports summary', 'error');
    } finally {
        // Restore button state
        refreshBtn.innerHTML = originalContent;
        refreshBtn.disabled = false;
    }
}

// Generate Package Sales Report
async function generatePackageSalesReport() {
    const reportCard = document.getElementById('packageSalesReport');
    const content = document.getElementById('packageSalesContent');
    
    try {
        // Show loading state
        reportCard.classList.add('loading');
        content.style.display = 'block';
        content.innerHTML = '<div style="text-align: center; padding: 3rem; color: #6c757d;"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top: 1rem;">Generating Package Sales Report...</p></div>';
        
        const startDate = document.getElementById('reportStartDate')?.value;
        const endDate = document.getElementById('reportEndDate')?.value;
        
        let url = '/api/reports/package-sales';
        const params = new URLSearchParams();
        
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch package sales report');
        }
        
        const report = await response.json();
        displayPackageSalesReport(report);
        
    } catch (error) {
        console.error('Error generating package sales report:', error);
        showNotification('Error generating package sales report', 'error');
        content.innerHTML = '<div style="text-align: center; padding: 3rem; color: #dc3545;"><i class="fas fa-exclamation-triangle fa-2x"></i><p style="margin-top: 1rem;">Failed to generate report</p></div>';
    } finally {
        // Remove loading state
        reportCard.classList.remove('loading');
    }
}

// Display Package Sales Report
function displayPackageSalesReport(report) {
    const content = document.getElementById('packageSalesContent');
    
    const { summary, salesByType, salesByMonth, sales } = report;
    
    content.innerHTML = `
        <div class="report-summary">
            <h4>Report Summary</h4>
            <div class="summary-stats">
                <div class="summary-item">
                    <span class="label">Total Sales:</span>
                    <span class="value">${summary.totalSales}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Revenue:</span>
                    <span class="value">$${summary.totalRevenue}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Average Sale Value:</span>
                    <span class="value">$${summary.averageSaleValue.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Sales by Package Type</h4>
            <div class="sales-by-type">
                ${Object.entries(salesByType).map(([type, data]) => `
                    <div class="type-item">
                        <div class="type-header">
                            <h5>${type}</h5>
                            <span class="type-count">${data.count} sales</span>
                        </div>
                        <div class="type-revenue">$${data.revenue}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="report-section">
            <h4>Sales by Month</h4>
            <div class="sales-by-month">
                ${Object.entries(salesByMonth).map(([month, data]) => `
                    <div class="month-item">
                        <div class="month-header">
                            <h5>${new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h5>
                            <span class="month-count">${data.count} sales</span>
                        </div>
                        <div class="month-revenue">$${data.revenue}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="report-section">
            <h4>Recent Sales</h4>
            <div class="recent-sales">
                ${sales.slice(0, 10).map(sale => `
                    <div class="sale-item">
                        <div class="sale-info">
                            <div class="sale-customer">${sale.customer.firstName} ${sale.customer.lastName}</div>
                            <div class="sale-package">${sale.package.name}</div>
                        </div>
                        <div class="sale-amount">$${sale.paymentInfo.amountPaid}</div>
                        <div class="sale-date">${new Date(sale.paymentInfo.paymentDate).toLocaleDateString()}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    content.style.display = 'block';
}

// Generate Instructor Classes Report
async function generateInstructorClassesReport() {
    const reportCard = document.getElementById('instructorClassesReport');
    const content = document.getElementById('instructorClassesContent');
    
    try {
        // Show loading state
        reportCard.classList.add('loading');
        content.style.display = 'block';
        content.innerHTML = '<div style="text-align: center; padding: 3rem; color: #6c757d;"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top: 1rem;">Generating Instructor Classes Report...</p></div>';
        
        const startDate = document.getElementById('reportStartDate')?.value;
        const endDate = document.getElementById('reportEndDate')?.value;
        
        let url = '/api/reports/instructor-classes';
        const params = new URLSearchParams();
        
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch instructor classes report');
        }
        
        const report = await response.json();
        displayInstructorClassesReport(report);
        
    } catch (error) {
        console.error('Error generating instructor classes report:', error);
        showNotification('Error generating instructor classes report', 'error');
        content.innerHTML = '<div style="text-align: center; padding: 3rem; color: #dc3545;"><i class="fas fa-exclamation-triangle fa-2x"></i><p style="margin-top: 1rem;">Failed to generate report</p></div>';
    } finally {
        // Remove loading state
        reportCard.classList.remove('loading');
    }
}

// Display Instructor Classes Report
function displayInstructorClassesReport(report) {
    const content = document.getElementById('instructorClassesContent');
    
    const { summary, instructors } = report;
    
    content.innerHTML = `
        <div class="report-summary">
            <h4>Report Summary</h4>
            <div class="summary-stats">
                <div class="summary-item">
                    <span class="label">Total Instructors:</span>
                    <span class="value">${summary.totalInstructors}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Classes:</span>
                    <span class="value">${summary.totalClasses}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Check-ins:</span>
                    <span class="value">${summary.totalCheckIns}</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Instructor Performance</h4>
            <div class="instructors-list">
                ${instructors.map(instructor => `
                    <div class="instructor-item">
                        <div class="instructor-header">
                            <h5>${instructor.instructor.firstName} ${instructor.instructor.lastName}</h5>
                            <span class="instructor-id">${instructor.instructor.instructorId}</span>
                        </div>
                        <div class="instructor-stats">
                            <div class="stat-item">
                                <span class="label">Classes:</span>
                                <span class="value">${instructor.statistics.totalClasses}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Check-ins:</span>
                                <span class="value">${instructor.statistics.totalCheckIns}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Avg Attendance:</span>
                                <span class="value">${instructor.statistics.averageAttendance}</span>
                            </div>
                        </div>
                        <div class="instructor-classes">
                            <h6>Classes:</h6>
                            <div class="classes-list">
                                ${instructor.classes.map(cls => `
                                    <div class="class-item">
                                        <div class="class-name">${cls.name}</div>
                                        <div class="class-date">${new Date(cls.date).toLocaleDateString()} ${cls.startTime}</div>
                                        <div class="class-attendance">${cls.attendance.totalAttendees} attendees</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    content.style.display = 'block';
}

// Generate Customer Packages Report
async function generateCustomerPackagesReport() {
    const reportCard = document.getElementById('customerPackagesReport');
    const content = document.getElementById('customerPackagesContent');
    
    try {
        // Show loading state
        reportCard.classList.add('loading');
        content.style.display = 'block';
        content.innerHTML = '<div style="text-align: center; padding: 3rem; color: #6c757d;"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top: 1rem;">Generating Customer Packages Report...</p></div>';
        
        const response = await fetch('/api/reports/customer-packages');
        if (!response.ok) {
            throw new Error('Failed to fetch customer packages report');
        }
        
        const report = await response.json();
        displayCustomerPackagesReport(report);
        
    } catch (error) {
        console.error('Error generating customer packages report:', error);
        showNotification('Error generating customer packages report', 'error');
        content.innerHTML = '<div style="text-align: center; padding: 3rem; color: #dc3545;"><i class="fas fa-exclamation-triangle fa-2x"></i><p style="margin-top: 1rem;">Failed to generate report</p></div>';
    } finally {
        // Remove loading state
        reportCard.classList.remove('loading');
    }
}

// Display Customer Packages Report
function displayCustomerPackagesReport(report) {
    const content = document.getElementById('customerPackagesContent');
    
    const { summary, customers } = report;
    
    content.innerHTML = `
        <div class="report-summary">
            <h4>Report Summary</h4>
            <div class="summary-stats">
                <div class="summary-item">
                    <span class="label">Total Customers:</span>
                    <span class="value">${summary.totalCustomers}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Active Packages:</span>
                    <span class="value">${summary.totalActivePackages}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Expired Packages:</span>
                    <span class="value">${summary.totalExpiredPackages}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Revenue:</span>
                    <span class="value">$${summary.totalRevenue}</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Customer Package Status</h4>
            <div class="customers-list">
                ${customers.map(customer => `
                    <div class="customer-item">
                        <div class="customer-header">
                            <h5>${customer.customer.firstName} ${customer.customer.lastName}</h5>
                            <span class="customer-id">${customer.customer.customerId}</span>
                        </div>
                        <div class="customer-stats">
                            <div class="stat-item">
                                <span class="label">Total Spent:</span>
                                <span class="value">$${customer.statistics.totalSpent}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Classes Used:</span>
                                <span class="value">${customer.statistics.usedClasses}/${customer.statistics.totalClasses}</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Utilization:</span>
                                <span class="value">${customer.statistics.utilizationRate}%</span>
                            </div>
                        </div>
                        <div class="customer-packages">
                            <div class="package-category">
                                <h6>Active Packages (${customer.packages.active.length})</h6>
                                ${customer.packages.active.map(pkg => `
                                    <div class="package-item active">
                                        <div class="package-name">${pkg.package.name}</div>
                                        <div class="package-balance">${pkg.balance.remainingClasses} classes remaining</div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="package-category">
                                <h6>Expired Packages (${customer.packages.expired.length})</h6>
                                ${customer.packages.expired.map(pkg => `
                                    <div class="package-item expired">
                                        <div class="package-name">${pkg.package.name}</div>
                                        <div class="package-balance">Expired</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    content.style.display = 'block';
}

// Generate Teacher Payments Report
async function generateTeacherPaymentsReport() {
    const reportCard = document.getElementById('teacherPaymentsReport');
    const content = document.getElementById('teacherPaymentsContent');
    
    try {
        // Show loading state
        reportCard.classList.add('loading');
        content.style.display = 'block';
        content.innerHTML = '<div style="text-align: center; padding: 3rem; color: #6c757d;"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top: 1rem;">Generating Teacher Payments Report...</p></div>';
        
        const month = document.getElementById('paymentMonth')?.value;
        const year = document.getElementById('paymentYear')?.value;
        
        let url = '/api/reports/teacher-payments';
        const params = new URLSearchParams();
        
        if (month) params.append('month', month);
        if (year) params.append('year', year);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch teacher payments report');
        }
        
        const report = await response.json();
        displayTeacherPaymentsReport(report);
        
    } catch (error) {
        console.error('Error generating teacher payments report:', error);
        showNotification('Error generating teacher payments report', 'error');
        content.innerHTML = '<div style="text-align: center; padding: 3rem; color: #dc3545;"><i class="fas fa-exclamation-triangle fa-2x"></i><p style="margin-top: 1rem;">Failed to generate report</p></div>';
    } finally {
        // Remove loading state
        reportCard.classList.remove('loading');
    }
}

// Display Teacher Payments Report
function displayTeacherPaymentsReport(report) {
    const content = document.getElementById('teacherPaymentsContent');
    
    const { summary, instructors } = report;
    
    content.innerHTML = `
        <div class="report-summary">
            <h4>Payment Summary - ${new Date(summary.period.year, summary.period.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
            <div class="summary-stats">
                <div class="summary-item">
                    <span class="label">Total Instructors:</span>
                    <span class="value">${summary.totalInstructors}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Classes:</span>
                    <span class="value">${summary.totalClasses}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Check-ins:</span>
                    <span class="value">${summary.totalCheckIns}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Base Pay:</span>
                    <span class="value">$${summary.totalBasePay}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Bonus Pay:</span>
                    <span class="value">$${summary.totalBonusPay}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Pay:</span>
                    <span class="value">$${summary.totalPay}</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Instructor Payments</h4>
            <div class="instructors-payments">
                ${instructors.map(instructor => `
                    <div class="instructor-payment-item">
                        <div class="instructor-header">
                            <h5>${instructor.instructor.firstName} ${instructor.instructor.lastName}</h5>
                            <span class="instructor-id">${instructor.instructor.instructorId}</span>
                        </div>
                        <div class="payment-details">
                            <div class="payment-breakdown">
                                <div class="payment-item">
                                    <span class="label">Pay Rate:</span>
                                    <span class="value">$${instructor.instructor.payRate}/class</span>
                                </div>
                                <div class="payment-item">
                                    <span class="label">Classes Taught:</span>
                                    <span class="value">${instructor.payment.totalClasses}</span>
                                </div>
                                <div class="payment-item">
                                    <span class="label">Total Check-ins:</span>
                                    <span class="value">${instructor.payment.totalCheckIns}</span>
                                </div>
                                <div class="payment-item">
                                    <span class="label">Base Pay:</span>
                                    <span class="value">$${instructor.payment.basePay}</span>
                                </div>
                                <div class="payment-item">
                                    <span class="label">Bonus Pay:</span>
                                    <span class="value">$${instructor.payment.bonusPay}</span>
                                </div>
                                <div class="payment-item total">
                                    <span class="label">Total Pay:</span>
                                    <span class="value">$${instructor.payment.totalPay}</span>
                                </div>
                            </div>
                            <div class="weekly-breakdown">
                                <h6>Weekly Breakdown</h6>
                                ${instructor.weeklyPayments.map(week => `
                                    <div class="week-item">
                                        <div class="week-date">Week of ${new Date(week.weekStart).toLocaleDateString()}</div>
                                        <div class="week-stats">
                                            <span>${week.classes.length} classes</span>
                                            <span>${week.checkIns} check-ins</span>
                                            <span>$${week.pay}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    content.style.display = 'block';
}

// ==================== DYNAMIC HEADER HELPER FUNCTIONS ====================

// Refresh all data across all sections
async function refreshAllData() {
    try {
        showNotification('Refreshing all data...', 'info');
        
        // Refresh all sections in parallel
        await Promise.all([
            refreshInstructorList(),
            loadClasses(),
            refreshCustomerList(),
            refreshPackageList(),
            refreshSalesList(),
            refreshAttendanceList(),
            refreshReportsSummary()
        ]);
        
        showNotification('All data refreshed successfully!', 'success');
    } catch (error) {
        console.error('Error refreshing all data:', error);
        showNotification('Error refreshing some data', 'error');
    }
}

// Export all reports (placeholder function)
function exportAllReports() {
    try {
        showNotification('Exporting all reports...', 'info');
        
        // This would typically generate and download reports
        // For now, we'll just show a success message
        setTimeout(() => {
            showNotification('Reports exported successfully!', 'success');
        }, 2000);
        
    } catch (error) {
        console.error('Error exporting reports:', error);
        showNotification('Error exporting reports', 'error');
    }
}

// ==================== CUSTOMER FUNCTIONS ====================

// Load customers from API
async function loadCustomersFromAPI() {
    try {
        const response = await fetch('/api/customers');
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading customers:', error);
        return [];
    }
}

// Render customer table with data
function renderCustomerTable(customers) {
    const tableBody = document.querySelector('#customersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (customers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #6b7280;">
                    No customers found. Add your first customer!
                </td>
            </tr>
        `;
        return;
    }
    
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.customerId}</td>
            <td>
                <div class="customer-info">
                    <div class="customer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="customer-details">
                        <div class="customer-name">${customer.firstName} ${customer.lastName}</div>
                        <div class="customer-age">Age: ${customer.age || 'N/A'}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="contact-info">
                    <div><i class="fas fa-envelope"></i> ${customer.email}</div>
                    <div><i class="fas fa-phone"></i> ${customer.phone}</div>
                </div>
            </td>
            <td>
                <div class="membership-info">
                    <div class="membership-type">${customer.membership.type}</div>
                    <div class="membership-status">${customer.membership.isActive ? 'Active' : 'Inactive'}</div>
                </div>
            </td>
            <td>
                <div class="class-info">
                    <div><i class="fas fa-calendar"></i> ${customer.classHistory.length} classes</div>
                    <div><i class="fas fa-box"></i> ${customer.packages.length} packages</div>
                </div>
            </td>
            <td>
                <div class="balance-info">
                    <div class="balance-amount">$${customer.paymentInfo.balance}</div>
                    <div class="payment-method">${customer.paymentInfo.paymentMethod}</div>
                </div>
            </td>
            <td>
                <span class="status-badge ${customer.status} clickable-status" onclick="toggleCustomerStatus('${customer._id}', '${customer.status}')" title="Click to toggle status">
                    ${customer.status}
                </span>
            </td>
            <td class="action-buttons">
                <button class="btn-icon view" onclick="handleViewCustomerDetails('${customer._id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit" onclick="handleEditCustomer('${customer._id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="handleDeleteCustomer('${customer._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update customer statistics
async function updateCustomerStats(customers) {
    try {
        // Calculate total customers
        const totalCustomers = customers.length;
        document.getElementById('totalCustomers').textContent = totalCustomers;
        
        // Calculate active customers
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        document.getElementById('activeCustomers').textContent = activeCustomers;
        
        // Calculate classes this week (simplified)
        const classesThisWeek = customers.reduce((total, customer) => {
            const thisWeek = customer.classHistory.filter(history => {
                const historyDate = new Date(history.attendanceDate);
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return historyDate >= weekAgo;
            }).length;
            return total + thisWeek;
        }, 0);
        document.getElementById('customerClassesThisWeek').textContent = classesThisWeek;
        
        // Calculate total revenue (simplified)
        const totalRevenue = customers.reduce((total, customer) => {
            return total + (customer.paymentInfo.balance || 0);
        }, 0);
        document.getElementById('totalRevenue').textContent = `$${totalRevenue}`;
        
    } catch (error) {
        console.error('Error updating customer stats:', error);
    }
}

// Refresh customer list
async function refreshCustomerList() {
    const refreshBtn = document.getElementById('refreshCustomersBtn');
    const originalContent = refreshBtn.innerHTML;
    
    // Show loading state
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    refreshBtn.disabled = true;
    
    try {
        const customers = await loadCustomersFromAPI();
        renderCustomerTable(customers);
        await updateCustomerStats(customers);
    } catch (error) {
        console.error('Error refreshing customer list:', error);
        showNotification('Error loading customers', 'error');
    } finally {
        // Restore button state
        refreshBtn.innerHTML = originalContent;
        refreshBtn.disabled = false;
    }
}

// View customer details
async function handleViewCustomerDetails(customerId) {
    try {
        const response = await fetch(`/api/customers/${customerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch customer details');
        }
        
        const customer = await response.json();
        showCustomerDetailsModal(customer);
    } catch (error) {
        console.error('Error fetching customer details:', error);
        showNotification('Error loading customer details', 'error');
    }
}

// Show customer details modal
function showCustomerDetailsModal(customer) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal show" id="customerDetailsModal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Customer Details</h2>
                    <button class="modal-close" onclick="closeCustomerDetailsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="customer-details-content">
                    <div class="customer-profile">
                        <div class="customer-avatar-large">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="customer-basic-info">
                            <h3>${customer.firstName} ${customer.lastName}</h3>
                            <p class="customer-id">ID: ${customer.customerId}</p>
                            <span class="status-badge ${customer.status}">${customer.status}</span>
                        </div>
                    </div>
                    
                    <div class="details-grid">
                        <div class="detail-section">
                            <h4><i class="fas fa-envelope"></i> Contact Information</h4>
                            <div class="detail-item">
                                <label>Email:</label>
                                <span>${customer.email}</span>
                            </div>
                            <div class="detail-item">
                                <label>Phone:</label>
                                <span>${customer.phone}</span>
                            </div>
                            <div class="detail-item">
                                <label>Age:</label>
                                <span>${customer.age || 'N/A'} years old</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-map-marker-alt"></i> Address</h4>
                            <div class="detail-item">
                                <label>Street:</label>
                                <span>${customer.address.street}</span>
                            </div>
                            <div class="detail-item">
                                <label>City:</label>
                                <span>${customer.address.city}</span>
                            </div>
                            <div class="detail-item">
                                <label>State:</label>
                                <span>${customer.address.state}</span>
                            </div>
                            <div class="detail-item">
                                <label>ZIP Code:</label>
                                <span>${customer.address.zipCode}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-id-card"></i> Membership</h4>
                            <div class="detail-item">
                                <label>Type:</label>
                                <span>${customer.membership.type}</span>
                            </div>
                            <div class="detail-item">
                                <label>Status:</label>
                                <span>${customer.membership.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Start Date:</label>
                                <span>${new Date(customer.membership.startDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-dollar-sign"></i> Payment Information</h4>
                            <div class="detail-item">
                                <label>Balance:</label>
                                <span>$${customer.paymentInfo.balance}</span>
                            </div>
                            <div class="detail-item">
                                <label>Payment Method:</label>
                                <span>${customer.paymentInfo.paymentMethod}</span>
                            </div>
                            <div class="detail-item">
                                <label>Classes Attended:</label>
                                <span>${customer.classHistory.length}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-phone-alt"></i> Emergency Contact</h4>
                            <div class="detail-item">
                                <label>Name:</label>
                                <span>${customer.emergencyContact.name}</span>
                            </div>
                            <div class="detail-item">
                                <label>Relationship:</label>
                                <span>${customer.emergencyContact.relationship}</span>
                            </div>
                            <div class="detail-item">
                                <label>Phone:</label>
                                <span>${customer.emergencyContact.phone}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="closeCustomerDetailsModal()">Close</button>
                        <button class="btn btn-primary" onclick="handleEditCustomer('${customer._id}'); closeCustomerDetailsModal();">
                            <i class="fas fa-edit"></i> Edit Customer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close customer details modal
function closeCustomerDetailsModal() {
    const modal = document.getElementById('customerDetailsModal');
    if (modal) {
        modal.remove();
    }
}

// Edit customer
async function handleEditCustomer(customerId) {
    try {
        const response = await fetch(`/api/customers/${customerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch customer details');
        }
        
        const customer = await response.json();
        openEditCustomerModal(customer);
    } catch (error) {
        console.error('Error fetching customer details:', error);
        showNotification('Error loading customer details for editing', 'error');
    }
}

// Open edit customer modal with pre-filled data
function openEditCustomerModal(customer) {
    const modal = document.getElementById('customerModal');
    const modalTitle = document.getElementById('customerModalTitle');
    const form = document.getElementById('customerForm');
    
    modalTitle.textContent = 'Edit Customer';
    form.reset();
    
    // Pre-fill form with customer data
    document.getElementById('customerFirstName').value = customer.firstName || '';
    document.getElementById('customerLastName').value = customer.lastName || '';
    document.getElementById('customerEmail').value = customer.email || '';
    document.getElementById('customerPhone').value = customer.phone || '';
    document.getElementById('customerDateOfBirth').value = customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : '';
    document.getElementById('customerFitnessLevel').value = customer.medicalInfo?.fitnessLevel || 'Beginner';
    document.getElementById('customerStreet').value = customer.address?.street || '';
    document.getElementById('customerCity').value = customer.address?.city || '';
    document.getElementById('customerState').value = customer.address?.state || '';
    document.getElementById('customerZipCode').value = customer.address?.zipCode || '';
    document.getElementById('emergencyName').value = customer.emergencyContact?.name || '';
    document.getElementById('emergencyRelationship').value = customer.emergencyContact?.relationship || '';
    document.getElementById('emergencyPhone').value = customer.emergencyContact?.phone || '';
    document.getElementById('membershipType').value = customer.membership?.type || 'Drop-in';
    document.getElementById('paymentMethod').value = customer.paymentInfo?.paymentMethod || 'Cash';
    document.getElementById('initialBalance').value = customer.paymentInfo?.balance || 0;
    document.getElementById('hasInjuries').checked = customer.medicalInfo?.hasInjuries || false;
    document.getElementById('injuries').value = customer.medicalInfo?.injuries?.join(', ') || '';
    document.getElementById('medications').value = customer.medicalInfo?.medications?.join(', ') || '';
    document.getElementById('allergies').value = customer.medicalInfo?.allergies?.join(', ') || '';
    document.getElementById('customerNotes').value = customer.notes || '';
    
    // Show/hide injuries group
    const injuriesGroup = document.getElementById('injuriesGroup');
    if (customer.medicalInfo?.hasInjuries) {
        injuriesGroup.style.display = 'block';
    } else {
        injuriesGroup.style.display = 'none';
    }
    
    // Store customer ID for update
    form.dataset.customerId = customer._id;
    form.dataset.isEdit = 'true';
    
    modal.classList.add('show');
    
    setTimeout(() => {
        document.getElementById('customerFirstName').focus();
    }, 100);
}

// Customer form functions
function openAddCustomerModal() {
    const modal = document.getElementById('customerModal');
    const modalTitle = document.getElementById('customerModalTitle');
    const form = document.getElementById('customerForm');
    
    modalTitle.textContent = 'Add New Customer';
    form.reset();
    
    // Clear form data attributes
    delete form.dataset.customerId;
    delete form.dataset.isEdit;
    
    modal.classList.add('show');
    
    setTimeout(() => {
        document.getElementById('customerFirstName').focus();
    }, 100);
}

async function handleCustomerFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitCustomerForm');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        // Convert FormData to object
        const customerData = {};
        for (let [key, value] of formData.entries()) {
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                if (!customerData[parent]) customerData[parent] = {};
                customerData[parent][child] = value;
            } else {
                customerData[key] = value;
            }
        }
        
        // Handle medical info
        customerData.medicalInfo = {
            hasInjuries: formData.has('hasInjuries'),
            injuries: customerData.injuries ? customerData.injuries.split(',').map(i => i.trim()).filter(i => i) : [],
            medications: customerData.medications ? customerData.medications.split(',').map(m => m.trim()).filter(m => m) : [],
            allergies: customerData.allergies ? customerData.allergies.split(',').map(a => a.trim()).filter(a => a) : [],
            fitnessLevel: customerData.fitnessLevel || 'Beginner'
        };
        
        // Handle membership
        customerData.membership = {
            type: customerData.membershipType || 'Drop-in',
            startDate: new Date(),
            isActive: true
        };
        
        // Handle payment info
        customerData.paymentInfo = {
            balance: parseFloat(customerData.initialBalance) || 0,
            paymentMethod: customerData.paymentMethod || 'Cash'
        };
        
        // Clean up the data
        delete customerData.membershipType;
        delete customerData.initialBalance;
        delete customerData.paymentMethod;
        delete customerData.injuries;
        delete customerData.medications;
        delete customerData.allergies;
        delete customerData.fitnessLevel;
        
        // Check if this is an edit or create operation
        const isEdit = form.dataset.isEdit === 'true';
        const customerId = form.dataset.customerId;
        
        let result;
        if (isEdit && customerId) {
            // Update existing customer
            result = await updateCustomerToAPI(customerId, customerData);
            if (result.success) {
                showNotification(`Customer ${result.data.customerId} updated successfully!`, 'success');
            }
        } else {
            // Create new customer
            result = await saveCustomerToAPI(customerData);
            if (result.success) {
                showNotification(`Customer ${result.data.customerId} added successfully!`, 'success');
            }
        }
        
        if (result.success) {
            closeCustomerModal();
            
            // Clear form data attributes
            delete form.dataset.customerId;
            delete form.dataset.isEdit;
            
            // Refresh the customer list and stats
            await refreshCustomerList();
        } else {
            throw new Error(result.error || 'Failed to save customer');
        }
        
    } catch (error) {
        console.error('Error saving customer:', error);
        showNotification('Error saving customer. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Customer';
    }
}

async function saveCustomerToAPI(data) {
    try {
        const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to save customer');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function updateCustomerToAPI(customerId, data) {
    try {
        const response = await fetch(`/api/customers/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.message || errorData.msg || 'Failed to update customer');
        }

        const result = await response.json();
        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Delete customer
async function handleDeleteCustomer(customerId) {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/customers/${customerId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete customer');
        }
        
        showNotification('Customer deleted successfully!', 'success');
        
        // Refresh the customer list
        await refreshCustomerList();
        
    } catch (error) {
        console.error('Error deleting customer:', error);
        showNotification('Error deleting customer', 'error');
    }
}

// Toggle customer status
async function toggleCustomerStatus(customerId, currentStatus) {
    const statusOptions = ['active', 'inactive', 'suspended'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const newStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    try {
        const response = await fetch(`/api/customers/${customerId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update customer status');
        }
        
        showNotification(`Customer status updated to ${newStatus}`, 'success');
        
        // Refresh the customer list
        await refreshCustomerList();
        
    } catch (error) {
        console.error('Error updating customer status:', error);
        showNotification('Error updating customer status', 'error');
    }
}

// Export functions for potential use in other modules
window.YogiTrack = {
    showSection,
    showNotification,
    validateForm,
    generateId,
    formatCurrency,
    formatDate,
    saveToLocalStorage,
    loadFromLocalStorage,
    openAddInstructorModal,
    filterInstructors,
    handleEditInstructor,
    handleDeleteInstructor,
    handleViewInstructor,
    handleViewInstructorDetails,
    handleEditInstructor,
    handleDeleteInstructor,
    openEditInstructorModal,
    showInstructorDetailsModal,
    closeInstructorDetailsModal,
    updateInstructorToAPI,
    toggleInstructorStatus,
    loadInstructorsFromAPI,
    saveInstructorToAPI,
    refreshInstructorList,
    renderInstructorTable,
    updateInstructorStats,
    getClassesThisWeek,
    calculateAverageRating,
    calculateMonthlyPayroll,
    loadClassesFromAPI,
    renderWeeklySchedule,
    setupClassesEventListeners,
    loadClasses,
    openAddClassModal,
    populateInstructorDropdown,
    setupClassModalEventListeners,
    setupClassFormEventListeners,
    saveClassToAPI,
    renderClassListView,
    viewClass,
    editClass,
    deleteClass,
    // Customer functions
    loadCustomersFromAPI,
    renderCustomerTable,
    updateCustomerStats,
    refreshCustomerList,
    openAddCustomerModal,
    handleCustomerFormSubmit,
    saveCustomerToAPI,
    updateCustomerToAPI,
    handleViewCustomerDetails,
    handleEditCustomer,
    handleDeleteCustomer,
    toggleCustomerStatus,
    setupCustomerModalEventListeners,
    setupCustomerFormEventListeners,
    closeCustomerModal,
    openEditCustomerModal,
    // Package functions
    loadPackagesFromAPI,
    renderPackageCards,
    renderPackageTable,
    updatePackageStats,
    refreshPackageList,
    togglePackageView,
    openAddPackageModal,
    handlePackageFormSubmit,
    savePackageToAPI,
    updatePackageToAPI,
    handleViewPackageDetails,
    handleEditPackage,
    handleDeletePackage,
    togglePackageStatus,
    setupPackageModalEventListeners,
    setupPackageFormEventListeners,
    closePackageModal,
    openEditPackageModal,
    showPackageDetailsModal,
    closePackageDetailsModal,
    // Sales functions
    loadSalesFromAPI,
    renderSalesTable,
    updateSalesStats,
    refreshSalesList,
    openRecordSaleModal,
    handleSaleFormSubmit,
    saveSaleToAPI,
    updateSaleToAPI,
    handleViewSaleDetails,
    handleEditSale,
    handleDeleteSale,
    toggleSaleStatus,
    setupSalesModalEventListeners,
    setupSalesFormEventListeners,
    closeSaleModal,
    openEditSaleModal,
    showSaleDetailsModal,
    closeSaleDetailsModal,
    loadCustomersForSale,
    loadPackagesForSale,
    handleCustomerSelection,
    handlePackageSelection,
    handleValidityStartDateChange,
    updateSaleSummary,
    // Attendance functions
    loadAttendanceFromAPI,
    renderAttendanceTable,
    updateAttendanceStats,
    refreshAttendanceList,
    openRecordAttendanceModal,
    handleAttendanceFormSubmit,
    saveAttendanceToAPI,
    updateAttendanceToAPI,
    handleViewAttendanceDetails,
    handleEditAttendance,
    handleDeleteAttendance,
    toggleAttendanceStatus,
    setupAttendanceModalEventListeners,
    setupAttendanceFormEventListeners,
    closeAttendanceModal,
    openEditAttendanceModal,
    showAttendanceDetailsModal,
    closeAttendanceDetailsModal,
    loadInstructorsForAttendance,
    loadCustomersForAttendance,
    handleInstructorSelection,
    handleClassSelection,
    checkScheduleWarning,
    filterCustomers,
    updateAttendanceSummary,
    // Reports functions
    setupReportsEventListeners,
    loadReportsSummary,
    updateReportsSummaryStats,
    refreshReportsSummary,
    generatePackageSalesReport,
    displayPackageSalesReport,
    generateInstructorClassesReport,
    displayInstructorClassesReport,
    generateCustomerPackagesReport,
    displayCustomerPackagesReport,
    generateTeacherPaymentsReport,
    displayTeacherPaymentsReport
};
