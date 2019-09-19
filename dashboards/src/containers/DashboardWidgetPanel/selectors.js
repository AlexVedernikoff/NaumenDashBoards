// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

export const props = ({dashboard: {editedWidgetId}}: AppState): ConnectedProps => {
    return {
        editedWidgetId
    };
};
