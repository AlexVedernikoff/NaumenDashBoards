// @flow
import ApexChart from 'react-apexcharts';
import {getChartType, getConfig, CHART_VARIANTS} from 'utils/chart';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';

export class Chart extends PureComponent<Props, State> {
	state = {
		options: {},
		series: []
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {categories, labels, series} = props.data;

		if (Array.isArray(series) && (Array.isArray(categories) || Array.isArray(labels))) {
			const {options, series} = getConfig(props.widget, props.data);
			state.options = options;
			state.series = series;

			return state;
		}

		return null;
	}

	getType = () => {
		const {widget} = this.props;
		const {type} = widget;

		return type === CHART_VARIANTS.COMBO ? 'line' : getChartType(type);
	};

	renderChart = () => {
		const {options, series} = this.state;
		const type = this.getType();

		return (
			<ApexChart
				height="100%"
				key={type}
				options={options}
				series={series}
				type={type}
			/>
		);
	};

	render () {
		return this.renderChart();
	}
}

export default Chart;
