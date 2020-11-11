// @flow
import ApexCharts from 'apexcharts';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {getLegendWidth, getOptions} from 'utils/chart';
import {LEGEND_DISPLAY_TYPES} from 'utils/chart/constants';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import {ResizeDetector} from 'components/molecules';
import styles from './styles.less';

export class Chart extends PureComponent<Props> {
	chart = null;
	containerRef: DivRef = createRef();

	componentDidMount () {
		const options = this.getOptions();

		if (options) {
			this.chart = new ApexCharts(this.containerRef.current, options);
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

	getClassname = () => {
		const {legend} = this.props.widget;
		const {BLOCK, INLINE} = LEGEND_DISPLAY_TYPES;
		const {displayType} = legend;

		return cn({
			[styles.container]: true,
			[styles.blockLegend]: displayType === BLOCK,
			[styles.inlineLegend]: displayType === INLINE
		});
	};

	getOptions = () => {
		const {data, widget} = this.props;
		const {current} = this.containerRef;
		let options;

		if (current) {
			options = getOptions(widget, data, current);
		}

		return options;
	};

	handleResize = (width: number) => {
		const {legend} = this.props.widget;
		const {position, show} = legend;
		const {current: container} = this.containerRef;

		if (show && this.chart && container) {
			this.chart.updateOptions({
				legend: {
					width: getLegendWidth(container, position)
				}
			});
		}
	};

	mixinResize = (chart: React$Node) => (
		<ResizeDetector className={styles.container} onResize={this.handleResize} skipOnMount={true}>
			{chart}
		</ResizeDetector>
	);

	render () {
		let chart = <div className={this.getClassname()} ref={this.containerRef} />;

		chart = this.mixinResize(chart);

		return chart;
	}
}

export default Chart;
