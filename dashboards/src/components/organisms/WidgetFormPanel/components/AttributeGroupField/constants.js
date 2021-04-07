// @flow
import {GROUP_WAYS} from 'store/widgets/constants';
import {ICON_NAMES} from 'components/atoms/Icon';

const ICONS: Object = {
	[GROUP_WAYS.CUSTOM]: {
		calendar: ICON_NAMES.TOUCH_CALENDAR,
		number: ICON_NAMES.TOUCH_NUMBER,
		text: ICON_NAMES.TOUCH_TEXT
	},
	[GROUP_WAYS.SYSTEM]: {
		calendar: ICON_NAMES.CALENDAR,
		number: ICON_NAMES.NUMBER,
		text: ICON_NAMES.TEXT
	}
};

export {
	ICONS
};
