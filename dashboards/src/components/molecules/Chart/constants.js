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

export {
	TOOLBAR_HANDLERS,
	ZOOM_MODES
};
