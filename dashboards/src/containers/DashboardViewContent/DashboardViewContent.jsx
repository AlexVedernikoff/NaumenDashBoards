// @flow
import {connect} from 'react-redux';
import {props} from './selectors';
import type {Props} from './types';
import React from 'react';
import ResponsiveLayout from 'components/molecules/ResponsiveLayout';

export const DashboardViewContentContainer = (props: Props) => (
	<ResponsiveLayout widgets={props.widgets} />
);

export default connect(props)(DashboardViewContentContainer);
