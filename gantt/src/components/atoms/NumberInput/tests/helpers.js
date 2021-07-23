const getProps = mixin => {
	return {
		controls: {},
		name: 'name',
		value: 0,
		...mixin
	};
};

export {
	getProps
};
