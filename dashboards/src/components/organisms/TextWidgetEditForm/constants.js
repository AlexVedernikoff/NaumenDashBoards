// @flow
import {FIELDS as BASE_FIELDS} from 'containers/WidgetEditForm/constants';
import {FONT_FAMILIES} from 'store/widgets/data/constants';

const content: 'content' = 'content';
const editorState: 'editorState' = 'editorState';
const styleMap: 'styleMap' = 'styleMap';
const text: 'text' = 'text';
const textSettings: 'textSettings' = 'textSettings';

const FIELDS = {
	...BASE_FIELDS,
	content,
	editorState,
	styleMap,
	text,
	textSettings
};

const ITALIC_KEY = 73;
const BOLD_KEY = 66;
const UNDERLINE_KEY = 85;

const HOT_KEYS = {
	BOLD_KEY,
	ITALIC_KEY,
	UNDERLINE_KEY
};

const TOGGLE_BOLD_STYLE: 'TOGGLE_BOLD_STYLE' = 'TOGGLE_BOLD_STYLE';
const TOGGLE_ITALIC_STYLE: 'TOGGLE_ITALIC_STYLE' = 'TOGGLE_ITALIC_STYLE';
const TOGGLE_UNDERLINE_STYLE: 'TOGGLE_UNDERLINE_STYLE' = 'TOGGLE_UNDERLINE_STYLE';

const HOT_KEYS_COMMANDS = {
	TOGGLE_BOLD_STYLE,
	TOGGLE_ITALIC_STYLE,
	TOGGLE_UNDERLINE_STYLE
};

const COMMAND_HANDLED_EVENT: 'handled' = 'handled';
const COMMAND_NOT_HANDLED_EVENT: 'not-handled' = 'not-handled';

const COMMAND_EVENTS = {
	COMMAND_HANDLED_EVENT,
	COMMAND_NOT_HANDLED_EVENT
};

const DEFAULT_TEXT_WIDGET_SETTINGS = {
	color: '#323232',
	fontFamily: FONT_FAMILIES[0],
	fontSize: 16
};

export {
	COMMAND_EVENTS,
	DEFAULT_TEXT_WIDGET_SETTINGS,
	FIELDS,
	HOT_KEYS,
	HOT_KEYS_COMMANDS
};
