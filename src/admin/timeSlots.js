// Canonical fixed time slots for Mentors Studio
// Confirmed from public booking/enquiry flow: Booking.jsx, ContactPage.jsx, and Timings.jsx

export const TIME_SLOTS = [
  // Morning / Adult Sessions (55 mins each, 10-min clean)
  {
    id: 'M1',
    label: 'Session 1: 10:00 – 10:55 am',
    group: 'Morning',
    shortTime: '10:00 – 10:55 AM',
    sessionNum: 1,
    duration: '55 min',
    startTime: '10:00',
    endTime: '10:55',
    sortOrder: 1,
  },
  {
    id: 'M2',
    label: 'Session 2: 11:05 am – 12:00 pm',
    group: 'Morning',
    shortTime: '11:05 AM – 12:00 PM',
    sessionNum: 2,
    duration: '55 min',
    startTime: '11:05',
    endTime: '12:00',
    sortOrder: 2,
  },
  {
    id: 'M3',
    label: 'Session 3: 12:10 – 1:05 pm',
    group: 'Morning',
    shortTime: '12:10 – 1:05 PM',
    sessionNum: 3,
    duration: '55 min',
    startTime: '12:10',
    endTime: '13:05',
    sortOrder: 3,
  },
  {
    id: 'M4',
    label: 'Session 4: 1:15 – 2:10 pm',
    group: 'Morning',
    shortTime: '1:15 – 2:10 PM',
    sessionNum: 4,
    duration: '55 min',
    startTime: '13:15',
    endTime: '14:10',
    sortOrder: 4,
  },
  {
    id: 'M5',
    label: 'Session 5: 2:20 – 3:15 pm',
    group: 'Morning',
    shortTime: '2:20 – 3:15 PM',
    sessionNum: 5,
    duration: '55 min',
    startTime: '14:20',
    endTime: '15:15',
    sortOrder: 5,
  },

  // Evening / School Sessions (55 mins each, 10-min clean)
  {
    id: 'E1',
    label: 'Session 1: 3:30 – 4:25 pm (school)',
    group: 'Evening',
    shortTime: '3:30 – 4:25 PM',
    sessionNum: 1,
    duration: '55 min',
    startTime: '15:30',
    endTime: '16:25',
    sortOrder: 6,
  },
  {
    id: 'E2',
    label: 'Session 2: 4:35 – 5:30 pm (school)',
    group: 'Evening',
    shortTime: '4:35 – 5:30 PM',
    sessionNum: 2,
    duration: '55 min',
    startTime: '16:35',
    endTime: '17:30',
    sortOrder: 7,
  },
  {
    id: 'E3',
    label: 'Session 3: 5:40 – 6:35 pm (school)',
    group: 'Evening',
    shortTime: '5:40 – 6:35 PM',
    sessionNum: 3,
    duration: '55 min',
    startTime: '17:40',
    endTime: '18:35',
    sortOrder: 8,
  },
  {
    id: 'E4',
    label: 'Session 4: 6:45 – 7:40 pm (school)',
    group: 'Evening',
    shortTime: '6:45 – 7:40 PM',
    sessionNum: 4,
    duration: '55 min',
    startTime: '18:45',
    endTime: '19:40',
    sortOrder: 9,
  },
  {
    id: 'E5',
    label: 'Session 5: 7:50 – 8:45 pm (school)',
    group: 'Evening',
    shortTime: '7:50 – 8:45 PM',
    sessionNum: 5,
    duration: '55 min',
    startTime: '19:50',
    endTime: '20:45',
    sortOrder: 10,
  },
];

export const MORNING_SLOTS = TIME_SLOTS.filter((s) => s.group === 'Morning');
export const EVENING_SLOTS = TIME_SLOTS.filter((s) => s.group === 'Evening');

/**
 * Finds a canonical slot from any slot string or ID.
 * Examples: 'M2', 'Session 2: 11:07 am – 12:07 pm', '11:07', 'evening session 1'
 */
export function findSlotByString(str) {
  if (!str) return TIME_SLOTS[0];
  const s = String(str).trim().toLowerCase();

  // 1. Direct ID match
  const byId = TIME_SLOTS.find((slot) => slot.id.toLowerCase() === s);
  if (byId) return byId;

  // 2. Direct label match
  const byLabel = TIME_SLOTS.find((slot) => slot.label.toLowerCase() === s);
  if (byLabel) return byLabel;

  // 3. Short time or start time match
  const byTime = TIME_SLOTS.find(
    (slot) =>
      slot.shortTime.toLowerCase() === s ||
      s.includes(slot.startTime) ||
      slot.label.toLowerCase().includes(s)
  );
  if (byTime) return byTime;

  // 4. Session number + group match (e.g. "Session 2... evening")
  const isEvening = s.includes('evening') || s.includes('pm') && (s.includes('3:30') || s.includes('3:10') || s.includes('4:') || s.includes('5:') || s.includes('6:') || s.includes('7:') || s.includes('8:'));
  for (let num = 1; num <= 5; num++) {
    if (s.includes(`session ${num}`) || s.includes(`session ${num}:`)) {
      const match = TIME_SLOTS.find(
        (slot) =>
          slot.sessionNum === num &&
          (isEvening ? slot.group === 'Evening' : slot.group === 'Morning')
      );
      if (match) return match;
    }
  }

  return TIME_SLOTS[0];
}

/**
 * Get slot object by slot ID ('M1' - 'M5', 'E1' - 'E5')
 */
export function getSlotById(slotId) {
  if (!slotId) return null;
  return TIME_SLOTS.find((s) => s.id === slotId) || null;
}

/**
 * Format a Date object as YYYY-MM-DD in local time
 */
export function formatDateForInput(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date nicely: 'Wednesday, Nov 4, 2026'
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = String(dateStr).split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// Alias for backwards compatibility
export const formatDateDisplay = formatDisplayDate;

/**
 * Add or subtract days from a YYYY-MM-DD date string
 */
export function addDaysToDate(dateStr, days) {
  if (!dateStr) return formatDateForInput(new Date());
  const parts = String(dateStr).split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  d.setDate(d.getDate() + days);
  return formatDateForInput(d);
}

/**
 * Get relative label: 'Today', 'Tomorrow', 'Yesterday', or null
 */
export function getDateRelativeLabel(dateStr) {
  if (!dateStr) return null;
  const todayStr = formatDateForInput(new Date());
  if (dateStr === todayStr) return 'Today';
  const tomorrowStr = addDaysToDate(todayStr, 1);
  if (dateStr === tomorrowStr) return 'Tomorrow';
  const yesterdayStr = addDaysToDate(todayStr, -1);
  if (dateStr === yesterdayStr) return 'Yesterday';
  return null;
}



