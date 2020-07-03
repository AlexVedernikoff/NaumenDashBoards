// @flow
import axisNormalizer from './axisNormalizer';
import circleNormalizer from './circleNormalizer';
import comboNormalizer from './comboNormalizer';
import {FIELDS} from 'WidgetFormPanel';
import type {LegacyWidget} from './types';
import speedometerNormalizer from './speedometerNormalizer';
import summaryNormalizer from './summaryNormalizer';
import tableNormalizer from './tableNormalizer';
import type {Widget} from 'store/widgets/data/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const transformType = (widget: LegacyWidget) => {
	let {type} = widget;

	if (type && typeof type === 'object') {
		type = type.value;
	}

	widget[type] = type && type in WIDGET_TYPES ? type : WIDGET_TYPES.COLUMN;
};

const widgetNormalizer = (widget: Object): Widget => {
	const {COMBO, DONUT, PIE, SPEEDOMETER, SUMMARY, TABLE} = WIDGET_TYPES;
	transformType(widget);

	switch (widget[FIELDS.type]) {
		case DONUT:
		case PIE:
			return circleNormalizer(widget);
		case COMBO:
			return comboNormalizer(widget);
		case SPEEDOMETER:
			return speedometerNormalizer(widget);
		case SUMMARY:
			return summaryNormalizer(widget);
		case TABLE:
			return tableNormalizer(widget);
		default:
			return axisNormalizer(widget);
	}
};

export default widgetNormalizer;
