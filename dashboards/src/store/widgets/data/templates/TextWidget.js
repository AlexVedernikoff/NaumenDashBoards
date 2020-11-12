// @flow
import type {LayoutMode} from 'store/dashboard/settings/types';
import NewWidget from 'store/widgets/data/NewWidget';
import {TEXT_ALIGNS, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {WidgetType} from 'store/widgets/data/types';

class TextWidget extends NewWidget {
	text: string = '';
	type: WidgetType = WIDGET_TYPES.TEXT;
	textSettings = null;

	constructor (layoutMode: LayoutMode) {
		super(layoutMode);
		this.textSettings = {
			styleMap: {},
			textAlign: TEXT_ALIGNS.left
		};
	}
}

export default TextWidget;
