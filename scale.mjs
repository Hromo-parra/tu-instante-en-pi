export const MAX_REFERENCE = 1_000_000_000_000_000;

export function scaleBounds(first, second) {
  if (!Number.isSafeInteger(first) || !Number.isSafeInteger(second) || first < 1 || second < 1) {
    throw new RangeError('Positions must be positive safe integers');
  }
  const min = Math.max(first, second, 1);
  return { min, max: Math.max(min, MAX_REFERENCE), adjustable: min < MAX_REFERENCE };
}

export function referenceAt(bounds, fraction) {
  if (!Number.isFinite(fraction) || fraction < 0 || fraction > 1) throw new RangeError('Invalid slider value');
  if (fraction === 0 || !bounds.adjustable) return bounds.min;
  if (fraction === 1) return bounds.max;
  return Math.max(bounds.min, Math.min(bounds.max, Math.round(Math.exp(Math.log(bounds.min) + fraction * (Math.log(bounds.max) - Math.log(bounds.min))))));
}

export function scaleValues(first, second, reference) {
  const bounds = scaleBounds(first, second);
  if (!Number.isSafeInteger(reference) || reference < bounds.min || reference > bounds.max) throw new RangeError('Invalid reference');
  const d = Math.abs(second - first);
  return { d, reference, relative: d / reference, percent: 100 * d / reference, x1: first / reference, x2: second / reference };
}
