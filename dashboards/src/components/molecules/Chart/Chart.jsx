// @flow
import ApexChart from 'react-apexcharts';
import {getChartType, getConfig} from 'utils/chart';
import type {Props, State} from './types';
import React, {Component} from 'react';

export class Chart extends Component<Props, State> {
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

	renderChart = () => {
		const {options, series} = this.state;
		const {widget} = this.props;
		const type = getChartType(widget.type.value);

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
