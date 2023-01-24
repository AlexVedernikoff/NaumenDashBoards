// @flow
import {cancelNewWidgetCreate} from 'store/widgets/data/actions';
import type {Dispatch} from 'store/types';
import {hideCopyPanel} from 'store/dashboard/settings/actions';

const resetState = () => ({
	type: 'root/resetState'
});

const switchState = (payload: Object) => ({
	payload,
	type: 'root/switchState'
});

const cancelWidgetCreate = () => (dispatch: Dispatch): void => {
	dispatch(cancelNewWidgetCreate());
	dispatch(hideCopyPanel());
};

export {
	cancelWidgetCreate,
	resetState,
	switchState
};
