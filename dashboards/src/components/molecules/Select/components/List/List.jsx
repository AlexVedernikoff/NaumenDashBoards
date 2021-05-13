// @flow
import Button from 'components/atoms/Button';
import {DEFAULT_ITEM_SIZE, DEFAULT_MAX_HEIGHT} from './constants';
import {FixedSizeList} from 'react-window';
import {getOptionLabel, getOptionValue} from 'components/molecules/Select/helpers';
import ListOption from 'components/molecules/Select/components/ListOption';
import type {Option, Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class List extends PureComponent<Props> {
	static defaultProps = {
		components: {},
		getOptionLabel,
		getOptionValue,
		itemSize: DEFAULT_ITEM_SIZE,
		maxHeight: DEFAULT_MAX_HEIGHT,
		multiple: false,
		searchValue: '',
		showMore: false,
		value: null,
		values: []
	};

	components = {
		ListOption,
		...this.props.components
	};

	getOptionLabel = (option: Option) => {
		const {getOptionLabel} = this.props;

		return getOptionLabel ? getOptionLabel(option) : option.label;
	};

	getOptionValue = (option: Option) => {
		const {getOptionValue} = this.props;

		return getOptionValue ? getOptionValue(option) : option.value;
	};

	handleClickShowMore = (e: Event) => {
		const {onClickShowMore} = this.props;

		e.stopPropagation();
		onClickShowMore && onClickShowMore();
	};

	handleSelect = (option: Option) => {
		const {multiple, onSelect, values} = this.props;

		if (multiple) {
			const val = this.getOptionValue(option);
			const foundItem = values.find(item => this.getOptionValue(item) === val);
			const newValues = foundItem
				? values.filter(item => foundItem !== item)
				: [...values, option];

			onSelect(newValues);
		} else {
			onSelect(option);
		}
	};

	renderListItem = (data: Object) => {
		const {getOptionLabel, multiple, onSelect, options, searchValue, value, values} = this.props;
		const {ListOption} = this.components;
		const {index, style} = data;
		const option = options[index];
		const optionValue = this.getOptionValue(option);
		let selected = false;

		if (multiple) {
			selected = values.findIndex(value => this.getOptionValue(value) === optionValue) !== -1;
		} else if (value) {
			selected = this.getOptionValue(value) === optionValue;
		}

		return (
			<ListOption
				found={!!searchValue}
				getOptionLabel={getOptionLabel}
				key={optionValue}
				onClick={this.handleSelect}
				option={option}
				selected={selected}
				style={style}
			/>
		);
	};

	renderShowMoreButton = () => {
		const {showMore} = this.props;

		if (showMore) {
			return (
				<Button
					className={styles.showMoreButton}
					onClick={this.handleClickShowMore}
					variant={BUTTON_VARIANTS.SIMPLE}>
					Показать еще
				</Button>
			);
		}

		return null;
	};

	renderVertualizedList = () => {
		const {itemSize, maxHeight, options, value, values} = this.props;
		const height = Math.min(itemSize * options.length, maxHeight);

		return (
			<FixedSizeList
				height={height}
				itemCount={options.length}
				itemSize={itemSize}
				value={value}
				values={values}
				width="100%"
			>
				{this.renderListItem}
			</FixedSizeList>
		);
	};

	render () {
		return (
			<div className={styles.list}>
				{this.renderVertualizedList()}
				{this.renderShowMoreButton()}
			</div>
		);
	}
}

export default List;
