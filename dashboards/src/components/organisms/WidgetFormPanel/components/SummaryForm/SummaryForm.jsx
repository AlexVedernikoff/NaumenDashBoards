// @flow
import {array, object} from 'yup';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_SUMMARY_SETTINGS} from 'components/molecules/Summary/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getErrorMessage, rules} from 'components/organisms/WidgetFormPanel/schema';
import {ParamsTab} from './components';
import type {ParamsTabProps, TypedFormProps} from 'WidgetFormPanel/types';
import React, {Component} from 'react';
import type {SummaryData, SummaryWidget, Widget} from 'store/widgets/data/types';
import uuid from 'tiny-uuid';
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
			data: data.map(this.updateWidgetData),
			header,
			id,
			indicator: extend(DEFAULT_SUMMARY_SETTINGS.indicator, indicator),
			layout,
			name,
			type
		};
	};

	updateWidgetData = (set: Values): SummaryData => {
		const {
			aggregation = DEFAULT_AGGREGATION.COUNT,
			descriptor = '',
			dataKey = uuid(),
			indicator,
			source,
			sourceForCompute = false
		} = set;

		return {
			aggregation,
			dataKey,
			descriptor,
			indicator,
			source,
			sourceForCompute
		};
	};

	renderParamsTab = (props: ParamsTabProps) => <ParamsTab {...props} />;

	renderStyleTab = () => null;

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
