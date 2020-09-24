// @flow
import ApexCharts from 'apexcharts';
import type {DivRef} from 'components/types';
import {getLegendCroppingFormatter, getLegendWidth, getOptions, LEGEND_POSITIONS} from 'utils/chart';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import {ResizeDetector} from 'components/molecules';
import styles from './styles.less';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class Chart extends PureComponent<Props> {
	chart = null;
	ref: DivRef = createRef();

	componentDidMount () {
		const options = this.getOptions();

		if (options) {
			this.chart = new ApexCharts(this.ref.current, options);
			this.chart.render();
		}
	}

	componentDidUpdate (prevProps: Props) {
		const {data: currentData} = this.props;
		const {data: prevData} = prevProps;

		if (currentData !== prevData) {
			const options = this.getOptions();
			options && this.chart && this.chart.updateOptions(options);
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
		let options;

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

	hasZoom = () => {
		const {widget} = this.props;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, LINE} = WIDGET_TYPES;

		return [BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, LINE].includes(widget.type);
	};

	mixinResize = (chart: React$Node) => (
		<ResizeDetector className={styles.container} onResize={this.handleResize} skipOnMount={true}>
			{chart}
		</ResizeDetector>
	);

	render () {
		let chart = <div ref={this.ref} />;

		if (this.hasSideLegend()) {
			chart = this.mixinResize(chart);
		}

		return chart;
	}
}

export default Chart;
