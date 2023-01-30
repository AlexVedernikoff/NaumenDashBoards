// @flow
const resetState = () => ({
	type: 'root/resetState'
});

const switchState = (payload: Object) => ({
	payload,
	type: 'root/switchState'
});

export {
	resetState,
	switchState
};
