// Re-export the canonical HR context implementation from `src/contexts`.
// Several components import from `src/context/HRContext` (singular).
// To avoid duplicate context instances, re-export the provider and hook
// from the canonical `src/contexts/HRContext.tsx` file.
export { HRProvider, useHR } from '../contexts/HRContext';
