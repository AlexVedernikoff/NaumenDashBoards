// @flow
import {connect} from 'react-redux';
import DashboardEditHeader from 'components/molecules/DashboardEditHeader';
import {functions, props} from './selectors';
import type {Props} from './types';
import React from 'react';

export const DashboardEditHeaderContainer = (props: Props) => (
	<DashboardEditHeader {...props}/>
);

export default connect(props, functions)(DashboardEditHeaderContainer);
