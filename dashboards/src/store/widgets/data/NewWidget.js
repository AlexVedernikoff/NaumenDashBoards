// @flow
import {DISPLAY_MODE, WIDGET_TYPES} from './constants';
import type {DisplayMode} from './types';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {LayoutMode} from 'store/dashboard/settings/types';

class NewWidget {
	static id: string = 'new-widget-id';
	displayMode: DisplayMode = DISPLAY_MODE.WEB;
	id: string = NewWidget.id;
	type = WIDGET_TYPES.BAR;

	constructor (layoutMode: LayoutMode = LAYOUT_MODE.WEB) {
		this.displayMode = layoutMode;
	}
}

export default NewWidget;
