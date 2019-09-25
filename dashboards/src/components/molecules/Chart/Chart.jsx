// @flow
import ApexChart from 'react-apexcharts';
import getConfig from 'utils/chart';
import type {Props, State} from './types';
import React, {Component} from 'react';

export class Chart extends Component<Props, State> {
	state = {
		options: {},
		series: []
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		if (props.data) {
			const {options, series} = getConfig(props.widget, props.data);

			state.options = options;
			state.series = series;
		}

		return state;
	}

	renderContent (loading: boolean) {
		const {options, series} = this.state;
		const {widget} = this.props;

		if (loading) {
			return <p>Загрузка данных...</p>;
		}

		return (
			<ApexChart
				height="100%"
				key={widget.chart.value}
				options={options}
				series={series}
				type={widget.chart.value}
			/>
		);
	}

	renderError () {
		const {data} = this.props;

		if (!data || data.error) {
			return <p>Ошибка загрузки данных...</p>;
		}
	}

	render () {
		const {data} = this.props;

		if (data) {
			return this.renderContent(data.loading);
		}

		return this.renderError();
	}
}

export default Chart;
