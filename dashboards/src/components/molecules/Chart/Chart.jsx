// @flow
import ApexCharts from 'apexcharts';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {getOptions} from 'utils/chart';
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
		this.updateOptions();
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
		this.updateOptions();
	};

	updateOptions = () => {
		const options = this.getOptions();
		return options && this.chart && this.chart.updateOptions(options);
	};

	render () {
		return (
			<ResizeDetector onResize={this.handleResize} skipOnMount={true}>
				<div className={this.getClassname()} ref={this.containerRef} />
			</ResizeDetector>
		);
	}
}

export default Chart;
