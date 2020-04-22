# bambooo-downtime-fetcher

crude script to dump all downtimes from a bamboohr ical feed

### prerequisites

you need to enable iCal feeds in your bamboohr account:
1. go to https://{my_company}.bamboohr.com/calendar
1. click on the settings cog in the top right of the calendar view
1. click on "Create Calendar Feed" under "Who's Out" and copy the url
1. NEVER SHARE THIS URL WITH UNTRUSTED PEOPLE

### usage

* envvars:
	* FEED_URL: https://{my_company}.bamboohr.com/feeds/feed.php?id={feed_id}
* cl arguments:
	* `node src/index.js <mode:all|overview|sum> [employees]`
	* `node src/index.js all` -> show down-times and summed up down-times for all employees
	* `node src/index.js sum "Employee One"` -> show summed up down-time for "Employee One"
	* `node src/index.js overview "Employee One" "Employee Two"` -> show down-time for "Employee One" and "Employee Two" 
* docker image: `docker run -e FEED_URL=https://{my_company}.bamboohr.com/feeds/feed.php?id={feed_id} quay.io/erdii0/bambooo-downtime-fetcher <mode> [employees]`
