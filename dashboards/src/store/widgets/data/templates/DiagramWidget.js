// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {DEFAULT_AGGREGATION, DEFAULT_SYSTEM_GROUP} from 'store/widgets/constants';
import {DEFAULT_HEADER_SETTINGS} from 'components/molecules/Diagram/constants';
import {DEFAULT_NAVIGATION_SETTINGS, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {NavigationSettings, WidgetType} from 'store/widgets/data/types';
import NewWidget from 'store/widgets/data/NewWidget';
import uuid from 'tiny-uuid';

class DiagramWidget extends NewWidget {
	computedAttrs: Array<Attribute> = [];
	data: Array<Object> = [];
	header = DEFAULT_HEADER_SETTINGS;
	name: string = 'Новый виджет';
	navigation: NavigationSettings = DEFAULT_NAVIGATION_SETTINGS;
	type: WidgetType = WIDGET_TYPES.COLUMN;

	constructor (layoutMode: LayoutMode) {
		super(layoutMode);

		this.data.push({
			dataKey: uuid(),
			indicators: [{
				aggregation: DEFAULT_AGGREGATION.COUNT,
				attribute: null
			}],
			parameters: [{
				attribute: null,
				group: DEFAULT_SYSTEM_GROUP.OVERLAP
			}],
			source: {
				descriptor: '',
				value: null
			},
			sourceForCompute: false
		});
	}
}

export default DiagramWidget;
