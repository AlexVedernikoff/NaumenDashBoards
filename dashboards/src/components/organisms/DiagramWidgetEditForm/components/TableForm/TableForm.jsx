// @flow
import {array, baseSchema, mixed, object} from 'components/organisms/DiagramWidgetEditForm/schema';
import {DEFAULT_TABLE_SETTINGS, DEFAULT_TABLE_SORTING} from 'components/organisms/Table/constants';
import {DEFAULT_TOP_SETTINGS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {extend} from 'helpers';
import type {FilledDataSet} from 'containers/DiagramWidgetEditForm/types';
import OptionsTab from 'DiagramWidgetEditForm/components/CommonOptionsTab';
import type {OptionsTabProps, ParamsTabProps, StyleTabProps, TypedFormProps} from 'DiagramWidgetEditForm/types';
import ParamsTab from './components/ParamsTab';
import React, {Component} from 'react';
import StyleTab from './components/StyleTab';
import type {TableData, TableWidget, Widget} from 'store/widgets/data/types';
import type {Values} from 'containers/WidgetEditForm/types';

export class TableForm extends Component<TypedFormProps> {
	getSchema = () => object({
		...baseSchema,
		data: array().of(object({
			breakdown: mixed().requiredByCompute(array().breakdown()),
			indicators: mixed().requiredByCompute(array().indicators()),
			parameters: array().parameters(),
			source: mixed().source()
		})),
		sources: mixed().minSourceNumbers(),
		top: object().topSettings()
	});

	normalizeDataSet = (dataSet: FilledDataSet): TableData => {
		const {
			breakdown,
			dataKey,
			indicators,
			parameters,
			source,
			sourceForCompute
		} = dataSet;

		return {
			breakdown,
			dataKey,
			indicators,
			parameters,
			source,
			sourceForCompute
		};
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
			computedAttrs = [],
			data,
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
			columnsRatioWidth,
			computedAttrs,
			data: data.map(this.normalizeDataSet),
			displayMode,
			header,
			id,
			name,
			navigation,
			showEmptyData,
			sorting,
			table: extend(DEFAULT_TABLE_SETTINGS, table),
			templateName,
			top,
			type
		};
	};

	renderOptionsTab = (props: OptionsTabProps) => <OptionsTab {...props} />;

	renderParamsTab = (props: ParamsTabProps) => <ParamsTab {...props} />;

	renderStyleTab = (props: StyleTabProps) => <StyleTab {...props} />;

	render () {
		return this.props.render({
			renderOptionsTab: this.renderOptionsTab,
			renderParamsTab: this.renderParamsTab,
			renderStyleTab: this.renderStyleTab,
			schema: this.getSchema(),
			updateWidget: this.updateWidget
		});
	}
}

export default TableForm;
