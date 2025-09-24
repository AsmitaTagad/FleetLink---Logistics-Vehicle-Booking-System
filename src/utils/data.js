export function toISOStringFromDateTimeLocal(dtLocalValue) {
  // dtLocalValue from <input type="datetime-local"> like "2025-09-23T09:30"
  if (!dtLocalValue) return null;
  // Date constructor treats "YYYY-MM-DDTHH:mm" as local time in browsers
  const iso = new Date(dtLocalValue).toISOString();
  return iso;
}

export function humanFriendly(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString();
}
