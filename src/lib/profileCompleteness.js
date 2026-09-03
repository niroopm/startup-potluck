// Shared between Header (for the red-dot nudge) and Profile (for the
// "fill this in" banner) so the definition of "incomplete" only lives
// in one place.
export const PROFILE_FIELDS = [
  'name', 'email', 'company', 'role', 'city',
  'needFromCommunity', 'startupProblemTicket', 'instagram', 'website'
];

export function isProfileIncomplete(member) {
  if (!member) return false;
  return PROFILE_FIELDS.some(key => !member[key] || !String(member[key]).trim());
}
