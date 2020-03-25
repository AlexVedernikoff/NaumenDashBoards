// @flow
import './styles.less';
import ApexCharts from 'apexcharts';
import type {DivRef} from 'components/types';
import {getLegendWidth, getOptions, LEGEND_POSITIONS} from 'utils/chart';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import ReactResizeDetector from 'react-resize-detector';

export class Chart extends PureComponent<Props> {
	chart = null;
	ref: DivRef = createRef();

	componentDidMount () {
		const options = this.getOptions();

		this.chart = new ApexCharts(this.ref.current, options);
		this.chart.render();
	}

	componentDidUpdate () {
		const options = this.getOptions();

		if (this.chart) {
			this.chart.updateOptions(options);
		}
	}

	componentWillUnmount () {
		if (this.chart && typeof this.chart.destroy === 'function') {
			this.chart.destroy();
		}
	}

	getOptions = () => {
		const {data, widget} = this.props;
		const {current} = this.ref;
		let options = {};

		if (current) {
			options = getOptions(widget, data, current.clientWidth);
		}

		return options;
	};

	handleResize = (width: number) => {
		if (this.chart) {
			this.chart.updateOptions({
				legend: {
					width: getLegendWidth(width)
				}
			});
		}
	};

	hasSideLegend = () => {
		const {legendPosition, showLegend} = this.props.widget;

		return showLegend && (legendPosition
			&& (legendPosition === LEGEND_POSITIONS.left || legendPosition === LEGEND_POSITIONS.right)
		);
	};

	renderChart = () => <div ref={this.ref} />;

	renderChartWithResize = () => (
		<ReactResizeDetector
			handleWidth
			onResize={this.handleResize}
			refreshMode="debounce"
			refreshRate={500}
			render={this.renderChart}
			skipOnMount={true}
		/>
	);

	render () {
		return this.hasSideLegend() ? this.renderChartWithResize() : this.renderChart();
	}
}

export default Chart;
