// @flow
import {array, object} from 'yup';
import type {CircleData, CircleWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS} from 'utils/chart/constants';
import {DEFAULT_CIRCLE_SORTING_SETTINGS} from 'store/widgets/data/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getErrorMessage, rules} from 'components/organisms/WidgetFormPanel/schema';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'WidgetFormPanel/types';
import React, {Component} from 'react';
import uuid from 'tiny-uuid';
import type {Values} from 'containers/WidgetFormPanel/types';

export class CircleChartForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, requiredByCompute} = rules;
		const {breakdown, indicator, source} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[breakdown]: requiredByCompute(breakdown),
				[indicator]: requiredByCompute(indicator),
				[source]: object().required(getErrorMessage(source)).nullable()
			}))
		});
	};

	updateWidget = (widget: Widget, values: Values): CircleWidget => {
		const {id, layout} = widget;
		const {
			colors = DEFAULT_COLORS,
			computedAttrs = [],
			data = [],
			dataLabels,
			header,
			legend,
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
			layout,
			legend: extend(DEFAULT_CHART_SETTINGS.legend, legend),
			name,
			sorting: extend(DEFAULT_CIRCLE_SORTING_SETTINGS, sorting),
			type
		};
	};

	updateWidgetData = (set: Values): CircleData => {
		const {
			aggregation = DEFAULT_AGGREGATION.COUNT,
			breakdown,
			breakdownGroup,
			descriptor = '',
			dataKey = uuid(),
			indicator,
			source,
			sourceForCompute = false
		} = set;

		return {
			aggregation,
			breakdown,
			breakdownGroup,
			dataKey,
			descriptor,
			indicator,
			source,
			sourceForCompute
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

export default CircleChartForm;
