import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Feedback {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  doctorName: string;
  rating: number; // 0-10 for NPS
  category: 'promoter' | 'passive' | 'detractor';
  comments?: string;
  aspects: {
    waitTime: number;
    doctorCare: number;
    staffFriendliness: number;
    cleanliness: number;
    overall: number;
  };
  submittedAt: string;
}

interface FeedbackState {
  feedbacks: Feedback[];
  npsScore: number;
}

const mockFeedbacks: Feedback[] = [
  {
    id: 'FB001',
    patientId: 'P001',
    patientName: 'John Smith',
    appointmentId: 'APT001',
    doctorName: 'Dr. Wilson',
    rating: 9,
    category: 'promoter',
    comments: 'Excellent service, very professional',
    aspects: { waitTime: 4, doctorCare: 5, staffFriendliness: 5, cleanliness: 5, overall: 5 },
    submittedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'FB002',
    patientId: 'P002',
    patientName: 'Sarah Johnson',
    appointmentId: 'APT002',
    doctorName: 'Dr. Brown',
    rating: 7,
    category: 'passive',
    comments: 'Good experience overall',
    aspects: { waitTime: 3, doctorCare: 4, staffFriendliness: 4, cleanliness: 4, overall: 4 },
    submittedAt: '2024-01-14T14:30:00Z'
  },
  {
    id: 'FB003',
    patientId: 'P003',
    patientName: 'Mike Chen',
    appointmentId: 'APT003',
    doctorName: 'Dr. Wilson',
    rating: 10,
    category: 'promoter',
    comments: 'Outstanding care!',
    aspects: { waitTime: 5, doctorCare: 5, staffFriendliness: 5, cleanliness: 5, overall: 5 },
    submittedAt: '2024-01-13T16:00:00Z'
  }
];

const calculateNPS = (feedbacks: Feedback[]): number => {
  if (feedbacks.length === 0) return 0;
  const promoters = feedbacks.filter(f => f.rating >= 9).length;
  const detractors = feedbacks.filter(f => f.rating <= 6).length;
  return Math.round(((promoters - detractors) / feedbacks.length) * 100);
};

const initialState: FeedbackState = {
  feedbacks: mockFeedbacks,
  npsScore: calculateNPS(mockFeedbacks)
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    addFeedback: (state, action: PayloadAction<Omit<Feedback, 'id' | 'category' | 'submittedAt'>>) => {
      const rating = action.payload.rating;
      const category = rating >= 9 ? 'promoter' : rating >= 7 ? 'passive' : 'detractor';
      
      const newFeedback: Feedback = {
        ...action.payload,
        id: `FB${String(state.feedbacks.length + 1).padStart(3, '0')}`,
        category,
        submittedAt: new Date().toISOString()
      };
      
      state.feedbacks.unshift(newFeedback);
      state.npsScore = calculateNPS(state.feedbacks);
    }
  }
});

export const { addFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
