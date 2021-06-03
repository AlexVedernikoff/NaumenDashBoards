// @flow
import type {AppState} from 'store/types';
import {clearWarningMessage, setSelectedWidget} from 'store/widgets/data/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';

export const functions: ConnectedFunctions = {
	clearWarningMessage,
	setSelectedWidget
};

export const props = (state: AppState): ConnectedProps => ({
	editMode: state.dashboard.settings.editMode
});
