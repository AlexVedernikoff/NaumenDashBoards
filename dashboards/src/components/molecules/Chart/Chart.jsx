// @flow
import ApexCharts from 'apexcharts';
import {checkLabelsForOverlap, getXAxisLabels} from 'utils/chart/mixins/helpers';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {getLegendWidth, getOptions} from 'utils/chart';
import {isAxisChart, isHorizontalChart} from 'store/widgets/helpers';
import {LEGEND_DISPLAY_TYPES} from 'utils/chart/constants';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
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

	componentDidUpdate () {
		const options = this.getOptions();

		options && this.chart && this.chart.updateOptions(options);
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
		const {data, globalColorsSettings, widget} = this.props;
		const {current} = this.containerRef;
		let options;

		if (current) {
			options = getOptions(widget, data, current, globalColorsSettings);
		}

		return options;
	};

	handleResize = () => {
		const {data, widget} = this.props;
		const {legend, type} = widget;
		const {current: container} = this.containerRef;

		if (container) {
			let opts = {
				legend: {
					width: getLegendWidth(container, legend.position)
				}
			};

			if (isAxisChart(type)) {
				const {labels} = data;
				const hasOverlappedLabel = checkLabelsForOverlap(labels, container, legend, isHorizontalChart(type));

				opts = {
					...opts,
					// $FlowFixMe
					labels: getXAxisLabels(widget, labels, !hasOverlappedLabel),
					xaxis: {
						labels: {
							rotate: hasOverlappedLabel ? -60 : 0,
							trim: hasOverlappedLabel
						}
					}
				};
			}

			this.chart && this.chart.updateOptions(opts);
		}
	};

	mixinResize = (chart: React$Node) => (
		<ResizeDetector onResize={this.handleResize} skipOnMount={true}>
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
