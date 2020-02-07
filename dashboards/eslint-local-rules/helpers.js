const createError = (node, message, fix = null) => ({
	fix,
	message,
	node
});

const simplifyString = string => string.replace(/[^a-zA-Z]+/g, '').toLowerCase();

const hasAlphabetOrderError = (currentString, nextString) => simplifyString(currentString) > simplifyString(nextString);

module.exports = {
	createError,
	hasAlphabetOrderError
};
