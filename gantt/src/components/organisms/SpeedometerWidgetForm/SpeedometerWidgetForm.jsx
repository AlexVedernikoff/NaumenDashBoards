// @flow
import DiagramWidgetForm from 'containers/DiagramWidgetForm';
import ParamsTab from './components/ParamsTab';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {schema} from './constants';
import StyleTab from './components/StyleTab';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class SpeedometerWidgetForm extends PureComponent<Props> {
	components = {
		ParamsTab,
		StyleTab
	};

	handleSubmit = (values) => {
		const {onSave, widget} = this.props;
		const {id} = widget;

		onSave({...values, id, type: WIDGET_TYPES.SPEEDOMETER});
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

export default SpeedometerWidgetForm;
