// @flow
import type {TimeInterval} from 'types/helper';

export const getTimeInSeconds = (timeIntervalInactivity: {interval: TimeInterval, length: number}) => {
	const {interval, length} = timeIntervalInactivity;
	let coef = 0;

	switch (interval) {
		case 'SECOND':
			coef = 1;
			break;
		case 'MINUTE':
			coef = 60;
			break;
		case 'HOUR':
			coef = 60 * 60;
			break;
		case 'DAY':
			coef = 60 * 60 * 24;
			break;
		case 'WEEK':
			coef = 60 * 60 * 24 * 7;
			break;
		default:
			coef = 1;
	}

	return coef * length;
};
