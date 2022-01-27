// @flow
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import type {DivRef} from 'components/types';
import {getMainDataSetIndex} from 'store/widgets/data/helpers';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import Summary from 'components/molecules/Summary';
import {summaryMixin} from 'utils/chart/mixins';

export class SummaryWidget extends PureComponent<Props, State> {
	state = {
		options: {data: {tooltip: null}}
	};

	containerRef: DivRef = createRef();

	componentDidMount () {
		this.updateOptions();
	}

	componentDidUpdate (prevProps: Props) {
		const {widget} = this.props;
		const {data, indicator} = widget;
		const {widget: {data: prevData, indicator: prevIndicator}} = prevProps;

		if (indicator.format !== prevIndicator.format || data !== prevData) {
			this.updateOptions();
		}
	}

	handleClickValue = () => {
		const {onDrillDown, widget} = this.props;
		const mixin = createDrillDownMixin(widget);
		const index = getMainDataSetIndex(widget.data);
		const dataSet = widget.data[index];
		const {indicators} = dataSet;
		const {aggregation, attribute} = indicators[0];

		if (attribute) {
			mixin.filters.push({aggregation, attribute});
			onDrillDown(widget, index, mixin);
		}
	};

	updateOptions = () => {
		const {widget} = this.props;
		const {current} = this.containerRef;

		if (current) {
			this.setState({
				options: summaryMixin(widget, current)
			});
		}
	};

	render () {
		const {data, widget} = this.props;
		const {fontColor, fontFamily, fontSize, fontStyle} = widget.indicator;
		const {options} = this.state;
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
}

export default SummaryWidget;
