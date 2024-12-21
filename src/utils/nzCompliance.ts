// NZ-specific compliance utilities and constants

// NZ Public Holidays 2024-2027
export const NZ_PUBLIC_HOLIDAYS_2024 = [
  { date: '2024-01-01', name: "New Year's Day" },
  { date: '2024-01-02', name: "Day after New Year's Day" },
  { date: '2024-02-06', name: 'Waitangi Day' },
  { date: '2024-03-29', name: 'Good Friday' },
  { date: '2024-04-01', name: 'Easter Monday' },
  { date: '2024-04-25', name: 'ANZAC Day' },
  { date: '2024-06-03', name: "King's Birthday" },
  { date: '2024-07-14', name: 'Matariki' },
  { date: '2024-10-28', name: 'Labour Day' },
  { date: '2024-12-25', name: 'Christmas Day' },
  { date: '2024-12-26', name: 'Boxing Day' }
];

export const NZ_PUBLIC_HOLIDAYS_2025 = [
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-01-02', name: "Day after New Year's Day" },
  { date: '2025-02-06', name: 'Waitangi Day' },
  { date: '2025-04-18', name: 'Good Friday' },
  { date: '2025-04-21', name: 'Easter Monday' },
  { date: '2025-04-25', name: 'ANZAC Day' },
  { date: '2025-06-02', name: "King's Birthday" },
  { date: '2025-07-04', name: 'Matariki' },
  { date: '2025-10-27', name: 'Labour Day' },
  { date: '2025-12-25', name: 'Christmas Day' },
  { date: '2025-12-26', name: 'Boxing Day' }
];

export const NZ_PUBLIC_HOLIDAYS_2026 = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-02', name: "Day after New Year's Day" },
  { date: '2026-02-06', name: 'Waitangi Day' },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-04-06', name: 'Easter Monday' },
  { date: '2026-04-25', name: 'ANZAC Day' },
  { date: '2026-06-01', name: "King's Birthday" },
  { date: '2026-06-24', name: 'Matariki' },
  { date: '2026-10-26', name: 'Labour Day' },
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2026-12-26', name: 'Boxing Day' }
];

export const NZ_PUBLIC_HOLIDAYS_2027 = [
  { date: '2027-01-01', name: "New Year's Day" },
  { date: '2027-01-02', name: "Day after New Year's Day" },
  { date: '2027-02-06', name: 'Waitangi Day' },
  { date: '2027-03-26', name: 'Good Friday' },
  { date: '2027-03-29', name: 'Easter Monday' },
  { date: '2027-04-25', name: 'ANZAC Day' },
  { date: '2027-06-07', name: "King's Birthday" },
  { date: '2027-06-14', name: 'Matariki' },
  { date: '2027-10-25', name: 'Labour Day' },
  { date: '2027-12-25', name: 'Christmas Day' },
  { date: '2027-12-26', name: 'Boxing Day' }
];

// Get all public holidays for a given year
export const getPublicHolidaysForYear = (year: number) => {
  switch (year) {
    case 2024:
      return NZ_PUBLIC_HOLIDAYS_2024;
    case 2025:
      return NZ_PUBLIC_HOLIDAYS_2025;
    case 2026:
      return NZ_PUBLIC_HOLIDAYS_2026;
    case 2027:
      return NZ_PUBLIC_HOLIDAYS_2027;
    default:
      throw new Error(`Public holidays not available for year ${year}`);
  }
};

// Get all public holidays between two dates
export const getPublicHolidaysBetweenDates = (startDate: Date, endDate: Date) => {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  let holidays = [];

  for (let year = startYear; year <= endYear; year++) {
    try {
      const yearHolidays = getPublicHolidaysForYear(year);
      holidays = [
        ...holidays,
        ...yearHolidays.filter(holiday => {
          const holidayDate = new Date(holiday.date);
          return holidayDate >= startDate && holidayDate <= endDate;
        })
      ];
    } catch (error) {
      console.warn(`No holiday data for year ${year}`);
    }
  }

  return holidays;
};

// Rest of the code remains the same...