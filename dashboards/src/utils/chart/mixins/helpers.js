// @flow
import type {AxisIndicator, AxisWidget, ComboWidget} from 'store/widgets/data/types';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import moment from 'moment';
import {parseMSInterval} from 'store/widgets/helpers';

const axisLabelFormatter = (value: number | string) => {
	let label = value;

	if (typeof label === 'string' && label.length > 25) {
		label = `${label.substring(0, 20)}...`;
	}

	return label;
};

const valueFormatter = (usesMSInterval: boolean, usesPercent: boolean, showZero: boolean = true) => (value: number) => {
	let formattedValue = value;

	if (usesMSInterval) {
		formattedValue = parseMSInterval(formattedValue);
	} else if (value) {
		if (!Number.isInteger(formattedValue)) {
			formattedValue = formattedValue.toFixed(2);
		}

		if (usesPercent) {
			formattedValue = `${formattedValue}%`;
		}
	}

	if (!showZero && value === 0) {
		formattedValue = '';
	}

	return formattedValue;
};

const getXAxisLabels = (widget: AxisWidget | ComboWidget, labels: Array<string>): Array<string> => {
	const set = getBuildSet(widget);
	const {group} = set;

	if (group.way === GROUP_WAYS.SYSTEM && group.data === DATETIME_SYSTEM_GROUP.SEVEN_DAYS) {
		return labels.map(str => {
			const dates = str.split('-');
			return `${moment(dates[0], 'DD.MM.YY').format('DD MMMM')} - ${moment(dates[1], 'DD.MM.YY').format('DD MMMM')}`;
		});
	}

	return labels;
};

const getXAxisOptions = (widget: AxisWidget | ComboWidget) => {
	const {parameter} = widget;
	const {name, show, showName} = parameter;

	let options: Object = {
		labels: {
			hideOverlappingLabels: true,
			maxHeight: 100,
			minHeight: 50,
			rotate: -60,
			show,
			trim: true
		},
		title: {
			offsetY: 10
		}
	};

	if (showName) {
		options.title.text = name;
	}

	return options;
};

const getYAxisOptions = (indicator: AxisIndicator) => {
	const {name, show, showName} = indicator;

	const options: Object = {
		decimalsInFloat: 2,
		labels: {
			maxWidth: 140
		},
		show
	};

	if (showName) {
		options.title = {
			offsetX: -5,
			text: name
		};
	}

	return options;
};

export {
	axisLabelFormatter,
	getXAxisLabels,
	getXAxisOptions,
	getYAxisOptions,
	valueFormatter
};
