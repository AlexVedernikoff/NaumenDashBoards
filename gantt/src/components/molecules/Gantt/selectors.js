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
	switchProgressCheckbox,
	setRangeTime
} from 'store/App/actions';

const props = (state: AppState) => {
	const {
		attributesMap,
		currentVersion,
		diagramKey,
		loadingData,
		progressCheckbox,
		resources,
		settings,
		tasks,
		workAttributes,
		workLink,
		workRelationCheckbox,
		workRelations
	} = state.APP;
	const {columnSettings, rollUp, scale} = settings;

	return {
		attributesMap,
		columns: columnSettings,
		currentVersion,
		diagramKey,
		loading: loadingData,
		progressCheckbox,
		resources,
		rollUp,
		scale,
		tasks,
		workAttributes,
		workLink,
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
	switchProgressCheckbox,
	setRangeTime
};

export {
	functions,
	props
};
