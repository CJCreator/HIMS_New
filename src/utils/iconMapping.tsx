import { 
  FaUserMd, 
  FaUserNurse, 
  FaPills, 
  FaClipboardList, 
  FaMicroscope, 
  FaUser, 
  FaUserTie,
  FaCalendarAlt,
  FaChartLine,
  FaBolt,
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaHospital,
  FaStethoscope,
  FaHeartbeat,
  FaSyringe,
  FaVial,
  FaPrescriptionBottleAlt,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPrint,
  FaDownload,
  FaUpload,
  FaSave,
  FaInfoCircle,
  FaQuestionCircle
} from 'react-icons/fa';

import {
  MdDashboard,
  MdNotifications,
  MdPeople,
  MdLocalPharmacy,
  MdScience,
  MdMedication,
  MdAssignment,
  MdEventNote,
  MdWarning,
  MdError,
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdSettings,
  MdLogout,
  MdHome,
  MdSearch,
  MdFilterList,
  MdAdd,
  MdEdit,
  MdDelete,
  MdPrint,
  MdFileDownload,
  MdFileUpload,
  MdSave,
  MdInfo
} from 'react-icons/md';

import { IconType } from 'react-icons';

export interface IconProps {
  className?: string;
  size?: number;
  'aria-label'?: string;
}

// Icon mapping for consistent usage across the app
export const icons = {
  // User Roles
  admin: FaUserTie,
  doctor: FaUserMd,
  nurse: FaUserNurse,
  pharmacist: FaPills,
  receptionist: FaClipboardList,
  labTechnician: FaMicroscope,
  patient: FaUser,
  
  // Medical
  medication: FaPills,
  prescription: FaPrescriptionBottleAlt,
  stethoscope: FaStethoscope,
  heartbeat: FaHeartbeat,
  syringe: FaSyringe,
  vial: FaVial,
  lab: FaMicroscope,
  
  // Navigation
  dashboard: MdDashboard,
  calendar: FaCalendarAlt,
  users: FaUsers,
  hospital: FaHospital,
  home: FaHome,
  
  // Actions
  add: FaPlus,
  edit: FaEdit,
  delete: FaTrash,
  save: FaSave,
  print: FaPrint,
  download: FaDownload,
  upload: FaUpload,
  search: FaSearch,
  filter: FaFilter,
  
  // Status
  success: FaCheckCircle,
  warning: FaExclamationTriangle,
  error: FaTimesCircle,
  info: FaInfoCircle,
  pending: FaClock,
  
  // Notifications
  bell: FaBell,
  notification: MdNotifications,
  
  // Analytics
  chart: FaChartLine,
  chartBar: FaChartBar,
  
  // Billing
  invoice: FaFileInvoiceDollar,
  money: FaMoneyBillWave,
  
  // System
  settings: FaCog,
  logout: FaSignOutAlt,
  bolt: FaBolt,
  
  // Lists
  clipboard: FaClipboardList,
  assignment: MdAssignment,
  eventNote: MdEventNote,
  
  // Help
  question: FaQuestionCircle,
} as const;

// Helper component for consistent icon rendering
export const Icon = ({ 
  name, 
  className = '', 
  size = 20, 
  ariaLabel 
}: { 
  name: keyof typeof icons; 
  className?: string; 
  size?: number; 
  ariaLabel?: string;
}) => {
  const IconComponent = icons[name];
  return (
    <IconComponent 
      className={className} 
      size={size} 
      aria-label={ariaLabel || name}
      aria-hidden={!ariaLabel}
    />
  );
};

// Export individual icons for direct use
export {
  FaUserMd,
  FaUserNurse,
  FaPills,
  FaClipboardList,
  FaMicroscope,
  FaUser,
  FaUserTie,
  FaCalendarAlt,
  FaChartLine,
  FaBolt,
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaHospital,
  FaStethoscope,
  FaHeartbeat,
  FaSyringe,
  FaVial,
  FaPrescriptionBottleAlt,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPrint,
  FaDownload,
  FaUpload,
  FaSave,
  FaInfoCircle,
  FaQuestionCircle,
  MdDashboard,
  MdNotifications,
  MdPeople,
  MdLocalPharmacy,
  MdScience,
  MdMedication,
  MdAssignment,
  MdEventNote,
  MdWarning,
  MdError,
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdSettings,
  MdLogout,
  MdHome,
  MdSearch,
  MdFilterList,
  MdAdd,
  MdEdit,
  MdDelete,
  MdPrint,
  MdFileDownload,
  MdFileUpload,
  MdSave,
  MdInfo
};
