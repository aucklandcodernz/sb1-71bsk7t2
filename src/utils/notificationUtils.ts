// NZ-specific notification utilities
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const NOTIFICATION_TYPES = {
  LEAVE_REQUEST: 'leave_request',
  LEAVE_APPROVAL: 'leave_approval',
  TIMESHEET_REMINDER: 'timesheet_reminder',
  BREAK_DUE: 'break_due',
  DOCUMENT_EXPIRY: 'document_expiry',
  TRAINING_DUE: 'training_due',
  INCIDENT_REPORT: 'incident_report',
  HAZARD_ALERT: 'hazard_alert',
  COMPLIANCE_DEADLINE: 'compliance_deadline'
};

export const sendNotification = (type: string, data: any) => {
  // In a real app, this would integrate with a push notification service
  // and handle both web and mobile notifications
  switch (type) {
    case NOTIFICATION_TYPES.BREAK_DUE:
      toast.warning(`Break required in ${data.timeUntilBreak} minutes`);
      break;
    case NOTIFICATION_TYPES.LEAVE_REQUEST:
      toast.success(`Leave request submitted for ${format(new Date(data.startDate), 'dd/MM/yyyy')}`);
      break;
    case NOTIFICATION_TYPES.INCIDENT_REPORT:
      if (data.severity === 'notifiable') {
        toast.error('WorkSafe NZ notification required within 24 hours');
      }
      break;
    // Add more notification types as needed
  }
};

export const scheduleReminder = (type: string, date: Date, data: any) => {
  // In a real app, this would schedule push notifications
  const now = new Date();
  const timeUntil = date.getTime() - now.getTime();
  
  if (timeUntil > 0) {
    setTimeout(() => {
      sendNotification(type, data);
    }, timeUntil);
  }
};