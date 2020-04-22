const ical = require("ical.js");
const axios = require("axios").default;
const transducers = require("transducers.js");

async function main() {
	const employeeNames = process.argv.slice(2);
	const feedUrl = process.env.FEED_URL;

	const transforms = [];

	if (employeeNames.length) {
		transforms.push(
			transducers.filter(event => {
				const fields = event[1];

				const summary = fields.find(field => {
					return field[0] == "summary";
				});

				return employeeNames.some(employee =>
					summary[3].includes(employee)
				);
			})
		);
	}

	transforms.push(
		transducers.map(event => {
			const [type, fields] = event;

			return {
				description: fields.find(field => field[0] == "description")[3],
				summary: fields.find(field => field[0] == "summary")[3],
				start: fields.find(field => field[0] == "dtstart")[3],
				end: fields.find(field => field[0] == "dtend")[3],
			};
		})
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
		.sort((a, b) => {
			if (a.summary > b.summary) {
				return 1;
			} else if (b.summary > a.summary) {
				return -1;
			} else {
				return 0;
			}
		});

	console.table(employeeEvents);
}

main().catch(err => {
	console.error("Uncatched error in main!");
	console.error(err);
	process.exit(1);
});
