// @flow
import {connect} from 'react-redux';
import {getSortingOptions} from 'WidgetFormPanel/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import {hasCalcAndCustomGroups} from 'store/widgetForms/helpers';
import {props} from './selectors';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import SortingBox from 'WidgetFormPanel/components/SortingBox';
import {SORTING_VALUES} from 'store/widgets/data/constants';
import t from 'localization';

class AxisSortingBox extends PureComponent<Props> {
	getSortingOptions = () => {
		const {customGroups, values} = this.props;
		const hasCustomGroup = this.hasCustomGroup();
		let options = getSortingOptions(hasCustomGroup);

		if (hasCustomGroup && hasCalcAndCustomGroups(values, customGroups)) {
			options = options.map(option =>
				option.value === SORTING_VALUES.INDICATOR
					? {...option, disabled: true, disabledMessage: t('SortingBox::DifferentGroupingsWarn')}
					: option
			);
		}

		return options;
	};

	hasCustomGroup = () => {
		const {values} = this.props;
		const {CUSTOM} = GROUP_WAYS;

		return !!values.data.find(({breakdown, parameters}) =>
			parameters[0].group.way === CUSTOM || (breakdown && breakdown[0].group.way === CUSTOM)
		);
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

export default connect(props)(AxisSortingBox);
