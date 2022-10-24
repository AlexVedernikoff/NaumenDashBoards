// @flow
import {checkIsAllowComparePeriod, getAllDescriptors, getFilterDescriptorGetter} from './helpers';
import {connect} from 'react-redux';
import {DEFAULT_COMPARE_PERIOD} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import ParamsTab from 'components/organisms/SummaryWidgetForm/components/ParamsTab';
import {props} from './selectors';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ParamsTabContainer extends PureComponent<Props> {
	componentDidMount () {
		this.checkAllowComparePeriod();
	}

	checkAllowComparePeriod = async () => {
		const {filters, onChange, values} = this.props;
		const {comparePeriod = DEFAULT_COMPARE_PERIOD} = values;
		const descriptors = getAllDescriptors(values, getFilterDescriptorGetter(filters));
		const isAllow = await checkIsAllowComparePeriod(descriptors);

		if (comparePeriod?.allow !== isAllow) {
			onChange(DIAGRAM_FIELDS.comparePeriod, {...comparePeriod, allow: isAllow});
		}
	};

	handleCheckAllowComparePeriod = () => {
		this.checkAllowComparePeriod();
	};

	render () {
		return <ParamsTab {...this.props} onCheckAllowComparePeriod={this.handleCheckAllowComparePeriod} />;
	}
}

export default connect(props)(ParamsTabContainer);
