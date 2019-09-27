// @flow
import DashboardWidgetPanelForm from 'containers/DashboardWidgetPanelForm';
import type {Props} from './types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import React, {Fragment} from 'react';
import styles from './style.less';

const DashboardWidgetPanel = ({editedWidgetId}: Props) => {
    const editWidgetPanel = editedWidgetId ? <DashboardWidgetPanelForm /> : null;

    return (
        <ReactCSSTransitionGroup
            component={Fragment}
            transitionName={{
                enter: styles.panelEnter,
                enterActive: styles.panelEnterActive,
                leave: styles.panelLeave,
                leaveActive: styles.panelLeaveActive
            }}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
        >
            {editWidgetPanel}
        </ReactCSSTransitionGroup>
    );
}

export default DashboardWidgetPanel;
