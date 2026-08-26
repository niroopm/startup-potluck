// Determines whether a given Sunday is an "outdoor" (1st/3rd) or "indoor" (2nd/4th) session.
export function getWeekRank(date) {
  return Math.ceil(date.getDate() / 7);
}

export function isOutdoorWeek(date) {
  const rank = getWeekRank(date);
  return rank === 1 || rank === 3;
}

export function getUpcomingSundayDetails(fromDate = new Date()) {
  const now = new Date(fromDate);
  const day = now.getDay();
  const diff = (7 - day) % 7;
  const upcomingSunday = new Date(now);
  upcomingSunday.setDate(now.getDate() + diff);

  const weekRank = getWeekRank(upcomingSunday);
  const outdoor = isOutdoorWeek(upcomingSunday);
  const formattedDate = upcomingSunday.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return { dateObj: upcomingSunday, dateString: formattedDate, weekRank, isOutdoor: outdoor };
}

// Returns the next `count` Sundays (including the upcoming one) with their session type.
export function getUpcomingSundays(count = 6) {
  const first = getUpcomingSundayDetails().dateObj;
  const list = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(first);
    d.setDate(first.getDate() + i * 7);
    list.push({
      dateObj: d,
      dateString: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      shortDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weekRank: getWeekRank(d),
      isOutdoor: isOutdoorWeek(d)
    });
  }
  return list;
}

export function getOrdinal(n) {
  return ['1st', '2nd', '3rd', '4th', '5th'][n - 1] || `${n}th`;
}
