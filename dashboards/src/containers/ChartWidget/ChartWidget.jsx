// @flow
import Chart from 'components/molecules/Chart';
import {connect} from 'react-redux';
import {LoadingDiagramWidget} from 'components/organisms/DiagramWidget';
import {props} from './selectors';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ChartWidget extends PureComponent<Props> {
	renderChart = (data: Object) => {
		const {globalColorsSettings, widget} = this.props;

		return <Chart data={data} globalColorsSettings={globalColorsSettings} widget={widget} />;
	};

	render () {
		const {widget} = this.props;

		return (
			<LoadingDiagramWidget widget={widget}>
				{(data) => this.renderChart(data)}
			</LoadingDiagramWidget>
		);
	}
}

export default connect(props)(ChartWidget);
