// @flow
const RESET_STATE: 'RESET_STATE' = 'RESET_STATE';
const SWITCH_STATE: 'SWITCH_STATE' = 'SWITCH_STATE';

const ROOT_EVENTS = {
	RESET_STATE,
	SWITCH_STATE
};

// Ключи, по которым сохраняются данные в localStorage
const LAYOUT_MODE: 'layoutMode' = 'layoutMode';
const PERSONAL_DASHBOARD: 'personalDashboard' = 'personalDashboard';

const LOCAL_STORAGE_VARS = {
	LAYOUT_MODE,
	PERSONAL_DASHBOARD
};

export {
	LOCAL_STORAGE_VARS,
	ROOT_EVENTS
};
