// @flow
import type {AxisIndicator, AxisParameter} from 'store/widgets/data/types';
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

const getXAxisOptions = (parameter: AxisParameter) => {
	const {name, show, showName} = parameter;

	const options: Object = {
		labels: {
			hideOverlappingLabels: false,
			rotate: -60,
			rotateAlways: true,
			show
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
			// Если проставить значение, то уплывает название оси на легенду
			maxWidth: undefined
		},
		show
	};

	if (showName) {
		options.title = {
			text: name
		};
	}

	return options;
};

export {
	axisLabelFormatter,
	getXAxisOptions,
	getYAxisOptions,
	valueFormatter
};
