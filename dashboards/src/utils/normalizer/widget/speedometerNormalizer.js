// @flow
import {array, header, string} from './helpers';
import {FIELDS} from 'WidgetFormPanel';
import type {SpeedometerWidget} from 'store/widgets/data/types';

const speedometerNormalizer = (widget: SpeedometerWidget): SpeedometerWidget => {
	const {
		borders,
		data,
		displayMode,
		id,
		layout,
		mkLayout,
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
		layout,
		mkLayout,
		name: string(widget[FIELDS.name]),
		ranges,
		type
	};
};

export default speedometerNormalizer;
