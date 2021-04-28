// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomFilterDataSet, CustomFilterValue} from 'containers/DiagramWidgetEditForm/components/FiltersOnWidget/types';
import FilterItem from './components/FilterItem';
import FormBox from 'components/molecules/FormBox';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class FiltersOnWidget extends PureComponent<Props> {
	/**
	 * Получить список использованных dataSets, для которых уже использовано 3 аттрибута в пользовательском фильтре
	 * @returns {string[]} - список использованных dataSets
	 */
	getUsedDataSets = (): string[] => {
		const {filters = []} = this.props;

		const dataSetIndexCounter = filters.reduce((p, {dataSetIndex}) => {
			if (dataSetIndex) {
				const value = dataSetIndex in p ? p[dataSetIndex] : 0;
				return {...p, [dataSetIndex]: value + 1};
			}

			return p;
		}, {});

		return Object.keys(dataSetIndexCounter).filter((index) => dataSetIndexCounter[index] > 2);
	};

	handleAddSource = () => {
		const {onAddNewFilterItem} = this.props;

		onAddNewFilterItem();
	};

	handleChangeAttribute = (idx: number) => (attribute: Attribute) => {
		const {filters, onChangeFilter} = this.props;

		if (idx < filters.length) {
			onChangeFilter(idx, {...filters[idx], attribute});
		}
	};

	handleChangeDataSet = (idx: number) => (dataSetIndex: number) => {
		const {filters, onChangeFilter} = this.props;

		if (idx < filters.length) {
			onChangeFilter(idx, {...filters[idx], dataSetIndex});
		}
	};

	handleChangeLabel = (idx: number) => (label: string) => {
		const {filters, onChangeFilter} = this.props;

		if (idx < filters.length) {
			onChangeFilter(idx, {...filters[idx], label});
		}
	};

	renderAddSourceFilter = (): React$Node => <IconButton icon={ICON_NAMES.PLUS} onClick={this.handleAddSource} />;

	renderFilterItem = (filterItemIdx: number, value: CustomFilterValue, availibleDataSets: CustomFilterDataSet[]): React$Node => {
		const {fetchAttributes} = this.props;
		return (
			<FilterItem
				dataSets={availibleDataSets}
				fetchAttributes={fetchAttributes}
				key={filterItemIdx}
				onChangeAttribute={this.handleChangeAttribute(filterItemIdx)}
				onChangeDataSet={this.handleChangeDataSet(filterItemIdx)}
				onChangeLabel={this.handleChangeLabel(filterItemIdx)}
				value={value}
			/>
		);
	};

	renderFilterItems = (): React$Node => {
		const {dataSets, filters = []} = this.props;
		const usedDataSets: string[] = this.getUsedDataSets();

		return filters.map((value, idx) => {
			const availibleDataSetsForItem = dataSets.filter(dataSet => {
				return value.dataSetIndex === dataSet.dataSetIndex
					|| !usedDataSets.includes(dataSet.dataSetIndex);
			});
			return this.renderFilterItem(idx, value, availibleDataSetsForItem);
		});
	};

	render () {
		return (
			<FormBox rightControl={this.renderAddSourceFilter()} title="Фильтрация на виджете">
				{this.renderFilterItems()}
			</FormBox>
		);
	}
}

export default FiltersOnWidget;