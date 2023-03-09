// @flow
import Component from 'components/organisms/ComboChartWidgetForm';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {normalizeCalcAndCustomGroups} from './helpers';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {Values} from 'store/widgetForms/comboChartForm/types';

class ComboChartWidgetForm extends PureComponent<Props> {
	handleChange = (values: Values) => {
		const {customGroups, onChange} = this.props;
		let newValues = values;

		newValues = normalizeCalcAndCustomGroups(values, customGroups);

		return onChange(newValues);
	};

	render () {
		return <Component {...this.props} onChange={this.handleChange} />;
	}
}

export default connect(props, functions)(ComboChartWidgetForm);
