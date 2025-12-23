# Deprecated Consultation Flows

The following consultation flow files are deprecated and should not be used for new development:

- `Phase2ConsultationFlow.tsx` - Development iteration (deprecated)
- `Phase3ConsultationFlow.tsx` - Development iteration (deprecated)
- `UnifiedConsultationFlow.tsx` - Superseded by FinalConsultationFlow (deprecated)
- `ConsultationFlow.tsx` - Original implementation (deprecated)

## Active Implementation

Use `FinalConsultationFlow.tsx` for all consultation workflows.

## Build Note

These files contain TypeScript errors due to component prop mismatches. They are kept for reference but are not used in the application routing.

To prevent build errors, these files have been temporarily modified to export stub components.
