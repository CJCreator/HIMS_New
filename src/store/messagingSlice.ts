import { createSlice } from '@reduxjs/toolkit';

const messagingSlice = createSlice({
  name: 'messaging',
  initialState: {
    threads: [
      { id: '1', subject: 'Lab Results Question', recipient: 'Dr. Smith', lastMessage: 'Thank you for clarifying', unread: 0, date: '2024-02-14' },
      { id: '2', subject: 'Prescription Refill', recipient: 'Pharmacy', lastMessage: 'Your refill is ready', unread: 1, date: '2024-02-15' },
    ],
    messages: [
      { id: 'M1', threadId: '1', sender: 'You', text: 'Can you explain my cholesterol results?', date: '2024-02-14T10:00:00Z', read: true },
      { id: 'M2', threadId: '1', sender: 'Dr. Smith', text: 'Your levels are within normal range...', date: '2024-02-14T14:30:00Z', read: true },
      { id: 'M3', threadId: '2', sender: 'You', text: 'I need a refill for my blood pressure medication', date: '2024-02-15T09:00:00Z', read: true },
      { id: 'M4', threadId: '2', sender: 'Pharmacy', text: 'Your refill is ready for pickup', date: '2024-02-15T11:00:00Z', read: false },
    ],
  },
  reducers: {
    sendMessage: (state, action) => {
      state.messages.push(action.payload);
      const thread = state.threads.find(t => t.id === action.payload.threadId);
      if (thread) {
        thread.lastMessage = action.payload.text;
        thread.date = action.payload.date.split('T')[0];
      }
    },
    createThread: (state, action) => {
      state.threads.unshift(action.payload);
    },
    markRead: (state, action) => {
      const thread = state.threads.find(t => t.id === action.payload);
      if (thread) thread.unread = 0;
      state.messages.filter(m => m.threadId === action.payload).forEach(m => m.read = true);
    },
  },
});

export const { sendMessage, createThread, markRead } = messagingSlice.actions;
export default messagingSlice.reducer;
