// @flow
import {array, header, string, templateName} from './helpers';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'components/organisms/Speedometer/constants';
import {DISPLAY_MODE} from 'store/widgets/data/constants';
import {FIELDS} from 'WidgetFormPanel';
import type {SpeedometerWidget} from 'store/widgets/data/types';

const speedometerNormalizer = (widget: SpeedometerWidget): SpeedometerWidget => {
	const {
		borders,
		data,
		displayMode = DISPLAY_MODE.WEB,
		id,
		indicator = DEFAULT_SPEEDOMETER_SETTINGS.indicator,
		ranges,
		type
	} = widget;

	return {
		borders,
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data,
		displayMode,
		header: header(widget),
		id,
		indicator,
		name: string(widget[FIELDS.name]),
		ranges,
		templateName: templateName(widget),
		type
	};
};

export default speedometerNormalizer;
