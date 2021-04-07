// @flow
import DiagramWidgetForm from 'src/containers/DiagramWidgetForm';
import ParamsTab from './components/ParamsTab';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {schema} from './constants';
import StyleTab from './components/StyleTab';
import {WIDGET_TYPES} from 'src/store/widgets/data/constants';

export class TableWidgetForm extends PureComponent<Props> {
	components = {
		ParamsTab,
		StyleTab
	};

	handleSubmit = (values) => {
		const {onSave, widget} = this.props;
		const {id} = widget;

		onSave({...values, id, type: WIDGET_TYPES.TABLE});
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

export default TableWidgetForm;
