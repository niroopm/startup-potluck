// Determines the session type for a given Sunday:
//   'outdoor'     -> 1st & 3rd Sundays (free, NTR Park)
//   'closed-door' -> 2nd & 4th Sundays (paid indoor session)
//   'none'        -> 5th Sunday, when a month has one (no event that week)
export function getWeekRank(date) {
  return Math.ceil(date.getDate() / 7);
}

export function getSessionType(date) {
  const rank = getWeekRank(date);
  if (rank === 5) return 'none';
  if (rank === 1 || rank === 3) return 'outdoor';
  return 'closed-door';
}

// Kept for convenience/back-compat: true only for outdoor Sundays.
export function isOutdoorWeek(date) {
  return getSessionType(date) === 'outdoor';
}

export function isNoEventWeek(date) {
  return getSessionType(date) === 'none';
}

export function getUpcomingSundayDetails(fromDate = new Date()) {
  const now = new Date(fromDate);
  const day = now.getDay();
  const diff = (7 - day) % 7;
  const upcomingSunday = new Date(now);
  upcomingSunday.setDate(now.getDate() + diff);

  const weekRank = getWeekRank(upcomingSunday);
  const sessionType = getSessionType(upcomingSunday);
  const formattedDate = upcomingSunday.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return {
    dateObj: upcomingSunday,
    dateString: formattedDate,
    weekRank,
    sessionType,
    isOutdoor: sessionType === 'outdoor',
    isNoEvent: sessionType === 'none'
  };
}

// Returns the next `count` Sundays (including the upcoming one) with their session type.
export function getUpcomingSundays(count = 6) {
  const first = getUpcomingSundayDetails().dateObj;
  const list = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(first);
    d.setDate(first.getDate() + i * 7);
    const sessionType = getSessionType(d);
    list.push({
      dateObj: d,
      dateString: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      shortDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weekRank: getWeekRank(d),
      sessionType,
      isOutdoor: sessionType === 'outdoor',
      isNoEvent: sessionType === 'none'
    });
  }
  return list;
}

export function getOrdinal(n) {
  return ['1st', '2nd', '3rd', '4th', '5th'][n - 1] || `${n}th`;
}
