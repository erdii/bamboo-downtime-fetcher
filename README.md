# bambooo-downtime-fetcher

crude script to dump all downtimes from a bamboohr ical feed

### usage

* envvars:
	* FEED_URL: https://{my_company}.bamboohr.com/feeds/feed.php?id={feed_id}
* cl arguments:
	* `node src/index.js [employees]`
	* `node src/index.js` -> show down-time for all employees
	* `node src/index.js "Employee One"` -> show down-time for "Employee One"
	* `node src/index.js "Employee One" "Employee Two"` -> show down-time for "Employee One" and "Employee Two" 
* docker image: `docker run -e FEED_URL=https://{my_company}.bamboohr.com/feeds/feed.php?id={feed_id} quay.io/erdii0/bambooo-downtime-fetcher [employees]`
