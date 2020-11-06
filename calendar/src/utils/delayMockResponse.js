// @flow
const delayMockResponse = (data: Object): Promise<Object> =>
	new Promise((resolve) => {
		setTimeout(() => resolve(data), 600);
	});

export default delayMockResponse;
