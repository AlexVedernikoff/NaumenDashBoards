// @flow
import api from 'api';
import type {BreakdownItem, Parameter} from 'store/widgetForms/types';
import {connect} from 'react-redux';
import {createFilterContext, getFilterContext} from 'src/store/helpers';
import type {DataSet, Props} from './types';
import {functions, props} from './selectors';
import {GROUP_WAYS} from 'store/widgets/constants';
import React, {Component} from 'react';
import SourceFieldset from 'WidgetFormPanel/components/SourceFieldset';

export class SourceFieldsetContainer extends Component<Props> {
	fetchAttributesByCode = async (classFqn: string | null, parameters: Array<Parameter | BreakdownItem>, defaultItem: Parameter | BreakdownItem) => {
		const {fetchAttributeByCode} = this.props;
		const newParameters = [];

		// eslint-disable-next-line no-unused-vars
		for (const item of parameters) {
			let newItem = {...defaultItem};
			const {attribute, group} = item;

			if (classFqn && group.way === GROUP_WAYS.SYSTEM) {
				const newAttr = await fetchAttributeByCode(classFqn, attribute);

				if (newAttr) {
					newItem = {...item, attribute: newAttr};
				}
			}

			newParameters.push(newItem);
		}

		return newParameters;
	};

	getSourceDescriptor = () => {
		const {filterList, value: {source}} = this.props;
		const {descriptor, filterId} = source;
		let result = descriptor;

		if (filterId) {
			const filter = filterList.find(item => item.id === filterId);

			if (filter) {
				result = filter.descriptor;
			}
		}

		return result;
	};

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
		const {value: sourceValue} = this.props.value.source;

		if (sourceValue) {
			const {value: classFqn} = sourceValue;
			const descriptor = this.getSourceDescriptor();
			const context = descriptor ? getFilterContext(descriptor, classFqn) : createFilterContext(classFqn);

			try {
				const {serializedContext} = await api.filterForm.openForm(context);

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
				fetchAttributesByCode={this.fetchAttributesByCode}
				onChange={this.handleChange}
				onOpenFilterForm={this.setContext}
			/>
		);
	}
}

export default connect(props, functions)(SourceFieldsetContainer);
