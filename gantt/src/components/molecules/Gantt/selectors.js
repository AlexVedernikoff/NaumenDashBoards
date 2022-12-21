// @flow
import type {AppState} from 'store/types';
import {
	editWorkDateRangesFromVersion,
	getGanttData,
	getListOfWorkAttributes,
	postEditedWorkData,
	saveChangedWorkInterval,
	saveChangedWorkProgress,
	saveChangedWorkRelations,
	savePositionOfWork,
	setRangeTime,
	switchProgressCheckbox
} from 'store/App/actions';
import {USER_ROLES} from 'store/App/constants';

const props = (state: AppState) => {
	const {
		attributesMap,
		currentVersion,
		diagramKey,
		loadingData,
		mandatoryAttributes,
		progressCheckbox,
		resources,
		settings,
		tasks,
		user,
		workAttributes,
		workData,
		workRelationCheckbox,
		workRelations
	} = state.APP;
	const {role} = user;
	const {columnSettings, rollUp, scale} = settings;

	return {
		attributesMap,
		columns: columnSettings,
		currentVersion,
		diagramKey,
		loading: loadingData,
		mandatoryAttributes,
		progressCheckbox,
		resources,
		roleSuper: role === USER_ROLES.SUPER,
		rollUp,
		scale,
		tasks,
		workAttributes,
		workData,
		workRelationCheckbox,
		workRelations
	};
};

const functions = {
	editWorkDateRangesFromVersion,
	getGanttData,
	getListOfWorkAttributes,
	postEditedWorkData,
	saveChangedWorkInterval,
	saveChangedWorkProgress,
	saveChangedWorkRelations,
	savePositionOfWork,
	setRangeTime,
	switchProgressCheckbox
};

export {
	functions,
	props
};
