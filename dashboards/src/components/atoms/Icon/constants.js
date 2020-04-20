// @flow
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	ArrowBottom,
	ArrowTop,
	Asc,
	Bold,
	Caret,
	Checkbox,
	CheckboxChecked,
	Close,
	Crop,
	Desc,
	Italic,
	Plus,
	PositionBottom,
	PositionLeft,
	PositionRight,
	PositionTop,
	Underline,
	Wrap
} from 'icons';

const ALIGN_CENTER: 'ALIGN_CENTER' = 'ALIGN_CENTER';
const ALIGN_LEFT: 'ALIGN_LEFT' = 'ALIGN_LEFT';
const ALIGN_RIGHT: 'ALIGN_RIGHT' = 'ALIGN_RIGHT';
const ARROW_BOTTOM: 'ARROW_BOTTOM' = 'ARROW_BOTTOM';
const ARROW_TOP: 'ARROW_TOP' = 'ARROW_TOP';
const ASC: 'ASC' = 'ASC';
const BOLD: 'BOLD' = 'BOLD';
const CARET: 'CARET' = 'CARET';
const CHECKBOX: 'CHECKBOX' = 'CHECKBOX';
const CHECKBOX_CHECKED: 'CHECKBOX_CHECKED' = 'CHECKBOX_CHECKED';
const CLOSE: 'CLOSE' = 'CLOSE';
const CROP: 'CROP' = 'CROP';
const DESC: 'DESC' = 'DESC';
const ITALIC: 'ITALIC' = 'ITALIC';
const PLUS: 'PLUS' = 'PLUS';
const POSITION_BOTTOM: 'POSITION_BOTTOM' = 'POSITION_BOTTOM';
const POSITION_LEFT: 'POSITION_LEFT' = 'POSITION_LEFT';
const POSITION_RIGHT: 'POSITION_RIGHT' = 'POSITION_RIGHT';
const POSITION_TOP: 'POSITION_TOP' = 'POSITION_TOP';
const UNDERLINE: 'UNDERLINE' = 'UNDERLINE';
const WRAP: 'WRAP' = 'WRAP';

const ICON_NAMES = {
	ALIGN_CENTER,
	ALIGN_LEFT,
	ALIGN_RIGHT,
	ARROW_BOTTOM,
	ARROW_TOP,
	ASC,
	BOLD,
	CARET,
	CHECKBOX,
	CHECKBOX_CHECKED,
	CLOSE,
	CROP,
	DESC,
	ITALIC,
	PLUS,
	POSITION_BOTTOM,
	POSITION_LEFT,
	POSITION_RIGHT,
	POSITION_TOP,
	UNDERLINE,
	WRAP
};

const ICONS = {
	[ALIGN_CENTER]: AlignCenter,
	[ALIGN_LEFT]: AlignLeft,
	[ALIGN_RIGHT]: AlignRight,
	[ARROW_BOTTOM]: ArrowBottom,
	[ARROW_TOP]: ArrowTop,
	[ASC]: Asc,
	[BOLD]: Bold,
	[CARET]: Caret,
	[CHECKBOX]: Checkbox,
	[CHECKBOX_CHECKED]: CheckboxChecked,
	[CLOSE]: Close,
	[CROP]: Crop,
	[DESC]: Desc,
	[ITALIC]: Italic,
	[PLUS]: Plus,
	[POSITION_BOTTOM]: PositionBottom,
	[POSITION_LEFT]: PositionLeft,
	[POSITION_RIGHT]: PositionRight,
	[POSITION_TOP]: PositionTop,
	[UNDERLINE]: Underline,
	[WRAP]: Wrap
};

export {
	ICONS,
	ICON_NAMES
};
