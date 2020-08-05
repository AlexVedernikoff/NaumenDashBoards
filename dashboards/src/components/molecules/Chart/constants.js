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

const KEY_CODES = {
	MINUS,
	NUM_DOWN,
	NUM_PLUS,
	NUM_ZERO,
	PLUS,
	ZERO
};

export {
	KEY_CODES,
	TOOLBAR_HANDLERS,
	ZOOM_MODES
};
