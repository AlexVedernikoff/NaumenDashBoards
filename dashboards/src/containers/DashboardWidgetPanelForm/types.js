// @flow
import {closeWidgetPanel, updateWidget} from 'store/dashboard/actions.js';
import Widget from 'entities';

export type Props = {
    closeWidgetPanel: typeof closeWidgetPanel,
    editedWidget: Widget,
    updateWidget: typeof updateWidget
};

export type ConnectedProps = {
    editedWidget: Widget
};

export type ConnectedFunctions = {
    closeWidgetPanel: typeof closeWidgetPanel,
    updateWidget: typeof updateWidget
};
