// @flow
import {connect} from 'react-redux';
import DashboardWidgetPanelForm from 'components/organisms/DashboardWidgetPanelForm';
import {functions, props} from './selectors';
import type {Props} from './types';
import React from 'react';

const DashboardWidgetPanelFormContainer = (props: Props) => (
    <DashboardWidgetPanelForm {...props} />
);

export default connect(props, functions)(DashboardWidgetPanelFormContainer);
