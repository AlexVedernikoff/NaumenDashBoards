// @flow
import type {AppState} from 'store/types';
import {cancelSettings, changeScale, saveSettings, setCommonSettings, setResourceSettings} from 'store/App/actions';

const props = (state: AppState) => {
	const {diagramKey, errorSettings, loadingSettings, resources, settings, sources} = state.APP;

	return {
		diagramKey,
		errorSettings,
		loading: loadingSettings,
		resources,
		settings,
		sources
	};
};

const functions = {
	cancelSettings,
	changeScale,
	saveSettings,
	setCommonSettings,
	setResourceSettings
};

export {
	functions,
	props
};
