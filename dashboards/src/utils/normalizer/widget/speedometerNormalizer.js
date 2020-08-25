// @flow
import {array, header, string, templateName} from './helpers';
import {DISPLAY_MODE} from 'store/widgets/data/constants';
import {FIELDS} from 'WidgetFormPanel';
import type {SpeedometerWidget} from 'store/widgets/data/types';

const speedometerNormalizer = (widget: SpeedometerWidget): SpeedometerWidget => {
	const {
		borders,
		data,
		displayMode = DISPLAY_MODE.WEB,
		id,
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
		name: string(widget[FIELDS.name]),
		ranges,
		templateName: templateName(widget),
		type
	};
};

export default speedometerNormalizer;
