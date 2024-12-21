export interface Organization {
  id: string;
  name: string;
  tradingName?: string;
  nzbn: string; // New Zealand Business Number
  gstNumber?: string;
  irdNumber: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    region: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  settings: {
    payrollFrequency: 'weekly' | 'fortnightly' | 'monthly';
    gstPeriod: 'monthly' | 'bimonthly' | 'sixmonthly';
    fiscalYearEnd: string;
    timezone: string;
    defaultWorkingHours: number;
    defaultKiwiSaverRate: number;
  };
  subscription: {
    plan: 'starter' | 'business' | 'enterprise';
    employeeLimit: number;
    features: string[];
    expiryDate: string;
  };
  branding?: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
}

export interface OrganizationUser {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'manager' | 'user';
  permissions: string[];
  status: 'active' | 'invited' | 'disabled';
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  managerId?: string;
  parentId?: string;
  settings?: {
    approvalWorkflow?: {
      leave?: string[];
      expenses?: string[];
      timesheet?: string[];
    };
  };
}

export interface Location {
  id: string;
  organizationId: string;
  name: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    region: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  settings?: {
    workingHours?: {
      start: string;
      end: string;
    };
    timeZone?: string;
  };
}

export interface Team {
  id: string;
  organizationId: string;
  departmentId: string;
  name: string;
  leaderId?: string;
  members: string[]; // Employee IDs
  settings?: {
    rosterPattern?: string;
    defaultShifts?: {
      start: string;
      end: string;
      breaks: number;
    }[];
  };
}