// @flow
import {array, baseSchema, mixed, object} from 'DiagramWidgetEditForm/schema';
import type {ComboData, ComboWidget, Widget} from 'store/widgets/data/types';
import {COMBO_TYPES, DEFAULT_AXIS_SORTING_SETTINGS, DEFAULT_TOP_SETTINGS} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS} from 'utils/chart/constants';
import {extend} from 'helpers';
import type {FilledDataSet} from 'containers/DiagramWidgetEditForm/types';
import ParamsTab from './components/ParamsTab';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import StyleTab from './components/StyleTab';
import type {Values} from 'containers/WidgetEditForm/types';

export class ComboChartForm extends Component<TypedFormProps> {
	getSchema = () => object({
		...baseSchema,
		data: array().of(object({
			breakdown: mixed().requiredByCompute(array().breakdown()),
			indicators: mixed().requiredByCompute(array().indicators()),
			parameters: array().parameters(),
			source: mixed().source(),
			top: object().topSettings()
		})),
		sources: mixed().minSourceNumbers()
	});

	normalizeDataSet = (dataSet: FilledDataSet): ComboData => {
		const {
			breakdown,
			dataKey,
			indicators,
			parameters,
			showEmptyData = false,
			source,
			sourceForCompute,
			top = DEFAULT_TOP_SETTINGS,
			type = COMBO_TYPES.COLUMN,
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
			type,
			xAxisName,
			yAxisName
		};
	};

	updateWidget = (widget: Widget, values: Values): ComboWidget => {
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
			parameter,
			name = '',
			navigation,
			showEmptyData,
			sorting,
			templateName,
			type
		} = values;
		const indicatorSettings = extend(DEFAULT_CHART_SETTINGS.axis, indicator);
		const comboData = data.map(this.normalizeDataSet);

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
			navigation,
			parameter: extend(DEFAULT_CHART_SETTINGS.axis, parameter),
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
