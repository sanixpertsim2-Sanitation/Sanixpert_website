// Shift Schedule:
// Morning: 7:00 AM - 7:00 PM, Mon-Sat
// Afternoon: 11:00 AM - 11:00 PM, Mon-Sat
// Night: 7:00 PM - 7:00 AM, Mon-Sat
// Sunday: 12-hour deep clean, Sunday only

export const detectShift = () => {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday

  // Sunday = special deep clean shift
  if (day === 0) return 'sunday'

  // Night shift: 7 PM (19:00) to 7 AM (07:00)
  if (hour >= 19 || hour < 7) return 'night'

  // Morning shift: 7 AM (07:00) to 7 PM (19:00)
  // Afternoon shift: 11 AM (11:00) to 11 PM (23:00)
  // For simplicity: if between 11 AM and 7 PM = afternoon on Mon-Sat
  if (hour >= 11 && hour < 19) return 'afternoon'

  // Otherwise morning (7 AM - 11 AM)
  return 'morning'
}

export const getShiftLabel = (shift) => {
  const labels = {
    morning: 'Morning (7AM - 7PM)',
    afternoon: 'Afternoon (11AM - 11PM)',
    night: 'Night (7PM - 7AM)',
    sunday: 'Sunday Deep Clean'
  }
  return labels[shift] || shift
}

export const getShiftTimeRange = (shift) => {
  const ranges = {
    morning: { start: 7, end: 19 },
    afternoon: { start: 11, end: 23 },
    night: { start: 19, end: 7 },
    sunday: { start: 0, end: 24 }
  }
  return ranges[shift] || ranges.morning
}
