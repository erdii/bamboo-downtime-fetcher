exports.filterForEmployeesFactory = (employeeNames) => (event) => {
	const fields = event[1];

	const summary = fields.find(field => {
		return field[0] == "summary";
	});

	return employeeNames.some(employee =>
		summary[3].includes(employee)
	);
}

exports.createDownTime = event => {
	const [type, fields] = event;

	return {
		description: fields.find(field => field[0] == "description")[3],
		summary: fields.find(field => field[0] == "summary")[3],
		start: fields.find(field => field[0] == "dtstart")[3],
		end: fields.find(field => field[0] == "dtend")[3],
	};
};

exports.parseSummary = (downTime) => {
	const summaryRegex = /^(.*) \((.*) - (.*)\)$/;

	const [_, name, type, daysString] = downTime.summary.match(summaryRegex);

	const days = parseFloat(daysString.split(" "));

	return {
		name,
		type,
		days,
		start: downTime.start,
		end: downTime.end,
	};
}

exports.sortByFactory = (property) => (a, b) => {
	if (a[property] > b[property]) {
		return 1;
	} else if (b[property] > a[property]) {
		return -1;
	} else {
		return 0;
	}
}

exports.groupByEmployeeAndType = (acc, {name, type, days}) => {
	acc[name] = acc[name] || {};
	acc[name]["Total"] = acc[name]["Total"] || 0;
	acc[name][type] = acc[name][type] || 0;
	acc[name][type] += days;
	acc[name]["Total"] += days;
	return acc;
}

exports.prettyPrintGroupedResults = (groupedResults) => {
	const employees = Object.keys(groupedResults);

	for (const employee of employees) {
		const employeeResults = groupedResults[employee];
		console.log(`${employee}:`);
		const types = Object.keys(employeeResults);
		for (const type of types) {
			console.log(`\t${type}: ${employeeResults[type]}`);
		}
	}
}
