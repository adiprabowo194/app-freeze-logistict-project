export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayRange() {
  const today = new Date();

  return {
    startDate: formatDate(today),
    endDate: formatDate(today),
  };
}

export function getLast7DaysRange() {
  const today = new Date();
  const past = new Date();

  past.setDate(today.getDate() - 6);

  return {
    startDate: formatDate(past),
    endDate: formatDate(today),
  };
}
export function getLast14DaysRange() {
  const today = new Date();
  const past = new Date();

  past.setDate(today.getDate() - 13);

  return {
    startDate: formatDate(past),
    endDate: formatDate(today),
  };
}

export function getThisWeekRange() {
  const today = new Date();
  const firstDay = new Date(today);

  firstDay.setDate(today.getDate() - today.getDay());

  return {
    startDate: formatDate(firstDay),
    endDate: formatDate(today),
  };
}

export function getThisMonthRange() {
  const today = new Date();
  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  return {
    startDate: formatDate(firstDay),
    endDate: formatDate(today),
  };
}