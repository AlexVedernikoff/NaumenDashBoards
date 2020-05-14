// @flow
import {array, object} from 'yup';
import {DEFAULT_SUMMARY_SETTINGS} from 'components/molecules/Summary/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getErrorMessage, rules} from 'components/organisms/WidgetFormPanel/schema';
import {normalizeDataSet} from 'utils/normalizer/widget/summaryNormalizer';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'WidgetFormPanel/types';
import React, {Component} from 'react';
import type {SummaryWidget, Widget} from 'store/widgets/data/types';
import type {Values} from 'containers/WidgetFormPanel/types';

export class SummaryForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, requiredByCompute} = rules;
		const {indicator, source} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[indicator]: requiredByCompute(indicator),
				[source]: object().required(getErrorMessage(source)).nullable()
			}))
		});
	};

	updateWidget = (widget: Widget, values: Values): SummaryWidget => {
		const {id, layout} = widget;
		const {
			computedAttrs = [],
			data = [],
			header,
			indicator,
			name = '',
			type
		} = values;

		return {
			computedAttrs,
			data: data.map(normalizeDataSet),
			header,
			id,
			indicator: extend(DEFAULT_SUMMARY_SETTINGS.indicator, indicator),
			layout,
			name,
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

export default SummaryForm;
