// @flow
import {DISPLAY_MODE, WIDGET_TYPES} from './constants';
import type {DisplayMode, WidgetType} from './types';
import type {WidgetLayoutPosition} from 'store/dashboard/layouts/types';

class NewWidget {
	static id: string = 'new-widget-id';
	displayMode: DisplayMode = DISPLAY_MODE.WEB;
	id: string = NewWidget.id;
	type: WidgetType = WIDGET_TYPES.COLUMN;
	recommendedPosition: ?WidgetLayoutPosition;

	constructor (
		displayMode: DisplayMode = DISPLAY_MODE.WEB,
		type: WidgetType = WIDGET_TYPES.COLUMN,
		recommendedPosition: ?WidgetLayoutPosition = null
	) {
		this.displayMode = displayMode;
		this.type = type;
		this.recommendedPosition = recommendedPosition;
	}
}

export default NewWidget;
