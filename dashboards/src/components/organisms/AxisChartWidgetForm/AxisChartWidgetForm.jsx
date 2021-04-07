// @flow
import DiagramWidgetForm from 'containers/DiagramWidgetForm';
import ParamsTab from './components/ParamsTab';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import StyleTab from './components/StyleTab';
import memoize from 'memoize-one';
import {array, baseSchema, mixed, object} from 'containers/DiagramWidgetForm/schema';
import {lazy} from 'yup';
import {WIDGET_TYPES} from 'src/store/widgets/data/constants';
import type {WidgetType} from 'src/store/widgets/data/types';

export class AxisChartWidgetForm extends PureComponent<Props> {
	components = {
		ParamsTab,
		StyleTab
	};

	getSchema = memoize((type: WidgetType) => object({
		...baseSchema,
		data: array().of(object({
			breakdown: mixed().requiredByCompute(lazy(() => {
				const {BAR, COLUMN, LINE} = WIDGET_TYPES;
				const hasConditionalBreakdown = type === BAR || type === COLUMN || type === LINE;

				return hasConditionalBreakdown ? array().conditionalBreakdown() : array().breakdown();
			})),
			indicators: mixed().requiredByCompute(array().indicators()),
			parameters: array().parameters(),
			source: mixed().source(),
			top: object().topSettings()
		})),
		sources: mixed().minSourceNumbers().sourceNumbers()
	}));

	handleSubmit = (values) => {
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
