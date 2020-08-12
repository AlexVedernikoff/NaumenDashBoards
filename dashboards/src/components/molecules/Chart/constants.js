// @flow
const RESET_ALL = 'toggleOtherControls';
const TOGGLE_PANNING = 'togglePanning';
const ZOOM_IN = 'handleZoomIn';
const ZOOM_OUT = 'handleZoomOut';
const ZOOM_RESET = 'handleZoomReset';
const ZOOM_SELECTION = 'toggleZoomSelection';

const TOOLBAR_HANDLERS = {
	RESET_ALL,
	TOGGLE_PANNING,
	ZOOM_IN,
	ZOOM_OUT,
	ZOOM_RESET,
	ZOOM_SELECTION
};

const PAN: 'PAN' = 'PAN';
const ZOOM: 'ZOOM' = 'ZOOM';

const ZOOM_MODES = {
	PAN,
	ZOOM
};

const MINUS = 'Minus';
const NUM_PLUS = 'NumpadAdd';
const NUM_DOWN = 'NumpadSubtract';
const NUM_ZERO = 'Numpad0';
const PLUS = 'Equal';
const ZERO = 'Digit0';

const MINUS_KEY = 189;
const NUM_PLUS_KEY = 107;
const NUM_DOWN_KEY = 109;
const NUM_ZERO_KEY = 96;
const PLUS_KEY = 187;
const ZERO_KEY = 48;

const KEY_CODES = {
  MINUS,
  MINUS_KEY,
  NUM_DOWN,
  NUM_DOWN_KEY,
  NUM_PLUS,
  NUM_PLUS_KEY,
  NUM_ZERO,
  NUM_ZERO_KEY,
  PLUS,
  PLUS_KEY,
  ZERO,
  ZERO_KEY
};

export {
	KEY_CODES,
	TOOLBAR_HANDLERS,
	ZOOM_MODES
};
