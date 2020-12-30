// @flow
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval, parseMSInterval} from 'store/widgets/helpers';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {Summary} from 'components/molecules';

export class SummaryWidget extends PureComponent<Props> {
	handleClick = () => {
		const {onDrillDown, widget} = this.props;
		const mixin = createDrillDownMixin(widget);
		const index = widget.data.findIndex(dataSet => !dataSet.sourceForCompute);
		const dataSet = widget.data[index];

		if (dataSet && !dataSet.sourceForCompute) {
			const {aggregation, indicator: attribute} = dataSet;

			mixin.filters.push({aggregation, attribute});
			onDrillDown(widget, index, mixin);
		}
	};

	render () {
		const {data, widget} = this.props;
		const {fontColor, fontFamily, fontSize, fontStyle} = widget.indicator;
		const {total} = data;
		const value = hasMSInterval(getBuildSet(widget)) ? parseMSInterval(total) : total;

		return (
			<Summary
				color={fontColor}
				fontFamily={fontFamily}
				fontSize={fontSize}
				fontStyle={fontStyle}
				onClick={this.handleClick}
				value={value}
			/>
		);
	}
}

export default SummaryWidget;
