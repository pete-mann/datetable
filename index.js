/*
This file is used to create insert statementa for a Calendar table with the following columns in order Date, dayOfWeekIndex, MonthOfYearIndex, Year, dayOfMonthIndex, isWeekend, isWeekDay, isPublicHoliday.
The file generates sql insert statement for MySQL
Set the start and end year for the script and execute with node, the file will output a file named `Calendar.sql` in the directory where this file is executed.
 */

 // Import the file system module
 const fs = require('fs');

/**
 * The createInsertStatement method is used to create the entire insert statement
 * @param  {Number} fromYear This is a year formatted as eg 2019. It is the first year in the data that is produced by this method
 * @param  {Number} toYear   This is a year formatted as eg 2019. It is the final year in the data that is produced by this method
 * @return {Boolean}         The boolean returned can be used to determine if the execution had errors
 */
exports.createInsertStatement = function({ tableName: tableName = 'Calendar', fromYear: fromYear, toYear: toYear }) {
  // Clear the sql file before inserting new data
  fs.writeFileSync("./Calendar.sql", '', (err) => console.log(err ? err : "Calendar sql file was cleared"));
  // Set the variable to store the output, this variable starts with the insert statement
  let output = `INSERT INTO ${tableName} (Date, dayOfWeekIndex, MonthOfYearIndex, Year, dayOfMonthIndex, isWeekend, isWeekDay, isPublicHoliday) VALUES \n`;
  // Loop through all dates and create insert statements
  for(var y = fromYear; y <= toYear; y++) {
    for(var m = 1; m <= 12; m++) {
      let date = new Date(y, m, 0);
      for(var d = 1; d <= date.getDate(); d++) {
        let day = new Date(y, m - 1, d);
        output += createInsertValue({
          year: y,
          monthOfYear: m,
          dayOfMonth: d,
          dayOfWeek: day.getDay() + 1
        });
      }
    }
  }
  // Finally write the sql data to file and exit
  fs.writeFileSync("./Calendar.sql", output, (err) => console.log(err ? err : "Calendar sql file was saved"));
}

/**
 * Create an insert statement to be appended to the output
 * @param  {Number} year        Year represented as 2019
 * @param  {Number} monthOfYear Month of year, January is 1
 * @param  {Number} dayOfMonth  Day of month, the first day is 1
 * @param  {Number} dayOfWeek   Day of week, Sunday is the first day which is 1
 * @return String   String representing the insert statement for each date record to be inserted. This string ends with a line break
 */
let createInsertValue = function({ year, monthOfYear, dayOfMonth, dayOfWeek }) {
  return `("${ year }-${ monthOfYear < 10 ? '0' + monthOfYear : (monthOfYear) }-${ dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth }", ` +  // date
          dayOfWeek + ', ' +                                                                                                                // day of week index FK
          monthOfYear + ', ' +                                                                                                              // month of year index FK
          year + ', ' +                                                                                                                     // year
          dayOfMonth + ', ' +                                                                                                               // day of month index
          (dayOfWeek == 7 || dayOfWeek == 1 ? 1 : 0) + ', ' +                                                                               // is weekend
          (dayOfWeek == 7 || dayOfWeek == 1 ? 0 : 1) + ', ' +                                                                               // is week day
          isPublicHoliday({ monthOfYear: monthOfYear, dayOfMonth: dayOfMonth }) + '), \n';                                                                                                                      // is public holiday
}

/**
 * Check if the date is a recurring public holiday. These public holidays ALWAYS fall on the same date, every year without change, ever.
 * Note that a year is not provided becuase these public holidays are ALWAYS the same irrespective of the year. This method does not
 * capture every public holiday in Australia because public holiday dates are volitile. 
 * @param  {Number} monthOfYear The month of the year, January = 1
 * @param  {Number} dayOfMonth  The day of the month, the first day = 1
 * @return {Boolean}            Returns a boolean that represents if the specified day is a public holiday.
 */
let isPublicHoliday = function({ monthOfYear, dayOfMonth }) {
  let recurringPublicHolidays = [
    '1.1',    // New years day
    '25.4',   // Anzac day
    '25.12',  // Christmas day
    '26.12',  // Boxing day
  ];
  return recurringPublicHolidays.indexOf((dayOfMonth + '.' + monthOfYear)) != -1 ? 1 : 0;
}
