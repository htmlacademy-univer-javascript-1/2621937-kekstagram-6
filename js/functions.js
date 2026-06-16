function isStringLengthValid(string, maxLength) {
  return string.length <= maxLength;
}

function isPalindrome(string) {
  const normalizedString = String(string)
    .replaceAll(' ', '')
    .toLowerCase();

  let reversedString = '';
  for (let i = normalizedString.length - 1; i >= 0; i--) {
    reversedString += normalizedString[i];
  }

  return normalizedString === reversedString;
}

function extractDigits(stringOrNumber) {
  const sourceString = String(stringOrNumber);
  let digits = '';

  for (let i = 0; i < sourceString.length; i++) {
    const character = sourceString[i];
    const parsed = parseInt(character, 10);

    if (!Number.isNaN(parsed)) {
      digits += character;
    }
  }

  return digits ? parseInt(digits, 10) : NaN;
}

function parseTimeToMinutes(time) {
  const [hours, minutes] = time.split(':').map((part) => parseInt(part, 10));
  return hours * 60 + minutes;
}

function isMeetingWithinWorkHours(workStart, workEnd, meetingStart, durationMinutes) {
  const workStartMinutes = parseTimeToMinutes(workStart);
  const workEndMinutes = parseTimeToMinutes(workEnd);
  const meetingStartMinutes = parseTimeToMinutes(meetingStart);
  const meetingEndMinutes = meetingStartMinutes + durationMinutes;

  return meetingStartMinutes >= workStartMinutes && meetingEndMinutes <= workEndMinutes;
}

// Тесты примерами из задания
console.log(isStringLengthValid('проверяемая строка', 20)); // true
console.log(isStringLengthValid('проверяемая строка', 18)); // true
console.log(isStringLengthValid('проверяемая строка', 10)); // false

console.log(isPalindrome('топот')); // true
console.log(isPalindrome('ДовОд')); // true
console.log(isPalindrome('Кекс')); // false
console.log(isPalindrome('Лёша на полке клопа нашёл ')); // true

console.log(extractDigits('2023 год')); // 2023
console.log(extractDigits('ECMAScript 2022')); // 2022
console.log(extractDigits('1 кефир, 0.5 батона')); // 105
console.log(extractDigits('агент 007')); // 7
console.log(extractDigits('а я томат')); // NaN
console.log(extractDigits(2023)); // 2023
console.log(extractDigits(-1)); // 1
console.log(extractDigits(1.5)); // 15

console.log(isMeetingWithinWorkHours('08:00', '17:30', '14:00', 90)); // true
console.log(isMeetingWithinWorkHours('8:0', '10:0', '8:0', 120));     // true
console.log(isMeetingWithinWorkHours('08:00', '14:30', '14:00', 90)); // false
console.log(isMeetingWithinWorkHours('14:00', '17:30', '08:0', 90));  // false
console.log(isMeetingWithinWorkHours('8:00', '17:30', '08:00', 900)); // false
