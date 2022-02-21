// @flow
import type {BreakdownItem, Parameter} from 'store/widgetForms/types';
import {compose} from 'redux';
import {connect} from 'react-redux';
import type {DataSet, Props} from './types';
import {functions, props} from './selectors';
import {GROUP_WAYS} from 'store/widgets/constants';
import React, {Component} from 'react';
import SourceFieldset from 'WidgetFormPanel/components/SourceFieldset';
import withFilterForm from 'containers/FilterForm';

export class SourceFieldsetContainer extends Component<Props> {
	fetchAttributesByCode = async (classFqn: string | null, parameters: Array<Parameter | BreakdownItem>, defaultItem: Parameter | BreakdownItem) => {
		const {fetchAttributeByCode} = this.props;
		const newParameters = [];

		// eslint-disable-next-line no-unused-vars
		for (const item of parameters) {
			let newItem = {...defaultItem};
			const {attribute, group} = item;

			if (classFqn && attribute && group.way === GROUP_WAYS.SYSTEM) {
				const newAttr = await fetchAttributeByCode(classFqn, attribute);

				if (newAttr) {
					newItem = {...item, attribute: newAttr};
				}
			}

			newParameters.push(newItem);
		}

		return newParameters;
	};

	handleChange = (dataSetIndex: number, dataSet: DataSet, callback?: Function) => {
		const {fetchSourcesFilters, onChange, value: {source: oldDataSet}} = this.props;
		const newClassFqn = dataSet.source.value?.value ?? null;
		const oldClassFqn = oldDataSet.value?.value ?? null;

		if (newClassFqn && newClassFqn !== oldClassFqn) {
			fetchSourcesFilters(newClassFqn);
		}

		onChange(dataSetIndex, dataSet, callback);
	};

	setContext = async (): Promise<string | null> => {
		const {clearDynamicAttributeGroups, openFilterForm, value} = this.props;
		const serializedContext = await openFilterForm(value.source);

		if (serializedContext) {
			clearDynamicAttributeGroups(value.dataKey);
		}

		return serializedContext;
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

export default compose(connect(props, functions), withFilterForm)(SourceFieldsetContainer);
