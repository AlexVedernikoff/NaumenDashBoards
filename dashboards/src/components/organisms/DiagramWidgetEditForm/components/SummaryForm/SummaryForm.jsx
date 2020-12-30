// @flow
import {array, object} from 'yup';
import {DEFAULT_SUMMARY_SETTINGS} from 'components/organisms/SummaryWidget/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/DiagramWidgetEditForm';
import {getErrorMessage, mixed, rules} from 'components/organisms/DiagramWidgetEditForm/schema';
import {getSummaryLayoutSize} from './helpers';
import {navigationSettings} from 'utils/normalizer/widget/helpers';
import {normalizeDataSet} from 'utils/normalizer/widget/summaryNormalizer';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import type {State} from './types';
import type {SummaryWidget, Widget} from 'store/widgets/data/types';
import type {Values} from 'containers/WidgetEditForm/types';

export class SummaryForm extends Component<TypedFormProps, State> {
	state = {
		layoutSize: getSummaryLayoutSize(this.props.layoutMode)
	};

	getSchema = () => {
		const {base, requiredByCompute} = rules;
		const {indicator, source, sources} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[indicator]: requiredByCompute(indicator),
				[source]: object().required(getErrorMessage(source)).nullable()
			})),
			[sources]: mixed().minSourceNumbers().sourceNumbers()
		});
	};

	updateWidget = (widget: Widget, values: Values): SummaryWidget => {
		const {id} = widget;
		const {
			computedAttrs = [],
			data = [],
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
			data: data.map(normalizeDataSet),
			displayMode,
			header,
			id,
			indicator: extend(DEFAULT_SUMMARY_SETTINGS.indicator, indicator),
			name,
			navigation: navigationSettings(navigation),
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
