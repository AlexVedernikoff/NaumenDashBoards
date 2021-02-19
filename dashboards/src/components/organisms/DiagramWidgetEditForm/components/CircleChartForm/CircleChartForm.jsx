// @flow
import {array, object} from 'yup';
import type {CircleData, CircleWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS} from 'utils/chart/constants';
import {DEFAULT_CIRCLE_SORTING_SETTINGS, DEFAULT_TOP_SETTINGS} from 'store/widgets/data/constants';
import {extend} from 'helpers';
import {FIELDS} from 'components/organisms/DiagramWidgetEditForm';
import type {FilledDataSet} from 'containers/DiagramWidgetEditForm/types';
import {getErrorMessage, mixed, rules} from 'components/organisms/DiagramWidgetEditForm/schema';
import ParamsTab from './components/ParamsTab';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import StyleTab from './components/StyleTab';
import type {Values} from 'containers/WidgetEditForm/types';

export class CircleChartForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, requiredBreakdown, requiredByCompute, validateTopSettings} = rules;

		return object({
			...base,
			data: array().of(object({
				breakdown: requiredBreakdown,
				indicators: requiredByCompute(array(mixed().requiredAttribute(getErrorMessage(FIELDS.indicator)))),
				source: mixed().source(),
				top: validateTopSettings
			})),
			sources: mixed().minSourceNumbers().sourceNumbers()
		});
	};

	normalizeDataSet = (dataSet: FilledDataSet): CircleData => {
		const {
			breakdown,
			dataKey,
			indicators,
			showEmptyData = false,
			source,
			sourceForCompute,
			top = DEFAULT_TOP_SETTINGS
		} = dataSet;

		return {
			breakdown,
			dataKey,
			indicators,
			showEmptyData,
			source,
			sourceForCompute,
			top
		};
	};

	updateWidget = (widget: Widget, values: Values): CircleWidget => {
		const {id} = widget;
		const {
			colors = DEFAULT_COLORS,
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
			colors,
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
