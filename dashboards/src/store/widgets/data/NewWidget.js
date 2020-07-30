// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {DEFAULT_HEADER_SETTINGS} from 'components/molecules/Diagram/constants';
import {FIELDS} from 'WidgetFormPanel';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {LayoutMode} from 'store/dashboard/settings/types';
import uuid from 'tiny-uuid';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

class NewWidget {
	static id: string = 'new-widget-id';
	computedAttrs: Array<Attribute> = [];
	data: Array<Object> = [];
	displayMode: LayoutMode = LAYOUT_MODE.WEB;
	header = DEFAULT_HEADER_SETTINGS;
	id: string = NewWidget.id;
	name: string = '';
	type: string = WIDGET_TYPES.COLUMN;

	constructor (layoutMode: LayoutMode = LAYOUT_MODE.WEB) {
		this.data.push({
			[FIELDS.dataKey]: uuid(),
			[FIELDS.descriptor]: '',
			[FIELDS.sourceForCompute]: false
		});
		this.displayMode = layoutMode;
	}
}

export default NewWidget;
