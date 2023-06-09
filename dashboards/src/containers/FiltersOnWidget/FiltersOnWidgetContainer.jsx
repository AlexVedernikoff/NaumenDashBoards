// @flow
import {connect} from 'react-redux';
import type {CustomFilterValue, Props, State} from './types';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FiltersOnWidget from 'WidgetFormPanel/components/FiltersOnWidget';
import {functions, props} from './selectors';
import React, {Component} from 'react';
import schema from './scheme';

export class FiltersOnWidgetContainer extends Component<Props, State> {
	state = {
		filters: []
	};

	componentDidMount () {
		const {initialCustomFiltersValues} = this.props;
		return this.setState({filters: initialCustomFiltersValues});
	}

	handleAddNewFilterItem = () => {
		const newValue: CustomFilterValue = {
			attributes: [],
			dataSetIndex: null,
			label: ''
		};

		this.setState(({filters}) => ({
			filters: [...filters, newValue]
		}), this.updateDataSets);
	};

	handleChangeFilter = (index: number, newFilter: CustomFilterValue, callback?: Function) =>
		this.setState(({filters}) => ({
			filters: [...filters.slice(0, index), newFilter, ...filters.slice(index + 1)]
		}), () => this.updateDataSets(callback));

	handleDeleteFilterItem = (index: number) => this.setState(({filters}) => ({
		filters: [...filters.slice(0, index), ...filters.slice(index + 1)]
	}), this.updateDataSets);

	updateDataSets = async (callback?: Function) => {
		const {dataSets, onChange, values} = this.props;
		const {filters} = this.state;
		let newData = values.data;

		await this.validateFilters();

		dataSets.forEach(dataSet => {
			const {dataSetIndex} = dataSet;
			let widgetFilterOptions = null;

			filters.forEach(({attributes, dataSetIndex: filterDataSetIndex, label}) => {
				if (
					filterDataSetIndex === dataSetIndex
					&& !!label
					&& (attributes?.length ?? 0) > 0
				) {
					if (!widgetFilterOptions) {
						widgetFilterOptions = [];
					}

					widgetFilterOptions.push({attributes, label});
				}
			});

			newData = newData.map((dataSet, i) => {
				let newDataSet = dataSet;

				if (i === dataSetIndex) {
					newDataSet = {
						...dataSet,
						source: {
							...dataSet.source,
							widgetFilterOptions
						}
					};
				}

				return newDataSet;
			});
		});

		onChange(DIAGRAM_FIELDS.data, newData, callback);
	};

	validateFilters = async () => {
		const environment = process.env.NODE_ENV;
		const {raiseErrors} = this.props;
		const {filters} = this.state;
		let errors = {};

		try {
			await schema.validate(filters, {abortEarly: false});
		} catch (err) {
			errors = err.inner.reduce((errors, innerError) => ({
				...errors, ['filtersOnWidget' + innerError.path]: innerError.message
			}), errors);

			if (environment === 'development') {
				console.error(errors);
			}
		}

		raiseErrors(errors);
	};

	render () {
		const {availableFiltersOnWidget, dataSets} = this.props;
		const {filters} = this.state;

		if (availableFiltersOnWidget) {
			return (
				<FiltersOnWidget
					dataSets={dataSets}
					filters={filters}
					onAddNewFilterItem={this.handleAddNewFilterItem}
					onChangeFilter={this.handleChangeFilter}
					onDeleteFilter={this.handleDeleteFilterItem}
				/>
			);
		}

		return null;
	}
}

export default connect(props, functions)(FiltersOnWidgetContainer);
