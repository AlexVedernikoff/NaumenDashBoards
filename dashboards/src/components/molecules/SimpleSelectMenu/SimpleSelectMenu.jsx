// @flow
import {CreationPanel, SearchSelectInput} from 'components/atoms';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import {SimpleSelectList} from 'components/molecules';
import styles from './styles.less';

export class SimpleSelectMenu extends PureComponent<Props, State> {
	static defaultProps = {
		isSearching: false,
		multiple: false,
		showMore: false,
		value: null,
		values: []
	};

	state = {
		foundOptions: [],
		searchValue: ''
	};

	getOptionLabel = (option: Object) => {
		const {getOptionLabel} = this.props;
		return getOptionLabel ? getOptionLabel(option) : option.label;
	};

	getOptionValue = (option: Object) => {
		const {getOptionValue} = this.props;
		return getOptionValue ? getOptionValue(option) : option.value;
	};

	handleChangeSearchInput = (searchValue: string) => {
		const {options} = this.props;
		const reg = new RegExp(searchValue, 'i');
		const foundOptions = options.filter(o => reg.test(this.getOptionLabel(o)));

		this.setState({foundOptions, searchValue});
	};

	renderCreationPanel = () => {
		const {creationButton} = this.props;

		if (creationButton) {
			const {onClick, text} = creationButton;
			return <CreationPanel onClick={onClick} text={text} />;
		}
	};

	renderList = () => {
		const {
			getOptionLabel,
			getOptionValue,
			multiple,
			onClickShowMore,
			onClose,
			onSelect,
			options,
			showMore,
			value,
			values
		} = this.props;
		const {foundOptions, searchValue} = this.state;
		const renderOptions = searchValue ? foundOptions : options;

		return (
			<SimpleSelectList
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				isSearching={!!searchValue}
				multiple={multiple}
				onClickShowMore={onClickShowMore}
				onClose={onClose}
				onSelect={onSelect}
				options={renderOptions}
				showMore={showMore}
				value={value}
				values={values}
			/>
		);
	};

	renderSearchInput = () => {
		const {isSearching} = this.props;
		const {searchValue} = this.state;

		if (isSearching) {
			return <SearchSelectInput onChange={this.handleChangeSearchInput} value={searchValue} />;
		}
	};

	render () {
		return (
			<div className={styles.menu}>
				{this.renderSearchInput()}
				{this.renderList()}
				{this.renderCreationPanel()}
			</div>
		);
	}
}

export default SimpleSelectMenu;
