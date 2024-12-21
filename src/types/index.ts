export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  startDate: string;
  status: 'active' | 'on_leave' | 'terminated';
  salary?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  address?: string;
  taxCode?: string;
  kiwiSaverRate?: string;
  bankAccount?: string;
  irdNumber?: string;
  // New fields
  personalDetails: {
    dateOfBirth: string;
    gender: string;
    nationality: string;
    passportNumber?: string;
    passportExpiry?: string;
    visaType?: string;
    visaExpiry?: string;
    nzResidencyStatus?: 'citizen' | 'permanent_resident' | 'work_visa' | 'other';
  };
  emergencyContacts: {
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
    address?: string;
  }[];
  employmentDetails: {
    employmentType: 'full_time' | 'part_time' | 'casual' | 'fixed_term';
    contractEndDate?: string;
    probationEndDate?: string;
    workingHours: {
      monday?: string;
      tuesday?: string;
      wednesday?: string;
      thursday?: string;
      friday?: string;
      saturday?: string;
      sunday?: string;
    };
    location: string;
    manager?: string;
    department: string;
    team?: string;
  };
  documents: {
    id: string;
    type: 'contract' | 'visa' | 'passport' | 'certification' | 'other';
    name: string;
    dateUploaded: string;
    expiryDate?: string;
    status: 'active' | 'expired' | 'archived';
    fileUrl: string;
  }[];
  qualifications: {
    id: string;
    type: string;
    name: string;
    institution: string;
    completionDate: string;
    expiryDate?: string;
    verificationStatus: 'pending' | 'verified' | 'failed';
  }[];
  induction: {
    completed: boolean;
    completionDate?: string;
    items: {
      id: string;
      name: string;
      status: 'pending' | 'completed';
      completionDate?: string;
      verifiedBy?: string;
    }[];
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'bereavement' | 'parental' | 'other';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

export interface Document {
  id: string;
  employeeId: string;
  type: 'contract' | 'policy' | 'certification' | 'other';
  name: string;
  dateUploaded: string;
  status: 'active' | 'archived';
  tags: string[];
  expiryDate: string | null;
  requiredBy: string | null;
  size: number;
  contentType: string;
  lastModified?: string;
  lastAccessedBy?: string;
  version?: number;
}