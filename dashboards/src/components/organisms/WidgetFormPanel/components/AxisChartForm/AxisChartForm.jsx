// @flow
import {array, lazy, object} from 'yup';
import type {Attribute} from 'store/sources/attributes/types';
import type {AxisData, AxisWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_AXIS_SORTING_SETTINGS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS} from 'utils/chart/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'WidgetFormPanel';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import {getErrorMessage, rules} from 'WidgetFormPanel/schema';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'WidgetFormPanel/types';
import React, {Component} from 'react';
import uuid from 'tiny-uuid';
import type {Values} from 'containers/WidgetFormPanel/types';

export class AxisChartForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, requiredAttribute, requiredByCompute} = rules;
		const {breakdown, source, sourceForCompute, xAxis, yAxis} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[breakdown]: object().when(sourceForCompute, {
					is: false,
					then: lazy(this.resolveBreakdownRule)
				}),
				[source]: object().required(getErrorMessage(source)).nullable(),
				[xAxis]: requiredAttribute(getErrorMessage(xAxis)),
				[yAxis]: requiredByCompute(yAxis)
			}))
		});
	};

	resolveBreakdownRule = (attribute: Attribute | null, context: Object) => {
		const {conditionalBreakdown, requiredAttribute} = rules;
		const {BAR, COLUMN, LINE} = WIDGET_TYPES;
		const {type} = context.values;
		const hasConditionalBreakdown = type === BAR || type === COLUMN || type === LINE;

		return hasConditionalBreakdown ? conditionalBreakdown : requiredAttribute(getErrorMessage(FIELDS.breakdown));
	};

	updateWidget = (widget: Widget, values: Values): AxisWidget => {
		const {id, layout} = widget;
		const {
			colors = DEFAULT_COLORS,
			computedAttrs = [],
			data = [],
			dataLabels,
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
			data: data.map(this.updateWidgetData),
			dataLabels: extend(DEFAULT_CHART_SETTINGS.dataLabels, dataLabels),
			header,
			id,
			indicator: extend(DEFAULT_CHART_SETTINGS.yAxis, indicator),
			layout,
			legend: extend(DEFAULT_CHART_SETTINGS.legend, legend),
			name,
			parameter: extend(DEFAULT_CHART_SETTINGS.xAxis, parameter),
			sorting: extend(DEFAULT_AXIS_SORTING_SETTINGS, sorting),
			type
		};
	};

	updateWidgetData = (set: Values): AxisData => {
		const {
			aggregation = DEFAULT_AGGREGATION.COUNT,
			breakdown = null,
			breakdownGroup = null,
			group = getDefaultSystemGroup(set.xAxis),
			descriptor = '',
			dataKey = uuid(),
			source,
			sourceForCompute = false,
			xAxis,
			yAxis
		} = set;

		return {
			aggregation,
			breakdown,
			breakdownGroup,
			dataKey,
			descriptor,
			group,
			source,
			sourceForCompute,
			xAxis,
			yAxis
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
