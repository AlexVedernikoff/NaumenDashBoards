// @flow
const createCustomGroupType = (...keys: Array<string>) => {
	let type = keys[0];

	if (keys.length > 1) {
		keys.forEach((key, index) => {
			if (index > 0) {
				type = `${type}$${key}`;
			}
		});
	}

	return type;
};

export {
	createCustomGroupType
};
