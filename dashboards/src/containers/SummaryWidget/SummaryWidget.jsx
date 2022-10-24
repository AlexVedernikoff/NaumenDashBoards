// @flow
import {compose} from 'redux';
import {connect} from 'react-redux';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import type {DivRef} from 'components/types';
import type {DrillDownMixin} from 'store/widgets/links/types';
import {functions} from './selectors';
import {getMainDataSetIndex} from 'store/widgets/data/helpers';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import styles from './styles.less';
import Summary from 'components/molecules/Summary';
import type {Widget} from 'store/widgets/data/types';
import withBaseWidget from 'containers/withBaseWidget';

export class SummaryWidget extends PureComponent<Props> {
	containerRef: DivRef = createRef();

	componentDidUpdate (prevProps: Props) {
		const {updateOptions, widget} = this.props;
		const {current: container} = this.containerRef;

		if (container) {
			const {data, indicator} = widget;
			const {widget: {data: prevData, indicator: prevIndicator}} = prevProps;

			if (indicator.format !== prevIndicator.format || data !== prevData) {
				updateOptions(container);
			}
		}
	}

	createDrillDownMixin = (widget: Widget): {index: number, mixin: DrillDownMixin} | null => {
		const mixin = createDrillDownMixin(widget);
		const index = getMainDataSetIndex(widget.data);
		const dataSet = widget.data[index];
		const {indicators} = dataSet;
		const {aggregation, attribute} = indicators[0];

		if (attribute) {
			mixin.filters.push({aggregation, attribute});
			return {index, mixin};
		}

		return null;
	};

	handleClickDiffValue = () => {
		const {drillDown, widget} = this.props;
		const data = this.createDrillDownMixin(widget);

		if (data) {
			const {index, mixin} = data;

			drillDown(widget, index, mixin);
		}
	};

	handleClickValue = () => {
		const {drillDown, widget} = this.props;
		const data = this.createDrillDownMixin(widget);

		if (data) {
			const {index, mixin} = data;

			drillDown(widget, index, mixin);
		}
	};

	handleResize = () => {
		const {updateOptions} = this.props;
		const {current: container} = this.containerRef;

		if (container) {
			updateOptions(container);
		}
	};

	renderSummary = () => {
		const {data, options} = this.props;
		const {current} = this.containerRef;

		if (current && data && options) {
			const {widget} = this.props;
			const {fontColor, fontFamily, fontSize, fontStyle} = widget.indicator;

			return (
				<Summary
					color={fontColor}
					fontFamily={fontFamily}
					fontSize={fontSize}
					fontStyle={fontStyle}
					forwardedRef={this.containerRef}
					onClickDiff={this.handleClickDiffValue}
					onClickValue={this.handleClickValue}
					options={options}
				/>
			);
		}

		return null;
	};

	render () {
		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={styles.container} ref={this.containerRef}>
					{this.renderSummary()}
				</div>
			</ResizeDetector>
		);
	}
}

export default compose(connect(null, functions), withBaseWidget)(SummaryWidget);
