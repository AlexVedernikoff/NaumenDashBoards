// @flow
import {DISPLAY_MODE, WIDGET_TYPES} from './constants';
import type {DisplayMode, WidgetType} from './types';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {LayoutMode} from 'store/dashboard/settings/types';

class NewWidget {
	static id: string = 'new-widget-id';
	displayMode: DisplayMode = DISPLAY_MODE.WEB;
	id: string = NewWidget.id;
	type: WidgetType = WIDGET_TYPES.COLUMN;

	constructor (layoutMode: LayoutMode = LAYOUT_MODE.WEB, type: WidgetType = WIDGET_TYPES.COLUMN) {
		this.displayMode = layoutMode;
		this.type = type;
	}
}

export default NewWidget;
