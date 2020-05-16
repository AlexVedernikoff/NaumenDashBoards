// @flow
import {array, object} from 'yup';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_TABLE_SETTINGS, DEFAULT_TABLE_SORTING} from 'components/organisms/Table/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getErrorMessage, rules} from 'components/organisms/WidgetFormPanel/schema';
import {ParamsTab, StyleTab} from './components';
import type {ParamsTabProps, StyleTabProps, TypedFormProps} from 'WidgetFormPanel/types';
import React, {Component} from 'react';
import type {TableData, TableWidget, Widget} from 'store/widgets/data/types';
import uuid from 'tiny-uuid';
import type {Values} from 'containers/WidgetFormPanel/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class TableForm extends Component<TypedFormProps> {
	getSchema = () => {
		const {base, requiredAttribute, requiredByCompute} = rules;
		const {breakdown, column, row, source} = FIELDS;

		return object({
			...base,
			data: array().of(object({
				[breakdown]: requiredByCompute(breakdown),
				[column]: requiredByCompute(column),
				[row]: requiredAttribute(getErrorMessage(row)),
				[source]: object().required(getErrorMessage(source)).nullable()
			}))
		});
	};

	updateWidget = (widget: Widget, values: Values): TableWidget => {
		const {id, layout} = widget;
		let columnsRatioWidth = [];
		let sorting = DEFAULT_TABLE_SORTING;

		if (widget.type === WIDGET_TYPES.TABLE) {
			columnsRatioWidth = widget.columnsRatioWidth;
			sorting = widget.sorting;
		}

		const {
			calcTotalColumn = true,
			calcTotalRow = true,
			computedAttrs = [],
			data = [],
			header,
			name = '',
			table,
			type
		} = values;

		return {
			calcTotalColumn,
			calcTotalRow,
			columnsRatioWidth,
			computedAttrs,
			data: data.map(this.updateWidgetData),
			header,
			id,
			layout,
			name,
			sorting,
			table: extend(DEFAULT_TABLE_SETTINGS, table),
			type
		};
	};

	updateWidgetData = (set: Values): TableData => {
		const {
			aggregation = DEFAULT_AGGREGATION.COUNT,
			breakdown,
			breakdownGroup,
			calcTotalColumn = false,
			calcTotalRow = false,
			column,
			descriptor = '',
			dataKey = uuid(),
			row,
			source,
			sourceForCompute = false
		} = set;

		return {
			aggregation,
			breakdown,
			breakdownGroup,
			calcTotalColumn,
			calcTotalRow,
			column,
			dataKey,
			descriptor,
			row,
			source,
			sourceForCompute
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
