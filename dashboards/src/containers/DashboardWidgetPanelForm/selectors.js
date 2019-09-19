// @flow
import type {AppState} from 'store/types';
import { bindActionCreators, Dispatch } from 'redux'
import {closeWidgetPanel, updateWidget} from 'store/dashboard/actions';
import type {ConnectedProps, ConnectedFunctions} from './types';

export const props = ({dashboard: {widgets, editedWidgetId}}: AppState): ConnectedProps => {
    const editedWidget = widgets.find(w => w.id === editedWidgetId);

    return {
        editedWidget
    };
};

export const functions = (dispatch: Dispatch): ConnectedFunctions => {
    return bindActionCreators({closeWidgetPanel, updateWidget}, dispatch);
};
