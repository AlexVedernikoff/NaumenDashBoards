// @flow
import {array, baseSchema, mixed, object} from 'DiagramWidgetEditForm/schema';
import type {ComboData, ComboWidget, Widget} from 'store/widgets/data/types';
import {
	COMBO_TYPES,
	DEFAULT_AXIS_SORTING_SETTINGS,
	DEFAULT_COLORS_SETTINGS,
	DEFAULT_TOP_SETTINGS
} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS} from 'utils/chart/constants';
import {extend} from 'helpers';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import type {FilledDataSet} from 'containers/DiagramWidgetEditForm/types';
import {getComboYAxisName} from 'store/widgets/data/helpers';
import ParamsTab from './components/ParamsTab';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import StyleTab from './components/StyleTab';
import type {Values} from 'containers/WidgetEditForm/types';

export class ComboChartForm extends Component<TypedFormProps> {
	getSchema = () => object({
		...baseSchema,
		data: array().of(object({
			breakdown: mixed().when(FIELDS.type, {
				else: mixed().requiredByCompute(array().conditionalBreakdown()),
				is: type => type === COMBO_TYPES.COLUMN_STACKED,
				then: array().breakdown()
			}),
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
			showBlankData = false,
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
			showBlankData,
			showEmptyData,
			source,
			sourceForCompute,
			top,
			type,
			xAxisName,
			yAxisName: getComboYAxisName(source.value, indicators, yAxisName)
		};
	};

	updateWidget = (widget: Widget, values: Values): ComboWidget => {
		const {id} = widget;
		const {
			colorsSettings = DEFAULT_COLORS_SETTINGS,
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
			colorsSettings,
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
