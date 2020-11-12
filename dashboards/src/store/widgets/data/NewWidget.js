// @flow
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {LayoutMode} from 'store/dashboard/settings/types';

class NewWidget {
	static id: string = 'new-widget-id';
	displayMode: LayoutMode = LAYOUT_MODE.WEB;
	id: string = NewWidget.id;

	constructor (layoutMode: LayoutMode = LAYOUT_MODE.WEB) {
		this.displayMode = layoutMode;
	}
}

export default NewWidget;
