export function formatAUS(date: string) {
  return new Date(date).toLocaleString("en-AU", {
    timeZone: "Australia/Sydney",
  });
}