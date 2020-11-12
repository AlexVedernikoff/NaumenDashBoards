// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {DEFAULT_HEADER_SETTINGS} from 'components/molecules/Diagram/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import type {LayoutMode} from 'store/dashboard/settings/types';
import NewWidget from 'store/widgets/data/NewWidget';
import uuid from 'tiny-uuid';
import type {WidgetType} from 'store/widgets/data/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

class DiagramWidget extends NewWidget {
	computedAttrs: Array<Attribute> = [];
	data: Array<Object> = [];
	header = DEFAULT_HEADER_SETTINGS;
	name: string = 'Новый виджет';
	type: WidgetType = WIDGET_TYPES.COLUMN;

	constructor (layoutMode: LayoutMode) {
		super(layoutMode);
		this.data.push({
			[FIELDS.dataKey]: uuid(),
			[FIELDS.descriptor]: '',
			[FIELDS.sourceForCompute]: false
		});
	}
}

export default DiagramWidget;
