// @flow
const DEFAULT_INTERVAL = 15;

const SECONDS_IN_MINUTE = 60;

// Режимы отображения сетки
const MOBILE: 'MOBILE' = 'MOBILE';
const WEB: 'WEB' = 'WEB';

const LAYOUT_MODE = {
	MOBILE,
	WEB
};

// контрольные точки отображения сетки
const LG: 'lg' = 'lg';
const SM: 'sm' = 'sm';

const LAYOUT_BREAKPOINTS = {
	LG,
	SM
};

const LEFT: 'LEFT' = 'LEFT';
const RIGHT: 'RIGHT' = 'RIGHT';

const EDIT_PANEL_POSITION = {
	LEFT,
	RIGHT
};

const MAX_AUTO_UPDATE_INTERVAL = 999;

export {
	DEFAULT_INTERVAL,
	SECONDS_IN_MINUTE,
	EDIT_PANEL_POSITION,
	MAX_AUTO_UPDATE_INTERVAL,
	LAYOUT_BREAKPOINTS,
	LAYOUT_MODE
};
