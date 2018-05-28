# screenshot
Node.js script to make screenshot with separate database in SQLlite
Node.js is using Phantom JS additional module to render pictures


Script "shotsql.js" is using table from database called "screenshot.db", to make the screenshot of specifics webpage's (in this case grafana sample dashboards). It takes the screenshots of the dashboards asynchroniously, to make all of it in one specific time. 
Name of the file is set based on time and name in URL (it uses Regexp to create correct name - by default of the dashboard ID, but if we are going to make a screenshot of any other website, it also excludes the name from URL).
Also it reads the last time of making screens and updates database with current time.

screenshot.db - is small database that contains only one table: ID, URL link and LastScreenTime.

I'm going to add another small script to be able to add and delete records from database using commandline.
