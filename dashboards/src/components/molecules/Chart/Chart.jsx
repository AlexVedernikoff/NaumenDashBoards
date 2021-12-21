// @flow
import ApexCharts from 'apexcharts';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {getOptions, LEGEND_POSITIONS} from 'utils/chart';
import {LEGEND_DISPLAY_TYPES} from 'utils/chart/constants';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import styles from './styles.less';
import {WIDGET_SETS} from 'store/widgets/data/constants';

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

	getClassName = () => {
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

	renderTotal = () => {
		const {data, widget} = this.props;
		const {dataLabels, showTotalAmount} = widget;
		const {fontFamily, fontSize} = dataLabels;

		if (showTotalAmount) {
			const style = {fontFamily, fontSize, height: fontSize};

			const {countTotals = 0} = data;
			return (
				<div className={styles.total} style={style}>
					Итого: {countTotals}
				</div>
			);
		}
	};

	render () {
		const {widget} = this.props;
		const {right, top} = LEGEND_POSITIONS;
		const className = cn({
			[styles.chart]: true,
			[styles.circleChart]: widget.type in WIDGET_SETS.CIRCLE && (!widget.legend.show || (widget.legend.position in {right, top}))
		});
		return (
			<ResizeDetector onResize={this.handleResize} skipOnMount={true}>
				<div className={className}>
					<div className={this.getClassName()} >
						<div ref={this.containerRef} />
					</div>
					{this.renderTotal()}
				</div>
			</ResizeDetector>
		);
	}
}

export default Chart;
