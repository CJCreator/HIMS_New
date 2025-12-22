import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import patientReducer from './patientSlice';
import appointmentReducer from './appointmentSlice';
import notificationReducer from './notificationSlice';
import medicationReducer from './medicationSlice';
import prescriptionReducer from './prescriptionSlice';
import labReducer from './labSlice';
import inventoryReducer from './inventorySlice';
import drugInteractionReducer from './drugInteractionSlice';
import reminderReducer from './reminderSlice';
import labResultsReducer from './labResultsSlice';
import feedbackReducer from './feedbackSlice';
import allergyReducer from './allergySlice';
import timelineReducer from './timelineSlice';
import problemListReducer from './problemListSlice';
import immunizationReducer from './immunizationSlice';
import signatureReducer from './signatureSlice';
import recurringAppointmentReducer from './recurringAppointmentSlice';
import waitlistReducer from './waitlistSlice';
import reorderReducer from './reorderSlice';
import batchReducer from './batchSlice';
import paymentPlanReducer from './paymentPlanSlice';
import healthSummaryReducer from './healthSummarySlice';
import adherenceReducer from './adherenceSlice';
import symptomReducer from './symptomSlice';
import messagingReducer from './messagingSlice';
import recordDownloadReducer from './recordDownloadSlice';
import doctorAnalyticsReducer from './doctorAnalyticsSlice';
import appointmentAnalyticsReducer from './appointmentAnalyticsSlice';
import revenueReducer from './revenueSlice';
import inventoryAnalyticsReducer from './inventoryAnalyticsSlice';
import demographicsReducer from './demographicsSlice';
import insuranceReducer from './insuranceSlice';
import { notificationMiddleware } from './notificationMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    appointments: appointmentReducer,
    notifications: notificationReducer,
    medication: medicationReducer,
    prescriptions: prescriptionReducer,
    lab: labReducer,
    inventory: inventoryReducer,
    drugInteraction: drugInteractionReducer,
    reminders: reminderReducer,
    labResults: labResultsReducer,
    feedback: feedbackReducer,
    allergies: allergyReducer,
    timeline: timelineReducer,
    problemList: problemListReducer,
    immunization: immunizationReducer,
    signature: signatureReducer,
    recurringAppointment: recurringAppointmentReducer,
    waitlist: waitlistReducer,
    reorder: reorderReducer,
    batch: batchReducer,
    paymentPlan: paymentPlanReducer,
    healthSummary: healthSummaryReducer,
    adherence: adherenceReducer,
    symptom: symptomReducer,
    messaging: messagingReducer,
    recordDownload: recordDownloadReducer,
    doctorAnalytics: doctorAnalyticsReducer,
    appointmentAnalytics: appointmentAnalyticsReducer,
    revenue: revenueReducer,
    inventoryAnalytics: inventoryAnalyticsReducer,
    demographics: demographicsReducer,
    insurance: insuranceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notificationMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;