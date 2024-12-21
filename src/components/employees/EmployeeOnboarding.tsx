import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { CheckCircle, Circle, AlertCircle, Download, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { validateIRDNumber, validateBankAccount } from '../../utils/payrollUtils';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface EmployeeOnboardingProps {
  employeeId: string;
  onComplete: () => void;
}

export const EmployeeOnboarding = ({ employeeId, onComplete }: EmployeeOnboardingProps) => {
  const employee = useEmployeeStore((state) => state.getEmployeeById(employeeId));
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalDetails: {
      phoneNumber: employee?.phoneNumber || '',
      address: employee?.address || '',
      emergencyContact: employee?.emergencyContact || '',
    },
    payrollDetails: {
      bankAccount: employee?.bankAccount || '',
      taxCode: employee?.taxCode || '',
      irdNumber: employee?.irdNumber || '',
      kiwiSaverRate: employee?.kiwiSaverRate || '3',
      studentLoan: false,
    },
    documents: {
      photoId: false,
      visaDetails: false,
      qualifications: false,
      employmentAgreement: false,
      kiwiSaverForm: false,
      taxCode: false,
    },
    induction: {
      healthAndSafety: false,
      companyPolicies: false,
      itSystems: false,
      teamIntroduction: false,
    },
  });

  const steps = [
    {
      title: 'Personal Details',
      description: 'Contact and emergency information',
      fields: ['phoneNumber', 'address', 'emergencyContact'],
    },
    {
      title: 'Payroll Setup',
      description: 'Tax and payment information',
      fields: ['bankAccount', 'taxCode', 'irdNumber', 'kiwiSaverRate'],
    },
    {
      title: 'Document Verification',
      description: 'Required documentation',
      fields: ['photoId', 'visaDetails', 'qualifications'],
    },
    {
      title: 'Induction',
      description: 'Company induction process',
      fields: ['healthAndSafety', 'companyPolicies', 'itSystems', 'teamIntroduction'],
    },
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      // In a real app, this would upload the file
      toast.success('Document uploaded successfully');
    },
  });

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return Object.values(formData.personalDetails).every(Boolean);
      case 1:
        return (
          validateBankAccount(formData.payrollDetails.bankAccount) &&
          validateIRDNumber(formData.payrollDetails.irdNumber) &&
          formData.payrollDetails.taxCode &&
          formData.payrollDetails.kiwiSaverRate
        );
      case 2:
        return Object.values(formData.documents).every(Boolean);
      case 3:
        return Object.values(formData.induction).every(Boolean);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error('Please complete all required fields');
      return;
    }

    if (currentStep === steps.length - 1) {
      // Save all data
      updateEmployee(employeeId, {
        ...formData.personalDetails,
        ...formData.payrollDetails,
      });
      toast.success('Onboarding completed successfully');
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleDownloadTemplate = (template: string) => {
    // In a real app, this would download the actual template
    toast.success(`${template} template downloaded`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Employee Onboarding</h2>
          <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
        </div>
        <button
          onClick={() => handleDownloadTemplate('Onboarding Checklist')}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Download Checklist</span>
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index < steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index < currentStep
                  ? 'bg-green-100'
                  : index === currentStep
                  ? 'bg-indigo-100'
                  : 'bg-gray-100'
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="text-green-600" size={16} />
              ) : index === currentStep ? (
                <Circle className="text-indigo-600" size={16} />
              ) : (
                <Circle className="text-gray-400" size={16} />
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  index === currentStep ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-gray-400">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-green-200' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border p-6">
        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.personalDetails.phoneNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalDetails: {
                      ...formData.personalDetails,
                      phoneNumber: e.target.value,
                    },
                  })
                }
                className="input-field"
                placeholder="+64 XX XXX XXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={formData.personalDetails.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalDetails: {
                      ...formData.personalDetails,
                      address: e.target.value,
                    },
                  })
                }
                className="input-field"
                placeholder="Full address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact
              </label>
              <input
                type="text"
                value={formData.personalDetails.emergencyContact}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalDetails: {
                      ...formData.personalDetails,
                      emergencyContact: e.target.value,
                    },
                  })
                }
                className="input-field"
                placeholder="Name and contact number"
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Account
              </label>
              <input
                type="text"
                value={formData.payrollDetails.bankAccount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payrollDetails: {
                      ...formData.payrollDetails,
                      bankAccount: e.target.value,
                    },
                  })
                }
                className="input-field"
                placeholder="XX-XXXX-XXXXXXX-XX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Code
              </label>
              <select
                value={formData.payrollDetails.taxCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payrollDetails: {
                      ...formData.payrollDetails,
                      taxCode: e.target.value,
                    },
                  })
                }
                className="input-field"
              >
                <option value="">Select Tax Code</option>
                <option value="M">M (Main employment)</option>
                <option value="M SL">M SL (Main employment with student loan)</option>
                <option value="S">S (Secondary employment)</option>
                <option value="SH">SH (Secondary higher rate)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                IRD Number
              </label>
              <input
                type="text"
                value={formData.payrollDetails.irdNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payrollDetails: {
                      ...formData.payrollDetails,
                      irdNumber: e.target.value,
                    },
                  })
                }
                className="input-field"
                placeholder="XXX-XXX-XXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                KiwiSaver Rate
              </label>
              <select
                value={formData.payrollDetails.kiwiSaverRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payrollDetails: {
                      ...formData.payrollDetails,
                      kiwiSaverRate: e.target.value,
                    },
                  })
                }
                className="input-field"
              >
                <option value="3">3%</option>
                <option value="4">4%</option>
                <option value="6">6%</option>
                <option value="8">8%</option>
                <option value="10">10%</option>
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.payrollDetails.studentLoan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payrollDetails: {
                        ...formData.payrollDetails,
                        studentLoan: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm text-gray-700">
                  I have a student loan
                </span>
              </label>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? "Drop the files here..."
                  : "Drag 'n' drop files here, or click to select files"}
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(formData.documents).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">
                      {key.split(/(?=[A-Z])/).join(' ')}
                    </h4>
                    <button
                      onClick={() => handleDownloadTemplate(key)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Download Template
                    </button>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        documents: {
                          ...formData.documents,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            {Object.entries(formData.induction).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">
                    {key.split(/(?=[A-Z])/).join(' ')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Complete {key.split(/(?=[A-Z])/).join(' ').toLowerCase()} training
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      induction: {
                        ...formData.induction,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 text-indigo-600 rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className="btn-secondary"
          disabled={currentStep === 0}
        >
          Previous
        </button>
        <button onClick={handleNext} className="btn-primary">
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">NZ Employment Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Valid employment agreement</li>
              <li>Tax code declaration (IR330)</li>
              <li>KiwiSaver details</li>
              <li>Proof of right to work</li>
              <li>Health & safety induction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};