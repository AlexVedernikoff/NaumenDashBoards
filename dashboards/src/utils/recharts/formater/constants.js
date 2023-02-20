import {DT_INTERVAL_PERIOD} from 'store/widgets/data/constants';

// Периоды атрибута типа dtInterval
const INTERVALS = [
	{
		label: 'recharts::formatMSInterval::Seconds',
		max: 60000,
		min: 1000
	},
	{
		label: 'recharts::formatMSInterval::Minutes',
		max: 36e5,
		min: 60000
	},
	{
		label: 'recharts::formatMSInterval::Hours',
		max: 864e5,
		min: 36e5
	},
	{
		label: 'recharts::formatMSInterval::Days',
		max: 6048e5,
		min: 864e5
	},
	{
		label: 'recharts::formatMSInterval::Weeks',
		max: Infinity,
		min: 6048e5
	}
];

const INTERVALS_DIVIDER = {
	[DT_INTERVAL_PERIOD.NOT_SELECTED]: null,
	[DT_INTERVAL_PERIOD.SECONDS]: 1_000,
	[DT_INTERVAL_PERIOD.MINUTES]: 60 * 1_000,
	[DT_INTERVAL_PERIOD.HOURS]: 60 * 60 * 1_000,
	[DT_INTERVAL_PERIOD.DAY]: 24 * 60 * 60 * 1_000,
	[DT_INTERVAL_PERIOD.WEEK]: 7 * 24 * 60 * 60 * 1_000
};

export {
	INTERVALS,
	INTERVALS_DIVIDER
};
