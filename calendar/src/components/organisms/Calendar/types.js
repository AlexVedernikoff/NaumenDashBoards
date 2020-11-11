// @flow

export type SchedulerEvent<T> = {
	value: T
};

export type Resourse = {
	colorField: string,
	data: Array<{
		color: string | null,
		value: string
	}>,
	field: string,
	name: string,
	valueField: string
};
