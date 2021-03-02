// @flow
import {array, baseSchema, mixed, object} from 'DiagramWidgetEditForm/schema';
import type {Attribute} from 'store/sources/attributes/types';
import type {AxisData, AxisWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_AXIS_SORTING_SETTINGS, DEFAULT_TOP_SETTINGS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS} from 'utils/chart/constants';
import {extend} from 'helpers';
import type {FilledDataSet} from 'containers/DiagramWidgetEditForm/types';
import {getLegendSettings} from 'utils/chart/helpers';
import type {InjectedProps} from 'containers/DiagramWidgetEditForm/HOCs/withChartColorsSettingsSaving/types';
import {lazy} from 'yup';
import ParamsTab from './components/ParamsTab';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import StyleTab from './components/StyleTab';
import type {Values} from 'containers/WidgetEditForm/types';
import withChartColorsSettingsSaving from 'containers/DiagramWidgetEditForm/HOCs/withChartColorsSettingsSaving';

export class AxisChartForm extends Component<TypedFormProps & InjectedProps> {
	getSchema = () => object({
		...baseSchema,
		data: array().of(object({
			breakdown: mixed().requiredByCompute(lazy(this.resolveBreakdownSchema)),
			indicators: mixed().requiredByCompute(array().indicators()),
			parameters: array().parameters(),
			source: mixed().source(),
			top: object().topSettings()
		})),
		sources: mixed().minSourceNumbers().sourceNumbers()
	});

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

	resolveBreakdownSchema = (attribute: Attribute | null, context: Object) => {
		const {BAR, COLUMN, LINE} = WIDGET_TYPES;
		const {type} = context.values;
		const hasConditionalBreakdown = type === BAR || type === COLUMN || type === LINE;

		return hasConditionalBreakdown ? array().conditionalBreakdown() : array().breakdown();
	};

	updateWidget = (widget: Widget, values: Values): AxisWidget => {
		const {saveCustomColorsSettings} = this.props;
		const {id} = widget;
		const {
			colorsSettings,
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

		saveCustomColorsSettings(colorsSettings);

		return {
			colorsSettings,
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

export default withChartColorsSettingsSaving(AxisChartForm);
