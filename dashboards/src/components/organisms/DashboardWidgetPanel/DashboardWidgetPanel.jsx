// @flow
import DashboardWidgetPanelForm from 'containers/DashboardWidgetPanelForm';
import type {Props} from 'containers/DashboardWidgetPanel/types';
import React from 'react';

const DashboardWidgetPanel = ({editedWidgetId}: Props) => {
    return editedWidgetId ? <DashboardWidgetPanelForm /> : null;
};

export default DashboardWidgetPanel;
