// @flow
import {COMPARE_PERIOD} from 'store/widgets/data/constants';
import type {ComparePeriod, SummaryWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DiffValues} from './types';

const getPeriodTitle = (comparePeriod: ComparePeriod) => {
	switch (comparePeriod.period) {
		case COMPARE_PERIOD.PREVIOUS_DAY:
			return 'за предыдущий день';
		case COMPARE_PERIOD.PREVIOUS_WEEK:
			return 'за предыдущую неделю';
		case COMPARE_PERIOD.PREVIOUS_MONTH:
			return 'за предыдущий месяц';
		case COMPARE_PERIOD.PREVIOUS_YEAR:
			return 'за предыдущий год';

		case COMPARE_PERIOD.CUSTOM: {
			const {endDate = '', startDate = ''} = comparePeriod;
			return `за ${startDate}-${endDate}`;
		}
	}

	return '';
};

const getDiffValues = (data: DiagramBuildData, widget: SummaryWidget): ?DiffValues => {
	if (data.diff) {
		const dataSet = widget.data.find(ds => !ds.sourceForCompute);
		const indicator = dataSet?.source.value.label ?? '';
		const period = getPeriodTitle(widget.comparePeriod);
		const {percent, value} = data.diff;
		return {
			indicator,
			percent,
			period,
			value
		};
	}

	return null;
};

export {
	getDiffValues,
	getPeriodTitle
};
