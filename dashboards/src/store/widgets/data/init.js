// @flow
import type {WidgetsAction, WidgetsDataState} from './types';

export const initialWidgetsState: WidgetsDataState = {
	copying: {
		error: false,
		loading: false
	},
	deleting: {
		error: false,
		loading: false
	},
	focusedWidget: '',
	map: {},
	saving: {
		error: false,
		loading: false
	},
	selectedWidget: '',
	sessionData: {},
	validatingToCopy: {
		error: false,
		loading: false
	}
};

export const defaultAction: WidgetsAction = {
	payload: null,
	type: 'widgets/data/unknownWidgetsAction'
};
