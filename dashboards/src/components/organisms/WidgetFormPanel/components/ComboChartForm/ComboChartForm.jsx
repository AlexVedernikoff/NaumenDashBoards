// @flow
import {array, object} from 'yup';
import type {ComboData, ComboWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_AXIS_SORTING_SETTINGS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS} from 'utils/chart/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import {getErrorMessage, rules} from 'components/organisms/WidgetFormPanel/schema';
import {ParamsTab} from './components';
import type {ParamsTabProps, TypedFormProps} from 'WidgetFormPanel/types';
import React, {Component} from 'react';
import uuid from 'tiny-uuid';
import type {Values} from 'containers/WidgetFormPanel/types';

export class ComboChartForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, conditionalBreakdown, requiredAttribute, requiredByCompute} = rules;
		const {breakdown, source, xAxis, yAxis} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[breakdown]: conditionalBreakdown,
				[source]: object().required(getErrorMessage(source)).nullable(),
				[xAxis]: requiredAttribute(getErrorMessage(xAxis)),
				[yAxis]: requiredByCompute(yAxis)
			}))
		});
	};

	updateWidget = (widget: Widget, values: Values): ComboWidget => {
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

	updateWidgetData = (set: Values): ComboData => {
		const {
			aggregation = DEFAULT_AGGREGATION.COUNT,
			breakdown = null,
			breakdownGroup = null,
			group = getDefaultSystemGroup(set.xAxis),
			descriptor = '',
			dataKey = uuid(),
			source,
			sourceForCompute = false,
			type = WIDGET_TYPES.COLUMN,
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
			type,
			xAxis,
			yAxis
		};
	};

	renderParamsTab = (props: ParamsTabProps) => <ParamsTab {...props} />;

	renderStyleTab = () => null;

	render () {
		return this.props.render({
			renderParamsTab: this.renderParamsTab,
			renderStyleTab: this.renderStyleTab,
			schema: this.getSchema(),
			updateWidget: this.updateWidget
		});
	}
}

export default ComboChartForm;
