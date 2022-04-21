// @flow
import type {AppState} from 'store/types';
import {getGanttData, getListOfWorkAttributes, postEditedWorkData, saveChangedWorkInterval, saveChangedWorkProgress, saveChangedWorkRelations, switchProgressCheckbox} from 'store/App/actions';

const props = (state: AppState) => {
	const {attributesMap, diagramKey, loadingData, progressCheckbox, resources, settings, tasks, workAttributes, workRelationCheckbox, workRelations} = state.APP;
	const {columnSettings, rollUp, scale} = settings;

	return {
		attributesMap,
		columns: columnSettings,
		diagramKey,
		loading: loadingData,
		progressCheckbox,
		resources,
		rollUp,
		scale,
		tasks,
		workAttributes,
		workRelationCheckbox,
		workRelations
	};
};

const functions = {
	getGanttData,
	getListOfWorkAttributes,
	postEditedWorkData,
	saveChangedWorkInterval,
	saveChangedWorkProgress,
	saveChangedWorkRelations,
	switchProgressCheckbox
};

export {
	functions,
	props
};
