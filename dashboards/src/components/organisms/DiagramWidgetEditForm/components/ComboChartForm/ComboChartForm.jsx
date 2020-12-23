// @flow
import {array, object} from 'yup';
import type {ComboWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_AXIS_SORTING_SETTINGS} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS} from 'utils/chart/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/DiagramWidgetEditForm';
import {getErrorMessage, mixed, rules} from 'components/organisms/DiagramWidgetEditForm/schema';
import {navigationSettings} from 'utils/normalizer/widget/helpers';
import {normalizeDataSet} from 'utils/normalizer/widget/comboNormalizer';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import type {Values} from 'containers/WidgetEditForm/types';

export class ComboChartForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, conditionalBreakdown, parameterRule, requiredByCompute, validateTopSettings} = rules;
		const {breakdown, source, sources, top, xAxis, yAxis} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[breakdown]: requiredByCompute(breakdown, conditionalBreakdown(FIELDS.yAxis)),
				[source]: object().required(getErrorMessage(source)).nullable(),
				[top]: validateTopSettings,
				[xAxis]: parameterRule(xAxis),
				[yAxis]: requiredByCompute(yAxis)
			})),
			[sources]: mixed().minSourceNumbers()
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
			legend,
			parameter,
			name = '',
			navigation,
			showEmptyData,
			sorting,
			templateName,
			type
		} = values;
		const indicatorSettings = extend(DEFAULT_CHART_SETTINGS.yAxis, indicator);
		const comboData = data.map(normalizeDataSet);

		// $FlowFixMe
		if (!comboData.find(({yAxisName}) => yAxisName)) {
			indicatorSettings.showName = false;
		}

		return {
			colors,
			computedAttrs,
			data: comboData,
			dataLabels: extend(DEFAULT_CHART_SETTINGS.dataLabels, dataLabels),
			displayMode,
			header,
			id,
			indicator: indicatorSettings,
			legend: extend(DEFAULT_CHART_SETTINGS.legend, legend),
			name,
			navigation: navigationSettings(navigation),
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
