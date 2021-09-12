// @flow
import type {AppState} from 'store/types';

const props = (state: AppState) => {
	const {diagramKey, loading, settings, tasks} = state.APP;
	const {columnSettings, rollUp, scale} = settings;

	return {
		columns: columnSettings,
		diagramKey,
		loading,
		rollUp,
		scale,
		tasks
	};
};

export {
	props
};
