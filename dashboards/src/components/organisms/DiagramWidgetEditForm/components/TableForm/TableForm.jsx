// @flow
import {array, object} from 'yup';
import {DEFAULT_TABLE_SETTINGS, DEFAULT_TABLE_SORTING} from 'components/organisms/Table/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/DiagramWidgetEditForm';
import {getDefaultIndicator, getDefaultParameter} from './helpers';
import {getErrorMessage, rules} from 'components/organisms/DiagramWidgetEditForm/schema';
import {normalizeDataSet} from 'utils/normalizer/widget/tableNormalizer';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import type {TableWidget, Widget} from 'store/widgets/data/types';
import type {Values} from 'containers/WidgetEditForm/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class TableForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, conditionalBreakdown, requiredAttribute, requiredByCompute} = rules;
		const {breakdown, indicator, indicators, parameter, parameters, source} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[breakdown]: requiredByCompute(breakdown, conditionalBreakdown(indicators)),
				[indicators]: requiredByCompute(indicators, array(object({
					attribute: requiredAttribute(getErrorMessage(indicator))
				})).default([getDefaultIndicator()])),
				[parameters]: array(object({
					attribute: requiredAttribute(getErrorMessage(parameter))
				})).default([getDefaultParameter()]),
				[source]: object().required(getErrorMessage(source)).nullable()
			}))
		});
	};

	updateWidget = (widget: Widget, values: Values): TableWidget => {
		const {id} = widget;
		let columnsRatioWidth = {};
		let sorting = DEFAULT_TABLE_SORTING;

		if (widget.type === WIDGET_TYPES.TABLE) {
			columnsRatioWidth = widget.columnsRatioWidth;
			sorting = widget.sorting;
		}

		const {
			calcTotalColumn = false,
			calcTotalRow = false,
			computedAttrs = [],
			data = [],
			displayMode,
			header,
			name = '',
			showEmptyData,
			table,
			templateName,
			type
		} = values;

		return {
			calcTotalColumn,
			calcTotalRow,
			columnsRatioWidth,
			computedAttrs,
			data: data.map(normalizeDataSet),
			displayMode,
			header,
			id,
			name,
			showEmptyData,
			sorting,
			table: extend(DEFAULT_TABLE_SETTINGS, table),
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

export default TableForm;