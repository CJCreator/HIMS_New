import { createSlice } from '@reduxjs/toolkit';

const recordDownloadSlice = createSlice({
  name: 'recordDownload',
  initialState: {
    availableRecords: [
      { id: '1', type: 'Lab Results', date: '2024-02-10', category: 'labs' },
      { id: '2', type: 'Prescription History', date: '2024-02-08', category: 'prescriptions' },
      { id: '3', type: 'Immunization Records', date: '2024-01-15', category: 'immunizations' },
      { id: '4', type: 'Visit Summary', date: '2024-02-05', category: 'visits' },
      { id: '5', type: 'Imaging Reports', date: '2024-01-20', category: 'imaging' },
    ],
    downloadHistory: [
      { id: 'D1', recordIds: ['1', '2'], format: 'PDF', date: '2024-02-12T10:30:00Z', size: '2.4 MB' },
    ],
  },
  reducers: {
    addDownload: (state, action) => {
      state.downloadHistory.unshift(action.payload);
    },
  },
});

export const { addDownload } = recordDownloadSlice.actions;
export default recordDownloadSlice.reducer;
