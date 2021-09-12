// @flow
import type {AppState} from 'store/types';
import {cancelSettings, saveSettings, setCommonSettings, setResourceSettings} from 'store/App/actions';

const props = (state: AppState) => {
	const {diagramKey, loading, resources, settings, sources} = state.APP;

	return {
		diagramKey,
		loading,
		resources,
		settings,
		sources
	};
};

const functions = {
	cancelSettings,
	saveSettings,
	setCommonSettings,
	setResourceSettings
};

export {
	functions,
	props
};
