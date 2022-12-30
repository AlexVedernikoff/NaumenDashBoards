// @flow
import type {AppAction, AppState} from './types';
import {APP_EVENTS, USER_ROLES} from './constants';

export const initialAppState: AppState = {
	attributesMap: {
		employee: [],
		serviceCall$PMTask: []
	},
	contentCode: '',
	currentColorSettings: [],
	currentInterval: {},
	currentVersion: '',
	diagramKey: '',
	endDate: new Date(),
	errorCommon: false,
	errorData: false,
	errorSettings: false,
	groupAttribute: [],
	hideEditPanel: false,
	isPersonal: false,
	isPersonalDiagram: true,
	loadingCommon: true,
	loadingData: true,
	loadingSettings: true,
	mandatoryAttributes: {},
	masterResources: [],
	masterSettings: {},
	metaClass: '',
	milestonesCheckbox: false,
	multiplicityCheckbox: false,
	progressCheckbox: false,
	resourceAndWorkSettings: [],
	resources: [],
	settings: {columnSettings: []},
	sources: {},
	startDate: new Date(),
	stateMilestonesCheckbox: false,
	subjectUuid: '',
	tasks: [],
	textPositionCheckbox: false,
	user: {
		email: '',
		name: '',
		role: ''
	},
	users: [],
	vacationAndWeekendsCheckbox: false,
	versions: [],
	viewOfNestingCheckbox: false,
	viewWork: {},
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
