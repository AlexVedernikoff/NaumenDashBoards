// @flow
import {array, lazy, object} from 'yup';
import type {Attribute} from 'store/sources/attributes/types';
import type {AxisData, AxisWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_AXIS_SORTING_SETTINGS, DEFAULT_TOP_SETTINGS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS} from 'utils/chart/constants';
import {extend} from 'helpers';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import type {FilledDataSet} from 'containers/DiagramWidgetEditForm/types';
import {getErrorMessage, mixed, rules} from 'DiagramWidgetEditForm/schema';
import {getLegendSettings} from 'utils/chart/helpers';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import type {Values} from 'containers/WidgetEditForm/types';

export class AxisChartForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, parameter, requiredByCompute, validateTopSettings} = rules;

		return object({
			...base,
			data: array().of(object({
				breakdown: requiredByCompute(lazy(this.resolveBreakdownRule)),
				indicators: requiredByCompute(array(mixed().requiredAttribute(getErrorMessage(FIELDS.indicator)))),
				parameters: array(parameter),
				source: mixed().source(),
				top: validateTopSettings
			})),
			sources: mixed().minSourceNumbers().sourceNumbers()
		});
	};

	normalizeDataSet = (dataSet: FilledDataSet): AxisData => {
		const {
			breakdown,
			dataKey,
			indicators,
			parameters,
			showEmptyData = false,
			source,
			top = DEFAULT_TOP_SETTINGS,
			sourceForCompute,
			xAxisName = '',
			yAxisName = ''
		} = dataSet;

		return {
			breakdown,
			dataKey,
			indicators,
			parameters,
			showEmptyData,
			source,
			sourceForCompute,
			top,
			xAxisName,
			yAxisName
		};
	};

	resolveBreakdownRule = (attribute: Attribute | null, context: Object) => {
		const {conditionalBreakdown, requiredBreakdown} = rules;
		const {BAR, COLUMN, LINE} = WIDGET_TYPES;
		const {type} = context.values;
		const hasConditionalBreakdown = type === BAR || type === COLUMN || type === LINE;

		return hasConditionalBreakdown ? conditionalBreakdown : requiredBreakdown;
	};

	updateWidget = (widget: Widget, values: Values): AxisWidget => {
		const {id} = widget;
		const {
			colors = DEFAULT_COLORS,
			computedAttrs = [],
			data,
			dataLabels,
			displayMode,
			header,
			indicator,
			legend,
			navigation,
			parameter,
			name = '',
			sorting,
			templateName,
			type
		} = values;

		return {
			colors,
			computedAttrs,
			data: data.map(this.normalizeDataSet),
			dataLabels: extend(DEFAULT_CHART_SETTINGS.dataLabels, dataLabels),
			displayMode,
			header,
			id,
			indicator: extend(DEFAULT_CHART_SETTINGS.axis, indicator),
			legend: extend(getLegendSettings(values), legend),
			name,
			navigation,
			parameter: extend(DEFAULT_CHART_SETTINGS.axis, parameter),
			sorting: extend(DEFAULT_AXIS_SORTING_SETTINGS, sorting),
			templateName,
			type
		};
	};

	renderParamsTab = (props: ParamsTabProps) => <ParamsTab {...props} />;

	renderStyleTab = (props: StyleTabProps) => <StyleTab {...props} />;

	render () {
		return this.props.render({
			renderParamsTab: this.renderParamsTab,
			renderStyleTab: this.renderStyleTab,
			schema: this.getSchema(),
			updateWidget: this.updateWidget
		});
	}
}

export default AxisChartForm;
