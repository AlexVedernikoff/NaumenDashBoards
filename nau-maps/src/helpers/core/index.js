// @flow
export const debounce = (fn, timeout = 1000) => {
	let timer = null;

	return (...params) => {
		clearTimeout(timer);

		timer = setTimeout(() => {
			fn.apply(this, params);
		}, timeout);
	};
};

export const clearString = v => String(v).toLowerCase().trim();
