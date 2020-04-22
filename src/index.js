const ical = require("ical.js");
const axios = require("axios").default;
const transducers = require("transducers.js");

const helpers = require("./helpers");

const allowedModes = ["all", "overview", "sum", "json"];

async function main() {
	const mode = process.argv[2];
	const employeeNames = process.argv.slice(3);
	const feedUrl = process.env.FEED_URL;

	let hasInputError = false;

	if (!feedUrl) {
		console.error("Missing envvar FEED_URL");
		hasInputError = true;
	}

	if (!mode || !allowedModes.includes(mode)) {
		console.error(`Missing mode. Allowed modes are: ${allowedModes.join(", ")}`);
		hasInputError = true;
	}

	if (hasInputError) {
		console.error("\nUsage: node src/index.js <mode:all|overview|sum> [employees]\n");
		return 2;
	}

	const transforms = [];

	if (employeeNames.length) {
		transforms.push(
			transducers.filter(helpers.filterForEmployeesFactory(employeeNames))
		);
	}

	transforms.push(
		transducers.map(helpers.createDownTime),
		transducers.map(helpers.parseSummary),
	);

	const transform = transducers.compose(...transforms);

	console.log(
		`Fetching down-time for employee(s) ${employeeNames.join(
			", "
		)} from BambooHR iCal-feed`
	);

	const resp = await axios.get(feedUrl);
	const parsed = ical.parse(resp.data);
	const events = parsed[2];

	console.log(`Fetched ${events.length} iCal events. Processing now...`);

	const employeeEvents = transducers
		.into([], transform, events)
		.sort(helpers.sortByFactory("name"));

	if (["overview", "all"].includes(mode)) {
		console.log("Overview:");
		console.table(employeeEvents);
	}

	if (["sum", "all"].includes(mode)) {
		const sumsByEmployee = employeeEvents
			.reduce(helpers.groupByEmployeeAndType, {});

		console.log("\nSumByEmployee:");
		helpers.prettyPrintGroupedResults(sumsByEmployee);
	}
}

main().then(exitCode => {
	process.exit(exitCode || 0);
}).catch(err => {
	console.error("Uncatched error in main!");
	console.error(err);
	process.exit(1);
});
