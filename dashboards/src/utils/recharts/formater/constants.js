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

export {
	INTERVALS
};
