// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Layout} from 'types/layout';
import type {Props} from './types';
import React, {Component} from 'react';
import ResponsiveLayout from 'components/molecules/ResponsiveLayout';

export class DashboardEditContainer extends Component<Props> {
	onLayoutChange = (layout: Layout) => {
		const {editLayout} = this.props;
		editLayout(layout)
	};

	render () {
		const {editWidget, widgets} = this.props;

		return (
			<ResponsiveLayout
				editWidget={editWidget}
				onLayoutChange={this.onLayoutChange}
				widgets={widgets}
			/>
		);
	}
}

export default connect(props, functions)(DashboardEditContainer);
