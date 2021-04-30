// @flow
import {connect} from 'react-redux';
import type {CustomFilterValue, Props, State} from './types';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import FiltersOnWidget from 'DiagramWidgetEditForm/components/FiltersOnWidget';
import {props} from './selectors';
import React, {Component} from 'react';

export class FiltersOnWidgetContainer extends Component<Props, State> {
	state = {
		filters: []
	};

	componentDidMount () {
		const {initialCustomFiltersValues} = this.props;
		return this.setState({filters: initialCustomFiltersValues});
	}

	fetchAttributes = (dataSetIndex: number) => {
		const {dataSets, fetchAttributes} = this.props;
		const dataSet = dataSets[dataSetIndex];

		if (dataSet) {
			const source = dataSet.source.value;

			if (source) {
				fetchAttributes(source.value);
			}
		}
	};

	handleAddNewFilterItem = () => {
		const newValue: CustomFilterValue = {
			attribute: null,
			dataSetIndex: null,
			label: ''
		};

		this.setState(({filters}) => ({
			filters: [...filters, newValue]
		}));
	};

	handleChangeFilter = (index: number, newFilter: CustomFilterValue) => {
		this.setState(({filters}) => ({
			filters: [...filters.slice(0, index), newFilter, ...filters.slice(index + 1)]
		}), this.updateDataSets);
	};

	handleDeleteFilterItem = (index: number) => {
		this.setState(({filters}) => ({
			filters: [...filters.slice(0, index), ...filters.slice(index + 1)]
		}), this.updateDataSets);
	};

	updateDataSets = () => {
		const {dataSets, setDataFieldValue} = this.props;
		const {filters} = this.state;

		dataSets.forEach((dataSet) => {
			const {dataSetIndex, source} = dataSet;
			let widgetFilterOptions = null;

			filters.forEach(({attribute, dataSetIndex: filterDataSetIndex, label}) => {
				if (
					filterDataSetIndex === dataSetIndex
					&& !!label
					&& !!attribute
				) {
					if (!widgetFilterOptions) {
						widgetFilterOptions = [];
					}

					widgetFilterOptions.push({attributes: [attribute], label});
				}
			});
			setDataFieldValue(dataSetIndex, FIELDS.source, { ...source, widgetFilterOptions });
		});
	};

	render () {
		const {dataSets} = this.props;
		const {filters} = this.state;

		return (
			<FiltersOnWidget
				dataSets={dataSets}
				fetchAttributes={this.fetchAttributes}
				filters={filters}
				onAddNewFilterItem={this.handleAddNewFilterItem}
				onChangeFilter={this.handleChangeFilter}
				onDeleteFilter={this.handleDeleteFilterItem}
			/>
		);
	}
}

export default connect(props)(FiltersOnWidgetContainer);
