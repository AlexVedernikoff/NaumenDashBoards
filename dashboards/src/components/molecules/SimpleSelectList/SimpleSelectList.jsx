// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class SimpleSelectList extends PureComponent<Props> {
	static defaultProps = {
		isSearching: false,
		messages: {
			noOptions: 'Список пуст',
			notFound: 'Ничего не найдено'
		}
	};

	handleClickOption = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {onSelect, options} = this.props;
		const {value} = e.currentTarget.dataset;
		const option = options.find(o => this.getOptionValue(o) === value);

		if (option) {
			onSelect(option);
		}
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

	renderList = () => {
		const {options} = this.props;

		if (options.length === 0) {
			return this.renderNoOptionsMessage();
		}

		return (
			<div className={styles.list}>
				{options.map(this.renderListItem)}
			</div>
		);
	};

	renderListItem = (option: Object) => {
		const {isSearching, value} = this.props;
		const optionLabel = this.getOptionLabel(option);
		const optionValue = this.getOptionValue(option);
		const isSelected = value && this.getOptionValue(value) === optionValue;
		const itemCN = cn({
			[styles.listItem]: true,
			[styles.foundListItem]: isSearching,
			[styles.selectedListItem]: isSelected
		});

		return (
			<div className={itemCN} data-value={optionValue} key={optionValue} onClick={this.handleClickOption}>
				<div className={styles.label}>{optionLabel}</div>
			</div>
		);
	};

	renderNoOptionsMessage = () => {
		const {isSearching} = this.props;
		const {noOptions, notFound} = this.getMessages();
		const message = isSearching ? notFound : noOptions;

		return <div className={styles.noOptionsMessage}>{message}</div>;
	};

	render () {
		return this.renderList();
	}
}

export default SimpleSelectList;
