## Date Table
### Why
Some RDBMS applications are required to store dates, sometimes it is necessary to have decades of data that will provide the application layer with dates for the lifetime of the application.
### What
This package is used to create an insert statement for a table with the following columns in order `Date, dayOfWeekIndex, MonthOfYearIndex, Year, dayOfMonthIndex, isWeekend, isWeekDay, isPublicHoliday`.
The file generates sql insert statement for MySQL only, the file will be stored in the same directory as the execution.
Set the start and end year for the script and execute with node, the file will output a file named `Calendar.sql` in the directory where this file is executed.
### How
```
let datetable = require('datetable');
datetable.createInsertStatement({ tableName: 'Calendar', fromYear: 2019, toYear: 2039 });
```
