// @flow
import {checkNumber, formatMSInterval, makeFormatterByNumberFormat} from './helpers';
import {DEFAULT_NUMBER_AXIS_FORMAT, WIDGET_TYPES} from 'store/widgets/data/constants';
import {getMainDataSet} from 'store/widgets/data/helpers';
import {hasMSInterval} from 'store/widgets/helpers';
import {INTEGER_AGGREGATION} from 'store/widgets/constants';
import type {SpeedometerWidget, SummaryWidget} from 'store/widgets/data/types';
import type {TotalFormatter} from './types';

const getTotalFormatterBase = (widget: SummaryWidget | SpeedometerWidget): TotalFormatter => {
	const {data, indicator} = widget;
	const {computedFormat, format} = indicator;
	const mainDataSet = getMainDataSet(data);
	const {aggregation, attribute} = mainDataSet.indicators[0];
	const usesMSInterval = hasMSInterval(attribute, aggregation);
	let formatter = null;

	if (usesMSInterval) {
		formatter = formatMSInterval;
	} else {
		const defaultSymbolCount = aggregation === INTEGER_AGGREGATION.AVG ? 2 : 0;
		const numberFormat = format ?? computedFormat ?? {...DEFAULT_NUMBER_AXIS_FORMAT, symbolCount: defaultSymbolCount};

		formatter = checkNumber(makeFormatterByNumberFormat(numberFormat, false));
	}

	let diffFormatter = checkNumber(makeFormatterByNumberFormat(DEFAULT_NUMBER_AXIS_FORMAT));

	if (widget.type === WIDGET_TYPES.SUMMARY) {
		const symbolCount = widget.comparePeriod?.format?.symbolCount ?? 0;

		diffFormatter = checkNumber(makeFormatterByNumberFormat({...DEFAULT_NUMBER_AXIS_FORMAT, additional: '%', symbolCount}, false));
	}

	return {
		data: formatter,
		diff: diffFormatter
	};
};

export {getTotalFormatterBase as getTotalFormatter};
