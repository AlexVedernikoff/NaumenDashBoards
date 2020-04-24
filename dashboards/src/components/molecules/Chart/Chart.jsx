// @flow
import './styles.less';
import ApexCharts from 'apexcharts';
import type {DivRef} from 'components/types';
import {getLegendCroppingFormatter, getLegendWidth, getOptions, LEGEND_POSITIONS} from 'utils/chart';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import {ResizeDetector} from 'components/molecules';

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
			const {fontSize} = this.props.widget.legend;
			const legendWidth = getLegendWidth(width);

			// $FlowFixMe
			this.chart.updateOptions({
				legend: {
					formatter: getLegendCroppingFormatter(legendWidth, fontSize),
					width: legendWidth
				}
			});
		}
	};

	hasSideLegend = () => {
		const {legend} = this.props.widget;
		const {position, show} = legend;
		const {left, right} = LEGEND_POSITIONS;

		return show && (position === left || position === right);
	};

	renderChart = () => <div ref={this.ref} />;

	renderChartWithResize = () => (
		<ResizeDetector onResize={this.handleResize} skipOnMount={true}>
			<div ref={this.ref} />
		</ResizeDetector>
	);

	render () {
		return this.hasSideLegend() ? this.renderChartWithResize() : this.renderChart();
	}
}

export default Chart;
