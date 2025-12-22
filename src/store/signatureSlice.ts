import { createSlice } from '@reduxjs/toolkit';

const signatureSlice = createSlice({
  name: 'signature',
  initialState: {
    signatures: [
      { id: '1', doctorId: 'D001', doctorName: 'Dr. Smith', signatureData: 'data:image/png;base64,iVBORw0KG...', createdAt: '2024-01-15T10:30:00Z' },
    ],
    signedPrescriptions: [
      { id: 'P001', prescriptionId: 'RX123', signatureId: '1', signedAt: '2024-01-15T10:35:00Z', ipAddress: '192.168.1.1' },
    ],
  },
  reducers: {
    saveSignature: (state, action) => {
      state.signatures.push(action.payload);
    },
    signPrescription: (state, action) => {
      state.signedPrescriptions.push({
        ...action.payload,
        signedAt: new Date().toISOString(),
        ipAddress: '192.168.1.1',
      });
    },
  },
});

export const { saveSignature, signPrescription } = signatureSlice.actions;
export default signatureSlice.reducer;
