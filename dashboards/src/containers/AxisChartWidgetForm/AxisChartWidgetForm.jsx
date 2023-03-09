// @flow
import Component from 'components/organisms/AxisChartWidgetForm';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {normalizeCalcAndCustomGroups} from './helpers';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {Values} from 'store/widgetForms/axisChartForm/types';

class AxisChartWidgetForm extends PureComponent<Props> {
	handleChange = (values: Values) => {
		let newValues = values;

		newValues = normalizeCalcAndCustomGroups(values, this.props.customGroups);

		return this.props.onChange(newValues);
	};

	render () {
		return <Component {...this.props} onChange={this.handleChange} />;
	}
}

export default connect(props, functions)(AxisChartWidgetForm);
