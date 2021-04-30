// @flow
import {array, baseSchema, mixed, object} from 'DiagramWidgetEditForm/schema';
import type {CircleData, CircleWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_CHART_SETTINGS} from 'utils/chart/constants';
import {
	DEFAULT_CIRCLE_SORTING_SETTINGS,
	DEFAULT_COLORS_SETTINGS,
	DEFAULT_TOP_SETTINGS
} from 'store/widgets/data/constants';
import {extend} from 'helpers';
import type {FilledDataSet} from 'containers/DiagramWidgetEditForm/types';
import type {InjectedProps} from 'containers/DiagramWidgetEditForm/HOCs/withChartColorsSettingsSaving/types';
import OptionsTab from 'DiagramWidgetEditForm/components/CommonOptionsTab';
import type {OptionsTabProps, ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import ParamsTab from './components/ParamsTab';
import React, {Component} from 'react';
import StyleTab from './components/StyleTab';
import type {Values} from 'containers/WidgetEditForm/types';
import withChartColorsSettingsSaving from 'containers/DiagramWidgetEditForm/HOCs/withChartColorsSettingsSaving';

export class CircleChartForm extends Component<TypedFormProps & InjectedProps> {
	getSchema = () => object({
		...baseSchema,
		data: array().of(object({
			breakdown: array().breakdown(),
			indicators: mixed().requiredByCompute(array().indicators()),
			source: mixed().source(),
			top: object().topSettings()
		})),
		sources: mixed().minSourceNumbers().sourceNumbers()
	});

	normalizeDataSet = (dataSet: FilledDataSet): CircleData => {
		const {
			breakdown,
			dataKey,
			indicators,
			showBlankData = false,
			showEmptyData = false,
			source,
			sourceForCompute,
			top = DEFAULT_TOP_SETTINGS
		} = dataSet;

		return {
			breakdown,
			dataKey,
			indicators,
			showBlankData,
			showEmptyData,
			source,
			sourceForCompute,
			top
		};
	};

	updateWidget = (widget: Widget, values: Values): CircleWidget => {
		const {applyNewColorsSettings} = this.props;
		// $FlowFixMe | В некоторых виджетах нет настроек и без ошибки обратиться к свойству не получается
		const {colorsSettings: prevColorsSettings = DEFAULT_COLORS_SETTINGS, id} = widget;
		const {
			colorsSettings = DEFAULT_COLORS_SETTINGS,
			computedAttrs = [],
			data,
			dataLabels,
			displayMode,
			header,
			legend,
			name = '',
			navigation,
			showEmpty,
			sorting,
			templateName,
			type
		} = values;

		return {
			colorsSettings: applyNewColorsSettings(prevColorsSettings, colorsSettings),
			computedAttrs,
			data: data.map(this.normalizeDataSet),
			dataLabels: extend(DEFAULT_CHART_SETTINGS.dataLabels, dataLabels),
			displayMode,
			header,
			id,
			legend: extend(DEFAULT_CHART_SETTINGS.legend, legend),
			name,
			navigation,
			showEmpty,
			sorting: extend(DEFAULT_CIRCLE_SORTING_SETTINGS, sorting),
			templateName,
			type
		};
	};

	renderOptionsTab = (props: OptionsTabProps) => <OptionsTab {...props} />;

	renderParamsTab = (props: ParamsTabProps) => <ParamsTab {...props} />;

	renderStyleTab = (props: StyleTabProps) => <StyleTab {...props} />;

	render () {
		const {saveCustomColorsSettings} = this.props;

		return this.props.render({
			onSubmitCallback: saveCustomColorsSettings,
			renderOptionsTab: this.renderOptionsTab,
			renderParamsTab: this.renderParamsTab,
			renderStyleTab: this.renderStyleTab,
			schema: this.getSchema(),
			updateWidget: this.updateWidget
		});
	}
}

export default withChartColorsSettingsSaving(CircleChartForm);
