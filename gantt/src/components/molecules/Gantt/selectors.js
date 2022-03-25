// @flow
import type {AppState} from 'store/types';
import {getGanttData, getListOfWorkAttributes, saveChangedWorkInterval, saveChangedWorkProgress, saveChangedWorkRelations} from 'store/App/actions';

const props = (state: AppState) => {
	const {attributesMap, diagramKey, links, loadingData, resources, settings, tasks, workAttributes} = state.APP;
	const {columnSettings, rollUp, scale} = settings;

	return {
		attributesMap,
		columns: columnSettings,
		diagramKey,
		links,
		loading: loadingData,
		resources,
		rollUp,
		scale,
		tasks,
		workAttributes
	};
};

const functions = {
	getGanttData,
	getListOfWorkAttributes,
	saveChangedWorkInterval,
	saveChangedWorkProgress,
	saveChangedWorkRelations
};

export {
	functions,
	props
};
