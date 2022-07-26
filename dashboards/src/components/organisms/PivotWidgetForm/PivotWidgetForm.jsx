// @flow
import DiagramWidgetForm from 'containers/DiagramWidgetForm';
import OptionsTab from 'PivotWidgetForm/components/OptionsTab';
import ParamsTab from 'PivotWidgetForm/components/ParamsTab';
import type {Props} from 'PivotWidgetForm/types';
import React, {PureComponent} from 'react';
import {schema} from './constants';
import StyleTab from 'PivotWidgetForm/components/StyleTab';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class PivotWidgetForm extends PureComponent<Props> {
	components = {
		OptionsTab,
		ParamsTab,
		StyleTab
	};

	handleSubmit = values => {
		const {onSave, widget} = this.props;
		const {id} = widget;

		onSave({...values, id, type: WIDGET_TYPES.PIVOT_TABLE});
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

export default PivotWidgetForm;
