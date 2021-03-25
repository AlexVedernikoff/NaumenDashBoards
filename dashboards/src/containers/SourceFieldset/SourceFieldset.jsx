// @flow
import {connect} from 'react-redux';
import {createFilterContext, getFilterContext} from 'src/store/helpers';
import type {DataSet} from 'WidgetFormPanel/components/SourceFieldset/types';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import SourceFieldset from 'WidgetFormPanel/components/SourceFieldset';

export class SourceFieldsetContainer extends Component<Props> {
	handleChange = (dataSetIndex: number, dataSet: DataSet) => {
		const {fetchSourcesFilters, onChange, value: {source: oldDataSet}} = this.props;
		const newClassFqn = dataSet.source.value?.value ?? null;
		const oldClassFqn = oldDataSet.value?.value ?? null;

		if (newClassFqn && newClassFqn !== oldClassFqn) {
			fetchSourcesFilters(newClassFqn);
		}

		onChange(dataSetIndex, dataSet);
	};

	setContext = async (): Promise<string | null> => {
		const {onFetchDynamicAttributes, value} = this.props;
		const {dataKey, source} = value;
		const {descriptor, value: sourceValue} = source;

		if (sourceValue) {
			const {value: classFqn} = sourceValue;
			const context = descriptor ? getFilterContext(descriptor, classFqn) : createFilterContext(classFqn);

			try {
				const {serializedContext} = await window.jsApi.commands.filterForm(context);

				onFetchDynamicAttributes(dataKey, serializedContext);
				return serializedContext;
			} catch (e) {
				console.error('Ошибка окна фильтрации: ', e);
			}
		}

		return null;
	};

	render () {
		const {fetchSourcesFilters, ...props} = this.props;

		return (
			<SourceFieldset
				{...props}
				onChange={this.handleChange}
				onOpenFilterForm={this.setContext}
			/>
		);
	}
}

export default connect(props, functions)(SourceFieldsetContainer);