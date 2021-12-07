const createError = (node, message, fix = null) => ({
	fix,
	message,
	node
});

const hasCamelCase = string => /([a-z]*)([A-Z]*?)([A-Z][a-z]+)/g.test(string);

const snakeCase = string => {
	const upperChars = string.match(/([A-Z])/g);

	upperChars.forEach(char => {
		string = string.replace(new RegExp(char), '_' + char.toLowerCase());
	});

	if (string[0] === '_') {
		string = string.slice(1);
	}

	return string;
};

const simplifyString = string => {
	if (hasCamelCase(string)) {
		string = snakeCase(string);
	}

	return string.toLowerCase();
};

const hasAlphabetOrderError = (currentString, nextString) => simplifyString(currentString) > simplifyString(nextString);

module.exports = {
	createError,
	hasAlphabetOrderError,
	simplifyString
};
