// @flow
import {Button, SimpleListOption} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class SimpleSelectList extends PureComponent<Props> {
	static defaultProps = {
		isSearching: false,
		messages: {
			noOptions: 'Список пуст',
			notFound: 'Ничего не найдено'
		},
		multiple: false,
		showMore: false,
		value: null,
		values: []
	};

	getMessages = () => {
		const {messages} = this.props;
		const defaultMessages = SimpleSelectList.defaultProps.messages;
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

	handleClickOption = (option: Object | null) => {
		const {onClose, onSelect} = this.props;
		option ? onSelect(option) : onClose();
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

	renderListItem = (option: Object) => {
		const {getOptionLabel, isSearching, multiple, value, values} = this.props;
		const optionValue = this.getOptionValue(option);
		let selected = false;

		if (multiple) {
			selected = values.findIndex(value => this.getOptionValue(value) === optionValue) !== -1;
		} else if (value) {
			selected = this.getOptionValue(value) === optionValue;
		}

		return (
			<SimpleListOption
				found={isSearching}
				getOptionLabel={getOptionLabel}
				key={optionValue}
				onClick={this.handleClickOption}
				option={option}
				selected={selected}
			/>
		);
	};

	renderNoOptionsMessage = () => {
		const {isSearching} = this.props;
		const {noOptions, notFound} = this.getMessages();
		const message = isSearching ? notFound : noOptions;

		return <div className={styles.noOptionsMessage}>{message}</div>;
	};

	renderShowMoreButton = () => {
		const {showMore} = this.props;

		if (showMore) {
			return (
				<div className={styles.showMoreContainer}>
					<Button onClick={this.handleClickShowMore} variant={BUTTON_VARIANTS.SIMPLE}>Показать еще</Button>
				</div>
			);
		}
	};

	render () {
		return this.renderList();
	}
}

export default SimpleSelectList;
