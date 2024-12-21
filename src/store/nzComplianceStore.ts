import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  NZCompliance,
  NZEmploymentAgreement,
  NZLeaveEntitlements,
  NZPayrollDetails,
  NZHealthSafety
} from '../types/nz-compliance';

interface NZComplianceStore {
  compliance: Record<string, NZCompliance>; // keyed by employee ID
  
  // Employment Agreements
  createEmploymentAgreement: (employeeId: string, agreement: NZEmploymentAgreement) => void;
  updateEmploymentAgreement: (employeeId: string, agreement: Partial<NZEmploymentAgreement>) => void;
  
  // Leave Management
  updateLeaveEntitlements: (employeeId: string, entitlements: Partial<NZLeaveEntitlements>) => void;
  calculateLeaveBalance: (employeeId: string) => NZLeaveEntitlements;
  
  // Payroll
  updatePayrollDetails: (employeeId: string, details: Partial<NZPayrollDetails>) => void;
  calculateKiwiSaver: (salary: number, rate: number) => {
    employeeContribution: number;
    employerContribution: number;
  };
  
  // Health & Safety
  addHazard: (employeeId: string, hazard: NZHealthSafety['hazardRegisters'][0]) => void;
  reportIncident: (employeeId: string, incident: NZHealthSafety['incidents'][0]) => void;
  updateTraining: (employeeId: string, training: NZHealthSafety['training'][0]) => void;
  
  // Policy Management
  addPolicy: (policy: NZCompliance['policies'][0]) => void;
  acknowledgePolicy: (policyId: string, employeeId: string) => void;
  
  // Compliance Reporting
  generateComplianceReport: (employeeId: string) => {
    agreements: boolean;
    leave: boolean;
    payroll: boolean;
    healthSafety: boolean;
    policies: boolean;
  };
}

export const useNZComplianceStore = create<NZComplianceStore>()(
  persist(
    (set, get) => ({
      compliance: {},

      createEmploymentAgreement: (employeeId, agreement) =>
        set((state) => ({
          compliance: {
            ...state.compliance,
            [employeeId]: {
              ...state.compliance[employeeId],
              employmentAgreements: [
                ...(state.compliance[employeeId]?.employmentAgreements || []),
                agreement,
              ],
            },
          },
        })),

      updateEmploymentAgreement: (employeeId, agreement) =>
        set((state) => ({
          compliance: {
            ...state.compliance,
            [employeeId]: {
              ...state.compliance[employeeId],
              employmentAgreements: state.compliance[employeeId]?.employmentAgreements.map(
                (a) => (a.status === 'active' ? { ...a, ...agreement } : a)
              ),
            },
          },
        })),

      updateLeaveEntitlements: (employeeId, entitlements) =>
        set((state) => ({
          compliance: {
            ...state.compliance,
            [employeeId]: {
              ...state.compliance[employeeId],
              leaveEntitlements: {
                ...state.compliance[employeeId]?.leaveEntitlements,
                ...entitlements,
              },
            },
          },
        })),

      calculateLeaveBalance: (employeeId) => {
        const entitlements = get().compliance[employeeId]?.leaveEntitlements;
        if (!entitlements) {
          return {
            annualLeave: { entitled: 20, taken: 0, remaining: 20 },
            sickLeave: { entitled: 10, taken: 0, remaining: 10 },
            bereavementLeave: { taken: 0 },
            parentalLeave: { primaryCarer: false },
            familyViolenceLeave: { taken: 0, remaining: 10 },
          };
        }
        return entitlements;
      },

      updatePayrollDetails: (employeeId, details) =>
        set((state) => ({
          compliance: {
            ...state.compliance,
            [employeeId]: {
              ...state.compliance[employeeId],
              payroll: {
                ...state.compliance[employeeId]?.payroll,
                ...details,
              },
            },
          },
        })),

      calculateKiwiSaver: (salary, rate) => ({
        employeeContribution: (salary * rate) / 100,
        employerContribution: (salary * 3) / 100, // 3% minimum employer contribution
      }),

      addHazard: (employeeId, hazard) =>
        set((state) => ({
          compliance: {
            ...state.compliance,
            [employeeId]: {
              ...state.compliance[employeeId],
              healthAndSafety: {
                ...state.compliance[employeeId]?.healthAndSafety,
                hazardRegisters: [
                  ...(state.compliance[employeeId]?.healthAndSafety?.hazardRegisters || []),
                  hazard,
                ],
              },
            },
          },
        })),

      reportIncident: (employeeId, incident) =>
        set((state) => ({
          compliance: {
            ...state.compliance,
            [employeeId]: {
              ...state.compliance[employeeId],
              healthAndSafety: {
                ...state.compliance[employeeId]?.healthAndSafety,
                incidents: [
                  ...(state.compliance[employeeId]?.healthAndSafety?.incidents || []),
                  incident,
                ],
              },
            },
          },
        })),

      updateTraining: (employeeId, training) =>
        set((state) => ({
          compliance: {
            ...state.compliance,
            [employeeId]: {
              ...state.compliance[employeeId],
              healthAndSafety: {
                ...state.compliance[employeeId]?.healthAndSafety,
                training: [
                  ...(state.compliance[employeeId]?.healthAndSafety?.training || []),
                  training,
                ],
              },
            },
          },
        })),

      addPolicy: (policy) =>
        set((state) => ({
          policies: [...(state.policies || []), policy],
        })),

      acknowledgePolicy: (policyId, employeeId) =>
        set((state) => ({
          policies: state.policies?.map((p) =>
            p.id === policyId
              ? {
                  ...p,
                  acknowledgements: [...p.acknowledgements, employeeId],
                }
              : p
          ),
        })),

      generateComplianceReport: (employeeId) => {
        const emp = get().compliance[employeeId];
        if (!emp) return {
          agreements: false,
          leave: false,
          payroll: false,
          healthSafety: false,
          policies: false,
        };

        return {
          agreements: emp.employmentAgreements.some((a) => a.status === 'active'),
          leave: !!emp.leaveEntitlements,
          payroll: !!emp.payroll,
          healthSafety: !!emp.healthAndSafety,
          policies: true, // Assuming default policies are in place
        };
      },
    }),
    {
      name: 'nz-compliance-storage',
    }
  )
);