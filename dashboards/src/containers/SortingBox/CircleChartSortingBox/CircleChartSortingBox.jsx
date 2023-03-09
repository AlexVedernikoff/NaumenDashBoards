// @flow
import {connect} from 'react-redux';
import {getSortingOptions} from 'WidgetFormPanel/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import {props} from './selectors';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import SortingBox from 'WidgetFormPanel/components/SortingBox';
import {SORTING_VALUES} from 'store/widgets/data/constants';

class CircleChartSortingBox extends PureComponent<Props> {
	getSortingOptions = () => {
		const hasCustomGroup = this.hasCustomGroup();
		const options = getSortingOptions(!hasCustomGroup)
			.filter(option => option.value !== SORTING_VALUES.PARAMETER);

		return options;
	};

	hasCustomGroup = () => {
		const {values: {data}} = this.props;
		return !!data.find(({breakdown}) => breakdown[0].group.way === GROUP_WAYS.CUSTOM);
	};

	render () {
		return (
			<SortingBox
				{...this.props}
				options={this.getSortingOptions()}
			/>
		);
	}
}

export default connect(props)(CircleChartSortingBox);
