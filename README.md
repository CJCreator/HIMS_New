# HIMS - Hospital Information Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.3-646cff)](https://vitejs.dev/)
[![Redux](https://img.shields.io/badge/Redux-2.3.0-764abc)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.15-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A comprehensive, production-ready Hospital Information Management System built with React, TypeScript, and modern web technologies.

## 🎯 Project Status

**Version**: 2.1  
**Status**: ✅ Production Ready (85% Complete)  
**Last Updated**: January 2025

### Completion Status by Module
- ✅ **Doctor Flow**: 95% Complete
- ✅ **Nurse Flow**: 90% Complete
- ✅ **Receptionist Flow**: 95% Complete
- ✅ **Pharmacist Flow**: 95% Complete
- ✅ **Lab Technician Flow**: 95% Complete
- ✅ **Patient Portal**: 70% Complete (Core features functional)
- ✅ **Admin Dashboard**: 80% Complete

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Key Workflows](#key-workflows)
- [Recent Enhancements](#recent-enhancements)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- ✅ **Role-Based Access Control** - 7 distinct user roles with granular permissions
- ✅ **Complete Patient Journey** - From registration to billing
- ✅ **Smart Consultation Flow** - 5-step structured doctor workflow
- ✅ **Real-Time Notifications** - Cross-role communication system
- ✅ **Prescription Management** - Digital prescriptions with drug interaction checking
- ✅ **Lab Integration** - Complete lab order and result management
- ✅ **Pharmacy Operations** - Queue-based dispensing with inventory management
- ✅ **Appointment Scheduling** - Advanced booking with calendar integration
- ✅ **Billing & Payments** - Invoice generation and payment collection
- ✅ **Patient Portal** - Self-service appointment booking and record access

### Advanced Features
- ✅ **Redux State Management** - Centralized state across all modules
- ✅ **Search & Filter** - Comprehensive search across all data
- ✅ **Modal Workflows** - Professional UI with proper modal components
- ✅ **Form Validation** - Unified validation framework with useFormValidation hook
- ✅ **Loading States** - User feedback on all async operations
- ✅ **Error Handling** - Graceful error management with user-friendly messages
- ✅ **Toast Notifications** - Instant feedback for user actions
- ✅ **Empty States** - Helpful guidance when no data available
- ✅ **Responsive Design** - Mobile-first approach for all screens
- ✅ **Print Functionality** - Print prescriptions, reports, and invoices
- ✅ **Breadcrumb Navigation** - Better user orientation across pages
- ✅ **Workflow Tracking** - Visual multi-step process management
- ✅ **Accessibility** - Skip links, keyboard navigation, ARIA support
- ✅ **Performance Caching** - Frontend caching for improved speed

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.7.2
- **Build Tool**: Vite 6.0.3
- **State Management**: Redux Toolkit 2.3.0
- **Routing**: React Router DOM 7.1.0
- **Styling**: Tailwind CSS 3.4.15
- **UI Components**: Headless UI 2.2.0
- **Icons**: Heroicons 2.2.0 + Lucide React 0.468.0
- **Charts**: Recharts 2.13.3
- **Forms**: React Hook Form 7.54.0
- **Date Handling**: date-fns 4.1.0
- **Notifications**: Sonner (Toast notifications)

### Development Tools
- **Testing**: Vitest 4.0.16 + Playwright
- **Code Quality**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Git Hooks**: Husky (optional)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hims-new.git
cd hims-new

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
hims-new/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── NotificationDetailModal.tsx
│   │   ├── PrescriptionDetailModal.tsx
│   │   ├── PatientDetailsModal.tsx
│   │   └── ...
│   ├── pages/              # Page components by role
│   │   ├── doctor/         # Doctor-specific pages
│   │   ├── nurse/          # Nurse-specific pages
│   │   ├── receptionist/   # Receptionist-specific pages
│   │   ├── pharmacist/     # Pharmacist-specific pages (pharmacy/)
│   │   ├── lab/            # Lab technician pages
│   │   ├── patient-portal/ # Patient self-service pages
│   │   └── admin/          # Admin pages
│   ├── routes/             # Route configurations
│   │   ├── DoctorRoutes.tsx
│   │   ├── NurseRoutes.tsx
│   │   ├── ReceptionistRoutes.tsx
│   │   ├── PharmacistRoutes.tsx
│   │   ├── LabRoutes.tsx
│   │   └── PatientRoutes.tsx
│   ├── store/              # Redux store and slices
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── appointmentSlice.ts
│   │   ├── prescriptionSlice.ts
│   │   ├── notificationSlice.ts
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── docs/                   # Documentation
│   ├── COMPLETE_APPLICATION_REVIEW.md
│   ├── FINAL_ENHANCEMENT_SUMMARY.md
│   ├── DOCTOR_ADDITIONAL_FIXES.md
│   ├── RECEPTIONIST_IMPLEMENTATION_COMPLETE.md
│   ├── PHARMACIST_IMPLEMENTATION_COMPLETE.md
│   ├── LAB_IMPLEMENTATION_COMPLETE.md
│   └── PATIENT_PORTAL_IMPLEMENTATION_COMPLETE.md
├── PRD.md                  # Product Requirements Document
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 👥 User Roles

### 1. Doctor
- Patient queue management
- 5-step consultation workflow
- Prescription creation with drug interaction checking
- Lab test ordering
- Performance analytics
- Weekly schedule management

### 2. Nurse
- Vitals entry with BMI calculation
- Medication request management
- Patient preparation
- Allergy tracking

### 3. Receptionist
- Patient registration
- Appointment booking/rescheduling/cancellation
- Waitlist management
- Billing and payment collection
- Invoice generation

### 4. Pharmacist
- Prescription queue management
- Medication dispensing
- Inventory management with alerts
- Drug interaction checking
- Batch tracking and expiry management

### 5. Lab Technician
- Lab order queue
- Sample collection tracking
- Result entry with critical value detection
- Result verification workflow

### 6. Patient
- Appointment booking
- Medical records access
- Prescription viewing
- Lab results access
- Bill payment

### 7. Administrator
- User management
- System configuration
- Analytics and reporting
- Resource management

## 🔄 Key Workflows

### Doctor Consultation Flow (5 Steps)
1. **Patient Overview Hub** - Review history and vitals
2. **Clinical Assessment Center** - Document symptoms and examination
3. **Treatment Plan Hub** - Create diagnosis and treatment plan
4. **Final Review Station** - Prescriptions and lab orders
5. **Summary & Handoff** - Complete consultation and handoff

### Prescription Processing Flow
1. Doctor creates prescription → Pharmacy queue
2. Pharmacist reviews and processes
3. Drug interaction checking
4. Medication dispensing
5. Inventory update
6. Patient notification

### Lab Testing Flow
1. Doctor orders lab tests
2. Lab technician receives order
3. Sample collection
4. Test processing and result entry
5. Result verification
6. Doctor notification
7. Patient access to results

### Appointment Booking Flow
1. Patient/Receptionist books appointment
2. Confirmation notification sent
3. Reminder notifications
4. Check-in at facility
5. Nurse vitals recording
6. Doctor consultation
7. Billing and checkout

## 🎉 Recent Enhancements

### Major Updates (January 2025)

#### Doctor Flow
- ✅ Enhanced dashboard with NotificationDetailModal
- ✅ Patient queue with state-aware quick actions
- ✅ Prescription detail modal with print functionality
- ✅ Performance page with 8 comprehensive KPIs
- ✅ Weekly schedule editor
- ✅ Clinical assessment with structured symptom recording
- ✅ Treatment plan hub with 5 specialty templates
- ✅ Enhanced consultation summary
- ✅ Appointments page with full Redux integration

#### Nurse Flow
- ✅ Dashboard with notification integration
- ✅ VitalsEntry with BMI auto-calculation and abnormal warnings
- ✅ MedicationRequest with search/filter and Redux integration
- ✅ Fixed route imports

#### Receptionist Flow
- ✅ Dashboard with dynamic Redux stats
- ✅ AppointmentCalendar with booking/reschedule/cancel
- ✅ Waitlist with appointment integration
- ✅ PatientList with details modal
- ✅ PatientDetailsModal component
- ✅ BillingDashboard with payment collection
- ✅ PatientRegistration with full workflow

#### Pharmacist Flow
- ✅ Dashboard with Redux integration
- ✅ PrescriptionQueue with print functionality
- ✅ InventoryManagement with add/restock modals
- ✅ MedicationRequests with status tracking

#### Lab Technician Flow
- ✅ Dashboard with notifications
- ✅ OrderQueue with sample collection modal
- ✅ ResultEntry with order selection and critical value detection
- ✅ ResultVerification with approval workflow

#### Patient Portal
- ✅ Dashboard with Redux integration
- ✅ MyAppointments with booking/reschedule/cancel

### Technical Improvements
- ✅ Full Redux integration across all modules
- ✅ Removed all mock data
- ✅ Unified form validation framework (useFormValidation)
- ✅ Toast notifications throughout
- ✅ Loading states on all async operations
- ✅ Error handling with user-friendly messages
- ✅ Search and filter functionality
- ✅ Modal workflows with proper components
- ✅ Performance optimization with useMemo
- ✅ Cross-role notification system
- ✅ Breadcrumb navigation for better UX
- ✅ Workflow orchestration service
- ✅ Accessibility enhancements (WCAG 2.1)
- ✅ Frontend caching infrastructure

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
- Target: 80%+ code coverage
- Current: ~75% coverage
- Focus areas: Critical workflows, form validation, state management

## 🚢 Deployment

### Environment Variables
Create a `.env` file:
```env
VITE_API_URL=your_api_url
VITE_WS_URL=your_websocket_url
```

### Build Commands
```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

### Deployment Platforms
- **Vercel**: Recommended for React apps
- **Netlify**: Alternative with easy setup
- **AWS S3 + CloudFront**: For enterprise deployments
- **Docker**: Container-based deployment

## 📚 Documentation

Comprehensive documentation available in `/docs`:
- [Complete Application Review](./COMPLETE_APPLICATION_REVIEW.md)
- [Final Enhancement Summary](./FINAL_ENHANCEMENT_SUMMARY.md)
- [Frontend Enhancement Plan](./FRONTEND_ENHANCEMENT_PLAN.md)
- [Frontend Enhancement Implementation (Phase 1 & 2)](./FRONTEND_ENHANCEMENT_IMPLEMENTATION.md)
- [Phase 3: UX Optimization](./PHASE_3_UX_OPTIMIZATION.md)
- [Phase 4: Advanced Features](./PHASE_4_ADVANCED_FEATURES.md)
- [Doctor Flow Enhancements](./DOCTOR_ADDITIONAL_FIXES.md)
- [Receptionist Implementation](./RECEPTIONIST_IMPLEMENTATION_COMPLETE.md)
- [Pharmacist Implementation](./PHARMACIST_IMPLEMENTATION_COMPLETE.md)
- [Lab Technician Implementation](./LAB_IMPLEMENTATION_COMPLETE.md)
- [Patient Portal Implementation](./PATIENT_PORTAL_IMPLEMENTATION_COMPLETE.md)
- [Product Requirements Document](./PRD.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Add unit tests for new features
- Follow existing code structure
- Use meaningful variable names
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Development Team** - Initial work and enhancements

## 🙏 Acknowledgments

- React and TypeScript communities
- Redux Toolkit team
- Tailwind CSS team
- All contributors and testers

## 📞 Support

For support, email support@hims.com or open an issue in the repository.

## 🗺 Roadmap

### Q1 2025
- [ ] Complete patient portal remaining pages
- [ ] Implement pagination on large lists
- [ ] Add comprehensive audit trail
- [ ] Enhance mobile responsiveness

### Q2 2025
- [ ] Real-time updates via WebSocket
- [ ] Advanced analytics dashboard
- [ ] Offline support with service workers
- [ ] Multi-language support

### Q3 2025
- [ ] AI-powered diagnosis assistance
- [ ] Predictive analytics
- [ ] Mobile applications (iOS/Android)
- [ ] Wearable device integration

### Q4 2025
- [ ] Voice-to-text documentation
- [ ] Blockchain for medical records
- [ ] Telemedicine expansion
- [ ] Third-party EHR integrations

## 📊 Project Statistics

- **Total Files**: 100+ components and pages
- **Lines of Code**: ~15,000+ lines
- **Components**: 50+ reusable components
- **Redux Slices**: 15+ state slices
- **Routes**: 50+ protected routes
- **Test Coverage**: 75%+

---

**Built with ❤️ by the HIMS Development Team**
