// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomFilterDataSet, CustomFilterValue} from 'containers/FiltersOnWidget/types';
import FilterItem from './components/FilterItem';
import FormBox from 'components/molecules/FormBox';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import t from 'localization';

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

		return Object.keys(dataSetIndexCounter).filter(index => dataSetIndexCounter[index] > 2);
	};

	handleAddSource = () => {
		const {filters, onAddNewFilterItem} = this.props;

		if (!filters || filters?.length < 3) {
			onAddNewFilterItem();
		}
	};

	handleChangeAttribute = (idx: number) => (attributes: Attribute[], callback?: Function) => {
		const {filters, onChangeFilter} = this.props;

		if (idx < filters.length) {
			onChangeFilter(idx, {...filters[idx], attributes}, callback);
		}
	};

	handleChangeDataSet = (idx: number) => (dataSetIndex: number, callback?: Function) => {
		const {filters, onChangeFilter} = this.props;

		if (idx < filters.length) {
			onChangeFilter(idx, {...filters[idx], dataSetIndex}, callback);
		}
	};

	handleChangeLabel = (idx: number) => (label: string, callback?: Function) => {
		const {filters, onChangeFilter} = this.props;

		if (idx < filters.length) {
			onChangeFilter(idx, {...filters[idx], label}, callback);
		}
	};

	handleDelete = (idx: number) => () => {
		const {filters, onDeleteFilter} = this.props;

		if (idx < filters.length) {
			onDeleteFilter(idx);
		}
	};

	renderAddSourceFilter = (): React$Node => {
		const {filters} = this.props;

		if (!filters || filters?.length < 3) {
			return <IconButton icon={ICON_NAMES.PLUS} onClick={this.handleAddSource} />;
		}

		return null;
	};

	renderFilterItem = (filterItemIdx: number, value: CustomFilterValue, availableDataSets: CustomFilterDataSet[]): React$Node => (
		<FilterItem
			dataSets={availableDataSets}
			idx={filterItemIdx}
			key={filterItemIdx}
			onChangeAttribute={this.handleChangeAttribute(filterItemIdx)}
			onChangeDataSet={this.handleChangeDataSet(filterItemIdx)}
			onChangeLabel={this.handleChangeLabel(filterItemIdx)}
			onDelete={this.handleDelete(filterItemIdx)}
			value={value}
		/>
	);

	renderFilterItems = (): React$Node => {
		const {dataSets, filters = []} = this.props;
		const usedDataSets: string[] = this.getUsedDataSets();

		return filters.map((value, idx) => {
			const availableDataSetsForItem = dataSets.filter(
				dataSet =>
					value.dataSetIndex === dataSet.dataSetIndex
					|| !usedDataSets.includes(dataSet.dataSetIndex)
			);
			return this.renderFilterItem(idx, value, availableDataSetsForItem);
		});
	};

	render () {
		return (
			<FormBox rightControl={this.renderAddSourceFilter()} title={t('FiltersOnWidget::FilterOnWidget')}>
				{this.renderFilterItems()}
			</FormBox>
		);
	}
}

export default FiltersOnWidget;
