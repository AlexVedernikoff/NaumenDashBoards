//@flow

export const compareFormatter = (data: ?[(string | number), string], formatter: (string | number) => string) => {
	if (data) {
		data.forEach(([item, value, ctx]) => {
			expect(formatter(item, ctx)).toEqual(value);
		});
	}
};