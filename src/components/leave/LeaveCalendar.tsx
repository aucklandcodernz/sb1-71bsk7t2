import React, { useState } from 'react';
import { useLeaveStore } from '../../store/leaveStore';
import { useEmployeeStore } from '../../store/employeeStore';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getPublicHolidaysForYear } from '../../utils/nzCompliance';

export const LeaveCalendar = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const leaveRequests = useLeaveStore((state) => state.leaveRequests);
  const employees = useEmployeeStore((state) => state.employees);

  const getEvents = () => {
    const publicHolidays = getPublicHolidaysForYear(selectedYear);
    
    const leaveEvents = leaveRequests.map(request => {
      const employee = employees.find(e => e.id === request.employeeId);
      return {
        id: request.id,
        title: `${employee?.name || 'Employee'} - ${request.type}`,
        start: request.startDate,
        end: request.endDate,
        backgroundColor: 
          request.status === 'approved' ? '#10B981' :
          request.status === 'rejected' ? '#EF4444' : '#F59E0B',
        borderColor: 'transparent',
        extendedProps: {
          type: request.type,
          status: request.status,
        },
      };
    });

    const holidayEvents = publicHolidays.map(holiday => ({
      id: `holiday-${holiday.date}`,
      title: holiday.name,
      start: holiday.date,
      allDay: true,
      backgroundColor: '#818CF8',
      borderColor: 'transparent',
      classNames: ['holiday-event'],
      extendedProps: {
        type: 'public-holiday',
      },
    }));

    return [...leaveEvents, ...holidayEvents];
  };

  const renderEventContent = (eventInfo: any) => {
    const isHoliday = eventInfo.event.extendedProps.type === 'public-holiday';
    return (
      <div className={`p-1 ${isHoliday ? 'italic' : ''}`}>
        <div className="text-xs font-medium truncate">{eventInfo.event.title}</div>
        {!isHoliday && (
          <div className="text-xs opacity-75">
            {eventInfo.event.extendedProps.type}
          </div>
        )}
      </div>
    );
  };

  const handleYearChange = (date: Date) => {
    setSelectedYear(date.getFullYear());
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Leave Calendar</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="input-field w-32"
        >
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={getEvents()}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        eventContent={renderEventContent}
        height="auto"
        datesSet={(dateInfo) => handleYearChange(dateInfo.start)}
        eventDidMount={(info) => {
          if (info.event.extendedProps.type === 'public-holiday') {
            info.el.style.fontStyle = 'italic';
          }
        }}
      />

      <div className="mt-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Legend</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#818CF8]"></div>
            <span className="text-sm">Public Holiday</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#10B981]"></div>
            <span className="text-sm">Approved Leave</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#F59E0B]"></div>
            <span className="text-sm">Pending Leave</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#EF4444]"></div>
            <span className="text-sm">Rejected Leave</span>
          </div>
        </div>
      </div>
    </div>
  );
};