// @flow
import {array, object} from 'yup';
import {DEFAULT_SUMMARY_SETTINGS} from 'components/organisms/SummaryWidget/constants';
import {extend} from 'helpers';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import type {FilledDataSet} from 'containers/DiagramWidgetEditForm/types';
import {getErrorMessage, mixed, rules} from 'components/organisms/DiagramWidgetEditForm/schema';
import {getSummaryLayoutSize} from './helpers';
import ParamsTab from './components/ParamsTab';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import type {State} from './types';
import StyleTab from './components/StyleTab';
import type {SummaryData, SummaryWidget, Widget} from 'store/widgets/data/types';
import type {Values} from 'containers/WidgetEditForm/types';

export class SummaryForm extends Component<TypedFormProps, State> {
	state = {
		layoutSize: getSummaryLayoutSize(this.props.layoutMode)
	};

	getSchema = () => {
		const {base, requiredByCompute} = rules;

		return object({
			...base,
			data: array().of(object({
				indicators: requiredByCompute(array(mixed().requiredAttribute(getErrorMessage(FIELDS.indicator)))),
				source: mixed().source()
			})),
			sources: mixed().minSourceNumbers().sourceNumbers()
		});
	};

	normalizeDataSet = (dataSet: FilledDataSet): SummaryData => {
		const {dataKey, indicators, source, sourceForCompute} = dataSet;

		return {
			dataKey,
			indicators,
			source,
			sourceForCompute
		};
	};

	updateWidget = (widget: Widget, values: Values): SummaryWidget => {
		const {id} = widget;
		const {
			computedAttrs,
			data,
			displayMode,
			header,
			indicator,
			name = '',
			navigation,
			templateName,
			type
		} = values;

		return {
			computedAttrs,
			data: data.map(this.normalizeDataSet),
			displayMode,
			header,
			id,
			indicator: extend(DEFAULT_SUMMARY_SETTINGS.indicator, indicator),
			name,
			navigation,
			templateName,
			type
		};
	};

	renderParamsTab = (props: ParamsTabProps) => <ParamsTab {...props} />;

	renderStyleTab = (props: StyleTabProps) => <StyleTab {...props} />;

	render () {
		const {layoutSize} = this.state;

		return this.props.render({
			layoutSize,
			renderParamsTab: this.renderParamsTab,
			renderStyleTab: this.renderStyleTab,
			schema: this.getSchema(),
			updateWidget: this.updateWidget
		});
	}
}

export default SummaryForm;
