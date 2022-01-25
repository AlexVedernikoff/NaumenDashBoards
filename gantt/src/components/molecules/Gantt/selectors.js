// @flow
import type {AppState} from 'store/types';

const props = (state: AppState) => {
	const {diagramKey, links, loadingData, settings, tasks} = state.APP;
	const {columnSettings, rollUp, scale} = settings;

	return {
		columns: columnSettings,
		diagramKey,
		links,
		loading: loadingData,
		rollUp,
		scale,
		tasks
	};
};

export {
	props
};
