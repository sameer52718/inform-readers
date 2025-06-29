export const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getTimeInTimezone = (timezone, baseTime) => {
  const time = baseTime || new Date();
  return new Date(time.toLocaleString("en-US", { timeZone: timezone }));
};

export const convertTimeToTimezone = (sourceTime, fromTimezone, toTimezone) => {
  // Create a date string in the source timezone
  const sourceTimeString = sourceTime.toLocaleString("sv-SE");
  const sourceDate = new Date(sourceTimeString);

  // Get the offset difference
  const sourceOffset = getTimezoneOffset(fromTimezone);
  const targetOffset = getTimezoneOffset(toTimezone);
  const offsetDiff = (targetOffset - sourceOffset) * 60 * 60 * 1000;

  return new Date(sourceDate.getTime() + offsetDiff);
};

export const getTimezoneOffset = (timezone) => {
  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const targetTime = new Date(utc + getTimezoneOffsetHours(timezone) * 3600000);
  return getTimezoneOffsetHours(timezone);
};

export const getTimezoneOffsetHours = (timezone) => {
  // This is a simplified version - in production you'd use a proper timezone library
  const offsetMap = {
    "America/New_York": -5,
    "America/Chicago": -6,
    "America/Denver": -7,
    "America/Los_Angeles": -8,
    "America/Phoenix": -7,
    "Pacific/Honolulu": -10,
    "Europe/London": 0,
    "Europe/Paris": 1,
    "Europe/Berlin": 1,
    "Europe/Rome": 1,
    "Europe/Madrid": 1,
    "Europe/Amsterdam": 1,
    "Europe/Zurich": 1,
    "Europe/Vienna": 1,
    "Europe/Stockholm": 1,
    "Europe/Moscow": 3,
    "Europe/Istanbul": 3,
    "Asia/Tokyo": 9,
    "Asia/Seoul": 9,
    "Asia/Shanghai": 8,
    "Asia/Hong_Kong": 8,
    "Asia/Singapore": 8,
    "Asia/Bangkok": 7,
    "Asia/Kolkata": 5.5,
    "Asia/Dubai": 4,
    "Asia/Tehran": 3.5,
    "Asia/Jakarta": 7,
    "Australia/Sydney": 11,
    "Australia/Melbourne": 11,
    "Australia/Perth": 8,
    "Pacific/Auckland": 13,
    "Africa/Cairo": 2,
    "Africa/Johannesburg": 2,
    "Africa/Lagos": 1,
    "Africa/Nairobi": 3,
    "America/Toronto": -5,
    "America/Vancouver": -8,
    "America/Mexico_City": -6,
    "America/Sao_Paulo": -3,
    "America/Argentina/Buenos_Aires": -3,
    "America/Lima": -5,
    "America/Santiago": -3,
  };

  return offsetMap[timezone] || 0;
};
