// @flow
import {connect} from 'react-redux';
import {createFilterContext, getFilterContext} from 'store/helpers';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import type {SourceData} from 'containers/DiagramWidgetEditForm/types';
import SourceFieldset from 'DiagramWidgetEditForm/components/SourceFieldset';

export class SourceFieldsetContainer extends Component<Props> {
	handleChangeDataSet = (dataSetIndex: number, source: SourceData) => {
		const {dataSet: {source: oldDataSet}, fetchSourcesFilters, onChangeDataSet} = this.props;
		const newClassFqn = source.value?.value ?? null;
		const oldClassFqn = oldDataSet.value?.value ?? null;

		if (newClassFqn && newClassFqn !== oldClassFqn) {
			fetchSourcesFilters(newClassFqn);
		}

		onChangeDataSet(dataSetIndex, source);
	};

	setContext = async (): Promise<string | null> => {
		const {dataSet, dataSetIndex, onFetchDynamicAttributes} = this.props;
		const {source} = dataSet;
		const {descriptor, value: sourceValue} = source;

		if (sourceValue) {
			const {value: classFqn} = sourceValue;
			const context = descriptor ? getFilterContext(descriptor, classFqn) : createFilterContext(classFqn);

			try {
				const {serializedContext} = await window.jsApi.commands.filterForm(context);

				onFetchDynamicAttributes(dataSetIndex, serializedContext);
				return serializedContext;
			} catch (e) {
				console.error('Ошибка окна фильтрации: ', e);
			}
		}

		return null;
	};

	render () {
		return (
			<SourceFieldset
				{...this.props}
				onChangeDataSet={this.handleChangeDataSet}
				openFilterForm={this.setContext}
			/>
		);
	}
}

export default connect(props, functions)(SourceFieldsetContainer);
