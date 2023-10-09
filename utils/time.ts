export function timeSince(isoTime: string) {
  const now = new Date();
  const past = new Date(isoTime);

  // Calculate the difference in milliseconds
  const diffMs = now.valueOf() - past.valueOf();

  // Convert the difference in various units
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  // Determine and format the difference
  if (diffWeeks > 0) {
    return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} h${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  } else {
    return `${diffSecs} sec${diffSecs > 1 ? "s" : ""} ago`;
  }
}
