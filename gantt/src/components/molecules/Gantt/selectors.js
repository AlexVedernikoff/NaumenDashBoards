// @flow
import type {AppState} from 'store/types';
import {getListOfGroupAttributes, saveChangeProgress} from 'store/App/actions';

const props = (state: AppState) => {
	const {diagramKey, groupAttribute, links, loadingData, resources, settings, tasks} = state.APP;
	const {columnSettings, rollUp, scale} = settings;

	return {
		columns: columnSettings,
		diagramKey,
		groupAttribute,
		links,
		loading: loadingData,
		resources,
		rollUp,
		scale,
		tasks
	};
};

const functions = {
	getListOfGroupAttributes,
	saveChangeProgress
};

export {
	functions,
	props
};
