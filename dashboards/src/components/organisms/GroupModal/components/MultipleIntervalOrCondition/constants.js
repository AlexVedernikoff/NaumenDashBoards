// @flow
import {INTERVAL_SYSTEM_GROUP} from 'src/store/widgets/constants';

const OPTIONS = [
	{
		label: 'Секунд',
		value: INTERVAL_SYSTEM_GROUP.SECOND
	},
	{
		label: 'Минут',
		value: INTERVAL_SYSTEM_GROUP.MINUTE
	},
	{
		label: 'Часов',
		value: INTERVAL_SYSTEM_GROUP.HOUR
	},
	{
		label: 'Дней',
		value: INTERVAL_SYSTEM_GROUP.DAY
	},
	{
		label: 'Недель',
		value: INTERVAL_SYSTEM_GROUP.WEEK
	}
];

export {
	OPTIONS
};
