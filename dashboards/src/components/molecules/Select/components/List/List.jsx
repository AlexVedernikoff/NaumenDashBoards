// @flow
import {Button, SimpleListOption} from 'components/atoms';
import {FixedSizeList} from 'react-window';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class List extends PureComponent<Props, State> {
	static defaultProps = {
		isSearching: false,
		itemSize: 32,
		maxHeight: 250,
		messages: {
			noOptions: 'Список пуст',
			notFound: 'Ничего не найдено'
		},
		multiple: false,
		searchValue: '',
		showMore: false,
		value: null,
		values: []
	};

	state = {
		options: [],
		searchValue: ''
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {getOptionLabel, searchValue} = props;
		const {searchValue: stateSearchValue} = state;
		let {options} = props;

		if (searchValue !== stateSearchValue) {
			const reg = new RegExp(searchValue, 'i');
			// $FlowFixMe
			options = options.filter(o => {
				const label = getOptionLabel ? getOptionLabel(o) : o.label;
				return reg.test(label);
			});
		}

		return {
			options,
			searchValue
		};
	}

	getMessages = () => {
		const {messages} = this.props;
		const defaultMessages = List.defaultProps.messages;
		return messages ? {...defaultMessages, ...messages} : defaultMessages;
	};

	getOptionLabel = (option: Object) => {
		const {getOptionLabel} = this.props;
		return getOptionLabel ? getOptionLabel(option) : option.label;
	};

	getOptionValue = (option: Object) => {
		const {getOptionValue} = this.props;
		return getOptionValue ? getOptionValue(option) : option.value;
	};

	handleClickShowMore = (e: Event) => {
		const {onClickShowMore} = this.props;

		e.stopPropagation();
		onClickShowMore && onClickShowMore();
	};

	renderList = () => {
		const {options} = this.props;

		if (options.length === 0) {
			return this.renderNoOptionsMessage();
		}

		return (
			<div className={styles.list}>
				{options.map(this.renderListItem)}
				{this.renderShowMoreButton()}
			</div>
		);
	};

	renderListItem = (data: Object) => {
		const {getOptionLabel, multiple, onSelect, searchValue, showSelectedIcon, value, values} = this.props;
		const {options} = this.state;
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
			<SimpleListOption
				found={!!searchValue}
				getOptionLabel={getOptionLabel}
				key={optionValue}
				onClick={onSelect}
				option={option}
				selected={selected}
				showSelectedIcon={showSelectedIcon}
				style={style}
			/>
		);
	};

	renderNoOptionsMessage = () => {
		const {searchValue} = this.props;
		const {noOptions, notFound} = this.getMessages();
		const message = searchValue ? notFound : noOptions;

		return <div className={styles.noOptionsMessage}>{message}</div>;
	};

	renderShowMoreButton = () => {
		const {showMore} = this.props;

		if (showMore) {
			return (
				<Button className={styles.showMoreButton} onClick={this.handleClickShowMore} variant={BUTTON_VARIANTS.SIMPLE}>Показать еще</Button>
			);
		}
	};

	renderVertualizedList = () => {
		const {itemSize, maxHeight} = this.props;
		const {options} = this.state;
		const height = Math.min(itemSize * options.length, maxHeight);

		return (
			<FixedSizeList
				height={height}
				itemCount={options.length}
				itemSize={itemSize}
				width="100%"
			>
				{this.renderListItem}
			</FixedSizeList>
		);
	};

	render () {
		const {options} = this.state;

		if (options.length === 0) {
			return this.renderNoOptionsMessage();
		}

		return (
			<div className={styles.list}>
				{this.renderVertualizedList()}
				{this.renderShowMoreButton()}
			</div>
		);
	}
}

export default List;
