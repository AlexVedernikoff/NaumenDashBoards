// @flow
import {compose} from 'redux';
import {connect} from 'react-redux';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import type {DivRef} from 'components/types';
import {functions} from './selectors';
import {getMainDataSetIndex} from 'store/widgets/data/helpers';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import styles from './styles.less';
import Summary from 'components/molecules/Summary';
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

	handleClickValue = () => {
		const {drillDown, widget} = this.props;
		const mixin = createDrillDownMixin(widget);
		const index = getMainDataSetIndex(widget.data);
		const dataSet = widget.data[index];
		const {indicators} = dataSet;
		const {aggregation, attribute} = indicators[0];

		if (attribute) {
			mixin.filters.push({aggregation, attribute});
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
			const {data, widget} = this.props;
			const {fontColor, fontFamily, fontSize, fontStyle} = widget.indicator;
			const {total} = data;
			const value = {
				...options,
				value: total
			};

			return (
				<Summary
					color={fontColor}
					fontFamily={fontFamily}
					fontSize={fontSize}
					fontStyle={fontStyle}
					forwardedRef={this.containerRef}
					onClickValue={this.handleClickValue}
					options={value}
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
