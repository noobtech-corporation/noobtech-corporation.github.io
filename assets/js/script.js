// NOOBTECH CORPORATION — shared site script
// Handles the mobile nav toggle on all pages.

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  initializeDateCalculator();
});

var calendarMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December', 'Gammer'
];

// EDIT HOLIDAYS HERE: use the normal Gregorian month and day.
// Add another object with the same five fields to add a holiday to the page.
var holidays = [
  { name: 'New Year\'s Day', month: 1, day: 1, description: 'Marks the beginning of the Gregorian year.', work: 'No regular work expected.' },
  { name: 'Good Friday', easterOffset: -2, description: 'A day of remembrance observed before Easter Sunday.', work: 'No regular work expected.' },
  { name: 'Easter Sunday', easterOffset: 0, description: 'A spring holiday centered on renewal and new beginnings.', work: 'No regular work expected.' },
  { name: 'Easter Monday', easterOffset: 1, description: 'The day following Easter Sunday, continuing the spring observance.', work: 'No regular work expected.' },
  { name: 'May Day', month: 5, day: 1, description: 'A traditional spring and workers\' holiday.', work: 'No regular work expected.' },
  { name: 'Ascension Day', easterOffset: 39, description: 'A traditional observance held 39 days after Easter Sunday.', work: 'No regular work expected.' },
  { name: 'Whit Sunday', easterOffset: 49, description: 'A traditional observance held 49 days after Easter Sunday.', work: 'No regular work expected.' },
  { name: 'Whit Monday', easterOffset: 50, description: 'The day after Whit Sunday.', work: 'No regular work expected.' },
  { name: 'WOW! Signal Anniversary', month: 8, day: 15, description: 'Commemorates the 1977 detection of the famous WOW! signal.', work: 'Work as normal; official observance.' },
  { name: 'Official Noobtech Founding Anniversary', month: 8, day: 16, description: 'Commemorates the founding of the Noobtech Corporation.', work: 'Work as normal; official observance.' },
  { name: 'German Unity Day', month: 10, day: 3, description: 'Commemorates German reunification in 1990.', work: 'No regular work expected.' },
  { name: 'N-DAY', month: 12, day: 6, description: 'Noobtech name for Nikolaustag, a German tradition honoring Saint Nicholas.', work: 'Work as normal; official observance.' },
  { name: 'Christmas', month: 12, day: 24, description: 'A winter holiday centered on Christmas Eve and the celebration of Christmas.', work: 'No regular work expected.' }
];

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function newMonthHours(year, monthIndex, day) {
  if (isLeapYear(year) && (monthIndex === 8 && (day === 14 || day === 15))) return 36;
  return 24;
}

function newYearHours(year) {
  return 364 * 24 + (isLeapYear(year) ? 24 : 0);
}

function oldYearHours(year) {
  return (isLeapYear(year) ? 366 : 365) * 24;
}

function hoursBeforeYear(year, hoursInYear) {
  var total = 0;
  for (var currentYear = 1; currentYear < year; currentYear += 1) total += hoursInYear(currentYear);
  return total;
}

function oldDateToYearHours(date) {
  var year = date.getUTCFullYear();
  var yearStart = Date.UTC(year, 0, 1);
  return { year: year, hours: (date.getTime() - yearStart) / 3600000 };
}

function parseOldDateInput(value) {
  var match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if (!match) return null;
  var day = Number(match[1]);
  var month = Number(match[2]);
  var year = Number(match[3]);
  var hour = match[4] === undefined ? 0 : Number(match[4]);
  var minute = match[5] === undefined ? 0 : Number(match[5]);
  var date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day || hour > 23 || minute > 59) return null;
  return date;
}

function easterDate(year) {
  var a = year % 19;
  var b = Math.floor(year / 100);
  var c = year % 100;
  var d = Math.floor(b / 4);
  var e = b % 4;
  var f = Math.floor((b + 8) / 25);
  var g = Math.floor((b - f + 1) / 3);
  var h = (19 * a + b - d - g + 15) % 30;
  var i = Math.floor(c / 4);
  var k = c % 4;
  var l = (32 + 2 * e + 2 * i - h - k) % 7;
  var m = Math.floor((a + 11 * h + 22 * l) / 451);
  var month = Math.floor((h + l - 7 * m + 114) / 31);
  var day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month: month, day: day };
}

function formatHolidayDate(month, day) {
  return calendarMonths[month - 1] + ' ' + day;
}

function renderHolidays() {
  var list = document.getElementById('holiday-list');
  if (!list) return;
  var displayYear = 2026;
  var easter = easterDate(displayYear);
  var renderedHolidays = holidays.map(function (holiday) {
    var holidayDate = holiday.easterOffset === undefined ? new Date(Date.UTC(displayYear, holiday.month - 1, holiday.day)) : new Date(Date.UTC(displayYear, easter.month - 1, easter.day + holiday.easterOffset));
    var holidayMonth = holidayDate.getUTCMonth() + 1;
    var holidayDay = holidayDate.getUTCDate();
    var noobtechDate = yearHoursToNewDate(displayYear, (holidayDate.getTime() - Date.UTC(displayYear, 0, 1)) / 3600000);
    return '<article class="holiday-item"><div class="holiday-name">' + holiday.name + '</div><div class="holiday-dates"><strong>' + formatHolidayDate(holidayMonth, holidayDay) + '</strong>Gregorian<br><strong>' + noobtechDate + '</strong>Noobtech</div><div class="holiday-description">' + holiday.description + '</div><div class="holiday-work"><strong>Work status</strong>' + holiday.work + '</div></article>';
  });
  list.innerHTML = renderedHolidays.join('');
}

function newDateToYearHours(year, monthIndex, day, hour, minute) {
  var total = 0;
  for (var currentMonth = 0; currentMonth < monthIndex; currentMonth += 1) {
    total += 28 * 24;
    if (currentMonth === 8 && isLeapYear(year)) total += 24;
  }
  for (var currentDay = 1; currentDay < day; currentDay += 1) {
    total += newMonthHours(year, monthIndex, currentDay);
  }
  return { year: year, hours: total + hour + minute / 60 };
}

function yearHoursToNewDate(year, totalHours) {
  var monthIndex = 0;
  while (monthIndex < 13 && totalHours >= 28 * 24 + (monthIndex === 8 && isLeapYear(year) ? 24 : 0)) {
    totalHours -= 28 * 24 + (monthIndex === 8 && isLeapYear(year) ? 24 : 0);
    monthIndex += 1;
  }
  var day = 1;
  while (totalHours >= newMonthHours(year, monthIndex, day) && day < 28) {
    totalHours -= newMonthHours(year, monthIndex, day);
    day += 1;
  }
  return formatNewDate(year, monthIndex, day, Math.floor(totalHours), Math.round((totalHours % 1) * 60));
}

function yearHoursToOldDate(year, totalHours) {
  var date = new Date(Date.UTC(year, 0, 1) + totalHours * 3600000);
  return date.toISOString().slice(0, 16).replace('T', ' ');
}

function formatNewDate(year, monthIndex, day, hour, minute) {
  if (minute === 60) { hour += 1; minute = 0; }
  return calendarMonths[monthIndex] + ' ' + day + ', ' + year + ' at ' + String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
}

function initializeDateCalculator() {
  var oldForm = document.getElementById('old-date-form');
  var newForm = document.getElementById('new-date-form');
  renderHolidays();
  if (!oldForm || !newForm) return;

  var monthSelect = document.getElementById('new-month');
  calendarMonths.forEach(function (month, index) {
    monthSelect.add(new Option(String(index + 1).padStart(2, '0') + ' — ' + month, index));
  });
  monthSelect.insertBefore(new Option('Select month', ''), monthSelect.firstChild);
  monthSelect.value = '';

  var result = document.getElementById('calculator-result');
  oldForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var date = parseOldDateInput(document.getElementById('old-date').value);
    if (!date) {
      result.textContent = 'INVALID DATE  /  Use DD/MM/YYYY HH:MM.';
      return;
    }
    var oldDate = oldDateToYearHours(date);
    result.textContent = 'NEW DATE  /  ' + yearHoursToNewDate(oldDate.year, oldDate.hours);
  });

  newForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var year = Number(document.getElementById('new-year').value);
    var month = Number(monthSelect.value);
    var day = Number(document.getElementById('new-day').value);
    var hour = Number(document.getElementById('new-hour').value);
    var minute = Number(document.getElementById('new-minute').value);
    var maxHour = newMonthHours(year, month, day) - 1;
    if (month === 8 && (day === 14 || day === 15) && isLeapYear(year)) maxHour = 35;
    if (day < 1 || day > 28 || hour < 0 || hour > maxHour || minute < 0 || minute > 59) {
      result.textContent = 'INVALID DATE  /  Check the day or hour for this month.';
      return;
    }
    var newDate = newDateToYearHours(year, month, day, hour, minute);
    result.textContent = 'OLD DATE  /  ' + yearHoursToOldDate(newDate.year, newDate.hours);
  });

}
