// @flow
import DiagramWidgetForm from 'containers/DiagramWidgetForm';
import {GROUP_WAYS} from 'store/widgets/constants';
import memoize from 'memoize-one';
import OptionsTab from './components/OptionsTab';
import ParamsTab from './components/ParamsTab';
import type {Props, Values} from './types';
import React, {PureComponent} from 'react';
import {schema} from './constants';
import StyleTab from './components/StyleTab';
import type {TabProps} from 'containers/DiagramWidgetForm/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class ComboChartWidgetForm extends PureComponent<Props> {
	handleSubmit = values => {
		const {onSave, widget} = this.props;
		const {id} = widget;

		onSave({...values, id, type: WIDGET_TYPES.COMBO});
	};

	hasCustomGroup = (values: Values): boolean => {
		const {breakdown, parameters} = values.data[0];
		const {CUSTOM} = GROUP_WAYS;

		return parameters[0].group.way === CUSTOM || breakdown?.[0].group.way === CUSTOM;
	};

	getComponents = memoize(() => ({
		OptionsTab: OptionsTab,
		ParamsTab: this.renderParamsTab,
		StyleTab: this.renderStyleTab
	}));

	renderParamsTab = (props: TabProps) => <ParamsTab {...props} hasCustomGroup={this.hasCustomGroup(props.values)} />;

	renderStyleTab = (props: TabProps) => <StyleTab {...props} />;

	render () {
		const {onChange, values} = this.props;

		return (
			<DiagramWidgetForm
				components={this.getComponents()}
				onChange={onChange}
				onSubmit={this.handleSubmit}
				schema={schema}
				values={values}
			/>
		);
	}
}

export default ComboChartWidgetForm;
