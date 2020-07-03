// @flow
import {array, header, string} from './helpers';
import {FIELDS} from 'WidgetFormPanel';
import type {SpeedometerWidget} from 'store/widgets/data/types';

const speedometerNormalizer = (widget: SpeedometerWidget): SpeedometerWidget => {
	const {
		borders,
		data,
		id,
		layout,
		ranges,
		type
	} = widget;

	return {
		borders,
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data,
		header: header(widget),
		id,
		layout,
		name: string(widget[FIELDS.name]),
		ranges,
		type
	};
};

export default speedometerNormalizer;
