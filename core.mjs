export const DIGIT_COUNT = 1_000_000;
export const DIGIT_SHA256 = '7806ee47461b49ef1f578e14461b2c83c09c6d7a9a914275da1d71e9cbbf7069';

export function patternForDate(value, format) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error('invalid-date');
  const [, year, month, day] = match;
  const y = Number(year), m = Number(month), d = Number(day);
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (y < 1 || m < 1 || m > 12 || d < 1 || d > days[m - 1]) throw new Error('invalid-date');
  const formats = { DDMMYYYY: day + month + year, MMDDYYYY: month + day + year, YYYYMMDD: year + month + day, DDMMYY: day + month + year.slice(2) };
  if (!Object.hasOwn(formats, format)) throw new Error('invalid-format');
  return formats[format];
}

export function findPattern(digits, pattern) {
  const index = digits.indexOf(pattern);
  if (index < 0) return { status: 'not-found', examined: digits.length, pattern };
  const start = Math.max(0, index - 18);
  const end = Math.min(digits.length, index + pattern.length + 18);
  return { status: 'found', examined: digits.length, pattern, position: index + 1, contextStart: start + 1, before: digits.slice(start, index), after: digits.slice(index + pattern.length, end) };
}

export function distance(first, second) {
  return first.status === 'found' && second.status === 'found' && first.examined === second.examined
    ? Math.abs(first.position - second.position) : null;
}

export function chooseLanguage(saved, browser) {
  return saved === 'es' || saved === 'en' ? saved : /^es(?:-|$)/i.test(browser || '') ? 'es' : 'en';
}

export function formatDate(value, language) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(12, 0, 0, 0);
  return new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}
