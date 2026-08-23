const hourSelect = document.getElementById("hourSelect");
const minuteSelect = document.getElementById("minuteSelect");
const periodSelect = document.getElementById("periodSelect");
const result = document.getElementById("result");
const resetButton = document.getElementById("resetButton");
const buttons = document.querySelectorAll("[data-minutes]");

function populatePicker() {
  // الساعة: من 1 إلى 12
  for (let hour = 1; hour <= 12; hour++) {
    const option = document.createElement("option");
    option.value = hour;
    option.textContent = String(hour);
    hourSelect.appendChild(option);
  }

  // الدقائق: من 00 إلى 59
  for (let minute = 0; minute < 60; minute++) {
    const option = document.createElement("option");
    option.value = minute;
    option.textContent = String(minute).padStart(2, "0");
    minuteSelect.appendChild(option);
  }

  setCurrentTime();
}

function getCurrentTime() {
  const now = new Date();
  const hours24 = now.getHours();

  return {
    hour: hours24 % 12 || 12,
    minute: now.getMinutes(),
    period: hours24 >= 12 ? "PM" : "AM"
  };
}

function setCurrentTime() {
  const current = getCurrentTime();

  hourSelect.value = String(current.hour);
  minuteSelect.value = String(current.minute);
  periodSelect.value = current.period;

  // لا نعرض نتيجة حتى يختار المستخدم +60 أو +90
  result.textContent = "—";
}

function to24Hour(hours, period) {
  if (period === "AM") {
    return hours === 12 ? 0 : hours;
  }

  return hours === 12 ? 12 : hours + 12;
}

function formatTime(hours24, minutes) {
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function calculate(minutesToAdd) {
  const hours = Number(hourSelect.value);
  const minutes = Number(minuteSelect.value);
  const period = periodSelect.value;

  const hours24 = to24Hour(hours, period);
  const totalMinutes = hours24 * 60 + minutes + minutesToAdd;

  const finalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const finalHours = Math.floor(finalMinutes / 60);
  const finalMins = finalMinutes % 60;

  result.textContent = formatTime(finalHours, finalMins);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    calculate(Number(button.dataset.minutes));
  });
});

[hourSelect, minuteSelect, periodSelect].forEach((select) => {
  select.addEventListener("change", () => {
    result.textContent = "—";
  });
});

resetButton.addEventListener("click", setCurrentTime);

populatePicker();
