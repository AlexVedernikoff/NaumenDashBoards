// @flow
import DiagramWidgetForm from 'containers/DiagramWidgetForm';
import ParamsTab from './components/ParamsTab';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {schema} from './constants';
import StyleTab from './components/StyleTab';

export class CircleChartWidgetForm extends PureComponent<Props> {
	components = {
		ParamsTab,
		StyleTab
	};

	handleSubmit = values => {
		const {onSave, type, widget} = this.props;
		const {id} = widget;

		onSave({...values, id, type});
	};

	render () {
		const {onChange, values} = this.props;

		return (
			<DiagramWidgetForm
				components={this.components}
				onChange={onChange}
				onSubmit={this.handleSubmit}
				schema={schema}
				values={values}
			/>
		);
	}
}

export default CircleChartWidgetForm;
