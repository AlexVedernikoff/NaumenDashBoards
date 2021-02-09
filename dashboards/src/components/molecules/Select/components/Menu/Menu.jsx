// @flow
import cn from 'classnames';
import {CreationPanel, SearchInput} from 'components/atoms';
import {debounce} from 'helpers';
import type {InputRef} from 'components/types';
import type {Props, State} from './types';
import React, {Component, createRef} from 'react';
import styles from './styles.less';

export class Menu extends Component<Props, State> {
	static defaultProps = {
		className: '',
		focusOnSearch: true,
		isSearching: true
	};

	searchInputRef: InputRef = createRef();

	state = {
		searchValue: ''
	};

	componentDidMount () {
		const {focusOnSearch} = this.props;
		const {current} = this.searchInputRef;

		if (focusOnSearch && current) {
			current.focus();
		}
	}

	handleChangeSearchInput = (searchValue: string) => this.setState({searchValue});

	renderCreationPanel = () => {
		const {creationButton} = this.props;

		if (creationButton) {
			const {onClick, text} = creationButton;
			return <CreationPanel onClick={onClick} text={text} />;
		}
	};

	renderList = () => {
		const {renderList} = this.props;
		const {searchValue} = this.state;

		return renderList(searchValue);
	};

	renderSearchInput = () => {
		const {isSearching} = this.props;
		const {searchValue} = this.state;

		if (isSearching) {
			return (
				<SearchInput
					forwardedRef={this.searchInputRef}
					onChange={debounce(this.handleChangeSearchInput, 500)}
					value={searchValue}
				/>
			);
		}
	};

	render () {
		const {className} = this.props;

		return (
			<div className={cn(styles.menu, className)}>
				{this.renderSearchInput()}
				{this.renderList()}
				{this.renderCreationPanel()}
			</div>
		);
	}
}

export default Menu;
