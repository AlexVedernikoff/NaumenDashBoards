// @flow
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import {getMainDataSet, getMainDataSetIndex} from 'store/widgets/data/helpers';
import {hasMSInterval, parseMSInterval} from 'store/widgets/helpers';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {Summary} from 'components/molecules';

export class SummaryWidget extends PureComponent<Props> {
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

	render () {
		const {data, widget} = this.props;
		const {fontColor, fontFamily, fontSize, fontStyle} = widget.indicator;
		const {total} = data;
		const {aggregation, attribute} = getMainDataSet(widget.data).indicators[0];
		const value = hasMSInterval(attribute, aggregation) ? parseMSInterval(total) : total;

		return (
			<Summary
				color={fontColor}
				fontFamily={fontFamily}
				fontSize={fontSize}
				fontStyle={fontStyle}
				onClickValue={this.handleClickValue}
				value={value}
			/>
		);
	}
}

export default SummaryWidget;
