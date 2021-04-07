// @flow
import type {AppState} from 'store/types';
import {cancelForm} from 'store/widgets/data/actions';
import type {ConnectedProps} from './types';
import {getAllWidgetsWithoutSelected} from 'store/widgets/data/selectors';

export const props = (state: AppState): ConnectedProps => ({
	saving: state.widgets.data.saving.loading,
	widgets: getAllWidgetsWithoutSelected(state)
});

export const functions = {
	cancelForm
};
