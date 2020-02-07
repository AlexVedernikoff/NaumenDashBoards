// @flow
import {CreationPanel, SearchSelectInput} from 'components/atoms';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import {SimpleSelectList} from 'components/molecules';
import styles from './styles.less';

export class SimpleSelectMenu extends PureComponent<Props, State> {
	static defaultProps = {
		isSearching: false
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
		const {getOptionLabel, getOptionValue, onSelect, options, value} = this.props;
		const {foundOptions, searchValue} = this.state;
		const renderOptions = searchValue ? foundOptions : options;

		return (
			<SimpleSelectList
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				isSearching={!!searchValue}
				onSelect={onSelect}
				options={renderOptions}
				value={value}
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
