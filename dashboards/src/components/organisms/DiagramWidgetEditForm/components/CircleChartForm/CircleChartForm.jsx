// @flow
import {array, object} from 'yup';
import type {CircleWidget, Widget} from 'store/widgets/data/types';
import {DEFAULT_CHART_SETTINGS, DEFAULT_COLORS} from 'utils/chart/constants';
import {DEFAULT_CIRCLE_SORTING_SETTINGS} from 'store/widgets/data/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/DiagramWidgetEditForm';
import {getErrorMessage, mixed, rules} from 'components/organisms/DiagramWidgetEditForm/schema';
import {navigationSettings} from 'utils/normalizer/widget/helpers';
import {normalizeDataSet} from 'utils/normalizer/widget/circleNormalizer';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import type {Values} from 'containers/WidgetEditForm/types';

export class CircleChartForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, requiredBreakdown, requiredByCompute, validateTopSettings} = rules;
		const {breakdown, indicator, source, sources, top} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[breakdown]: requiredByCompute(breakdown, requiredBreakdown(FIELDS.indicator)),
				[indicator]: requiredByCompute(indicator),
				[source]: object().required(getErrorMessage(source)).nullable(),
				[top]: validateTopSettings
			})),
			[sources]: mixed().minSourceNumbers().sourceNumbers()
		});
	};

	updateWidget = (widget: Widget, values: Values): CircleWidget => {
		const {id} = widget;
		const {
			colors = DEFAULT_COLORS,
			computedAttrs = [],
			data = [],
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
			data: data.map(normalizeDataSet),
			dataLabels: extend(DEFAULT_CHART_SETTINGS.dataLabels, dataLabels),
			displayMode,
			header,
			id,
			legend: extend(DEFAULT_CHART_SETTINGS.legend, legend),
			name,
			navigation: navigationSettings(navigation),
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
