// @flow
import {COMPARE_PERIOD} from 'store/widgets/data/constants';
import type {ComparePeriod, SummaryWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DiffValues} from './types';
import t from 'localization';

const getPeriodTitle = (comparePeriod: ComparePeriod) => {
	switch (comparePeriod.period) {
		case COMPARE_PERIOD.PREVIOUS_DAY:
			return t('ComparePeriodBox::AtPreviousDay');
		case COMPARE_PERIOD.PREVIOUS_WEEK:
			return t('ComparePeriodBox::AtPreviousWeek');
		case COMPARE_PERIOD.PREVIOUS_MONTH:
			return t('ComparePeriodBox::AtPreviousMonth');
		case COMPARE_PERIOD.PREVIOUS_YEAR:
			return t('ComparePeriodBox::AtPreviousYear');

		case COMPARE_PERIOD.CUSTOM: {
			const {endDate = '', startDate = ''} = comparePeriod;
			return t('ComparePeriodBox::AtCustomRange', {end: endDate, start: startDate});
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
