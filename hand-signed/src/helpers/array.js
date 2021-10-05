// @flow

/**
 * Преобразует многомерный массив в одномерный массив.
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
 * @param {Array<Array<T>>} array - многомерный массив.
 * @return {Array<T>} - одномерный массив.
 */
export const flattenArray = <T>(array: Array<Array<T>>): Array<T> => {
	const stack = [...array];
	const result = [];

	while (stack.length) {
		const next = stack.pop();

		if (Array.isArray(next)) {
			stack.push(...next);
		} else {
			result.push(next);
		}
	}

	return result.reverse();
};
