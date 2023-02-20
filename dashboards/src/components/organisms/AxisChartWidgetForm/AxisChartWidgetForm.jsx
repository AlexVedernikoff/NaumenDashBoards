// @flow
import DiagramWidgetForm from 'containers/DiagramWidgetForm';
import {isStackedChart} from 'store/widgets/helpers';
import memoize from 'memoize-one';
import OptionsTab from './components/OptionsTab';
import ParamsTab from './components/ParamsTab';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {schema, schemaStacked} from './constants';
import StyleTab from './components/StyleTab';
import type {WidgetType} from 'src/store/widgets/data/types';

export class AxisChartWidgetForm extends PureComponent<Props> {
	components = {
		OptionsTab,
		ParamsTab,
		StyleTab
	};

	getSchema = memoize((type: WidgetType) => isStackedChart(type) ? schemaStacked : schema);

	handleSubmit = values => {
		const {onSave, type, widget} = this.props;
		const {id} = widget;

		onSave({...values, id, type});
	};

	render () {
		const {onChange, type, values} = this.props;

		return (
			<DiagramWidgetForm
				components={this.components}
				onChange={onChange}
				onSubmit={this.handleSubmit}
				schema={this.getSchema(type)}
				values={values}
			/>
		);
	}
}

export default AxisChartWidgetForm;
