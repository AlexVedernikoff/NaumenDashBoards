// @flow
import {array, lazy, object} from 'yup';
import type {Attribute} from 'store/sources/attributes/types';
import type {AxisWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_AXIS_SORTING_SETTINGS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS} from 'utils/chart/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'WidgetFormPanel';
import {getErrorMessage, rules} from 'WidgetFormPanel/schema';
import {normalizeDataSet} from 'utils/normalizer/widget/axisNormalizer';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'WidgetFormPanel/types';
import React, {Component} from 'react';
import type {Values} from 'containers/WidgetFormPanel/types';

export class AxisChartForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, parameterRule, requiredByCompute} = rules;
		const {breakdown, source, xAxis, yAxis} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[breakdown]: requiredByCompute(breakdown, lazy(this.resolveBreakdownRule)),
				[source]: object().required(getErrorMessage(source)).nullable(),
				[xAxis]: parameterRule(xAxis),
				[yAxis]: requiredByCompute(yAxis)
			}))
		});
	};

	resolveBreakdownRule = (attribute: Attribute | null, context: Object) => {
		const {conditionalBreakdown, requiredBreakdown} = rules;
		const {BAR, COLUMN, LINE} = WIDGET_TYPES;
		const {type} = context.values;
		const hasConditionalBreakdown = type === BAR || type === COLUMN || type === LINE;

		return hasConditionalBreakdown ? conditionalBreakdown(FIELDS.yAxis) : requiredBreakdown(FIELDS.yAxis);
	};

	updateWidget = (widget: Widget, values: Values): AxisWidget => {
		const {id} = widget;
		const {
			colors = DEFAULT_COLORS,
			computedAttrs = [],
			data = [],
			dataLabels,
			displayMode,
			header,
			indicator,
			legend,
			parameter,
			name = '',
			sorting,
			type
		} = values;

		return {
			colors,
			computedAttrs,
			data: data.map(normalizeDataSet),
			dataLabels: extend(DEFAULT_CHART_SETTINGS.dataLabels, dataLabels),
			displayMode,
			header,
			id,
			indicator: extend(DEFAULT_CHART_SETTINGS.yAxis, indicator),
			legend: extend(DEFAULT_CHART_SETTINGS.legend, legend),
			name,
			parameter: extend(DEFAULT_CHART_SETTINGS.xAxis, parameter),
			sorting: extend(DEFAULT_AXIS_SORTING_SETTINGS, sorting),
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
