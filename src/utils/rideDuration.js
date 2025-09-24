//dummy distance (not implemented google map)
export default function estimateDistanceKm(fromPincode, toPincode) {
  if (!fromPincode || !toPincode) return 0;
  if (fromPincode === toPincode) return 5;
  const from = parseInt(fromPincode, 10) || 0;
  const to = parseInt(toPincode, 10) || 0;
  const distance = Math.abs(from - to) / 10;
  return distance < 5 ? 5 : distance;
}

export function estimateRideDurationHours(
  fromPincode,
  toPincode,
  avgSpeed = 40
) {
  const distance = estimateDistanceKm(fromPincode, toPincode);
  const duration = distance / avgSpeed;
  return Math.max(0.5, +duration.toFixed(2));
}
