// Milestone meets that get a confetti celebration.
//
// Meet numbers can't be computed (some Sundays are skipped), so list each
// milestone here by hand once its date is known:
//   { meet: 25, date: '2026-10-18' }            // date = the milestone Sunday (YYYY-MM-DD)
//   { meet: 50, date: '2027-06-06', until: '2027-06-20' }   // optional: override end date
//
// Celebration runs from 7 days BEFORE the date until `until` (default: 7 days
// after, i.e. the next regular Sunday). Preview any time with ?confetti=25 in the URL.
export const MILESTONE_MEETS = [
  { meet: 25, date: '2026-10-11', until: '2026-10-18' },
];

const DAY = 24 * 60 * 60 * 1000;

function parseDay(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function getActiveMilestone(now = new Date(), previewMeet) {
  if (previewMeet) return { meet: Number(previewMeet) };
  const t = now.getTime();
  return MILESTONE_MEETS.find(m => {
    const day = parseDay(m.date);
    const start = day - 7 * DAY;
    const end = (m.until ? parseDay(m.until) : day + 7 * DAY) + DAY; // inclusive of end day
    return t >= start && t < end;
  }) || null;
}
