// @flow
import DropDownList from 'components/molecules/DropDownList';
import {escapeString} from 'helpers';
import Loader from 'components/atoms/Loader';
import type {Props, Root, State} from './types';
import React, {PureComponent} from 'react';
import SearchInput from 'components/atoms/SearchInput';
import styles from './styles.less';
import Text, {TEXT_TYPES} from 'components/atoms/Text';

export class MultiDropDownList extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		searchValue: ''
	};

	getItems = (): Array<Object> => {
		const {items} = this.props;
		const {searchValue} = this.state;
		const reg = new RegExp(escapeString(searchValue), 'i');

		return items
			.map(item => ({
				...item,
				children: item.children.filter(child => reg.test(child.label))
			}))
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

	renderListItem = (item: Root) => {
		const {onSelect} = this.props;
		const {searchValue} = this.state;

		return <DropDownList expand={!!searchValue} key={item.value} onSelect={onSelect} value={item} />;
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
			<div className={this.props.className}>
				{this.renderSearchInput()}
				{this.renderLoader()}
				{this.renderList()}
			</div>
		);
	}
}

export default MultiDropDownList;
