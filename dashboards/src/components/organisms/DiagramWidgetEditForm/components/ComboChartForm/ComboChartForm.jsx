// @flow
import {array, object} from 'yup';
import type {ComboWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_AXIS_SORTING_SETTINGS} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS, DEFAULT_COMBO_Y_AXIS_SETTINGS} from 'utils/chart/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/DiagramWidgetEditForm';
import {getErrorMessage, rules} from 'components/organisms/DiagramWidgetEditForm/schema';
import {normalizeDataSet} from 'utils/normalizer/widget/comboNormalizer';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import type {Values} from 'containers/WidgetEditForm/types';

export class ComboChartForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, conditionalBreakdown, parameterRule, requiredByCompute} = rules;
		const {breakdown, source, xAxis, yAxis} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[breakdown]: requiredByCompute(breakdown, conditionalBreakdown(FIELDS.yAxis)),
				[source]: object().required(getErrorMessage(source)).nullable(),
				[xAxis]: parameterRule(xAxis),
				[yAxis]: requiredByCompute(yAxis)
			}))
		});
	};

	updateWidget = (widget: Widget, values: Values): ComboWidget => {
		const {id} = widget;
		const {
			colors = DEFAULT_COLORS,
			computedAttrs = [],
			data = [],
			dataLabels,
			displayMode,
			header,
			indicator,
			indicatorSettings = DEFAULT_COMBO_Y_AXIS_SETTINGS,
			legend,
			parameter,
			name = '',
			showEmptyData,
			sorting,
			templateName,
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
			indicatorSettings,
			legend: extend(DEFAULT_CHART_SETTINGS.legend, legend),
			name,
			parameter: extend(DEFAULT_CHART_SETTINGS.xAxis, parameter),
			showEmptyData,
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

export default ComboChartForm;
