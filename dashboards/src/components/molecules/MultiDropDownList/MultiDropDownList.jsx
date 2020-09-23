// @flow
import {DropDownList} from 'components/molecules';
import type {Item, Props, State} from './types';
import {Loader, SearchInput} from 'components/atoms';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import Text, {TEXT_TYPES} from 'components/atoms/Text';

export class MultiDropDownList extends PureComponent<Props, State> {
	state = {
		searchValue: ''
	};

	getItems = (): Array<Object> => {
		const {items} = this.props;
		const {searchValue} = this.state;
		const reg = new RegExp(searchValue, 'ig');

		return items
			.map(item => ({
				...item,
				children: item.children.filter(child => reg.test(child.label)
				)}))
			.filter(({children, label}) => reg.test(label) || children.length !== 0);
	};

	handleSearch = (searchValue: string) => this.setState({searchValue});

	renderEmptyMessage = () => (
		<Text className={styles.emptyMessage} type={TEXT_TYPES.SMALL}>Нет совпадений.</Text>
	);

	renderList = (): Array<React$Node> | React$Node => {
		const {searchValue} = this.state;
		const items = this.getItems();

		if (searchValue && items.length === 0) {
			return this.renderEmptyMessage();
		}

		return items.map(this.renderListItem);
	};

	renderListItem = (item: Item) => {
		const {onSelect} = this.props;
		const {searchValue} = this.state;
		const {children, label} = item;

		return <DropDownList expand={!!searchValue} onSelect={onSelect} options={children} title={label} />;
	};

	renderLoader = () => {
		const {loading} = this.props;

		if (loading) {
			return (
				<div className={styles.loaderContainer}>
					<Loader size={30} />
				</div>
			);
		}
	};

	renderSearchInput = () => {
		const {onFocusSearchInput} = this.props;
		return <SearchInput className={styles.field} onChange={this.handleSearch} onFocus={onFocusSearchInput} />;
	};

	render () {
		return (
			<Fragment>
				{this.renderSearchInput()}
				{this.renderLoader()}
				{this.renderList()}
			</Fragment>
		);
	}
}

export default MultiDropDownList;
