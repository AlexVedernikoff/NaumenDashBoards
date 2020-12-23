// @flow
import {array, object} from 'yup';
import {checkSourceForParent, getDefaultIndicator, getDefaultParameter} from './helpers';
import {DEFAULT_TABLE_SETTINGS, DEFAULT_TABLE_SORTING} from 'components/organisms/Table/constants';
import {DEFAULT_TOP_SETTINGS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/DiagramWidgetEditForm';
import {getErrorMessage, mixed, rules} from 'components/organisms/DiagramWidgetEditForm/schema';
import {navigationSettings} from 'utils/normalizer/widget/helpers';
import {normalizeDataSet} from 'utils/normalizer/widget/tableNormalizer';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import React, {Component} from 'react';
import type {TableWidget, Widget} from 'store/widgets/data/types';
import type {Values} from 'containers/WidgetEditForm/types';

export class TableForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, conditionalBreakdown, requiredAttribute, requiredByCompute, validateTopSettings} = rules;
		const {breakdown, indicator, indicators, parameter, parameters, source, sources, top} = FIELDS;

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
				[source]: object()
					.required(getErrorMessage(source)).nullable()
					.test(
						'check-source-for-parent',
						'Для данного типа выбранный источник не доступен - выберите другой',
						checkSourceForParent
					)
			})),
			[sources]: mixed().minSourceNumbers(),
			[top]: validateTopSettings
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
			navigation,
			showEmptyData,
			table,
			templateName,
			top = DEFAULT_TOP_SETTINGS,
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
			navigation: navigationSettings(navigation),
			showEmptyData,
			sorting,
			table: extend(DEFAULT_TABLE_SETTINGS, table),
			templateName,
			top,
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
