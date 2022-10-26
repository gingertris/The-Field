import {scheduleJob, RecurrenceRule, Range} from'node-schedule';

//set times
const weekdayRule = new RecurrenceRule();
weekdayRule.dayOfWeek = [new Range(1,5)];
weekdayRule.hour = [new Range(18,22)];


const weekendRule = new RecurrenceRule();
weekendRule.dayOfWeek = [0,6];
weekendRule.hour = [new Range(16,18), 22];

const powerHourRule = new RecurrenceRule();
powerHourRule.dayOfWeek = [0,6];
powerHourRule.hour = [new Range(19,21)];

//set timezones
const euWeekdayRule = structuredClone(weekdayRule);
euWeekdayRule.tz = 'cet';

const euWeekendRule = structuredClone(weekendRule);
euWeekendRule.tz = 'cet';

const euPowerHourRule = structuredClone(powerHourRule);
euPowerHourRule.tz = 'cet';

const naWeekdayRule = structuredClone(weekdayRule);
naWeekdayRule.tz = 'est';

const naWeekendRule = structuredClone(weekendRule);
naWeekendRule.tz = 'est';

const naPowerHourRule = structuredClone(powerHourRule);
naPowerHourRule.tz = 'est';

