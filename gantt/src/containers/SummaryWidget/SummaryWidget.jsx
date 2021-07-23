// @flow
import {connect} from 'react-redux';
import {functions} from './selectors';
import {LoadingDiagramWidget} from 'src/components/organisms/DiagramWidget';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import SummaryWidget from 'components/organisms/SummaryWidget';

export class SummaryWidgetContainer extends PureComponent<Props> {
	render () {
		const {drillDown, widget} = this.props;

		return (
			<LoadingDiagramWidget widget={widget}>
				{data => <SummaryWidget data={data} onDrillDown={drillDown} widget={widget} />}
			</LoadingDiagramWidget>
		);
	}
}

export default connect(null, functions)(SummaryWidgetContainer);
