// @flow
import {connect} from 'react-redux';
import DashboardWidgetPanel from 'components/organisms/DashboardWidgetPanel';
import {props} from './selectors';
import type {Props} from './types';
import React from 'react';

const DashboardWidgetPanelContainer = (props: Props) => (
    <DashboardWidgetPanel {...props} />
);

export default connect(props)(DashboardWidgetPanelContainer);
