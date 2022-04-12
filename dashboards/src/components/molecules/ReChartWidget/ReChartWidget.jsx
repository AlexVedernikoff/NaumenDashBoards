// @flow
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {LEGEND_DISPLAY_TYPES, LEGEND_POSITIONS} from 'utils/recharts/constants';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import {WIDGET_SETS} from 'store/widgets/data/constants';

export class ReChartWidget extends PureComponent<Props> {
	containerRef: DivRef = createRef();
	chart = null;

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

	handleResize = (...props) => {
		const {updateOptions} = this.props;
		const {current: container} = this.containerRef;

		if (container) {
			updateOptions(container);
		}
	};

	renderTotal = () => {
		const {data, widget} = this.props;
		const {dataLabels, showTotalAmount} = widget;
		const {fontFamily, fontSize} = dataLabels;

		if (showTotalAmount) {
			const style = {fontFamily, fontSize, height: fontSize};
			const {countTotals = 0} = data ?? {};

			return (
				<div className={styles.total} style={style}>
					<T countTotals={countTotals} text="Chart::CountTotals" />
				</div>
			);
		}
	};

	render () {
		const {children, widget} = this.props;
		const {right, top} = LEGEND_POSITIONS;
		const className = cn({
			[styles.chart]: true,
			[styles.circleChart]: widget.type in WIDGET_SETS.CIRCLE && (!widget.legend.show || (widget.legend.position in {right, top}))
		});
		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={className} ref={this.containerRef}>
					<div className={this.getClassName()} >
						{children}
					</div>
					{this.renderTotal()}
				</div>
			</ResizeDetector>
		);
	}
}

export default ReChartWidget;
