// @flow
import {array, object} from 'yup';
import type {ComboWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_AXIS_SORTING_SETTINGS} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS} from 'utils/chart/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getErrorMessage, rules} from 'components/organisms/WidgetFormPanel/schema';
import {normalizeDataSet} from 'utils/normalizer/widget/comboNormalizer';
import {ParamsTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'WidgetFormPanel/types';
import React, {Component} from 'react';
import {StyleTab} from 'WidgetFormPanel/components/AxisChartForm/components';
import type {Values} from 'containers/WidgetFormPanel/types';

export class ComboChartForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, requiredAttribute, requiredBreakdown, requiredByCompute} = rules;
		const {breakdown, source, xAxis, yAxis} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[breakdown]: requiredByCompute(breakdown, requiredBreakdown(FIELDS.yAxis)),
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
			data: data.map(normalizeDataSet),
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

export default ComboChartForm;
