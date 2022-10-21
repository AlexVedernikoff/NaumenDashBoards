// @flow
import type {AppAction, AppState} from './types';
import {APP_EVENTS, USER_ROLES} from './constants';

export const initialAppState: AppState = {
	attributesMap: {
		employee: [],
		serviceCall$PMTask: []
	},
	contentCode: '',
	currentInterval: {},
	currentVersion: '',
	diagramKey: '',
	endDate: new Date(),
	errorCommon: false,
	errorData: false,
	errorSettings: false,
	groupAttribute: [],
	hideEditPanel: false,
	loadingCommon: true,
	loadingData: true,
	loadingSettings: true,
	mandatoryAttributes: {},
	masterResources: [],
	masterSettings: {},
	metaClass: '',
	milestonesCheckbox: false,
	progressCheckbox: false,
	resourceAndWorkSettings: [],
	resources: [],
	settings: {columnSettings: []},
	sources: {},
	startDate: new Date(),
	stateMilestonesCheckbox: false,
	subjectUuid: '',
	tasks: [],
	user: {
		email: '',
		name: '',
		role: USER_ROLES.REGULAR
	},
	versions: [],
	workAttributes: [],
	workData: {},
	workProgresses: {},
	workRelationCheckbox: false,
	workRelations: [],
	worksWithoutStartOrEndDateCheckbox: false
};

export const defaultAppAction: AppAction = {
	payload: null,
	type: APP_EVENTS.UNKNOWN_APP_ACTION
};
